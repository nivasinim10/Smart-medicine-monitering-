# Smart Medicine Fullstack — requested modifications

The original React/Vite frontend and Express/MongoDB backend structure have been retained. This is an additive update, not a replacement UI.

## Implemented
1. Medication records now include `stockQuantity`, `unitsPerDose` (default 1), `refillThreshold` (default 3), and a low-stock alert latch.
2. Every successful dose acknowledgement through the device or either app role deducts the configured tablet quantity once per dose event.
3. Patient and linked caregiver can acknowledge an event in the app, including an event already classified MISSED. The event records `wasMissed`, `missedAt`, `acknowledgedTime`, and acknowledgement `source`.
4. The medication inventory UI shows stock, refill threshold, and a refill indicator. Both roles can update current stock; refill resets the low-stock alert latch.
5. Low-stock notifications are sent to the patient and linked caregivers when stock reaches the threshold.
6. Added a Prescriptions section to both roles. PDF/JPG/PNG uploads (up to 8 MB) are stored locally under `backend/uploads/prescriptions`; file access is authenticated and patient-authorized.
7. Added an authenticated device dose-state endpoint for the future ESP32 integration.
8. Default reminder/missed threshold is 10 minutes: first alert at scheduled time, second alert after 5 minutes, and MISSED after the next 5-minute response window.

## Hardware integration notes
- The ESP32 should continue to execute the scheduled reminder and second buzzer locally from its RTC so Wi-Fi loss does not stop reminders.
- Physical button acknowledgement continues to use `POST /api/v1/dose-events/device` with `X-Device-Key`.
- App acknowledgement uses `POST /api/v1/dose-events/:id/acknowledge`.
- Both acknowledgement paths update the same dose event; stock deduction is guarded by the event's `stockDeductedAt` field.
- `GET /api/v1/device/dose-state` is available to the authenticated device for current event state.
- No direct ESP32-to-MongoDB or app-to-MongoDB connection has been introduced.

## Security and setup
- The populated `.env` from the uploaded archive has been excluded. Create `backend/.env` from `backend/.env.example` and enter your own private settings.
- `node_modules` and generated build folders are excluded. Run `npm install` in the root/backend/frontend folders as described in the README.
- Prescription files are local prototype storage. Keep the uploads folder backed up with the database; for deployment, migrate it to private object storage.
- This prototype records acknowledgement, not proof that medicine was swallowed.
