"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { DepartmentNavbar } from "@/components/ui/department-navbar"
import { useAuth } from "@/hooks/use-auth"

export function DepartmentLayout({ children }) {
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
      // If not department user, redirect to home
      if (!user || userType !== 'department') {
        setRedirected(true)
        router.push("/")
        return
      }
    }
  }, [user, userType, loading, router, mounted, redirected])

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading department portal...</p>
        </motion.div>
      </div>
    )
  }

  // If not department user, don't show anything (will redirect)
  if (!user || userType !== 'department') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900">
      <DepartmentNavbar />
      <main>
        {children}
      </main>
    </div>
  )
}