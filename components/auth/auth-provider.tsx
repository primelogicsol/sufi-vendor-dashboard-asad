"use client"

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import { AuthService } from '@/lib/auth/auth-service'
import { TokenManager } from '@/lib/auth/token-manager'
import type { AuthState, AuthContextType, LoginCredentials, AuthTokens , User } from '@/types/auth'

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  isLoading: true,
  error: null,
}

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { tokens: AuthTokens | null; user: User | null  } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_AUTHENTICATED'; payload: { tokens: AuthTokens | null; user: User | null } }

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        tokens: action.payload.tokens,
        user: action.payload.user,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        tokens: null,
        user: null,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        tokens: null,
        user: null,
        isLoading: false,
        error: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: true,
        tokens: action.payload.tokens,
        user: action.payload.user,
        isLoading: false,
        error: null,
      }
    default:
      return state
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const result = await AuthService.login(credentials)

      if (result.success && result.data) {
        const user = AuthService.getCurrentUser()
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            tokens: result.data,
            user,
          },
        })
        return true
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: result.error || 'Login failed',
        })
        return false
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
      return false
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout()
      dispatch({ type: 'LOGOUT' })
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still dispatch logout action
      dispatch({ type: 'LOGOUT' })
    }
  }

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const result = await AuthService.refreshAccessToken()
      if (result.success) {
        // Update state with new token
        const tokens = TokenManager.getTokens()
        const user = TokenManager.getUser()
        
        dispatch({
          type: 'SET_AUTHENTICATED',
          payload: { tokens, user },
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          // Check if token is valid
          const isValid = await AuthService.ensureValidToken()
          
          if (isValid) {
            const tokens = TokenManager.getTokens()
            const user = TokenManager.getUser()
            
            dispatch({
              type: 'SET_AUTHENTICATED',
              payload: { tokens, user },
            })
          } else {
            // Invalid token, clear everything
            dispatch({ type: 'LOGOUT' })
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Auth check error:', error)
        dispatch({ type: 'LOGOUT' })
      }
    }

    checkAuthStatus()
  }, [])

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!state.isAuthenticated) return

    const interval = setInterval(async () => {
      if (TokenManager.shouldRefreshToken()) {
        await refreshToken()
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [state.isAuthenticated])

  // Context value
  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
    clearError,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC to protect routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return null
    }

    return <Component {...props} />
  }
}


