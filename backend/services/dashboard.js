const {getDatabase}=require('../config/database');
const {dateKey}=require('../utils/core');
const {ensure}=require('./dose');
async function today(patientId){
 const day=await ensure(patientId),db=getDatabase();
 const schedules=await db.collection('schedules').find({patientId,enabled:true}).toArray();
 const meds=await db.collection('medications').find({patientId,active:true}).project({_id:1}).toArray();
 const medIds=new Set(meds.map(m=>String(m._id)));
 const validSchedules=schedules.filter(s=>medIds.has(String(s.medicationId)));
 const ids=validSchedules.map(s=>s._id);
 const events=ids.length?await db.collection('dose_events').find({patientId,scheduledDateKey:day,scheduleId:{$in:ids},status:{$ne:'CANCELLED'}}).sort({scheduledTime:1}).toArray():[];
 const patient=await db.collection('users').findOne({_id:patientId},{projection:{passwordHash:0,fcmTokens:0}});
 const devices=await db.collection('devices').find({patientId},{projection:{deviceKeyHash:0}}).toArray();
 const slots={};
 for(const s of ['morning','afternoon','night']){
  if(!validSchedules.some(x=>x.slot===s))continue;
  slots[s]=events.find(e=>e.slot===s)||{slot:s,status:'NONE'};
 }
 return{date:day,patient,slots,devices};
}
module.exports={today};
