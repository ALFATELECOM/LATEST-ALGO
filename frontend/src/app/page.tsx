'use client'

import { useEffect, useState } from 'react'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { LoginPage } from '@/components/auth/LoginPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tradingData, setTradingData] = useState({
    positions: [],
    orders: [],
    pnl: 0,
    portfolioValue: 100000
  })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate loading and authentication check
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    return <LoginPage />
  }

  return <Dashboard user={user} tradingData={tradingData} isConnected={isConnected} />
}
