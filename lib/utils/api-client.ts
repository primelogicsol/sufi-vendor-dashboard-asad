import { TokenManager } from '@/lib/auth/token-manager'
import { AuthService } from '@/lib/auth/auth-service'
// import {jwtDecode} from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

interface ApiRequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  requiresAuth?: boolean
}

export class ApiClient {
  
  // Make authenticated API request
  static async request(endpoint: string, options: ApiRequestOptions = {}): Promise<Response> {
    const {
      method = 'GET',
      headers = {},
      body,
      requiresAuth = true,
    } = options

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      ...headers,
    }

    // Only set Content-Type for JSON, let browser set it for FormData
    if (!(body instanceof FormData)) {
      requestHeaders['Content-Type'] = 'application/json'
    }

    // Add authentication if required
    if (requiresAuth) {
      // Ensure we have a valid token
      const hasValidToken = await AuthService.ensureValidToken()
      // console.log('Has valid token:', hasValidToken);
      if (!hasValidToken) {
        console.log('No valid token, redirecting to login');
        // Redirect to login or throw error
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        throw new Error('Authentication required')
      }

      const accessToken = TokenManager.getAccessToken()
      console.log('Access Token:', accessToken);
      if (accessToken) {
        try {
          // const decodedToken = jwtDecode(accessToken);
          // console.log('Decoded Token:', decodedToken); // Log the token payload
          requestHeaders['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      } else {
        console.log('No access token found');
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    }

    // Add body for POST/PUT requests
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      if (body instanceof FormData) {
        requestOptions.body = body // FormData goes directly
      } else {
        requestOptions.body = JSON.stringify(body) // JSON needs stringifying
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions)
      // console.log('API Response:', response)
      // Handle token expiration
      if (response.status === 401 && requiresAuth) {
        // Try to refresh token
        const refreshResult = await AuthService.refreshAccessToken()
        
        if (refreshResult.success) {
          // Retry the request with new token
          const newAccessToken = TokenManager.getAccessToken()
          if (newAccessToken) {
            requestHeaders['Authorization'] = `Bearer ${newAccessToken}`
            return fetch(`${API_BASE_URL}${endpoint}`, {
              ...requestOptions,
              headers: requestHeaders,
            })
          }
        } else {
          // Refresh failed, redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          throw new Error('Session expired')
        }
      }

      return response
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Convenience methods
  static async get(endpoint: string, requiresAuth: boolean = true): Promise<Response> {
    return this.request(endpoint, { method: 'GET', requiresAuth })
  }

  static async post(endpoint: string, data: unknown, requiresAuth: boolean = true): Promise<Response> {
    return this.request(endpoint, { method: 'POST', body: data, requiresAuth })
  }

  static async put(endpoint: string, data: unknown, requiresAuth: boolean = true): Promise<Response> {
    return this.request(endpoint, { method: 'PUT', body: data, requiresAuth })
  }

  static async patch(endpoint: string, data: unknown, requiresAuth: boolean = true): Promise<Response> {
    return this.request(endpoint, { method: 'PATCH', body: data, requiresAuth })
  }

  static async delete(endpoint: string, requiresAuth: boolean = true): Promise<Response> {
    return this.request(endpoint, { method: 'DELETE', requiresAuth })
  }

  // JSON response helpers
  static async getJson<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    const response = await this.get(endpoint, requiresAuth)
    return response.json()
  }

  static async postJson<T>(endpoint: string, data: unknown, requiresAuth: boolean = true): Promise<T> {
    const response = await this.post(endpoint, data, requiresAuth)
    return response.json()
  }

  // FormData specific helper
  static async postFormData<T>(endpoint: string, formData: FormData, requiresAuth: boolean = true): Promise<T> {
    const response = await this.post(endpoint, formData, requiresAuth)
    return response.json()
  }

  static async putFormData<T>(endpoint: string, formData: FormData, requiresAuth: boolean = true): Promise<T> {
    const response = await this.put(endpoint, formData, requiresAuth)
    return response.json()
  }
}