'use client'

import { useEffect, useState } from 'react'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { LoginPage } from '@/components/auth/LoginPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tradingData, setTradingData] = useState({
    positions: [
      { symbol: 'RELIANCE', quantity: 10, price: 2500, pnl: 1500 },
      { symbol: 'TCS', quantity: 5, price: 3500, pnl: 1000 }
    ],
    orders: [
      { symbol: 'INFY', type: 'BUY', quantity: 20, status: 'COMPLETE' },
      { symbol: 'HDFC', type: 'SELL', quantity: 15, status: 'PENDING' }
    ],
    pnl: 2500,
    portfolioValue: 100000
  })
  const [isConnected, setIsConnected] = useState(false)
  const [strategies, setStrategies] = useState([
    { name: 'RSI Strategy', status: 'ACTIVE', pnl: 1200 },
    { name: 'MACD Strategy', status: 'ACTIVE', pnl: 800 },
    { name: 'Bollinger Bands', status: 'INACTIVE', pnl: 0 }
  ])
  const [marketData, setMarketData] = useState({
    nifty: { price: 19500, change: 150, change_percent: 0.78 },
    sensex: { price: 65000, change: 200, change_percent: 0.31 }
  })

  useEffect(() => {
    // Simulate loading and authentication check
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // For demo purposes, set a mock user
        setUser({
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          isAuthenticated: true
        })
        setIsConnected(true)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Simulate real-time data updates
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      setTradingData(prev => ({
        ...prev,
        pnl: prev.pnl + (Math.random() - 0.5) * 200,
        portfolioValue: prev.portfolioValue + (Math.random() - 0.5) * 100,
        positions: prev.positions.map(pos => ({
          ...pos,
          pnl: pos.pnl + (Math.random() - 0.5) * 100
        }))
      }))

      setMarketData(prev => ({
        nifty: {
          ...prev.nifty,
          price: prev.nifty.price + (Math.random() - 0.5) * 50,
          change: (Math.random() - 0.5) * 100
        },
        sensex: {
          ...prev.sensex,
          price: prev.sensex.price + (Math.random() - 0.5) * 100,
          change: (Math.random() - 0.5) * 200
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isConnected])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg text-gray-600">Loading ALFA ALGO Trading System...</p>
          <p className="mt-2 text-sm text-gray-500">Initializing trading platform</p>
        </div>
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    return <LoginPage />
  }

  return (
    <Dashboard 
      user={user} 
      tradingData={tradingData} 
      isConnected={isConnected}
      strategies={strategies}
      marketData={marketData}
    />
  )
}