"""
ALFA ALGO Trading System - Simple Version
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI application
app = FastAPI(
    title="ALFA ALGO Trading System",
    description="Algorithmic trading system with Zerodha integration",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ALFA ALGO Trading System is running!"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/status")
async def api_status():
    return {"status": "API is working"}