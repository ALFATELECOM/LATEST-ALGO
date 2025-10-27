"""
ALFA ALGO Trading System - Enhanced Main Application
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import uvicorn
import os
import asyncio
from datetime import datetime
from typing import Dict, List, Optional, Any

# Create FastAPI application
app = FastAPI(
    title="ALFA ALGO Trading System",
    description="Comprehensive algorithmic trading system with Zerodha integration",
    version="2.0.0",
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

# Security
security = HTTPBearer()

# Mock data for demonstration
mock_data = {
    "user": {
        "id": "1",
        "name": "Demo User",
        "email": "demo@example.com",
        "is_authenticated": True
    },
    "portfolio": {
        "value": 100000,
        "pnl": 2500,
        "positions": [
            {"symbol": "RELIANCE", "quantity": 10, "price": 2500, "pnl": 1500},
            {"symbol": "TCS", "quantity": 5, "price": 3500, "pnl": 1000}
        ],
        "orders": [
            {"symbol": "INFY", "type": "BUY", "quantity": 20, "status": "COMPLETE"},
            {"symbol": "HDFC", "type": "SELL", "quantity": 15, "status": "PENDING"}
        ]
    },
    "strategies": [
        {"name": "RSI Strategy", "status": "ACTIVE", "pnl": 1200},
        {"name": "MACD Strategy", "status": "ACTIVE", "pnl": 800},
        {"name": "Bollinger Bands", "status": "INACTIVE", "pnl": 0}
    ],
    "market_data": {
        "nifty": {"price": 19500, "change": 150, "change_percent": 0.78},
        "sensex": {"price": 65000, "change": 200, "change_percent": 0.31}
    }
}

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "alfa-algo-trading",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ALFA ALGO Trading System",
        "version": "2.0.0",
        "features": [
            "Real-time trading",
            "Multiple strategies",
            "Risk management",
            "Portfolio analytics",
            "Zerodha integration"
        ]
    }

# Authentication endpoints
@app.post("/api/v1/auth/login")
async def login(credentials: dict):
    """Login endpoint"""
    return {
        "access_token": "demo_token_123",
        "user": mock_data["user"],
        "expires_in": 3600
    }

@app.get("/api/v1/auth/me")
async def get_current_user():
    """Get current user"""
    return mock_data["user"]

# Portfolio endpoints
@app.get("/api/v1/portfolio")
async def get_portfolio():
    """Get portfolio data"""
    return mock_data["portfolio"]

@app.get("/api/v1/portfolio/positions")
async def get_positions():
    """Get current positions"""
    return mock_data["portfolio"]["positions"]

@app.get("/api/v1/portfolio/orders")
async def get_orders():
    """Get orders"""
    return mock_data["portfolio"]["orders"]

# Trading endpoints
@app.post("/api/v1/trading/place-order")
async def place_order(order: dict):
    """Place a new order"""
    return {
        "order_id": f"ORD_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "status": "PENDING",
        "message": "Order placed successfully"
    }

@app.post("/api/v1/trading/cancel-order/{order_id}")
async def cancel_order(order_id: str):
    """Cancel an order"""
    return {
        "order_id": order_id,
        "status": "CANCELLED",
        "message": "Order cancelled successfully"
    }

# Strategy endpoints
@app.get("/api/v1/strategies")
async def get_strategies():
    """Get all strategies"""
    return {
        "equity_strategies": mock_data["strategies"],
        "options_strategies": [
            {
                "name": "Iron Condor",
                "type": "iron_condor",
                "status": "INACTIVE",
                "pnl": 0,
                "description": "Neutral strategy with limited risk and reward",
                "max_profit": "Limited",
                "max_loss": "Limited",
                "market_outlook": "Neutral"
            },
            {
                "name": "Butterfly",
                "type": "butterfly", 
                "status": "INACTIVE",
                "pnl": 0,
                "description": "Neutral strategy with maximum profit at center strike",
                "max_profit": "Limited",
                "max_loss": "Limited",
                "market_outlook": "Neutral"
            },
            {
                "name": "Straddle",
                "type": "straddle",
                "status": "INACTIVE", 
                "pnl": 0,
                "description": "Volatility strategy betting on big moves",
                "max_profit": "Unlimited",
                "max_loss": "Limited",
                "market_outlook": "Volatile"
            },
            {
                "name": "Strangle",
                "type": "strangle",
                "status": "INACTIVE",
                "pnl": 0,
                "description": "Volatility strategy with wider breakeven",
                "max_profit": "Unlimited", 
                "max_loss": "Limited",
                "market_outlook": "Volatile"
            },
            {
                "name": "Call Spread",
                "type": "call_spread",
                "status": "INACTIVE",
                "pnl": 0,
                "description": "Bullish strategy with limited risk",
                "max_profit": "Limited",
                "max_loss": "Limited", 
                "market_outlook": "Bullish"
            },
            {
                "name": "Put Spread",
                "type": "put_spread",
                "status": "INACTIVE",
                "pnl": 0,
                "description": "Bearish strategy with limited risk",
                "max_profit": "Limited",
                "max_loss": "Limited",
                "market_outlook": "Bearish"
            },
            {
                "name": "Covered Call",
                "type": "covered_call",
                "status": "INACTIVE",
                "pnl": 0,
                "description": "Income strategy on owned stock",
                "max_profit": "Limited",
                "max_loss": "Unlimited",
                "market_outlook": "Neutral to Bullish"
            },
            {
                "name": "Protective Put",
                "type": "protective_put",
                "status": "INACTIVE",
                "pnl": 0,
                "description": "Insurance strategy for owned stock",
                "max_profit": "Unlimited",
                "max_loss": "Limited",
                "market_outlook": "Bullish with Protection"
            }
        ]
    }

@app.get("/api/v1/strategies/options")
async def get_options_strategies():
    """Get options strategies"""
    return {
        "strategies": [
            {
                "name": "Iron Condor",
                "type": "iron_condor",
                "description": "Neutral strategy with limited risk and reward",
                "max_profit": "Limited",
                "max_loss": "Limited",
                "market_outlook": "Neutral",
                "volatility": "Low to Moderate",
                "time_decay": "Positive",
                "breakeven_points": 2,
                "risk_reward_ratio": "1:1 to 1:3"
            },
            {
                "name": "Butterfly",
                "type": "butterfly",
                "description": "Neutral strategy with maximum profit at center strike",
                "max_profit": "Limited",
                "max_loss": "Limited",
                "market_outlook": "Neutral",
                "volatility": "Low",
                "time_decay": "Positive",
                "breakeven_points": 2,
                "risk_reward_ratio": "1:1 to 1:2"
            },
            {
                "name": "Straddle",
                "type": "straddle",
                "description": "Volatility strategy betting on big moves",
                "max_profit": "Unlimited",
                "max_loss": "Limited",
                "market_outlook": "Volatile",
                "volatility": "High",
                "time_decay": "Negative",
                "breakeven_points": 2,
                "risk_reward_ratio": "1:1 to 1:2"
            },
            {
                "name": "Strangle",
                "type": "strangle",
                "description": "Volatility strategy with wider breakeven",
                "max_profit": "Unlimited",
                "max_loss": "Limited",
                "market_outlook": "Volatile",
                "volatility": "High",
                "time_decay": "Negative",
                "breakeven_points": 2,
                "risk_reward_ratio": "1:1 to 1:2"
            }
        ]
    }

@app.post("/api/v1/strategies/{strategy_name}/start")
async def start_strategy(strategy_name: str):
    """Start a strategy"""
    return {
        "strategy": strategy_name,
        "status": "STARTED",
        "message": f"Strategy {strategy_name} started successfully"
    }

@app.post("/api/v1/strategies/{strategy_name}/stop")
async def stop_strategy(strategy_name: str):
    """Stop a strategy"""
    return {
        "strategy": strategy_name,
        "status": "STOPPED",
        "message": f"Strategy {strategy_name} stopped successfully"
    }

@app.post("/api/v1/strategies/options/{strategy_type}/setup")
async def setup_options_strategy(strategy_type: str, params: dict):
    """Setup an options strategy"""
    return {
        "strategy_type": strategy_type,
        "status": "SETUP",
        "message": f"Options strategy {strategy_type} setup successfully",
        "parameters": params
    }

# Market data endpoints
@app.get("/api/v1/market/quote/{symbol}")
async def get_quote(symbol: str):
    """Get quote for a symbol"""
    return {
        "symbol": symbol,
        "price": 2500 + (hash(symbol) % 1000),
        "change": (hash(symbol) % 200) - 100,
        "volume": 1000000 + (hash(symbol) % 500000)
    }

@app.get("/api/v1/market/indices")
async def get_indices():
    """Get market indices"""
    return mock_data["market_data"]

# Analytics endpoints
@app.get("/api/v1/analytics/performance")
async def get_performance():
    """Get performance analytics"""
    return {
        "total_pnl": 2500,
        "daily_pnl": 150,
        "win_rate": 0.65,
        "sharpe_ratio": 1.2,
        "max_drawdown": -500,
        "total_trades": 25,
        "winning_trades": 16
    }

@app.get("/api/v1/analytics/risk")
async def get_risk_metrics():
    """Get risk metrics"""
    return {
        "portfolio_risk": 0.02,
        "var_95": 1000,
        "max_position_size": 10000,
        "correlation_risk": 0.3,
        "daily_loss_limit": 2000
    }

# WebSocket endpoint for real-time data
@app.websocket("/ws")
async def websocket_endpoint(websocket):
    """WebSocket endpoint for real-time data"""
    await websocket.accept()
    try:
        while True:
            # Send real-time data
            data = {
                "type": "market_update",
                "timestamp": datetime.now().isoformat(),
                "data": mock_data["market_data"]
            }
            await websocket.send_json(data)
            await asyncio.sleep(5)  # Send updates every 5 seconds
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )