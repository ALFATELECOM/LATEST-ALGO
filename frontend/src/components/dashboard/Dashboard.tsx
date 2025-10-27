'use client'

import React, { useState, useEffect } from 'react'
import { StrategyManager } from './StrategyManager'
import { OrderBook } from './OrderBook'
import { RiskMetrics } from './RiskMetrics'
import { PerformanceAnalytics } from './PerformanceAnalytics'
import OptionsStrategies from '@/components/options/OptionsStrategies'

interface DashboardProps {
  user?: any
  tradingData?: any
  isConnected?: boolean
  strategies?: any[]
  marketData?: any
}

export function Dashboard({ 
  user = { name: 'Demo User' }, 
  tradingData = { positions: [], orders: [], pnl: 0, portfolioValue: 100000 },
  isConnected = true,
  strategies = [],
  marketData = {}
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [realTimeData, setRealTimeData] = useState(tradingData)
  const [localStrategies, setLocalStrategies] = useState(strategies)
  const [localMarketData, setLocalMarketData] = useState(marketData)
  const [optionsStrategies, setOptionsStrategies] = useState([
    {
      name: "Iron Condor",
      type: "iron_condor",
      description: "Neutral strategy with limited risk and reward",
      max_profit: "Limited",
      max_loss: "Limited",
      market_outlook: "Neutral",
      volatility: "Low to Moderate",
      time_decay: "Positive",
      breakeven_points: 2,
      risk_reward_ratio: "1:1 to 1:3",
      status: "INACTIVE",
      pnl: 0
    },
    {
      name: "Butterfly",
      type: "butterfly",
      description: "Neutral strategy with maximum profit at center strike",
      max_profit: "Limited",
      max_loss: "Limited",
      market_outlook: "Neutral",
      volatility: "Low",
      time_decay: "Positive",
      breakeven_points: 2,
      risk_reward_ratio: "1:1 to 1:2",
      status: "INACTIVE",
      pnl: 0
    },
    {
      name: "Straddle",
      type: "straddle",
      description: "Volatility strategy betting on big moves",
      max_profit: "Unlimited",
      max_loss: "Limited",
      market_outlook: "Volatile",
      volatility: "High",
      time_decay: "Negative",
      breakeven_points: 2,
      risk_reward_ratio: "1:1 to 1:2",
      status: "INACTIVE",
      pnl: 0
    },
    {
      name: "Strangle",
      type: "strangle",
      description: "Volatility strategy with wider breakeven",
      max_profit: "Unlimited",
      max_loss: "Limited",
      market_outlook: "Volatile",
      volatility: "High",
      time_decay: "Negative",
      breakeven_points: 2,
      risk_reward_ratio: "1:1 to 1:2",
      status: "INACTIVE",
      pnl: 0
    },
    {
      name: "Call Spread",
      type: "call_spread",
      description: "Bullish strategy with limited risk",
      max_profit: "Limited",
      max_loss: "Limited",
      market_outlook: "Bullish",
      volatility: "Any",
      time_decay: "Positive",
      breakeven_points: 1,
      risk_reward_ratio: "1:1 to 1:3",
      status: "INACTIVE",
      pnl: 0
    },
    {
      name: "Put Spread",
      type: "put_spread",
      description: "Bearish strategy with limited risk",
      max_profit: "Limited",
      max_loss: "Limited",
      market_outlook: "Bearish",
      volatility: "Any",
      time_decay: "Positive",
      breakeven_points: 1,
      risk_reward_ratio: "1:1 to 1:3",
      status: "INACTIVE",
      pnl: 0
    },
    {
      name: "Covered Call",
      type: "covered_call",
      description: "Income strategy on owned stock",
      max_profit: "Limited",
      max_loss: "Unlimited",
      market_outlook: "Neutral to Bullish",
      volatility: "Any",
      time_decay: "Positive",
      breakeven_points: 1,
      risk_reward_ratio: "1:1 to 1:2",
      status: "INACTIVE",
      pnl: 0
    },
    {
      name: "Protective Put",
      type: "protective_put",
      description: "Insurance strategy for owned stock",
      max_profit: "Unlimited",
      max_loss: "Limited",
      market_outlook: "Bullish with Protection",
      volatility: "Any",
      time_decay: "Negative",
      breakeven_points: 1,
      risk_reward_ratio: "1:1 to 1:2",
      status: "INACTIVE",
      pnl: 0
    }
  ])

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        pnl: prev.pnl + (Math.random() - 0.5) * 100,
        portfolioValue: prev.portfolioValue + (Math.random() - 0.5) * 50
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'trading', name: 'Trading', icon: '📈' },
    { id: 'strategies', name: 'Strategies', icon: '🤖' },
    { id: 'options', name: 'Options', icon: '⚡' },
    { id: 'orders', name: 'Orders', icon: '📋' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'risk', name: 'Risk', icon: '⚠️' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                ALFA ALGO Trading System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </div>
              <div className="text-sm text-gray-500">
                Welcome, {user?.name || 'User'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'overview' && <OverviewTab data={realTimeData} />}
          {activeTab === 'trading' && <TradingTab data={realTimeData} />}
          {activeTab === 'strategies' && <StrategyManager />}
          {activeTab === 'options' && <OptionsStrategies strategies={optionsStrategies} onStrategyAction={(type, action) => {
            console.log(`Options strategy ${type} ${action}`);
            // Handle options strategy actions
          }} />}
          {activeTab === 'orders' && <OrderBook />}
          {activeTab === 'analytics' && <PerformanceAnalytics />}
          {activeTab === 'risk' && <RiskMetrics />}
        </div>
      </main>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Portfolio Value
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ₹{data.portfolioValue?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">P&L</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Today's P&L
                  </dt>
                  <dd className={`text-lg font-medium ${
                    data.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{data.pnl?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Positions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.positions?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Orders
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.orders?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            📈 Place Order
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            🤖 Start Strategy
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            📊 View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}

// Trading Tab Component
function TradingTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Trading Chart</h3>
          <TradingChart />
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Market Data</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">NIFTY 50</span>
              <span className="font-medium">19,500 (+150)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SENSEX</span>
              <span className="font-medium">65,000 (+200)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RELIANCE</span>
              <span className="font-medium">₹2,500 (+25)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Placeholder components
function TradingChart() {
  return (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Trading Chart Component</span>
    </div>
  )
}

