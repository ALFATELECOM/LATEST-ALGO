"""
Configuration settings for ALFA ALGO Trading System
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "ALFA ALGO Trading System"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/alfa_algo_trading"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # Zerodha API
    ZERODHA_API_KEY: str = ""
    ZERODHA_API_SECRET: str = ""
    ZERODHA_REDIRECT_URL: str = "http://localhost:3000/auth/callback"
    ZERODHA_BASE_URL: str = "https://api.kite.trade"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-frontend-domain.vercel.app"
    ]
    
    # Trading Settings
    MAX_POSITION_SIZE: float = 100000.0  # Maximum position size in rupees
    MAX_DAILY_LOSS: float = 5000.0  # Maximum daily loss in rupees
    MAX_DAILY_TRADES: int = 50  # Maximum trades per day
    DEFAULT_STOP_LOSS_PERCENT: float = 2.0  # Default stop loss percentage
    DEFAULT_TRAILING_STOP_PERCENT: float = 1.0  # Default trailing stop percentage
    
    # Risk Management
    ENABLE_RISK_MANAGEMENT: bool = True
    MAX_PORTFOLIO_RISK: float = 0.02  # Maximum 2% portfolio risk per trade
    MAX_CORRELATION_RISK: float = 0.3  # Maximum 30% correlation between positions
    
    # Data Settings
    ENABLE_REAL_TIME_DATA: bool = True
    DATA_CACHE_TTL: int = 60  # Data cache TTL in seconds
    HISTORICAL_DATA_DAYS: int = 365  # Days of historical data to fetch
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/alfa_algo.log"
    ENABLE_STRUCTURED_LOGGING: bool = True
    
    # Monitoring
    ENABLE_SENTRY: bool = False
    SENTRY_DSN: str = ""
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30  # WebSocket heartbeat interval in seconds
    WS_MAX_CONNECTIONS: int = 100  # Maximum WebSocket connections
    
    # Strategy Settings
    ENABLE_STRATEGY_BACKTESTING: bool = True
    BACKTEST_START_DATE: str = "2023-01-01"
    BACKTEST_END_DATE: str = "2024-01-01"
    BACKTEST_INITIAL_CAPITAL: float = 100000.0
    
    # Notification Settings
    ENABLE_EMAIL_NOTIFICATIONS: bool = False
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    NOTIFICATION_EMAIL: str = ""
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [".csv", ".xlsx", ".json"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Validate critical settings
if settings.ENVIRONMENT == "production":
    if not settings.ZERODHA_API_KEY or not settings.ZERODHA_API_SECRET:
        raise ValueError("Zerodha API credentials must be set in production")
    
    if settings.SECRET_KEY == "your-secret-key-change-in-production":
        raise ValueError("SECRET_KEY must be changed in production")
    
    if settings.ALLOWED_HOSTS == ["*"]:
        raise ValueError("ALLOWED_HOSTS must be restricted in production")

# Create necessary directories
Path("logs").mkdir(exist_ok=True)
Path("data").mkdir(exist_ok=True)
Path("backups").mkdir(exist_ok=True)
