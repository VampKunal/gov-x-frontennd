'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { SidebarNav } from '@/components/navigation/sidebar-nav'
import { DepartmentSidebarNav } from '@/components/navigation/department-sidebar-nav'
import { MobileNav } from '@/components/navigation/mobile-nav'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { useAuth } from '@/hooks/use-auth'

const publicRoutes = ['/', '/auth', '/auth/choice', '/auth/signin', '/auth/signup', '/auth/forgot-password', '/department/auth']

export function ModernLayout({ children }) {
  const { user, userType, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !redirected) {
      const isPublicRoute = publicRoutes.includes(pathname)
      
      if (!user && !isPublicRoute) {
        // User not authenticated and trying to access protected route
        setRedirected(true)
        router.push('/')
        return
      } 
      
      if (user && pathname === '/auth') {
        // User is authenticated and on auth page, redirect to dashboard
        setRedirected(true)
        router.push('/dashboard')
        return
      }
    }
  }, [user, loading, pathname, router, mounted, redirected])

  // Show loading state
  if (!mounted || loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </motion.div>
        </div>
      </ThemeProvider>
    )
  }

  const isPublicRoute = publicRoutes.includes(pathname)
  // Never show navigation on landing page, even if user is logged in
  const showNavigation = user && !isPublicRoute && pathname !== '/'
  const isDepartmentUser = userType === 'department'

  if (isPublicRoute) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {showNavigation && (
          <>
            {/* Desktop Sidebar Navigation */}
            {isDepartmentUser ? <DepartmentSidebarNav /> : <SidebarNav />}
            
            {/* Main Content Area */}
            <div className="lg:pl-16 transition-all duration-300">
              <main className="pb-20 lg:pb-0">
                {children}
              </main>
            </div>
            
            {/* Mobile Bottom Navigation - only for regular users */}
            {!isDepartmentUser && <MobileNav />}
          </>
        )}
        
        {!showNavigation && (
          <main className="min-h-screen">
            {children}
          </main>
        )}
      </div>
    </ThemeProvider>
  )
}
