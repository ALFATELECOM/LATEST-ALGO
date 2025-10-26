"""
ALFA ALGO Trading System - Simple Backend
"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def root():
    return jsonify({
        "message": "ALFA ALGO Trading System is running!",
        "version": "1.0.0",
        "status": "healthy"
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/api/status')
def api_status():
    return jsonify({
        "status": "API is working",
        "endpoints": [
            "/",
            "/health", 
            "/api/status"
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
