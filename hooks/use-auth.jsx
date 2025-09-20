"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getFirebaseServices } from "@/lib/firebase"
import toast from "react-hot-toast"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [firebaseServices, setFirebaseServices] = useState(null)
  const [idToken, setIdToken] = useState(null)
  const [tokenLoading, setTokenLoading] = useState(false)
  const [userType, setUserType] = useState('user') // 'user' or 'department'

  useEffect(() => {
    const services = getFirebaseServices()
    if (services) {
      setFirebaseServices(services)

      const { onAuthStateChanged } = require("firebase/auth")
      const unsubscribe = onAuthStateChanged(services.auth, async (user) => {
        setUser(user)
        setLoading(false)
        setAuthInitialized(true)
        
        // Get ID token when user changes
        if (user) {
          try {
            const token = await user.getIdToken()
            setIdToken(token)
            
            // Store token in localStorage for API calls
            localStorage.setItem('firebase-token', token)
            
            // Get user type from localStorage or default to 'user'
            const storedUserType = localStorage.getItem('userType') || 'user'
            setUserType(storedUserType)
          } catch (error) {
            console.error('Error getting ID token:', error)
            setIdToken(null)
            localStorage.removeItem('firebase-token')
          }
        } else {
          setIdToken(null)
          setUserType('user')
          localStorage.removeItem('firebase-token')
          localStorage.removeItem('userType')
        }
      })

      return () => unsubscribe()
    } else {
      setLoading(false)
      setAuthInitialized(true)
    }
  }, [])

  const signUpWithEmail = async (email, password) => {
    if (!firebaseServices) {
      toast.error("Authentication service not available")
      return
    }

    setLoading(true)
    try {
      const { createUserWithEmailAndPassword } = require("firebase/auth")
      const result = await createUserWithEmailAndPassword(firebaseServices.auth, email, password)
      toast.success("Account created successfully!")
      return result.user
    } catch (error) {
      console.error("Error creating account:", error)
      toast.error(error.message || "Failed to create account")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithEmail = async (email, password, accountType = 'user') => {
    if (!firebaseServices) {
      toast.error("Authentication service not available")
      return
    }

    setLoading(true)
    try {
      const { signInWithEmailAndPassword } = require("firebase/auth")
      const result = await signInWithEmailAndPassword(firebaseServices.auth, email, password)
      
      // Store user type
      localStorage.setItem('userType', accountType)
      setUserType(accountType)
      
      toast.success(accountType === 'department' ? "Department signed in successfully!" : "Signed in successfully!")
      return result.user
    } catch (error) {
      console.error("Error signing in:", error)
      toast.error(error.message || "Failed to sign in")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (accountType = 'user') => {
    if (!firebaseServices) {
      toast.error("Authentication service not available")
      return
    }

    setLoading(true)
    try {
      const { signInWithPopup } = require("firebase/auth")
      const result = await signInWithPopup(firebaseServices.auth, firebaseServices.googleProvider)
      
      // Store user type
      localStorage.setItem('userType', accountType)
      setUserType(accountType)
      
      toast.success(accountType === 'department' ? "Department signed in with Google successfully!" : "Signed in with Google successfully!")
      return result.user
    } catch (error) {
      console.error("Error signing in with Google:", error)
      toast.error(error.message || "Failed to sign in with Google")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    if (!firebaseServices) {
      toast.error("Authentication service not available")
      return
    }

    setLoading(true)
    try {
      const { sendPasswordResetEmail } = require("firebase/auth")
      await sendPasswordResetEmail(firebaseServices.auth, email)
      toast.success("Password reset email sent!")
    } catch (error) {
      console.error("Error sending password reset:", error)
      toast.error(error.message || "Failed to send password reset email")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!firebaseServices) {
      toast.error("Authentication service not available")
      return
    }

    setLoading(true)
    try {
      const { signOut: firebaseSignOut } = require("firebase/auth")
      await firebaseSignOut(firebaseServices.auth)
      
      // Clear tokens and user type
      setIdToken(null)
      setUserType('user')
      localStorage.removeItem('firebase-token')
      localStorage.removeItem('userType')
      
      toast.success("Signed out successfully!")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Get fresh ID token
  const getIdToken = async (forceRefresh = false) => {
    if (!user || !firebaseServices) {
      return null
    }

    setTokenLoading(true)
    try {
      const token = await user.getIdToken(forceRefresh)
      setIdToken(token)
      localStorage.setItem('firebase-token', token)
      return token
    } catch (error) {
      console.error('Error getting ID token:', error)
      setIdToken(null)
      localStorage.removeItem('firebase-token')
      return null
    } finally {
      setTokenLoading(false)
    }
  }

  // Get user claims (for role-based access)
  const getUserClaims = async () => {
    if (!user) return null
    
    try {
      const idTokenResult = await user.getIdTokenResult()
      return idTokenResult.claims
    } catch (error) {
      console.error('Error getting user claims:', error)
      return null
    }
  }

  // Test admin login function
  const testAdminLogin = async () => {
    const mockUser = {
      uid: 'test-admin-123',
      email: 'admin@dept.gov.in',
      displayName: 'Test Admin',
      photoURL: null,
      emailVerified: true
    }
    
    setUser(mockUser)
    setUserType('department')
    localStorage.setItem('userType', 'department')
    setIdToken('mock-admin-token')
    localStorage.setItem('firebase-token', 'mock-admin-token')
    
    return mockUser
  }

  const value = {
    user,
    loading,
    authInitialized,
    idToken,
    tokenLoading,
    userType,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    resetPassword,
    signOut,
    getIdToken,
    getUserClaims,
    testAdminLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
