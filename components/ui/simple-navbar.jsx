"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Rss, 
  FileText, 
  Bell, 
  LayoutDashboard, 
  Menu,
  X,
  Code2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { UserPopover } from "../popover/user-popover"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/track", label: "My Issues", icon: FileText },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/api-demo", label: "API Demo", icon: Code2 },
]

export function SimpleNavbar() {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-2 md:px-4">
        {/* Logo */}
        <div className="flex">
          <Link className="mr-6 flex items-center space-x-2 text-nowrap" href="/dashboard">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-green-500">
              <span className="text-sm font-bold text-white">GX</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Gov-X India
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex items-center md:space-x-6 lg:space-x-12 text-sm font-medium hidden md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 transition-colors hover:text-foreground/80 ${
                  isActive ? "text-foreground" : "text-foreground/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center justify-between space-x-2">
          {/* Mobile menu button */}
          <div className="flex items-center space-x-2">
            {/* User menu */}
            <UserPopover 
              name={user?.displayName}
              image={user?.photoURL}
              email={user?.email}
              onSignOut={() => signOut()} />
          </div>
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileNavOpen && (
        <div className="border-b md:hidden">
          <div className="container py-4">
            <nav className="grid gap-2 z-10">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center space-x-3 rounded-lg p-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground ${
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}