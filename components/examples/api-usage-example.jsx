"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

export function ApiUsageExample() {
  const { user, idToken, getIdToken } = useAuth()
  const { api, makeAuthenticatedRequest, ApiError } = useApi()
  
  const [userProfile, setUserProfile] = useState(null)
  const [userIssues, setUserIssues] = useState([])
  const [allIssues, setAllIssues] = useState([])
  const [loading, setLoading] = useState(false)
  
  // New issue form
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    location: '',
    department: 'municipal',
    category: 'Infrastructure'
  })

  // Fetch user profile (Mock response - shows token being sent)
  const fetchUserProfile = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Show the token that would be sent to backend
      console.log('🔐 Sending Firebase ID Token to backend:', idToken)
      console.log('📡 API Call: GET /auth/profile')
      console.log('📜 Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken?.substring(0, 20)}...`
      })
      
      // Mock successful response (what backend would return)
      const mockResponse = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Anonymous User',
        email_verified: user.emailVerified,
        picture: user.photoURL,
        created_at: new Date().toISOString(),
        role: 'citizen',
        issues_reported: 5,
        issues_resolved: 2,
        backend_note: 'This is a mock response - backend engineer will implement the actual logic'
      }
      
      setUserProfile(mockResponse)
      toast.success('Profile loaded successfully! (Mock data)')
      console.log('🎉 Backend would return:', mockResponse)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error(`Failed to load profile: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's issues (Mock response)
  const fetchUserIssues = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      console.log('🔐 Sending token for user issues:', idToken?.substring(0, 20) + '...')
      console.log('📡 API Call: GET /user/issues')
      
      // Mock user-specific issues
      const mockIssues = [
        {
          id: 1,
          title: 'Pothole on Main Street',
          description: 'Large pothole causing traffic issues',
          location: 'Main Street, Your City',
          status: 'pending',
          created_at: '2024-01-15T10:00:00Z',
          department: 'municipal',
          category: 'Infrastructure'
        },
        {
          id: 2,
          title: 'Broken Street Light',
          description: 'Street light not working since last week',
          location: 'Park Avenue, Your City',
          status: 'in_progress',
          created_at: '2024-01-12T14:30:00Z',
          department: 'electricity',
          category: 'Utilities'
        }
      ]
      
      setUserIssues(mockIssues)
      toast.success('Your issues loaded! (Mock data)')
      console.log('📦 Backend would filter by user_id and return:', mockIssues)
    } catch (error) {
      console.error('Error fetching user issues:', error)
      toast.error(`Failed to load your issues: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all issues (public endpoint)
  const fetchAllIssues = async () => {
    setLoading(true)
    try {
      // This endpoint works with or without authentication
      const response = await api.issues.getAll({ limit: 5 })
      setAllIssues(response.data.issues)
      toast.success('All issues loaded successfully!')
    } catch (error) {
      console.error('Error fetching all issues:', error)
      toast.error(`Failed to load issues: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Create new issue (Mock creation)
  const createNewIssue = async () => {
    if (!user) {
      toast.error('Please login to create an issue')
      return
    }

    if (!newIssue.title || !newIssue.description || !newIssue.location) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      console.log('🔐 Creating issue with Firebase token:', idToken?.substring(0, 20) + '...')
      console.log('📡 API Call: POST /issues')
      console.log('📜 Request Body:', newIssue)
      console.log('📜 User from token:', {
        user_id: user.uid,
        email: user.email,
        name: user.displayName
      })
      
      // Mock successful creation
      const createdIssue = {
        id: Date.now(), // Mock ID
        ...newIssue,
        status: 'pending',
        created_at: new Date().toISOString(),
        user_id: user.uid,
        user_email: user.email,
        user_name: user.displayName || 'Anonymous',
        likes: 0,
        comments: 0
      }
      
      toast.success('Issue created successfully! (Mock)')
      console.log('🎉 Backend would save and return:', createdIssue)
      
      setNewIssue({
        title: '',
        description: '',
        location: '',
        department: 'municipal',
        category: 'Infrastructure'
      })
      
      // Add to user issues for demo
      setUserIssues(prev => [createdIssue, ...prev])
    } catch (error) {
      console.error('Error creating issue:', error)
      toast.error(`Failed to create issue: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Display and analyze token (for backend engineer reference)
  const analyzeToken = async () => {
    if (!idToken) {
      toast.error('No token available')
      return
    }

    setLoading(true)
    try {
      // Show the token being sent (this is what backend will receive)
      console.log('🔐 Firebase ID Token (what backend receives):', idToken)
      
      // Parse the token payload (JWT decode for demonstration)
      const tokenParts = idToken.split('.')
      if (tokenParts.length === 3) {
        const header = JSON.parse(atob(tokenParts[0]))
        const payload = JSON.parse(atob(tokenParts[1]))
        
        console.log('📋 Token Header:', header)
        console.log('📋 Token Payload:', payload)
        
        // Show what the backend engineer needs to know
        const tokenInfo = {
          algorithm: header.alg,
          keyId: header.kid,
          issuer: payload.iss,
          audience: payload.aud,
          userId: payload.user_id || payload.sub,
          email: payload.email,
          emailVerified: payload.email_verified,
          issuedAt: new Date(payload.iat * 1000).toISOString(),
          expiresAt: new Date(payload.exp * 1000).toISOString(),
          authTime: new Date(payload.auth_time * 1000).toISOString()
        }
        
        setUserProfile(tokenInfo)
        
        toast.success('Token analyzed! Check console and profile section below.')
        
        // This is what the backend engineer needs to implement:
        console.log(`
🚀 BACKEND IMPLEMENTATION GUIDE:

1. Extract token from Authorization header:
   Bearer ${idToken.substring(0, 50)}...

2. Verify token with Firebase Admin SDK:
   decoded_token = auth.verify_id_token(token)

3. Extract user info:
   user_id = decoded_token['user_id']
   email = decoded_token['email']
   email_verified = decoded_token['email_verified']

4. Use user_id for database operations
        `)
      }
    } catch (error) {
      console.error('Token analysis failed:', error)
      toast.error(`Token analysis failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Refresh token manually
  const refreshToken = async () => {
    if (!user) {
      toast.error('Please login first')
      return
    }

    setLoading(true)
    try {
      const newToken = await getIdToken(true) // Force refresh
      if (newToken) {
        toast.success('Token refreshed successfully!')
      } else {
        toast.error('Failed to refresh token')
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      toast.error(`Failed to refresh token: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        🔗 API Integration Example
      </h1>

      {/* User Status */}
      <Card>
        <CardHeader>
          <CardTitle>🔐 Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>UID:</strong> {user.uid?.substring(0, 8)}...
                </div>
              </div>
              <div>
                <strong>Token Available:</strong> 
                <span className={idToken ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {idToken ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button onClick={analyzeToken} disabled={loading}>
                  🔍 Analyze Token
                </Button>
                <Button onClick={refreshToken} disabled={loading}>
                  🔄 Refresh Token
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Please login to test API calls</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Testing Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 API Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={fetchUserProfile} 
              disabled={!user || loading}
              variant="outline"
            >
              👤 Get Profile
            </Button>
            <Button 
              onClick={fetchUserIssues} 
              disabled={!user || loading}
              variant="outline"
            >
              📋 Get My Issues
            </Button>
            <Button 
              onClick={fetchAllIssues} 
              disabled={loading}
              variant="outline"
            >
              🌐 Get All Issues
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Display */}
      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle>👤 User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Create New Issue Form */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>➕ Create New Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Issue title"
                value={newIssue.title}
                onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
              />
              <Textarea
                placeholder="Issue description"
                value={newIssue.description}
                onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
              />
              <Input
                placeholder="Location"
                value={newIssue.location}
                onChange={(e) => setNewIssue({...newIssue, location: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newIssue.department}
                  onChange={(e) => setNewIssue({...newIssue, department: e.target.value})}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="municipal">Municipal Corporation</option>
                  <option value="pwd">Public Works Department</option>
                  <option value="electricity">Electricity Board</option>
                  <option value="water">Water Department</option>
                  <option value="traffic">Traffic Police</option>
                </select>
                <select
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Safety">Safety</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>
              <Button onClick={createNewIssue} disabled={loading} className="w-full">
                📤 Create Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Issues Display */}
      {userIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📋 Your Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userIssues.map((issue) => (
                <div key={issue.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{issue.title}</h3>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">{issue.location}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Issues Display */}
      {allIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🌐 All Issues (Public)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allIssues.map((issue) => (
                <div key={issue.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{issue.title}</h3>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">{issue.location}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👤 {issue.user_name}</span>
                      <span className="text-sm">❤️ {issue.likes}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}