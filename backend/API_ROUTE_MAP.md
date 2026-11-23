# Route Map
GET /api/v1/health
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/me
POST|GET /api/v1/patients
POST|GET|PUT|DELETE /api/v1/medications
POST|GET|PUT|DELETE /api/v1/schedules
GET /api/v1/dashboard/today
GET /api/v1/dose-events/history
POST /api/v1/dose-events/device
POST|GET /api/v1/devices
POST /api/v1/devices/:deviceId/rotate-key
POST /api/v1/devices/:deviceId/heartbeat
GET /api/v1/notifications
PATCH /api/v1/notifications/:id/read
POST /api/v1/notifications/device-token


## Added medication stock, acknowledgement and prescription APIs
- `PATCH /api/v1/medications/:id/stock` — patient or linked caregiver updates tablet quantity, units per dose and refill threshold.
- `POST /api/v1/dose-events/:id/acknowledge` — patient or linked caregiver records a software acknowledgement, including a previously MISSED event.
- `GET /api/v1/prescriptions?patientId=...` — list the patient's prescription metadata.
- `POST /api/v1/prescriptions` — upload a PDF/JPG/PNG as JSON `{ fileBase64, mimeType, originalName, patientId? }`; max 8 MB.
- `GET /api/v1/prescriptions/:id/file` — authenticated download; access is checked against the patient relationship.
- `GET /api/v1/device/dose-state` — authenticated ESP32 state query using `X-Device-Key`; returns the current second-reminder/missed state.

## Acknowledgement and stock rules
Each dose event has a one-time `stockDeductedAt` claim. Acknowledging through device, patient app or caregiver app transitions the event to TAKEN and deducts `unitsPerDose` once. A late acknowledgement retains `wasMissed` and `missedAt` audit fields. Refill stock updates reset the low-stock alert latch.


## Added medication stock, acknowledgement and prescription APIs
- `PATCH /api/v1/medications/:id/stock` — patient or linked caregiver updates tablet quantity, units per dose and refill threshold.
- `POST /api/v1/dose-events/:id/acknowledge` — patient or linked caregiver records a software acknowledgement, including a previously MISSED event.
- `GET /api/v1/prescriptions?patientId=...` — list the patient's prescription metadata.
- `POST /api/v1/prescriptions` — upload a PDF/JPG/PNG as JSON `{ fileBase64, mimeType, originalName, patientId? }`; max 8 MB.
- `GET /api/v1/prescriptions/:id/file` — authenticated download; access is checked against the patient relationship.
- `GET /api/v1/device/dose-state` — authenticated ESP32 state query using `X-Device-Key`; returns the current second-reminder/missed state.

## Acknowledgement and stock rules
Each dose event has a one-time `stockDeductedAt` claim. Acknowledging through device, patient app or caregiver app transitions the event to TAKEN and deducts `unitsPerDose` once. A late acknowledgement retains `wasMissed` and `missedAt` audit fields. Refill stock updates reset the low-stock alert latch.
