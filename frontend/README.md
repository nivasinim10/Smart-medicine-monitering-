# SmartMed Frontend

React + Vite frontend built for the uploaded Smart Medicine Embedded Backend v2.0.0.

## Start backend

Extract your `Smart_Med_Backend.zip`. In `Smart_Medicine_Embedded_Backend`, configure `.env` based on `.env.example` (MongoDB connection, JWT secret), then run:

```bash
npm install
npm start
```

Backend defaults to `http://localhost:3000/api/v1`.

## Start frontend

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

For deployment, set `VITE_API_URL` to the backend's publicly accessible `/api/v1` URL and run `npm run build`.

## Included features

- Caregiver registration and caregiver/patient login
- Patient creation and switching between linked patients
- Today's medicine dashboard (morning, afternoon, night)
- Active medication list, create, deactivate
- Schedule list and creation
- Device list and registration; one-time device key display
- Dose event history
- Notifications and mark as read

## Notes

- Patient accounts are created by caregivers; patients can sign in with their credentials.
- Only the embedded device can report doses taken, using the backend device-key authenticated endpoint. The frontend intentionally does not allow a patient to fabricate dose events.
- The backend supports additional edit, key rotation, and push token endpoints not exposed in this first frontend release.
- Login tokens are held in browser session storage; use secure HTTPS and strengthen token management for production.
- This frontend is not a medical device and does not replace medical judgment.
