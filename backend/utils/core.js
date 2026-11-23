const crypto=require('crypto');const {ObjectId}=require('mongodb');
const ROLES={CAREGIVER:'CAREGIVER',PATIENT:'PATIENT'},SLOTS=['morning','afternoon','night'];
const oid=x=>new ObjectId(x),valid=x=>ObjectId.isValid(x),safe=u=>{if(!u)return null;const{passwordHash,fcmTokens,...x}=u;return x};
const deviceKey=()=>crypto.randomBytes(32).toString('hex'),hashKey=x=>crypto.createHash('sha256').update(x).digest('hex');
function dateKey(d=new Date()){const tz=process.env.TIMEZONE||'Asia/Kolkata',p=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d),v={};p.forEach(x=>x.type!=='literal'&&(v[x.type]=x.value));return `${v.year}-${v.month}-${v.day}`}
function scheduled(date,time){const off=Number(process.env.TIMEZONE_OFFSET_MINUTES||330),sg=off>=0?'+':'-',a=Math.abs(off),z=n=>String(n).padStart(2,'0');return new Date(`${date}T${time}:00.000${sg}${z(Math.floor(a/60))}:${z(a%60)}`)}
module.exports={ROLES,SLOTS,oid,valid,safe,deviceKey,hashKey,dateKey,scheduled};
