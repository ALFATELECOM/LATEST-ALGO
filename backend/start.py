#!/usr/bin/env python3
"""
ALFA ALGO Trading System - Backend Start Script
"""

import uvicorn
import os
from pathlib import Path

def main():
    """Start the FastAPI server"""
    print("🚀 Starting ALFA ALGO Trading System Backend...")
    
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"🌐 Server will run on: http://{host}:{port}")
    print(f"📚 API Documentation: http://{host}:{port}/docs")
    print(f"🔧 Debug mode: {debug}")
    print("\n" + "="*50)
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info" if not debug else "debug"
    )

if __name__ == "__main__":
    main()
