# API Examples
Base: `http://localhost:3000/api/v1`

## Register caregiver
`POST /auth/register`
```json
{"name":"Caregiver One","email":"caregiver@example.com","password":"password123"}
```

## Create patient
`POST /patients` with caregiver Bearer token
```json
{"name":"Patient One","email":"patient@example.com","password":"password123"}
```

## Create medicine
`POST /medications` with caregiver Bearer token
```json
{"patientId":"<patient-id>","name":"Paracetamol","dosage":"500 mg","instructions":"After breakfast","slot":"morning"}
```

## Create schedule
`POST /schedules` with caregiver Bearer token
```json
{"patientId":"<patient-id>","medicationId":"<medication-id>","slot":"morning","time":"08:00","missedAfterMinutes":60}
```

## Dashboard
Patient: `GET /dashboard/today` with patient token.
Caregiver: `GET /dashboard/today?patientId=<patient-id>` with caregiver token.

## Register device
`POST /devices` with caregiver token
```json
{"deviceId":"BOX001","patientId":"<patient-id>","name":"Smart Medicine Box"}
```
Save returned `deviceKey`.

## Heartbeat
`POST /devices/BOX001/heartbeat` with header `X-Device-Key: <deviceKey>`
```json
{"batteryLevel":92,"wifiSignal":-48}
```

## TAKEN
`POST /dose-events/device` with header `X-Device-Key: <deviceKey>`
```json
{"slot":"morning","timestamp":"2026-10-07T08:04:00+05:30"}
```

## History
`GET /dose-events/history` for patient; caregiver adds `?patientId=<patient-id>`.

## Notifications
`GET /notifications`; `PATCH /notifications/<id>/read`; `POST /notifications/device-token`.
