"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  MapPin,
  Bell,
  Plus,
  Eye,
  Activity,
  Award,
  Filter,
  Search
} from "lucide-react"
import { Loading } from "@/components/ui/loading"

export default function DashboardPage() {
  const { user, loading } = useAuth()
//  const [notifications, setNotifications] = useState(3)

  if (loading) {
    return <Loading fullScreen size="lg" text="Loading your dashboard..." />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Content */}
        <main className="container mx-auto px-2 xxs:px-3 xs:px-4 sm:px-6 lg:px-8 pt-4 xxs:pt-5 xs:pt-6 md:pt-8 pb-4 xxs:pb-5 xs:pb-6 md:pb-8 space-y-4 xxs:space-y-5 xs:space-y-6 md:space-y-8">
          {/* Welcome Banner */}
          <motion.div
            className="relative overflow-hidden rounded-2xl xxs:rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-3 xxs:p-4 xs:p-6 md:p-8 border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 xxs:gap-4">
                <div className="space-y-1 xxs:space-y-2">
                  <h1 className="text-lg xxs:text-xl xs:text-2xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent leading-tight">
                    Welcome back, {user?.email?.split('@')[0] || 'Citizen'}! 🇮🇳
                  </h1>
                  <p className="text-muted-foreground text-xs xxs:text-sm md:text-base leading-relaxed">
                    Start by reporting an issue or browse what's happening in your community.
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button size={"sm"} className="w-full sm:w-auto shadow-lg bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-xs xxs:text-sm xs:text-base px-3 xxs:px-4 xs:px-6 h-8 xxs:h-10 xs:h-12" onClick={() => window.location.href = '/report'}>
                    <Plus className="h-3 w-3 xxs:h-4 xxs:w-4 mr-1 xxs:mr-2" />
                    📤 Report Issue
                  </Button>
                </motion.div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 xxs:gap-3 xs:gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              {
                icon: MessageSquare,
                label: "My Reports",
                value: "0",
                change: "+0 this week",
                color: "primary",
                bgColor: "bg-primary/10"
              },
              {
                icon: Eye,
                label: "Following",
                value: "0",
                change: "+0 this week",
                color: "accent",
                bgColor: "bg-accent/10"
              },
              {
                icon: CheckCircle,
                label: "Resolved",
                value: "0",
                change: "68% rate",
                color: "primary",
                bgColor: "bg-primary/10"
              },
              {
                icon: Award,
                label: "Impact Score",
                value: "0",
                change: "Community rank",
                color: "accent",
                bgColor: "bg-accent/10"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="glass border-border/50 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-2 xxs:p-3 xs:p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2 xxs:mb-3">
                      <div className={`p-1.5 xxs:p-2 rounded-lg xxs:rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`h-3 w-3 xxs:h-4 xxs:w-4 md:h-5 md:w-5 text-${stat.color}`} />
                      </div>
                      <TrendingUp className="h-3 w-3 xxs:h-4 xxs:w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5 xxs:space-y-1">
                      <p className="text-lg xxs:text-xl xs:text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                      <p className="text-xs xs:text-sm font-medium text-foreground leading-tight">{stat.label}</p>
                      <p className="text-xs text-muted-foreground leading-tight hidden xxs:block">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-4 xxs:gap-5 xs:gap-6 md:gap-8">
            {/* Recent Activity */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: MessageSquare,
                      title: "Pothole reported on Main Street",
                      time: "2 hours ago",
                      status: "In Review",
                      statusColor: "bg-yellow-500/20 text-yellow-600"
                    },
                    {
                      icon: CheckCircle,
                      title: "Streetlight repair completed",
                      time: "1 day ago",
                      status: "Resolved",
                      statusColor: "bg-green-500/20 text-green-600"
                    },
                    {
                      icon: Eye,
                      title: "Started following park maintenance",
                      time: "3 days ago",
                      status: "Active",
                      statusColor: "bg-blue-500/20 text-blue-600"
                    }
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-colors duration-300 cursor-pointer"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{activity.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                          <Badge className={`text-xs ${activity.statusColor} border-0`}>
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="text-center pt-4">
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                      View All Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions & Profile */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Profile Card */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-foreground">
                        {user?.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{user?.email?.split('@')[0]}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Account created</span>
                      <span className="text-foreground">
                        {new Date(user?.metadata?.creationTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Community Level</span>
                        <span className="text-primary font-medium">Starter</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: MessageSquare, label: "Report New Issue", color: "primary", href: "/report" },
                    { icon: Search, label: "Browse Issues", color: "muted", href: "/feed" },
                    { icon: MapPin, label: "My Issues", color: "muted", href: "/track" },
                    { icon: Bell, label: "Notifications", color: "muted", href: "/notifications" }
                  ].map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button
                        variant={action.color === 'primary' ? 'default' : 'outline'}
                        className={`w-full justify-start h-12 ${
                          action.color === 'primary' 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                            : 'bg-transparent hover:bg-muted/50'
                        }`}
                        onClick={() => window.location.href = action.href}
                      >
                        <action.icon className="h-4 w-4 mr-3" />
                        {action.label}
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
