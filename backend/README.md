# ALFA ALGO Trading System - Backend

A comprehensive algorithmic trading system backend built with FastAPI.

## Features

- **RESTful API** - Complete trading system API
- **Options Strategies** - Iron Condor, Butterfly, Straddle, Strangle
- **Real-time Data** - WebSocket support for live market data
- **Portfolio Management** - Track positions, orders, and P&L
- **Risk Management** - Built-in risk controls and limits
- **Strategy Engine** - Extensible strategy framework

## Quick Start

### Installation

```bash
pip install -r requirements.txt
```

### Running the Server

```bash
python start.py
```

Or directly with uvicorn:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /` - API information

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Portfolio
- `GET /api/v1/portfolio` - Get portfolio data
- `GET /api/v1/portfolio/positions` - Get positions
- `GET /api/v1/portfolio/orders` - Get orders

### Trading
- `POST /api/v1/trading/place-order` - Place order
- `POST /api/v1/trading/cancel-order/{order_id}` - Cancel order

### Strategies
- `GET /api/v1/strategies` - Get all strategies
- `GET /api/v1/strategies/options` - Get options strategies
- `POST /api/v1/strategies/{strategy_name}/start` - Start strategy
- `POST /api/v1/strategies/{strategy_name}/stop` - Stop strategy

### Market Data
- `GET /api/v1/market/quote/{symbol}` - Get quote
- `GET /api/v1/market/indices` - Get market indices

### Analytics
- `GET /api/v1/analytics/performance` - Performance metrics
- `GET /api/v1/analytics/risk` - Risk metrics

### WebSocket
- `ws://localhost:8000/ws` - Real-time data stream

## Deployment

This backend is designed to be deployed on cloud platforms like Render, Railway, or Heroku.

### Environment Variables

- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 8000)
- `DEBUG` - Debug mode (default: True)

## Development

### Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Main FastAPI application
│   └── strategies/
│       ├── base_strategy.py # Base strategy classes
│       └── options_strategies.py # Options trading strategies
├── requirements.txt         # Python dependencies
├── start.py                # Server startup script
└── README.md               # This file
```

## License

Private - ALFA ALGO Trading System
