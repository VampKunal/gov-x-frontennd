'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Building2, 
  LayoutDashboard, 
  Bell, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  LogOut, 
  Sun,
  Moon,
  Activity
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import useThemeStore from '@/stores/theme-store'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const departmentSidebarItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/department/dashboard',
  },
  {
    icon: Bell,
    label: 'Notifications',
    href: '/department/notifications',
  },
  {
    icon: FileText,
    label: 'All Issues',
    href: '/department/issues',
  },
  {
    icon: AlertTriangle,
    label: 'Unresolved',
    href: '/department/unresolved',
  },
  {
    icon: CheckCircle,
    label: 'Resolved',
    href: '/department/resolved',
  },
]

export function DepartmentSidebarNav() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useThemeStore()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div 
      className={`hidden lg:flex fixed left-0 top-0 h-full bg-background/95 backdrop-blur-sm border-r border-border/50 z-40 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full p-2">
        {/* Logo */}
        <div className="mb-4">
          <Link href="/department/dashboard" className="flex items-center space-x-3 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">GX</span>
              <div className="absolute inset-0 h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent animate-ping opacity-20"></div>
            </div>
            {isExpanded && (
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-lg font-bold gradient-text">
                  Gov-X India
                </span>
                <span className="text-xs text-muted-foreground">Department Portal</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {departmentSidebarItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-2 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {/* Background hover effect with proper timing */}
                  <div className="absolute inset-0 bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-primary' : ''}`} />
                  {isExpanded && (
                    <motion.span 
                      className="font-medium relative z-10"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                  
                  {isActive && (
                    <motion.div
                      className="ml-auto w-1 h-6 bg-primary rounded-full relative z-10"
                      layoutId="departmentActiveIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="py-2 border-t border-border/50">
          <button
            onClick={toggleTheme}
            className={`flex items-center space-x-3 px-2 py-2 rounded-lg transition-all duration-200 w-full hover:bg-muted/50 text-muted-foreground hover:text-foreground`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isExpanded && (
              <motion.span 
                className="font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="pt-2 border-t border-border/50">
          {user && (
            <div className="space-y-2">
              {/* Department Badge */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 w-full justify-center">
                    <Activity className="h-3 w-3 mr-1" />
                    Department Portal
                  </Badge>
                </motion.div>
              )}
              
              <Link
                href="/department/profile"
                className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-muted/50 transition-all duration-200 group"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="text-xs font-medium">
                    {user.displayName?.[0] || user.email?.[0] || 'D'}
                  </AvatarFallback>
                </Avatar>
                {isExpanded && (
                  <motion.div 
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-sm font-medium truncate">
                      {user.displayName || user.email?.split('@')[0] || 'Department'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </motion.div>
                )}
              </Link>

              <button
                onClick={() => signOut()}
                className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 w-full text-muted-foreground"
              >
                <LogOut className="w-5 h-5" />
                {isExpanded && (
                  <motion.span 
                    className="font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Sign Out
                  </motion.span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}