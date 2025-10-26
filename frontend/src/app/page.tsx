'use client'

import { useEffect } from 'react'
import { useApp } from './providers'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { LoginPage } from '@/components/auth/LoginPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Home() {
  const { user, isLoading, setLoading } = useApp()

  useEffect(() => {
    // Check for existing authentication
    const checkAuth = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('access_token')
        if (token) {
          // Validate token with backend
          const response = await fetch('/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const userData = await response.json()
            // User is authenticated
          } else {
            localStorage.removeItem('access_token')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('access_token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [setLoading])

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

  return <Dashboard />
}
