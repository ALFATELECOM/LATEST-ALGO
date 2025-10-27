// ALFA ALGO Trading System - API Service
// Connects frontend to live backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://latest-algo.onrender.com'

// API Response types
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

interface HealthResponse {
  status: string
  service: string
  version: string
  timestamp: string
}

interface PortfolioData {
  value: number
  pnl: number
  positions: any[]
  orders: any[]
}

interface StrategyData {
  id: string
  name: string
  status: string
  pnl: number
  parameters: any
}

interface MarketData {
  nifty: { price: number; change: number; change_percent: number }
  sensex: { price: number; change: number; change_percent: number }
}

// API Service Class
class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  // Generic API call method
  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Health check
  async getHealth(): Promise<HealthResponse> {
    return this.apiCall<HealthResponse>('/health')
  }

  // Get API info
  async getApiInfo(): Promise<any> {
    return this.apiCall<any>('/')
  }

  // Portfolio endpoints
  async getPortfolio(): Promise<PortfolioData> {
    return this.apiCall<PortfolioData>('/api/v1/portfolio')
  }

  async getPositions(): Promise<any[]> {
    return this.apiCall<any[]>('/api/v1/portfolio/positions')
  }

  async getOrders(): Promise<any[]> {
    return this.apiCall<any[]>('/api/v1/portfolio/orders')
  }

  // Trading endpoints
  async placeOrder(orderData: any): Promise<any> {
    return this.apiCall<any>('/api/v1/trading/place-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async cancelOrder(orderId: string): Promise<any> {
    return this.apiCall<any>(`/api/v1/trading/cancel-order/${orderId}`, {
      method: 'POST',
    })
  }

  // Strategy endpoints
  async getStrategies(): Promise<StrategyData[]> {
    return this.apiCall<StrategyData[]>('/api/v1/strategies')
  }

  async getOptionsStrategies(): Promise<StrategyData[]> {
    return this.apiCall<StrategyData[]>('/api/v1/strategies/options')
  }

  async startStrategy(strategyName: string): Promise<any> {
    return this.apiCall<any>(`/api/v1/strategies/${strategyName}/start`, {
      method: 'POST',
    })
  }

  async stopStrategy(strategyName: string): Promise<any> {
    return this.apiCall<any>(`/api/v1/strategies/${strategyName}/stop`, {
      method: 'POST',
    })
  }

  // Market data endpoints
  async getMarketIndices(): Promise<MarketData> {
    return this.apiCall<MarketData>('/api/v1/market/indices')
  }

  async getQuote(symbol: string): Promise<any> {
    return this.apiCall<any>(`/api/v1/market/quote/${symbol}`)
  }

  // Analytics endpoints
  async getPerformanceAnalytics(): Promise<any> {
    return this.apiCall<any>('/api/v1/analytics/performance')
  }

  async getRiskMetrics(): Promise<any> {
    return this.apiCall<any>('/api/v1/analytics/risk')
  }

  // Authentication endpoints
  async login(credentials: { username: string; password: string }): Promise<any> {
    return this.apiCall<any>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getCurrentUser(): Promise<any> {
    return this.apiCall<any>('/api/v1/auth/me')
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export types
export type { ApiResponse, HealthResponse, PortfolioData, StrategyData, MarketData }
