"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, BellOff, Check, CheckCheck, Trash2, Filter, Settings, Clock, AlertCircle, CheckCircle, XCircle, MapPin, Users, Heart, MessageCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "status_update",
    title: "Your pothole issue is now In Progress! 🚧",
    message: "Municipal Corporation has assigned a team to fix the pothole on MG Road. Work will begin on January 22nd.",
    timestamp: "2 minutes ago",
    isRead: false,
    priority: "high",
    icon: AlertCircle,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    data: {
      issueId: "GGN2024001",
      location: "MG Road, Gurgaon",
      department: "Municipal Corporation"
    }
  },
  {
    id: 2,
    type: "community_interaction",
    title: "5 people liked your garbage issue report 👍",
    message: "Your report about overflowing garbage bins is gaining community support.",
    timestamp: "15 minutes ago",
    isRead: false,
    priority: "medium",
    icon: Heart,
    iconColor: "text-red-400",
    bgColor: "bg-red-500/10",
    data: {
      issueId: "DEL2024087",
      likes: 5,
      location: "Connaught Place, Delhi"
    }
  },
  {
    id: 3,
    type: "status_update",
    title: "🎉 Street light issue has been Resolved!",
    message: "The street light on Park Street has been fixed. Thank you for reporting!",
    timestamp: "1 hour ago",
    isRead: false,
    priority: "high",
    icon: CheckCircle,
    iconColor: "text-green-400",
    bgColor: "bg-green-500/10",
    data: {
      issueId: "KOL2024156",
      location: "Park Street, Kolkata",
      resolvedDate: "January 18, 2024"
    }
  },
  {
    id: 4,
    type: "community_interaction",
    title: "New comment on your drainage issue 💬",
    message: "Amit Kumar: 'I live nearby and can confirm this issue. Thanks for reporting!'",
    timestamp: "2 hours ago",
    isRead: true,
    priority: "medium",
    icon: MessageCircle,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    data: {
      issueId: "MUM2024234",
      commentUser: "Amit Kumar",
      location: "Bandra West, Mumbai"
    }
  },
  {
    id: 5,
    type: "system",
    title: "Weekly Impact Report Available 📊",
    message: "Your civic contributions this week: 3 issues reported, 2 resolved. You're making a difference!",
    timestamp: "1 day ago",
    isRead: true,
    priority: "low",
    icon: Eye,
    iconColor: "text-orange-400",
    bgColor: "bg-orange-500/10",
    data: {
      issuesReported: 3,
      issuesResolved: 2
    }
  },
  {
    id: 6,
    type: "status_update",
    title: "⚠️ Your road barrier issue needs more details",
    message: "Traffic Police Department requires additional information about the location and severity.",
    timestamp: "1 day ago",
    isRead: true,
    priority: "high",
    icon: AlertCircle,
    iconColor: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    data: {
      issueId: "HYD2024011",
      location: "ORR, Hyderabad",
      department: "Traffic Police"
    }
  },
  {
    id: 7,
    type: "community_interaction",
    title: "Your issue was shared 10 times 🔄",
    message: "Community members are spreading awareness about the pothole issue on MG Road.",
    timestamp: "2 days ago",
    isRead: true,
    priority: "medium",
    icon: Users,
    iconColor: "text-green-400",
    bgColor: "bg-green-500/10",
    data: {
      issueId: "GGN2024001",
      shares: 10,
      location: "MG Road, Gurgaon"
    }
  },
  {
    id: 8,
    type: "system",
    title: "🇮🇳 Thank you for contributing to Digital India!",
    message: "Your active participation in civic reporting is helping build a better nation. Keep up the great work!",
    timestamp: "3 days ago",
    isRead: true,
    priority: "low",
    icon: CheckCircle,
    iconColor: "text-orange-400",
    bgColor: "bg-gradient-to-r from-orange-500/10 to-green-500/10",
    data: {
      totalContributions: 15
    }
  }
]

function NotificationCard({ notification, onMarkRead, onDelete }) {
  const Icon = notification.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
      whileHover={{ x: 4 }}
      className="group"
    >
      <Card className={`glass border-border/50 hover:border-border transition-all duration-300 ${
        !notification.isRead ? 'ring-1 ring-orange-500/20' : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center flex-shrink-0 mt-1`}>
              <Icon className={`h-5 w-5 ${notification.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-sm font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'} line-clamp-2`}>
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 ml-2 mt-1 animate-pulse duration-200" />
                )}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {notification.message}
              </p>

              <div className="flex items-center justify-between">
                <div className="md:flex items-center space-x-3 space-y-3 md:space-y-0 justify-center">
                  <div className="sm:flex space-x-3 items-center space-y-3 sm:space-y-0">
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {notification.timestamp}
                  </span>
                  
                  {notification.data?.location && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {notification.data.location}
                    </span>
                  )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      notification.priority === 'high' ? 'border-red-500/20 text-red-400' :
                      notification.priority === 'medium' ? 'border-yellow-500/20 text-yellow-400' :
                      'border-green-500/20 text-green-400'
                    }`}
                  >
                    {notification.priority}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onMarkRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onDelete(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Additional Data */}
              {notification.data?.issueId && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/problems/${notification.data.issueId.split('2024')[1]}`}
                    className="text-xs h-8"
                  >
                    View Issue #{notification.data.issueId}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState("all")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const unreadCount = notifications.filter(n => !n.isRead).length
  const filters = ["all", "status_update", "community_interaction", "system"]

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true
    return notification.type === filter
  })

  const handleMarkRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    )
  }

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    )
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent flex items-center">
              <Bell className="h-8 w-8 mr-3 text-orange-400" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-2">
              Stay updated on your civic issues and community activity
              {unreadCount > 0 && (
                <Badge variant="outline" className="ml-2 bg-orange-500/10 text-orange-400 border-orange-500/20">
                  {unreadCount} unread
                </Badge>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Bell className={`h-4 w-4 ${notificationsEnabled ? 'text-green-400' : 'text-muted-foreground'}`} />
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
              <span className="text-sm text-muted-foreground">
                {notificationsEnabled ? 'On' : 'Off'}
              </span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {filters.map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className="capitalize"
            >
              {filterOption === "all" ? "All" : filterOption.replace("_", " ")}
            </Button>
          ))}
        </motion.div>

        {/* Actions Bar */}
        {(unreadCount > 0 || notifications.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-muted/30 rounded-lg"
          >
            <div className="text-sm text-muted-foreground">
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} 
              {filter !== "all" && ` in ${filter.replace("_", " ")}`}
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="flex items-center space-x-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span>Mark All Read</span>
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex items-center space-x-2 text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NotificationCard
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">
                {notifications.length === 0 ? '🔔' : '📭'}
              </div>
              <h3 className="text-lg font-medium mb-2">
                {notifications.length === 0 ? 'No notifications yet' : 'No notifications found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {notifications.length === 0 
                  ? 'When you report issues or engage with the community, you\'ll see updates here.'
                  : 'Try adjusting your filter or check back later for new updates.'
                }
              </p>
              {notifications.length === 0 && (
                <Button
                  onClick={() => window.location.href = "/feed"}
                  className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600"
                >
                  🚨 Report Your First Issue
                </Button>
              )}
            </motion.div>
          )}
        </div>

        {/* Tips Card */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="glass border-border/50 bg-gradient-to-r from-orange-500/10 to-green-500/10">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">💡 Tip: Stay Engaged</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable push notifications to get real-time updates on your issues. You can also follow other community issues to stay informed about civic improvements in your area.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}