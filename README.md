# Smart Medicine — Frontend + Backend (one VS Code folder)

## Prerequisites
- Node.js 20+ and npm
- A MongoDB connection (local MongoDB or MongoDB Atlas)

## First-time setup
1. Open **this entire `Smart_Medicine_Fullstack` folder** in VS Code.
2. In the VS Code terminal, run `npm run setup` to install dependencies for both applications.
3. Copy `backend/.env.example` to `backend/.env`.
4. Edit `backend/.env`: set `MONGO_URI` to your actual MongoDB connection URI and `JWT_SECRET` to a long, random secret. Do not commit or share `.env`.
5. The frontend defaults to the backend at `http://localhost:3000/api/v1`. For a different backend URL, copy `frontend/.env.example` to `frontend/.env` and change `VITE_API_URL`.

## Run both together
From the **root folder**, run:

```bash
npm run dev
```

Open **http://localhost:5173**. The backend listens at **http://localhost:3000**.

Both processes run from one VS Code terminal. Stop them with Ctrl+C.

## Folder layout
- `frontend/` — React + Vite UI
- `backend/` — Express API, MongoDB integration, device simulator
- `scripts/dev.js` — launches both servers

## Notes
The backend requires a reachable MongoDB database and configured JWT secret; it will not start with placeholder settings. The UI and API have not been end-to-end tested against your database. For details on endpoints and embedded device simulation, read `backend/README.md`.


## Updated build
This archive preserves the original React/Vite frontend and Express/MongoDB backend structure. See `backend/README.md` and `backend/API_ROUTE_MAP.md` for the added stock, app acknowledgement, prescription, and ESP32 integration workflows. Create `backend/.env` from `backend/.env.example` before running.
