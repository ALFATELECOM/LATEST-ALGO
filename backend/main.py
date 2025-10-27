#!/usr/bin/env python3
"""
ALFA ALGO Trading System - Main Entry Point
"""

import uvicorn
import os

if __name__ == "__main__":
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    
    print(f"Starting ALFA ALGO Trading System Backend...")
    print(f"Server will run on: http://{host}:{port}")
    print(f"API Documentation: http://{host}:{port}/docs")
    
    # Start the FastAPI server
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
