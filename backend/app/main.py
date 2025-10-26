"""
ALFA ALGO Trading System - Main Application
FastAPI backend for algorithmic trading with Zerodha integration
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Create FastAPI application
app = FastAPI(
    title="ALFA ALGO Trading System",
    description="Comprehensive algorithmic trading system with Zerodha integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "alfa-algo-trading",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "production")
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ALFA ALGO Trading System",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Basic API endpoints
@app.get("/api/v1/status")
async def api_status():
    """API status endpoint"""
    return {
        "status": "running",
        "message": "API is working correctly"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )