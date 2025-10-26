'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

// Types
interface User {
  id: string
  name: string
  email: string
  isAuthenticated: boolean
}

interface TradingData {
  positions: any[]
  orders: any[]
  pnl: number
  portfolioValue: number
}

interface AppState {
  user: User | null
  isConnected: boolean
  tradingData: TradingData
  strategies: any[]
  isLoading: boolean
}

interface AppContextType extends AppState {
  setUser: (user: User | null) => void
  setTradingData: (data: TradingData) => void
  setStrategies: (strategies: any[]) => void
  setLoading: (loading: boolean) => void
  connect: () => void
  disconnect: () => void
  socket: Socket | null
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export function Providers({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    isConnected: false,
    tradingData: {
      positions: [],
      orders: [],
      pnl: 0,
      portfolioValue: 0,
    },
    strategies: [],
    isLoading: false,
  })

  const [socket, setSocket] = useState<Socket | null>(null)

  // WebSocket connection
  const connect = () => {
    if (socket?.connected) return

    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000', {
      transports: ['websocket'],
      autoConnect: true,
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket')
      setState(prev => ({ ...prev, isConnected: true }))
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket')
      setState(prev => ({ ...prev, isConnected: false }))
    })

    newSocket.on('trading_data', (data: TradingData) => {
      setState(prev => ({ ...prev, tradingData: data }))
    })

    newSocket.on('strategy_update', (strategies: any[]) => {
      setState(prev => ({ ...prev, strategies }))
    })

    newSocket.on('error', (error: any) => {
      console.error('WebSocket error:', error)
    })

    setSocket(newSocket)
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setState(prev => ({ ...prev, isConnected: false }))
    }
  }

  // Auto-connect on mount
  useEffect(() => {
    connect()
    return () => disconnect()
  }, [])

  // Context value
  const contextValue: AppContextType = {
    ...state,
    setUser: (user) => setState(prev => ({ ...prev, user })),
    setTradingData: (tradingData) => setState(prev => ({ ...prev, tradingData })),
    setStrategies: (strategies) => setState(prev => ({ ...prev, strategies })),
    setLoading: (isLoading) => setState(prev => ({ ...prev, isLoading })),
    connect,
    disconnect,
    socket,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

// Hook to use context
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within a Providers')
  }
  return context
}
