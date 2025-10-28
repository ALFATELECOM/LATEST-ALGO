'use client'

import React, { useState } from 'react'

interface Strategy {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'paused'
  pnl: number
  lastUpdate: string
}

export function StrategyManager() {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'RSI Strategy',
      description: 'Overbought/Oversold signals based on RSI indicator',
      status: 'active',
      pnl: 1200,
      lastUpdate: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      name: 'MACD Strategy',
      description: 'Moving average convergence divergence signals',
      status: 'active',
      pnl: 800,
      lastUpdate: '2024-01-15 10:25:00'
    },
    {
      id: '3',
      name: 'Bollinger Bands',
      description: 'Price action within Bollinger Bands',
      status: 'paused',
      pnl: -200,
      lastUpdate: '2024-01-15 09:45:00'
    }
  ])

  const toggleStrategy = (id: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === id 
        ? { 
            ...strategy, 
            status: strategy.status === 'active' ? 'paused' : 'active' 
          }
        : strategy
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Strategy Manager</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          + Add Strategy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{strategy.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}>
                {strategy.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">P&L:</span>
                <span className={`text-sm font-medium ${
                  strategy.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{strategy.pnl.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Update:</span>
                <span className="text-sm text-gray-900">{strategy.lastUpdate}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => toggleStrategy(strategy.id)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                  strategy.status === 'active'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {strategy.status === 'active' ? 'Pause' : 'Resume'}
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200">
                Settings
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy Performance Chart Placeholder */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Strategy Performance</h4>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Performance Chart Component</span>
        </div>
      </div>
    </div>
  )
}

