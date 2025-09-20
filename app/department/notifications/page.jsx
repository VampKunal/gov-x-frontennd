"use client"

import { motion } from 'framer-motion'
import { DepartmentLayout } from '@/components/layouts/department-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Bell,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Calendar
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

export default function DepartmentNotifications() {
  const notifications = [
    {
      id: 1,
      type: 'new_issue',
      title: 'New High Priority Issue Reported',
      message: 'Large pothole on MG Road reported by Rahul Sharma',
      time: '5 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'issue_resolved',
      title: 'Issue Successfully Resolved',
      message: 'Street light repair on Park Street has been completed',
      time: '2 hours ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'deadline_approaching',
      title: 'Deadline Approaching',
      message: 'Drainage cleaning project deadline is tomorrow',
      time: '4 hours ago',
      read: true,
      priority: 'high'
    },
    {
      id: 4,
      type: 'team_update',
      title: 'Team Assignment Update',
      message: '3 new issues assigned to PWD Team Alpha',
      time: '1 day ago',
      read: true,
      priority: 'low'
    }
  ]

  return (
    <DepartmentLayout>
      <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm border-b border-border/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/department/dashboard"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              
              <div className="h-6 w-px bg-border/50" />
              
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Notifications</h1>
                  <p className="text-sm text-muted-foreground">Stay updated with recent activities</p>
                </div>
              </div>
            </div>

            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {notifications.filter(n => !n.read).length} New
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {notifications.map((notification, index) => (
            <motion.div key={notification.id} variants={cardVariants}>
              <Card className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 ${
                !notification.read ? 'border-l-4 border-l-primary' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'new_issue' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                      notification.type === 'issue_resolved' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      notification.type === 'deadline_approaching' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {notification.type === 'new_issue' && <AlertTriangle className="h-5 w-5" />}
                      {notification.type === 'issue_resolved' && <CheckCircle className="h-5 w-5" />}
                      {notification.type === 'deadline_approaching' && <Clock className="h-5 w-5" />}
                      {notification.type === 'team_update' && <User className="h-5 w-5" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={`text-xs ${
                            notification.priority === 'high' ? 'border-red-300 text-red-600 dark:border-red-800 dark:text-red-400' :
                            notification.priority === 'medium' ? 'border-yellow-300 text-yellow-600 dark:border-yellow-800 dark:text-yellow-400' :
                            'border-green-300 text-green-600 dark:border-green-800 dark:text-green-400'
                          }`}>
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className={`mb-3 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {notification.time}
                        </span>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {!notification.read && (
                            <Button size="sm">
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Empty State */}
          {notifications.length === 0 && (
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No notifications</h3>
                  <p className="text-muted-foreground">You're all caught up! New notifications will appear here.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DepartmentLayout>
  )
}