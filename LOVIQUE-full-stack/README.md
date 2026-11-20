# LOVIQUE — Full-stack starter

A starter for a **friendship and community matching** platform. It is not configured as an adult dating service.

## Stack
- Frontend: React + Vite + JSX + Tailwind CSS
- Backend: Python Flask + Flask-SQLAlchemy + Flask-CORS
- Database: PostgreSQL (SQLite fallback for local development)

## Project layout
```text
LOVIQUE-full-stack/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── __init__.py
│   │   └── extensions.py
│   ├── .env.example
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
├── database/schema.sql
└── .gitignore
```

## 1. Run the backend
```bash
cd backend
python -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
python run.py
```
The API runs at `http://127.0.0.1:5000`. The health endpoint is `/api/health`.

For a quick local start, the app uses SQLite if `DATABASE_URL` is not set. To use PostgreSQL, set `DATABASE_URL` in `.env`.

## 2. Run the frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Vite displays the local development URL, usually `http://localhost:5173`.

## Notes before real deployment
This is a learning scaffold, not a production-ready social platform. Before real users:
- implement verified authentication, password hashing, session/token security and account recovery;
- add age-appropriate safeguards, reporting, blocking, moderation and privacy controls;
- validate every input on the server, add rate limiting and secure headers;
- use HTTPS, secrets management, backups and database migrations;
- do not expose private profile or location data.
