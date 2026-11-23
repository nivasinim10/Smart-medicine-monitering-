# Smart_Medicine_Embedded_Backend v2.0.0

Complete Phase-1 backend baseline for the Smart Medicine Embedded System.

## Roles
- CAREGIVER: creates patients, manages medication/schedules/devices, views linked patient data.
- PATIENT: separate login, views own medicines/schedules/dashboard/history/device/notifications.
- Both roles use the same REST API and MongoDB.

## Phase-1 device
ESP32 + DS1307 + OLED + buzzer + 3 LEDs + one TAKEN button. The backend records acknowledgement; it does not claim ingestion.

## Setup
1. Extract as `Smart_Medicine_Embedded_Backend`.
2. `cd Smart_Medicine_Embedded_Backend`
3. `npm install` (or `& "C:\\Program Files\\nodejs\\npm.cmd" install` if needed).
4. Copy `.env.example` to `.env` and fill `MONGO_URI` and `JWT_SECRET`.
5. Generate JWT secret locally: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
6. `npm start`
7. Open `http://localhost:3000/api/v1/health`.

## Main flow
1. POST `/api/v1/auth/register` -> caregiver
2. POST `/api/v1/auth/login` -> caregiver token
3. POST `/api/v1/patients` -> patient + caregiver link
4. Patient can login through the same `/auth/login` endpoint.
5. Caregiver creates medication and DAILY schedule for the patient.
6. `/dashboard/today` creates today's dose events and shows UPCOMING/DELAYED/TAKEN/MISSED.
7. Caregiver registers BOX001 and receives a device key once.
8. ESP32/simulator sends heartbeat and TAKEN event with `X-Device-Key`.
9. Missed doses and offline devices create notifications for patient + linked caregivers.

## Important
- Public registration creates only CAREGIVER accounts.
- Patient creation is caregiver-controlled.
- Medicine belongs to patient, not caregiver.
- Device belongs to patient.
- Mobile apps never access MongoDB directly.
- Firebase is optional; keep `FIREBASE_ENABLED=false` during core testing.
- Phase 1 supports one active schedule per patient per slot and DAILY frequency.

See `API_EXAMPLES.md` for request examples and `BACKEND_CHECKLIST.md` for the testing plan.


## Updated Phase 1 workflows
- Reminder sequence: first alert at scheduled time, second alert after 5 minutes, MISSED after the next 5-minute response window (10 minutes total). The ESP32 firmware should keep its reminder timing locally using its RTC so reminders continue without Wi-Fi. The backend monitor records the second-reminder and missed transitions.
- Dose acknowledgement is supported from the ESP32 (`POST /dose-events/device`) and both authenticated app roles (`POST /dose-events/:id/acknowledge`). Late acknowledgement changes the current status to TAKEN while preserving the original missed audit fields.
- Medication stock fields: `stockQuantity`, `unitsPerDose` (default 1), `refillThreshold` (default 3). Every unique acknowledged event deducts stock once.
- Prescription upload accepts PDF/JPG/PNG up to 8 MB. Files are stored under `backend/uploads/prescriptions` and served only through an authenticated, patient-authorized endpoint. Back up this folder with the database. For deployment, move files to private object storage.
- Device integration: send the existing authenticated device dose event with `deviceId`, `slot`, `event: TAKEN`, and timestamp. Use `GET /api/v1/device/dose-state` with `X-Device-Key` to inspect the current reminder state. Do not make the ESP32 connect directly to MongoDB.


## Updated Phase 1 workflows
- Reminder sequence: first alert at scheduled time, second alert after 5 minutes, MISSED after the next 5-minute response window (10 minutes total). The ESP32 firmware should keep its reminder timing locally using its RTC so reminders continue without Wi-Fi. The backend monitor records the second-reminder and missed transitions.
- Dose acknowledgement is supported from the ESP32 (`POST /dose-events/device`) and both authenticated app roles (`POST /dose-events/:id/acknowledge`). Late acknowledgement changes the current status to TAKEN while preserving the original missed audit fields.
- Medication stock fields: `stockQuantity`, `unitsPerDose` (default 1), `refillThreshold` (default 3). Every unique acknowledged event deducts stock once.
- Prescription upload accepts PDF/JPG/PNG up to 8 MB. Files are stored under `backend/uploads/prescriptions` and served only through an authenticated, patient-authorized endpoint. Back up this folder with the database. For deployment, move files to private object storage.
- Device integration: send the existing authenticated device dose event with `deviceId`, `slot`, `event: TAKEN`, and timestamp. Use `GET /api/v1/device/dose-state` with `X-Device-Key` to inspect the current reminder state. Do not make the ESP32 connect directly to MongoDB.
