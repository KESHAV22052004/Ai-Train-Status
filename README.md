# 🚆 Ai-Train-Status: Real-Time Indian Railways AI Portal

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://ai-train-status.vercel.app)

**Ai-Train-Status** is a full-stack, AI-powered railway dashboard designed to provide real-time tracking and predictive delay analysis for Indian Railways. Built with a modern glassmorphism UI, it offers a seamless experience for monitoring train statuses, managing smart alerts, and viewing AI-driven travel insights.

## 🚀 Live Demo
You can view the live application here:  
👉 **[https://ai-train-status.vercel.app](https://ai-train-status.vercel.app)**

## ✨ Key Features
-   **🔍 Smart Train Search**: Fast autocomplete search for 40+ real Indian trains.
-   **🤖 AI Delay Prediction**: Uses a simulated XGBoost model to predict expected delays based on weather, speed, and real-world factors.
-   **📡 Live Tracker**: Visualizes real-time progress on a dynamic vertical train route with Indian Standard Time (IST) sync.
-   **🛡️ Secure Authentication**: Custom JWT-based Auth system with "Continue as Guest" support.
-   **🔔 Smart Notifications**: Save alerts for specific trains to be notified of delays or weather changes.
-   **📉 Performance Analytics**: Visualize train speed and delay trends over time.

## 🛠️ Tech Stack
-   **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React.
-   **Backend**: FastAPI (Python), JWT Authentication, SQLite Database.
-   **Deployment**: Vercel (Frontend) & Render.com (Backend).


## 🛠️ Installation & Setup
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/KESHAV22052004/Ai-Train-Status.git
    ```
2.  **Frontend Setup**:
    ```bash
    cd ai-train-dashboard
    npm install
    npm run dev
    ```
3.  **Backend Setup**:
    ```bash
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8001
    ```

---
*Created for interview and educational purposes.*
