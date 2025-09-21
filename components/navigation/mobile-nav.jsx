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
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-0 relative group ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {/* Background hover effect */}
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/10 scale-100' 
                    : 'bg-muted/0 group-hover:bg-muted/50 scale-95 group-hover:scale-100'
                }`} />
                
                <div className="relative z-10">
                  <motion.div
                    className="relative"
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <item.icon className={`w-6 h-6 transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'group-hover:text-foreground'
                    }`} />
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                        layoutId="mobileActiveIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </div>
                
                <span className={`text-xs font-medium truncate relative z-10 transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
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
            <motion.button
              onClick={() => setShowProfileModal(true)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-0 relative group text-muted-foreground hover:text-foreground`}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Background hover effect */}
              <div className="absolute inset-0 rounded-xl bg-muted/0 group-hover:bg-muted/50 scale-95 group-hover:scale-100 transition-all duration-300" />
              
              <div className="relative z-10">
                <Avatar className="w-6 h-6 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary group-hover:bg-primary/20">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs font-medium truncate relative z-10 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Profile
              </span>
            </motion.button>
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
