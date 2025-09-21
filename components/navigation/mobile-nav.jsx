'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Search, 
  Camera, 
  MessageSquare, 
  User 
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ProfileModal } from './profile-modal'

const mobileNavItems = [
  {
    icon: Home,
    label: 'Home',
    href: '/dashboard',
  },
  {
    icon: Search,
    label: 'Explore',
    href: '/feed',
  },
  {
    icon: Camera,
    label: 'Report',
    href: '/report',
  },
  {
    icon: MessageSquare,
    label: 'Activity',
    href: '/track',
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)

  return (
    <motion.div 
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {mobileNavItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <item.icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                      layoutId="mobileActiveIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-xs font-medium truncate ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </Link>
            </motion.div>
          )
        })}

        {/* Profile Avatar */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => setShowProfileModal(true)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 text-muted-foreground hover:text-foreground`}
            >
              <div className="relative">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="text-xs font-medium">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs font-medium truncate text-muted-foreground">
                Profile
              </span>
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Safe area bottom padding */}
      <div className="h-safe-bottom bg-background/95" />
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </motion.div>
  )
}
