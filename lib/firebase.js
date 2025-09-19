"use client"

let firebaseApp = null
let firebaseAuth = null

const firebaseConfig = {
  apiKey: "AIzaSyBBI9T4RQcvygnEdAn-w4aTG9xZNBugTes",
  authDomain: "gov-x-a0044.firebaseapp.com",
  projectId: "gov-x-a0044",
  storageBucket: "gov-x-a0044.firebasestorage.app",
  messagingSenderId: "226394457552",
  appId: "1:226394457552:web:7d05f4ce93b15b354865d5",
  measurementId: "G-9Q7RGV7MK8",
}

const initializeFirebase = () => {
  if (typeof window === "undefined") return null

  if (firebaseApp && firebaseAuth) {
    return { app: firebaseApp, auth: firebaseAuth }
  }

  try {
    const { initializeApp, getApps } = require("firebase/app")
    const { getAuth, GoogleAuthProvider } = require("firebase/auth")

    // Initialize app
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig)
    } else {
      firebaseApp = getApps()[0]
    }

    // Initialize auth
    firebaseAuth = getAuth(firebaseApp)

    // Initialize Google provider
    const googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({
      prompt: "select_account",
    })

    return {
      app: firebaseApp,
      auth: firebaseAuth,
      googleProvider,
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    return null
  }
}

export const getFirebaseServices = () => {
  return initializeFirebase()
}
