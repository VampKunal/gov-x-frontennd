"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  ChevronRight,
  BarChart3,
  Activity,
  Calendar,
  Star,
  Settings,
  LogOut,
  Building2
} from 'lucide-react'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const floatingAnimation = {
  y: [-2, 2, -2],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

export default function DepartmentDashboard() {
  const [dashboardData, setDashboardData] = useState({
    notifications: 12,
    totalIssues: 156,
    unresolvedIssues: 89,
    resolvedIssues: 67,
    importantIssues: 23,
    inProgressIssues: 34,
    zeroActionIssues: 55,
    delayedIssues: 12
  })

  const statsCards = [
    {
      title: 'Notifications',
      value: dashboardData.notifications,
      icon: Bell,
      color: 'bg-blue-500',
      description: 'New alerts',
      trend: '+2.5%',
      href: '/department/notifications'
    },
    {
      title: 'Total Issues',
      value: dashboardData.totalIssues,
      icon: FileText,
      color: 'bg-purple-500',
      description: 'All reported issues',
      trend: '+12.3%',
      href: '/department/issues'
    },
    {
      title: 'Unresolved Issues',
      value: dashboardData.unresolvedIssues,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      description: 'Pending resolution',
      trend: '-5.2%',
      href: '/department/unresolved'
    },
    {
      title: 'Resolved Issues',
      value: dashboardData.resolvedIssues,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Successfully resolved',
      trend: '+8.7%',
      href: '/department/resolved'
    },
    {
      title: 'Important Issues',
      value: dashboardData.importantIssues,
      icon: Star,
      color: 'bg-red-500',
      description: 'High priority',
      trend: '+15.1%',
      href: '/department/important'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={cardVariants} className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Welcome to Department Dashboard
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitor, manage, and resolve civic issues efficiently. Track your department's performance and help build a better community.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={cardVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={stat.href}>
                    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                      {/* Animated background gradient */}
                      <motion.div
                        className={`absolute inset-0 ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                        animate={floatingAnimation}
                      />
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                            <stat.icon className={`h-5 w-5 text-white`} style={{ filter: `drop-shadow(0 0 6px ${stat.color.replace('bg-', '').replace('-500', '')})` }} />
                          </div>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            {stat.trend}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-foreground">
                            {stat.value}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {stat.description}
                            </p>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-200" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/department/unresolved">
                      <Button
                        variant="outline"
                        className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-yellow-50 hover:bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 dark:border-yellow-800"
                      >
                        <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                          Review Pending ({dashboardData.zeroActionIssues})
                        </span>
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/department/important">
                      <Button
                        variant="outline"
                        className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-red-50 hover:bg-red-100 border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:border-red-800"
                      >
                        <Star className="h-6 w-6 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                          High Priority ({dashboardData.importantIssues})
                        </span>
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/department/resolved">
                      <Button
                        variant="outline"
                        className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-800"
                      >
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Upload Proof
                        </span>
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Overview */}
          <motion.div variants={cardVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Issue resolved', location: 'MG Road, Sector 14', time: '2 hours ago', type: 'success' },
                      { action: 'New high priority issue', location: 'Park Street, Zone 3', time: '4 hours ago', type: 'urgent' },
                      { action: 'Issue assigned to team', location: 'Mall Road, District 5', time: '6 hours ago', type: 'info' },
                      { action: 'Proof uploaded', location: 'Main Market, Sector 7', time: '1 day ago', type: 'success' }
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors duration-200"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'urgent' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location}</span>
                            <span>•</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Resolution Rate</span>
                        <span className="text-sm text-muted-foreground">75%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <motion.div
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Average Response Time</span>
                        <span className="text-sm text-muted-foreground">2.3 days</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "60%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Citizen Satisfaction</span>
                        <span className="text-sm text-muted-foreground">4.2/5</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <motion.div
                          className="bg-yellow-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "84%" }}
                          transition={{ duration: 1, delay: 0.9 }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">This Month</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12% improvement
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
  )
}
