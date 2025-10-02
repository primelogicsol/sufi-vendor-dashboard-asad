// // lib/auth/token-manager.ts

// import type { AuthTokens } from '@/types/auth'

// const ACCESS_TOKEN_KEY = 'accessToken'
// const REFRESH_TOKEN_KEY = 'refreshToken'
// const USER_KEY = 'user'

// export class TokenManager {
//   // Check if we're in browser environment
//   private static get isBrowser(): boolean {
//     return typeof window !== 'undefined'
//   }

//   // Store tokens
//   static setTokens(tokens: AuthTokens): void {
//     if (!this.isBrowser) return

//     try {
//       localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
//       localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
//     } catch (error) {
//       console.error('Failed to store tokens:', error)
//     }
//   }

//   // Get access token
//   static getAccessToken(): string | null {
//     if (!this.isBrowser) return null

//     try {
//       return localStorage.getItem(ACCESS_TOKEN_KEY)
//     } catch (error) {
//       console.error('Failed to get access token:', error)
//       return null
//     }
//   }

//   // Get refresh token
//   static getRefreshToken(): string | null {
//     if (!this.isBrowser) return null

//     try {
//       return localStorage.getItem(REFRESH_TOKEN_KEY)
//     } catch (error) {
//       console.error('Failed to get refresh token:', error)
//       return null
//     }
//   }

//   // Update access token only
//   static setAccessToken(accessToken: string): void {
//     if (!this.isBrowser) return

//     try {
//       localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
//     } catch (error) {
//       console.error('Failed to store access token:', error)
//     }
//   }

//   // Get both tokens
//   static getTokens(): AuthTokens | null {
//     const accessToken = this.getAccessToken()
//     const refreshToken = this.getRefreshToken()

//     if (!accessToken || !refreshToken) {
//       return null
//     }

//     return { accessToken, refreshToken }
//   }

//   // Clear all tokens
//   static clearTokens(): void {
//     if (!this.isBrowser) return

//     try {
//       localStorage.removeItem(ACCESS_TOKEN_KEY)
//       localStorage.removeItem(REFRESH_TOKEN_KEY)
//       localStorage.removeItem(USER_KEY)
//     } catch (error) {
//       console.error('Failed to clear tokens:', error)
//     }
//   }

//   // Store user data
//   static setUser(user: any): void {
//     if (!this.isBrowser) return

//     try {
//       localStorage.setItem(USER_KEY, JSON.stringify(user))
//     } catch (error) {
//       console.error('Failed to store user data:', error)
//     }
//   }

//   // Get user data
//   static getUser(): any | null {
//     if (!this.isBrowser) return null

//     try {
//       const userData = localStorage.getItem(USER_KEY)
//       return userData ? JSON.parse(userData) : null
//     } catch (error) {
//       console.error('Failed to get user data:', error)
//       return null
//     }
//   }

//   // Check if user is authenticated (has valid tokens)
//   static isAuthenticated(): boolean {
//     return !!(this.getAccessToken() && this.getRefreshToken())
//   }

//   // Decode JWT token (basic implementation)
//   static decodeToken(token: string): any {
//     try {
//       const base64Url = token.split('.')[1]
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//           .join('')
//       )
//       return JSON.parse(jsonPayload)
//     } catch (error) {
//       console.error('Failed to decode token:', error)
//       return null
//     }
//   }

//   // Check if token is expired
//   static isTokenExpired(token: string): boolean {
//     const decoded = this.decodeToken(token)
//     if (!decoded || !decoded.exp) return true

//     const currentTime = Date.now() / 1000
//     return decoded.exp < currentTime
//   }

//   // Check if access token needs refresh (expires in next 5 minutes)
//   static shouldRefreshToken(): boolean {
//     const accessToken = this.getAccessToken()
//     if (!accessToken) return false

//     const decoded = this.decodeToken(accessToken)
//     if (!decoded || !decoded.exp) return false

//     const currentTime = Date.now() / 1000
//     const timeUntilExpiry = decoded.exp - currentTime
    
//     // Refresh if expires in next 5 minutes (300 seconds)
//     return timeUntilExpiry < 300
//   }
// }

// lib/auth/token-manager.ts

import type { AuthTokens , User } from '@/types/auth'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'

// Define a type for JWT token payload
interface JWTPayload {
  exp?: number
  iat?: number
  sub?: string
  [key: string]: unknown
}

export class TokenManager {
  // Check if we're in browser environment
  private static get isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  // Store tokens
  static setTokens(tokens: AuthTokens): void {
    if (!this.isBrowser) return

    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    } catch (error) {
      console.error('Failed to store tokens:', error)
    }
  }

  // Get access token
  static getAccessToken(): string | null {
    if (!this.isBrowser) return null

    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    } catch (error) {
      console.error('Failed to get access token:', error)
      return null
    }
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    if (!this.isBrowser) return null

    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('Failed to get refresh token:', error)
      return null
    }
  }

  // Update access token only
  static setAccessToken(accessToken: string): void {
    if (!this.isBrowser) return

    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    } catch (error) {
      console.error('Failed to store access token:', error)
    }
  }

  // Get both tokens
  static getTokens(): AuthTokens | null {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()

    if (!accessToken || !refreshToken) {
      return null
    }

    return { accessToken, refreshToken }
  }

  // Clear all tokens
  static clearTokens(): void {
    if (!this.isBrowser) return

    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch (error) {
      console.error('Failed to clear tokens:', error)
    }
  }

  // Store user data
  static setUser(user: unknown): void {
    if (!this.isBrowser) return

    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch (error) {
      console.error('Failed to store user data:', error)
    }
  }

  // Get user data
  static getUser(): User | null {
    if (!this.isBrowser) return null

    try {
      const userData = localStorage.getItem(USER_KEY)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Failed to get user data:', error)
      return null
    }
  }

  // Check if user is authenticated (has valid tokens)
  static isAuthenticated(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken())
  }

  // Decode JWT token (basic implementation)
  static decodeToken(token: string): JWTPayload | null {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token)
    if (!decoded || !decoded.exp) return true

    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  }

  // Check if access token needs refresh (expires in next 5 minutes)
  static shouldRefreshToken(): boolean {
    const accessToken = this.getAccessToken()
    if (!accessToken) return false

    const decoded = this.decodeToken(accessToken)
    if (!decoded || !decoded.exp) return false

    const currentTime = Date.now() / 1000
    const timeUntilExpiry = decoded.exp - currentTime
    
    // Refresh if expires in next 5 minutes (300 seconds)
    return timeUntilExpiry < 300
  }

  // Try to get current user id from stored user or token payload
  static getUserId(): string | null {
    const user = this.getUser()
    if (user && (user as User).id) return (user as User).id

    const access = this.getAccessToken()
    if (!access) return null
    const payload = this.decodeToken(access)
    if (!payload) return null
    const possible =
      (payload['vendorId'] as string) ||
      (payload['sub'] as string) ||
      (payload['id'] as string) ||
      (payload['userId'] as string)
    return possible || null
  }
}