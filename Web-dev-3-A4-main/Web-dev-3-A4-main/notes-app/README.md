# Jotter – Full-stack Notes App

**Stack:** React + Vite (frontend) · Node.js + Express (MVC) · MongoDB + Mongoose · JWT auth

## Folder structure
```
backend/
  server.js
  src/
    config/db.js            # MongoDB connection
    models/                 # Model      -> User, Note
    controllers/            # Controller -> authController, noteController
    routes/                 # Routes     -> /api/auth, /api/notes
    middleware/             # JWT auth, error handler
frontend/
  src/pages/                # Login, Register, Dashboard
  src/components/           # NoteCard, NoteModal, AuthLayout
  src/context/AuthContext   # auth state
```

## Run karne ke steps
1. MongoDB chalu karo (local ya MongoDB Atlas ka URI).
2. Backend:
   ```
   cd backend
   npm install
   npm run dev          # http://localhost:5000
   ```
   (`.env` me MONGO_URI aur JWT_SECRET check/change karo)
3. Frontend (naye terminal me):
   ```
   cd frontend
   npm install
   npm run dev          # http://localhost:5173
   ```

## API
| Method | Endpoint | Auth | Kaam |
|---|---|---|---|
| POST | /api/auth/register | - | Naya account |
| POST | /api/auth/login | - | Login |
| GET | /api/auth/me | JWT | Current user |
| GET | /api/notes?q= | JWT | Notes list + search |
| POST | /api/notes | JWT | Note banao |
| PUT | /api/notes/:id | JWT | Edit / pin |
| DELETE | /api/notes/:id | JWT | Delete |
