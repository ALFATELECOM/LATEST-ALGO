'use client'

import React, { useState } from 'react'

interface PerformanceMetric {
  name: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  description: string
}

interface TradeData {
  date: string
  pnl: number
  trades: number
  winRate: number
}

export function PerformanceAnalytics() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M')

  const [performanceMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'Total Return',
      value: '₹12,450',
      change: 12.4,
      trend: 'up',
      description: 'Total profit/loss over selected period'
    },
    {
      name: 'Win Rate',
      value: '68%',
      change: 5.2,
      trend: 'up',
      description: 'Percentage of profitable trades'
    },
    {
      name: 'Sharpe Ratio',
      value: '1.8',
      change: 0.3,
      trend: 'up',
      description: 'Risk-adjusted return measure'
    },
    {
      name: 'Max Drawdown',
      value: '3.2%',
      change: -0.8,
      trend: 'down',
      description: 'Maximum peak-to-trough decline'
    },
    {
      name: 'Average Trade',
      value: '₹125',
      change: 15.6,
      trend: 'up',
      description: 'Average profit per trade'
    },
    {
      name: 'Profit Factor',
      value: '2.1',
      change: 0.2,
      trend: 'up',
      description: 'Ratio of gross profit to gross loss'
    }
  ])

  const [tradeData] = useState<TradeData[]>([
    { date: '2024-01-01', pnl: 1200, trades: 15, winRate: 65 },
    { date: '2024-01-02', pnl: -300, trades: 12, winRate: 58 },
    { date: '2024-01-03', pnl: 800, trades: 18, winRate: 72 },
    { date: '2024-01-04', pnl: 1500, trades: 20, winRate: 75 },
    { date: '2024-01-05', pnl: -200, trades: 8, winRate: 62 },
    { date: '2024-01-06', pnl: 900, trades: 14, winRate: 71 },
    { date: '2024-01-07', pnl: 1100, trades: 16, winRate: 69 }
  ])

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'stable': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '→'
      default: return ''
    }
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Performance Analytics</h3>
        <div className="flex space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1D">1 Day</option>
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="1Y">1 Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-900">{metric.name}</h4>
              <span className={`text-lg ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
              </span>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getChangeColor(metric.change)}`}>
                {metric.change >= 0 ? '+' : ''}{metric.change}%
              </span>
              <span className="text-xs text-gray-500">vs previous period</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">P&L Over Time</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">P&L Chart Component</span>
          </div>
        </div>

        {/* Win Rate Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Win Rate Trend</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Win Rate Chart Component</span>
          </div>
        </div>
      </div>

      {/* Trade Analysis Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Daily Trade Analysis</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P&L
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Trade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tradeData.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getChangeColor(day.pnl)}`}>
                      ₹{day.pnl.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.trades}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.winRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{Math.round(day.pnl / day.trades).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategy Performance Comparison */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Strategy Performance Comparison</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">RSI Strategy</div>
            <div className="text-2xl font-bold text-green-600">+₹3,200</div>
            <div className="text-xs text-gray-500">68% win rate</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">MACD Strategy</div>
            <div className="text-2xl font-bold text-green-600">+₹2,800</div>
            <div className="text-xs text-gray-500">72% win rate</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Bollinger Bands</div>
            <div className="text-2xl font-bold text-red-600">-₹500</div>
            <div className="text-xs text-gray-500">45% win rate</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Manual Trades</div>
            <div className="text-2xl font-bold text-blue-600">+₹1,100</div>
            <div className="text-xs text-gray-500">55% win rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
