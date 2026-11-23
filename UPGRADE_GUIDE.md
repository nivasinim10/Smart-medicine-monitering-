# SmartMed — Patient + Caregiver Edition

## Install
1. Extract this ZIP and open `Smart_Medicine_Fullstack` in VS Code.
2. Run `npm run setup` (Node.js required).
3. Create `backend/.env` from `backend/.env.example`, using your existing MongoDB Atlas `MONGO_URI` and JWT settings. Never share or commit this file.
4. Run `npm run dev`. Open http://localhost:5173.

## Existing users
Existing caregivers and patient accounts remain in Atlas. Existing patients created before this upgrade may not have `mustChangePassword` set, so the first-login password-change screen is only mandatory for newly created patients. For old patients, the caregiver should arrange a secure password reset before use.

## Workflows
- Caregiver registers or signs in via Caregiver portal, then Patients → Add patient.
- Caregiver enters patient name, unique email, temporary password (10+ characters). Share the temporary password privately.
- Patient chooses Patient portal, signs in with their own email and temporary password, and changes password immediately.
- Patient can see only their own overview, medicines, schedules, dose history and notifications. Backend checks ownership for data endpoints and rejects patient writes to medicines/schedules/devices.
- Caregiver continues managing linked patient data and device registration.

## Notes
- This is a local web application, not yet a PWA or native app.
- Device-generated TAKEN events indicate device activity, not proof of ingestion.
- Do not use real clinical data during initial testing.
- Backend auth and UI flows should be tested end to end before real-world use.
