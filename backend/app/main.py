"""
ALFA ALGO Trading System - Main Application
FastAPI backend for algorithmic trading with Zerodha integration
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
import uvicorn
import os
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db
from app.api.v1.api import api_router
from app.core.exceptions import setup_exception_handlers
from app.core.middleware import setup_middleware
from app.services.websocket_manager import WebSocketManager
from app.services.strategy_manager import StrategyManager
from app.services.risk_manager import RiskManager

# Global managers
websocket_manager = WebSocketManager()
strategy_manager = StrategyManager()
risk_manager = RiskManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    print("🚀 Starting ALFA ALGO Trading System...")
    
    # Initialize database
    await init_db()
    
    # Initialize managers
    await strategy_manager.initialize()
    await risk_manager.initialize()
    
    # Start background tasks
    await strategy_manager.start_background_tasks()
    
    print("✅ ALFA ALGO Trading System started successfully!")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down ALFA ALGO Trading System...")
    await strategy_manager.stop_background_tasks()
    await websocket_manager.disconnect_all()
    print("✅ Shutdown complete!")

# Create FastAPI application
app = FastAPI(
    title="ALFA ALGO Trading System",
    description="Comprehensive algorithmic trading system with Zerodha integration",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup trusted hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Setup custom middleware
setup_middleware(app)

# Setup exception handlers
setup_exception_handlers(app)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "alfa-algo-trading",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket):
    """WebSocket endpoint for real-time data"""
    await websocket_manager.connect(websocket)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ALFA ALGO Trading System",
        "version": "1.0.0",
        "docs": "/docs" if settings.ENVIRONMENT != "production" else "Documentation not available in production"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
        log_level="info"
    )
