"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollDirection, useScrolled } from "@/hooks/use-scroll"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sparkles, Menu, X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"

const NavItem = ({ href, children, onClick }) => (
  <motion.div
    whileHover={{ y: -2 }}
    whileTap={{ y: 0 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Link
      href={href}
      onClick={onClick}
      className="group relative px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100"
        initial={false}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
          className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-orange-400 to-green-400 group-hover:w-full group-hover:left-0"
        transition={{ duration: 0.3 }}
      />
    </Link>
  </motion.div>
)

const AnimatedButton = ({ children, variant = "primary", className = "", ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Button
      className={`relative overflow-hidden transition-all duration-300 ${
        variant === "primary"
          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
          : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30"
      } ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </Button>
  </motion.div>
)

export function HoverNavbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { scrollDirection, scrollY } = useScrollDirection()
  const isScrolled = useScrolled(50)
  const { user } = useAuth()

  // Only show navigation items when user is logged in
  const navItems = user ? [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/feed", label: "Issues Feed" },
    { href: "/track", label: "My Reports" },
    { href: "/notifications", label: "Notifications" },
  ] : []
  
  // Public navigation for non-logged in users (empty when not logged in)
  const publicNavItems = []

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{
        y: scrollDirection === "down" && scrollY > 100 ? -100 : 0,
        opacity: scrollDirection === "down" && scrollY > 100 ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-600 to-green-600 flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 h-10 w-10 rounded-xl bg-gradient-to-br from-orange-600 to-green-600 opacity-20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                Gov-X India
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {(user ? navItems : publicNavItems).map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <NavItem href={item.href}>{item.label}</NavItem>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Auth Area */}
          <motion.div
            className="hidden md:flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {user ? (
              <Link href="/dashboard" aria-label="Open dashboard">
                <Avatar className="h-9 w-9 border border-white/20">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                  <AvatarFallback>{(user.displayName?.[0] || "U").toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <>
                <Link href="/auth/choice">
                  <AnimatedButton variant="secondary" size="sm">
                    Log In
                  </AnimatedButton>
                </Link>
                <Link href="/auth/choice">
                  <AnimatedButton variant="primary" size="sm">
                    Sign Up
                  </AnimatedButton>
                </Link>
              </>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <motion.button
                className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileNavOpen ? "close" : "menu"}
                    initial={{ rotate: 0, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobileNavOpen ? (
                      <X className="h-5 w-5 text-white" />
                    ) : (
                      <Menu className="h-5 w-5 text-white" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </SheetTrigger>

            <SheetContent 
              side="right" 
              className="w-[300px] sm:w-[350px] bg-black/95 backdrop-blur-xl border-l border-white/10"
            >
              <div className="flex flex-col h-full pt-8">
                {/* Mobile Logo */}
                <motion.div 
                  className="flex items-center space-x-3 mb-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-600 to-green-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                    Gov-X India
                  </span>
                </motion.div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2 mb-8 flex-1">
                  {(user ? navItems : publicNavItems).map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className="group block text-lg font-medium text-white hover:text-orange-400 transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20"
                      >
                        <motion.span
                          className="group-hover:translate-x-2 transition-transform duration-300 inline-block"
                          whileHover={{ x: 4 }}
                        >
                          {item.label}
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile Auth Area */}
                <motion.div 
                  className="flex flex-col space-y-3 pb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {user ? (
                    <Link href="/dashboard" onClick={() => setMobileNavOpen(false)} className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 border border-white/20">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                        <AvatarFallback>{(user.displayName?.[0] || "U").toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium">{user.displayName || user.email || "Profile"}</span>
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth/choice" onClick={() => setMobileNavOpen(false)}>
                        <AnimatedButton variant="secondary" className="w-full h-12 text-base">
                          Log In
                        </AnimatedButton>
                      </Link>
                      <Link href="/auth/choice" onClick={() => setMobileNavOpen(false)}>
                        <AnimatedButton variant="primary" className="w-full h-12 text-base">
                          Sign Up
                        </AnimatedButton>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}