"""
AI Train Status & Smart Alerts — FastAPI Backend

Run with:  uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routes.trains import router as trains_router
from routes.alerts import router as alerts_router
from routes.auth import router as auth_router

# Initialize database
init_db()

app = FastAPI(
    title="AI Train Status & Smart Alerts API",
    version="1.0.0",
    description="Backend API for train search, live status, and smart alert system",
)

# CORS — allow Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(trains_router)
app.include_router(alerts_router)


@app.get("/")
async def root():
    return {
        "service": "AI Train Status & Smart Alerts API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
