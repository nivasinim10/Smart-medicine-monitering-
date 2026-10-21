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
