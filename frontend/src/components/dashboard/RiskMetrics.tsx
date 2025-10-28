'use client'

import React, { useState } from 'react'

interface RiskMetric {
  name: string
  value: string | number
  status: 'good' | 'warning' | 'danger'
  description: string
  trend?: 'up' | 'down' | 'stable'
}

export function RiskMetrics() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([
    {
      name: 'Portfolio Risk',
      value: '2.1%',
      status: 'good',
      description: 'Current portfolio risk level',
      trend: 'stable'
    },
    {
      name: 'VaR (95%)',
      value: '₹1,250',
      status: 'good',
      description: 'Value at Risk at 95% confidence',
      trend: 'down'
    },
    {
      name: 'Max Drawdown',
      value: '3.2%',
      status: 'warning',
      description: 'Maximum peak-to-trough decline',
      trend: 'up'
    },
    {
      name: 'Sharpe Ratio',
      value: '1.8',
      status: 'good',
      description: 'Risk-adjusted return measure',
      trend: 'up'
    },
    {
      name: 'Beta',
      value: '0.95',
      status: 'good',
      description: 'Portfolio sensitivity to market',
      trend: 'stable'
    },
    {
      name: 'Correlation Risk',
      value: '35%',
      status: 'warning',
      description: 'Portfolio correlation with market',
      trend: 'up'
    }
  ])

  const [riskLimits] = useState({
    dailyLossLimit: 2000,
    maxPositionSize: 10000,
    maxTradesPerDay: 50,
    correlationLimit: 40,
    drawdownLimit: 5
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'danger': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '→'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Risk Metrics</h3>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Update Limits
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {riskMetrics.map((metric, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-900">{metric.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                {metric.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              {getTrendIcon(metric.trend) && (
                <span className="text-lg">{getTrendIcon(metric.trend)}</span>
              )}
            </div>
            <p className="text-sm text-gray-600">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Risk Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Limits</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Daily Loss Limit</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">₹{riskLimits.dailyLossLimit.toLocaleString()}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max Position Size</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">₹{riskLimits.maxPositionSize.toLocaleString()}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max Trades/Day</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{riskLimits.maxTradesPerDay}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Correlation Limit</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{riskLimits.correlationLimit}%</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Drawdown Limit</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{riskLimits.drawdownLimit}%</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Alerts</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex-shrink-0">
                <span className="text-yellow-600">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">High Correlation Warning</p>
                <p className="text-xs text-yellow-600">Portfolio correlation approaching limit</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex-shrink-0">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Risk Within Limits</p>
                <p className="text-xs text-green-600">All risk metrics are within acceptable ranges</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-shrink-0">
                <span className="text-blue-600">ℹ️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Position Size Alert</p>
                <p className="text-xs text-blue-600">Consider diversifying large positions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Chart Placeholder */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Over Time</h4>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Risk Chart Component</span>
        </div>
      </div>
    </div>
  )
}

