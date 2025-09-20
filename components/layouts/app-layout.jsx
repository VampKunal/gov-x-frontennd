"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { SimpleNavbar } from "@/components/ui/simple-navbar"
import { useAuth } from "@/hooks/use-auth"

const publicPaths = ["/", "/auth", "/auth/choice", "/auth/forgot-password", "/department/auth"]

export function AppLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !redirected) {
      const isPublicPath = publicPaths.includes(pathname)
      
      if (!user && !isPublicPath) {
        // User not authenticated and trying to access protected route
        setRedirected(true)
        router.push("/")
        return
      } 
      
      if (user && pathname === "/auth") {
        // User is authenticated and on auth page, redirect to dashboard
        setRedirected(true)
        router.push("/dashboard")
        return
      }
    }
  }, [user, loading, pathname, router, mounted, redirected])

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    )
  }

  const isPublicPath = publicPaths.includes(pathname)
  // Never show navbar on landing page, even if user is logged in
  const showNavbar = user && !isPublicPath && pathname !== "/"

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <SimpleNavbar />}
      <main className={showNavbar ? "flex-1" : ""}>
        {children}
      </main>
    </div>
  )
}
