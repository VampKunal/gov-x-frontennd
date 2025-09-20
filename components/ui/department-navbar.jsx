"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import {
  Building2,
  LayoutDashboard,
  Bell,
  FileText,
  AlertTriangle,
  CheckCircle,
  Star,
  LogOut,
  Menu,
  X,
  Activity
} from "lucide-react"

const navItems = [
  { href: "/department/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/department/notifications", label: "Notifications", icon: Bell },
  { href: "/department/issues", label: "All Issues", icon: FileText },
  { href: "/department/unresolved", label: "Unresolved", icon: AlertTriangle },
  { href: "/department/resolved", label: "Resolved", icon: CheckCircle },
]

const NavItem = ({ href, children, icon: Icon, onClick }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        href={href}
        onClick={onClick}
        className={`group relative flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-primary text-primary-foreground shadow-lg"
            : "text-muted-foreground hover:text-foreground hover:bg-background/80"
        }`}
      >
        <Icon className="h-4 w-4" />
        <span className="relative z-10">{children}</span>
        {!isActive && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-background/60 opacity-0 group-hover:opacity-100"
            initial={false}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </Link>
    </motion.div>
  )
}

export function DepartmentNavbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <motion.header
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-border/50 shadow-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link href="/department/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Building2 className="h-5 w-5 text-white" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Department Portal
                </span>
                <div className="text-xs text-muted-foreground">Gov-X India</div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <NavItem href={item.href} icon={item.icon}>
                  {item.label}
                </NavItem>
              </motion.div>
            ))}
          </nav>

          {/* Desktop User Area */}
          <motion.div
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Activity className="h-3 w-3 mr-1" />
              Department
            </Badge>
            
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9 border border-border/50">
                <AvatarImage src={user?.photoURL} alt="Department User" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'D'}
                </AvatarFallback>
              </Avatar>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              className="p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileNavOpen && (
          <motion.div
            className="md:hidden border-t border-border/50 mt-4 pt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2 mb-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  <NavItem
                    href={item.href}
                    icon={item.icon}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {item.label}
                  </NavItem>
                </motion.div>
              ))}
            </div>

            {/* Mobile User Area */}
            <motion.div 
              className="flex items-center justify-between pt-4 border-t border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photoURL} alt="Department User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {user?.displayName || user?.email || 'Department User'}
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Department
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}