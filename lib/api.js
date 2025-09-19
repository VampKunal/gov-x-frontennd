"use client"

// API base URL - update this to match your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Get stored Firebase token
 */
const getStoredToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('firebase-token')
}

/**
 * Create authenticated API client
 */
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Make authenticated request
   */
  async request(endpoint, options = {}) {
    const token = getStoredToken()
    const url = `${this.baseURL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    // Add Firebase ID token to Authorization header
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
    }

    const config = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      // Handle different response types
      const contentType = response.headers.get('content-type')
      let data

      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        throw new ApiError(
          data?.message || data || 'An error occurred',
          response.status,
          data
        )
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Network error or other issues
      throw new ApiError(
        'Network error or server unavailable',
        0,
        { originalError: error.message }
      )
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = Object.keys(params).length 
      ? '?' + new URLSearchParams(params).toString()
      : ''
    
    return this.request(`${endpoint}${queryString}`, {
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }

  /**
   * Upload file with authentication
   */
  async uploadFile(endpoint, file, additionalData = {}) {
    const token = getStoredToken()
    const formData = new FormData()
    
    formData.append('file', file)
    
    // Add any additional data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key])
    })

    const headers = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers, // Don't set Content-Type for FormData
    })
  }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Create default API client instance
const apiClient = new ApiClient()

/**
 * API endpoints for Gov-X platform
 */
export const govXApi = {
  // Auth endpoints
  auth: {
    // Verify token and get user profile
    verifyToken: () => apiClient.get('/auth/verify'),
    
    // Update user profile
    updateProfile: (data) => apiClient.put('/auth/profile', data),
    
    // Get user profile
    getProfile: () => apiClient.get('/auth/profile'),
  },

  // Civic issues endpoints
  issues: {
    // Get all issues
    getAll: (params = {}) => apiClient.get('/issues', params),
    
    // Get single issue
    getById: (id) => apiClient.get(`/issues/${id}`),
    
    // Create new issue
    create: (data) => apiClient.post('/issues', data),
    
    // Update issue
    update: (id, data) => apiClient.put(`/issues/${id}`, data),
    
    // Delete issue
    delete: (id) => apiClient.delete(`/issues/${id}`),
    
    // Upload issue image
    uploadImage: (issueId, file) => 
      apiClient.uploadFile(`/issues/${issueId}/upload`, file),
    
    // Like/unlike issue
    toggleLike: (id) => apiClient.post(`/issues/${id}/like`),
    
    // Add comment
    addComment: (id, comment) => apiClient.post(`/issues/${id}/comments`, { comment }),
    
    // Get comments
    getComments: (id) => apiClient.get(`/issues/${id}/comments`),
    
    // Track issue progress
    getProgress: (id) => apiClient.get(`/issues/${id}/progress`),
  },

  // User-specific endpoints
  user: {
    // Get user's issues
    getMyIssues: () => apiClient.get('/user/issues'),
    
    // Get user's notifications
    getNotifications: () => apiClient.get('/user/notifications'),
    
    // Mark notification as read
    markNotificationRead: (id) => apiClient.patch(`/user/notifications/${id}/read`),
    
    // Get user statistics
    getStats: () => apiClient.get('/user/stats'),
  },

  // Department endpoints
  departments: {
    // Get all departments
    getAll: () => apiClient.get('/departments'),
    
    // Get department by ID
    getById: (id) => apiClient.get(`/departments/${id}`),
  },

  // Analytics endpoints
  analytics: {
    // Get public statistics
    getPublicStats: () => apiClient.get('/analytics/public'),
    
    // Get issue trends
    getTrends: (params = {}) => apiClient.get('/analytics/trends', params),
  },
}

/**
 * Hook for making API calls with auth context
 */
export const useApi = () => {
  const makeAuthenticatedRequest = async (requestFn, options = {}) => {
    try {
      // Auto-refresh token if needed
      if (options.refreshToken && typeof window !== 'undefined') {
        const { useAuth } = await import('@/hooks/use-auth')
        const { getIdToken } = useAuth()
        await getIdToken(true) // Force refresh
      }
      
      return await requestFn()
    } catch (error) {
      if (error.status === 401) {
        // Token expired, try to refresh
        try {
          const { useAuth } = await import('@/hooks/use-auth')
          const { getIdToken } = useAuth()
          await getIdToken(true) // Force refresh
          
          // Retry the request
          return await requestFn()
        } catch (refreshError) {
          // If refresh fails, user needs to login again
          console.error('Token refresh failed:', refreshError)
          
          // Clear stored token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('firebase-token')
          }
          
          throw new ApiError('Authentication failed. Please login again.', 401)
        }
      }
      
      throw error
    }
  }

  return {
    makeAuthenticatedRequest,
    api: govXApi,
    ApiError,
  }
}

// Export the API client and utilities
export { apiClient, ApiError }
export default govXApi