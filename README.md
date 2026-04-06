# 🚆 AI Train Status & Smart Alerts

![AI Train Dashboard Preview](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57)

A modern, full-stack application designed to track real-time Indian railway status, predict train delays using a simulated AI Inference Engine (XGBoost logic), and set up conditional smart track alerts based on user criteria. 

This project was built focusing on strict modern UI/UX principles (Glassmorphism, Dark Accents, Micro-interactions) coupled with a high-performance Python asynchronous backend.

---

## 🌟 Key Features

* **Dynamic AI Delay Prediction**: Calculates real-time arrival latency bounds dynamically based on the train's actual speed, route congestion, and simulated real-world weather constraints.
* **Smart Alerts & Notifications**: Users can set conditional triggers (e.g., "Alert me if Train 12951 is delayed more than 30 mins").
* **Local JWT Authentication**: Fully custom, self-contained authentication system. Users can securely sign up, log in, or continue as a **Guest**. Guest data remains local, while authenticated user alerts are safely stored in a relational PostgreSQL/SQLite structure.
* **Modern Dashboard**: Built meticulously with Tailwind CSS and Recharts to map out predictive trends cleanly across a beautiful Glassmorphic interface.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js (App Router, strict mode)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charting**: Recharts
- **Forms & State**: Native React Hooks & Context APIs (`useAuth`, `useAlerts`)

### Backend
- **Framework**: FastAPI (Python 3.13+)
- **Security**: Passlib (Bcrypt), PyJWT (Bearer token verification)
- **Database**: SQLite (`database.py`) with Foreign Key integrations mapping `users` to `alerts`
- **Data Layer**: Mock Simulated Train Environment + XGBoost Inference Logic Simulation

---

## 🚀 Running Locally

You'll need two terminals to run the system smoothly. The backend manages the data layer, and the frontend consumes it.

### 1. Start the FastAPI Backend
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
pip install "fastapi[standard]" "passlib[bcrypt]" pyjwt python-multipart

# Start the server (runs on Port 8001 by default via next.config.ts mappings)
python -m uvicorn main:app --reload --port 8001
```

### 2. Start the Next.js Frontend
```bash
# From the project root
npm install

# Start the web server (runs on Port 3000)
npm run dev
```
Navigate to `http://localhost:3000/dashboard` to interact with the application.

---

## ☁️ Deployment Strategy

This architecture naturally lends itself to decoupled microservice deployments.

- **Frontend Deployment (Vercel)**: Automatically detects `next.config.ts`. Bind the `FASTAPI_URL` environment variable during deployment to automatically rewrite `/api/*` fetches seamlessly without CORS issues.
- **Backend Deployment (Render/Railway)**: Push the `backend/` directory separately using the deployment command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.

---

## 📝 License
This project is made for educational and interview presentation purposes. Data presented is a simulation of the Indian Railway architecture utilizing realistic algorithmic variations. All train data belongs to their respective transit authorities.
