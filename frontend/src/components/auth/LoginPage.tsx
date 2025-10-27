'use client'

import React, { useState } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState('demo') // 'demo' or 'zerodha'
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    apiKey: '',
    apiSecret: ''
  })

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate demo login
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
      window.location.reload()
    }, 2000)
  }

  const handleZerodhaLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate Zerodha login
    setTimeout(() => {
      setIsLoading(false)
      // In real implementation, this would authenticate with Zerodha
      alert('Zerodha integration coming soon!')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            ALFA ALGO Trading System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Advanced Algorithmic Trading Platform
          </p>
        </div>

        {/* Login Type Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setLoginType('demo')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              loginType === 'demo'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Demo Mode
          </button>
          <button
            onClick={() => setLoginType('zerodha')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              loginType === 'zerodha'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Zerodha Login
          </button>
        </div>

        {/* Demo Login Form */}
        {loginType === 'demo' && (
          <form className="mt-8 space-y-6" onSubmit={handleDemoLogin}>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Demo Mode
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Use demo mode to explore all features with simulated data. No real money involved.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Enter Demo Mode'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Zerodha Login Form */}
        {loginType === 'zerodha' && (
          <form className="mt-8 space-y-6" onSubmit={handleZerodhaLogin}>
            <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">
                    Live Trading
                  </h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p>Connect to your Zerodha account for live trading. Requires API credentials.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  id="apiKey"
                  name="apiKey"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your Zerodha API Key"
                  value={credentials.apiKey}
                  onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-700">
                  API Secret
                </label>
                <input
                  id="apiSecret"
                  name="apiSecret"
                  type="password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your Zerodha API Secret"
                  value={credentials.apiSecret}
                  onChange={(e) => setCredentials({...credentials, apiSecret: e.target.value})}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Connect to Zerodha'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Features List */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Features</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">🤖</span>
              Automated Strategies
            </div>
            <div className="flex items-center">
              <span className="mr-2">📊</span>
              Real-time Analytics
            </div>
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              Risk Management
            </div>
            <div className="flex items-center">
              <span className="mr-2">📈</span>
              Live Trading
            </div>
            <div className="flex items-center">
              <span className="mr-2">🔄</span>
              Backtesting
            </div>
            <div className="flex items-center">
              <span className="mr-2">📱</span>
              Mobile Responsive
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}