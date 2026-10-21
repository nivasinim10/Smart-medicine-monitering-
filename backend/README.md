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
