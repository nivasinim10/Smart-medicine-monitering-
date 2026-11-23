const {getDatabase}=require('../config/database');
const {dateKey,scheduled,oid}=require('../utils/core');
const {patientAndCaregivers}=require('./notify');
async function ensure(patientId){
 const db=getDatabase(),day=dateKey(),q={enabled:true}; if(patientId)q.patientId=patientId;
 for(const s of await db.collection('schedules').find(q).toArray()){
  const old=await db.collection('dose_events').findOne({patientId:s.patientId,scheduleId:s._id,scheduledDateKey:day}); if(old)continue;
  const m=await db.collection('medications').findOne({_id:s.medicationId,patientId:s.patientId,active:true});
  if(!m)continue;
  try{await db.collection('dose_events').insertOne({patientId:s.patientId,scheduleId:s._id,medicationId:s.medicationId,medicationName:m?.name||'Medicine',deviceId:null,slot:s.slot,scheduledTime:scheduled(day,s.time),scheduledDateKey:day,acknowledgedTime:null,status:'UPCOMING',source:'SYSTEM',reminder2SentAt:null,missedAt:null,stockDeductedAt:null,stockDeductedQuantity:0,createdAt:new Date(),updatedAt:new Date()})}catch(e){if(e.code!==11000)throw e}
 } return day;
}
async function deductStock(event){
 const db=getDatabase();
 const med=await db.collection('medications').findOne({_id:event.medicationId});
 if(!med)return {deducted:false};
 const units=Math.max(1,Number(med.unitsPerDose||1));
 const claimed=await db.collection('dose_events').updateOne({_id:event._id,stockDeductedAt:null},{$set:{stockDeductedAt:new Date(),stockDeductedQuantity:Math.min(Math.max(0,Number(med.stockQuantity||0)),units)}});
 if(!claimed.modifiedCount)return {deducted:false};
 const updated=await db.collection('medications').findOneAndUpdate({_id:med._id},[{$set:{stockQuantity:{$max:[0,{$subtract:[{$ifNull:['$stockQuantity',0]},units]}]},updatedAt:'$$NOW'}}],{returnDocument:'after'});
 const value=updated?.value||updated;
 const threshold=Number(value?.refillThreshold??3);
 if(value && Number(value.stockQuantity)<=threshold && Number(value.stockQuantity)>=0 && !med.lowStockAlertSent){
  const alertClaim=await db.collection('medications').updateOne({_id:med._id,lowStockAlertSent:{$ne:true}},{$set:{lowStockAlertSent:true}});
  if(!alertClaim.modifiedCount)return {deducted:true,remaining:value?.stockQuantity};
  const msg=`${med.name} has to be refilled. Only ${value.stockQuantity} tablet(s) remaining.`;
  await patientAndCaregivers(event.patientId,'LOW_STOCK',msg,{medicationId:med._id.toString(),remaining:value.stockQuantity});
 }
 return {deducted:true,remaining:value?.stockQuantity};
}
async function acknowledge({patientId,slot,eventId,timestamp,source,deviceId}){
 const db=getDatabase(),at=new Date(); await ensure(patientId);
 let filter={patientId,status:{$in:['UPCOMING','DELAYED','MISSED']}};
 if(eventId){if(!/^[a-f\d]{24}$/i.test(eventId))throw Object.assign(Error('Invalid dose event ID'),{statusCode:400});filter._id=oid(eventId)}else{filter.slot=slot;filter.scheduledDateKey=dateKey(at)}
 const e=await db.collection('dose_events').findOne(filter,{sort:{scheduledTime:-1}}); if(!e)return null;
 // Acknowledgements are not valid before the scheduled reminder.
 if(at<new Date(e.scheduledTime))throw Object.assign(Error('Cannot acknowledge a dose before its scheduled time'),{statusCode:409});
 if(e.status==='TAKEN')return e;
 const updated=await db.collection('dose_events').findOneAndUpdate({_id:e._id,status:{$in:['UPCOMING','DELAYED','MISSED']}},{$set:{deviceId:deviceId||e.deviceId||null,acknowledgedTime:at,status:'TAKEN',source,wasMissed:e.status==='MISSED'||!!e.missedAt,updatedAt:new Date()}},{returnDocument:'after'});
 const event=updated?.value||updated;if(!event)return db.collection('dose_events').findOne({_id:e._id});
 await deductStock(event); return db.collection('dose_events').findOne({_id:e._id});
}
async function undoCaregiverTaken(patientId,eventId){
 const db=getDatabase(),id=oid(eventId),now=new Date();
 const e=await db.collection('dose_events').findOne({_id:id,patientId});
 if(!e)throw Object.assign(Error('Dose event not found'),{statusCode:404});
 if(e.status!=='TAKEN'||e.source!=='APP_CAREGIVER')throw Object.assign(Error('Only caregiver-marked Taken doses can be undone'),{statusCode:409});
 const state=now.getTime()-new Date(e.scheduledTime).getTime()>=10*60000?'MISSED':'DELAYED';
 const changed=await db.collection('dose_events').updateOne({_id:id,patientId,status:'TAKEN',source:'APP_CAREGIVER'},{$set:{status:state,source:'SYSTEM',acknowledgedTime:null,wasMissed:false,missedAt:state==='MISSED'?now:null,stockDeductedAt:null,stockDeductedQuantity:0,updatedAt:now,undoneAt:now}});
 if(!changed.modifiedCount)throw Object.assign(Error('Dose has already changed'),{statusCode:409});
 if(e.stockDeductedAt&&e.medicationId){
  const med=await db.collection('medications').findOne({_id:e.medicationId});
  if(med){
   const quantity=e.stockDeductedQuantity===undefined?Math.max(1,Number(med.unitsPerDose||1)):Math.max(0,Number(e.stockDeductedQuantity)||0);
   if(quantity>0)await db.collection('medications').updateOne({_id:med._id},{$inc:{stockQuantity:quantity},$set:{lowStockAlertSent:false,updatedAt:now}});
  }
 }
 return db.collection('dose_events').findOne({_id:id});
}
async function taken(device,slot,timestamp){return acknowledge({patientId:device.patientId,slot,timestamp,source:'DEVICE',deviceId:device.deviceId})}
async function appTaken(user,eventId){return acknowledge({patientId:user.patientId||user._id,eventId,source:user.role==='CAREGIVER'?'APP_CAREGIVER':'APP_PATIENT'})}
async function monitor(){
 const db=getDatabase(),now=new Date();
 // Retire orphaned schedules from earlier medication deletions as well.
 const activeMeds=await db.collection('medications').find({active:true}).project({_id:1}).toArray();
 const activeIds=new Set(activeMeds.map(m=>String(m._id)));
 for(const sch of await db.collection('schedules').find({enabled:true}).toArray()){
  if(activeIds.has(String(sch.medicationId)))continue;
  await db.collection('schedules').deleteOne({_id:sch._id});
  await db.collection('dose_events').updateMany({scheduleId:sch._id,status:{$in:['UPCOMING','DELAYED','MISSED']}},{$set:{status:'CANCELLED',cancelledAt:now,updatedAt:now}});
 }
 await ensure();
 await db.collection('dose_events').updateMany({status:'UPCOMING',scheduledTime:{$lte:now}},{$set:{status:'DELAYED',updatedAt:now}});
 // Second reminder is due five minutes after the first scheduled alert. Hardware polls the event API to receive this state.
 for(const e of await db.collection('dose_events').find({status:'DELAYED',scheduledTime:{$lte:new Date(now.getTime()-5*60000)},reminder2SentAt:null}).toArray()){
  await db.collection('dose_events').updateOne({_id:e._id,status:'DELAYED',reminder2SentAt:null},{$set:{reminder2SentAt:now,updatedAt:now}});
 }
 // MISSED after the second five-minute response window (10 minutes from scheduled time).
 for(const e of await db.collection('dose_events').find({status:'DELAYED',scheduledTime:{$lte:new Date(now.getTime()-10*60000)}}).toArray()){
  const r=await db.collection('dose_events').updateOne({_id:e._id,status:'DELAYED'},{$set:{status:'MISSED',missedAt:now,updatedAt:now}});
  if(r.modifiedCount)await patientAndCaregivers(e.patientId,'MISSED_DOSE',`${e.medicationName} (${e.slot}) was not acknowledged after both reminders.`,{doseEventId:e._id.toString(),slot:e.slot});
 }
}
module.exports={ensure,taken,monitor,appTaken,acknowledge,undoCaregiverTaken};
