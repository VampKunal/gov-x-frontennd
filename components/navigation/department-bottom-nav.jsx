'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Bell, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  User
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'

const departmentBottomNavItems = [
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
    label: 'Issues',
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

export function DepartmentBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <motion.nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-border/50 shadow-2xl z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-bottom">
        {departmentBottomNavItems.slice(0, 4).map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''} truncate`}>
                  {item.label}
                </span>
              </Link>
            </motion.div>
          )
        })}
        
        {/* Profile Avatar - 5th item */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/department/profile"
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
              pathname === '/department/profile' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`relative ${pathname === '/department/profile' ? 'scale-110' : ''} transition-transform duration-200`}>
              <Avatar className="h-5 w-5">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  {user?.displayName?.[0] || user?.email?.[0] || 'D'}
                </AvatarFallback>
              </Avatar>
              {pathname === '/department/profile' && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </div>
            <span className={`text-xs font-medium ${pathname === '/department/profile' ? 'text-primary' : ''} truncate`}>
              Profile
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  )
}