const e=require('express'),c=require('../controllers/all'),a=require('../middleware/auth'),r=require('../middleware/role'),d=require('../middleware/device');const x=e.Router();
x.get('/health',(q,s)=>s.json({success:true,service:'Smart Medicine Embedded Backend',status:'healthy',timestamp:new Date().toISOString()}));
x.post('/auth/change-password',a,c.changePassword);x.post('/auth/register',c.register);x.post('/auth/login',c.login);x.get('/auth/me',a,c.me);
x.post('/patients',a,r('CAREGIVER'),c.patients);x.get('/patients',a,r('CAREGIVER'),c.patients);
x.get('/medications',a,c.medication);x.post('/medications',a,c.medication);x.get('/medications/:id',a,c.medication);x.put('/medications/:id',a,c.medication);x.delete('/medications/:id',a,c.medication);
x.get('/schedules',a,c.schedule);x.post('/schedules',a,c.schedule);x.get('/schedules/:id',a,c.schedule);x.put('/schedules/:id',a,c.schedule);x.delete('/schedules/:id',a,c.schedule);
x.get('/dashboard/today',a,c.dashboard);x.get('/dose-events/history',a,c.history);x.post('/dose-events/device',d,c.deviceDose);
x.post('/devices',a,c.device);x.get('/devices',a,c.device);x.post('/devices/:deviceId/rotate-key',a,c.device);x.post('/devices/:deviceId/heartbeat',d,c.device);
x.get('/notifications',a,c.notifications);x.patch('/notifications/:id/read',a,c.notifications);x.post('/notifications/device-token',a,c.notifications);module.exports=x;
