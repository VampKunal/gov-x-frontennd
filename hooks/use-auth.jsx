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
          } catch (error) {
            console.error('Error getting ID token:', error)
            setIdToken(null)
            localStorage.removeItem('firebase-token')
          }
        } else {
          setIdToken(null)
          localStorage.removeItem('firebase-token')
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

  const signInWithEmail = async (email, password) => {
    if (!firebaseServices) {
      toast.error("Authentication service not available")
      return
    }

    setLoading(true)
    try {
      const { signInWithEmailAndPassword } = require("firebase/auth")
      const result = await signInWithEmailAndPassword(firebaseServices.auth, email, password)
      toast.success("Signed in successfully!")
      return result.user
    } catch (error) {
      console.error("Error signing in:", error)
      toast.error(error.message || "Failed to sign in")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    if (!firebaseServices) {
      toast.error("Authentication service not available")
      return
    }

    setLoading(true)
    try {
      const { signInWithPopup } = require("firebase/auth")
      const result = await signInWithPopup(firebaseServices.auth, firebaseServices.googleProvider)
      toast.success("Signed in with Google successfully!")
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
      
      // Clear tokens
      setIdToken(null)
      localStorage.removeItem('firebase-token')
      
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

  const value = {
    user,
    loading,
    authInitialized,
    idToken,
    tokenLoading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    resetPassword,
    signOut,
    getIdToken,
    getUserClaims,
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
