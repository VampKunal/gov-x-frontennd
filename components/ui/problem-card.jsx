"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Repeat2, MapPin, Calendar, Eye, MoreHorizontal, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostTracker } from "@/components/ui/post-tracker"
import Image from "next/image"
import Link from "next/link"

const getDepartmentColor = (department) => {
  const colors = {
    "Municipal Corporation": "bg-primary/10 text-primary border-primary/20",
    "PWD": "bg-warning/10 text-warning border-warning/20",
    "Water Department": "bg-info/10 text-info border-info/20",
    "Traffic Police": "bg-destructive/10 text-destructive border-destructive/20",
    "Electricity Board": "bg-success/10 text-success border-success/20",
    "Fire Department": "bg-destructive/10 text-destructive border-destructive/20",
    "Health Department": "bg-success/10 text-success border-success/20",
    "Forest Department": "bg-success/10 text-success border-success/20"
  }
  return colors[department] || "bg-muted/10 text-muted-foreground border-muted/20"
}

const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || "pending"
  const colors = {
    "pending": "bg-warning/10 text-warning border-warning/20",
    "under review": "bg-info/10 text-info border-info/20", 
    "in progress": "bg-info/10 text-info border-info/20",
    "resolved": "bg-success/10 text-success border-success/20",
    "rejected": "bg-destructive/10 text-destructive border-destructive/20"
  }
  return colors[statusLower] || colors.pending
}

const getCategoryIcon = (category) => {
  const icons = {
    "Pothole": "🕳️",
    "Garbage": "🗑️", 
    "Street Light": "💡",
    "Water": "🚰",
    "Traffic": "🚦",
    "Road": "🛣️",
    "Drainage": "🌊"
  }
  return icons[category] || "📋"
}

export function ProblemCard({ 
  problem, 
  showActions = true, 
  isDetailed = false,
  onClick
}) {
  const [isTrackerOpen, setIsTrackerOpen] = useState(false)
  const {
    id,
    title,
    description,
    category,
    department,
    location,
    image,
    user,
    timestamp,
    likes = 0,
    comments = 0,
    reposts = 0,
    status = "Pending",
    isLiked = false,
    isReposted = false,
    isTracked = false
  } = problem

  const handleCardClick = () => {
    if (onClick) {
      onClick(problem)
    }
  }

  const handleTrackClick = (e) => {
    e.stopPropagation()
    setIsTrackerOpen(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
        className="mobile-card"
      >
        <Card className="glass border-border/50 hover:border-border transition-all duration-300 cursor-pointer overflow-hidden card-hover">
          <CardContent className="p-0 mobile-spacing">
          <div onClick={handleCardClick}>
            {/* Header */}
            <div className="p-4 sm:p-6 pb-3">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/70 to-success/70 text-white text-sm">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.name || "Anonymous User"}
                      </p>
                      <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {timestamp}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={getDepartmentColor(department)}>
                        {department}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-muted/50">
                        {getCategoryIcon(category)} {category}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 touch-target">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 pb-3">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 line-clamp-2">
                {title}
              </h3>
              <p className={`text-sm text-muted-foreground mb-3 ${isDetailed ? '' : 'line-clamp-3'}`}>
                {description}
              </p>
              {location && (
                <div className="flex items-center text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md w-fit">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}
            </div>

            {/* Image */}
            {image && (
              <div className="px-4 sm:px-6 pb-3">
                <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="px-4 sm:px-6 py-3 border-t border-border/50 bg-card/50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <motion.button
                    className={`flex items-center space-x-1 text-sm transition-colors touch-target ${
                      isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{likes}</span>
                  </motion.button>
                  
                  <motion.button
                    className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-info transition-colors touch-target"
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium">{comments}</span>
                  </motion.button>
                  
                  <motion.button
                    className={`flex items-center space-x-1 text-sm transition-colors touch-target ${
                      isReposted ? 'text-success' : 'text-muted-foreground hover:text-success'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Repeat2 className="h-4 w-4" />
                    <span className="font-medium">{reposts}</span>
                  </motion.button>
                </div>
                
                <motion.button
                  onClick={handleTrackClick}
                  className={`flex items-center space-x-1 text-sm px-3 py-2 rounded-full border transition-all touch-target ${
                    isTracked 
                      ? 'bg-primary/10 text-primary border-primary/20 shadow-sm' 
                      : 'text-muted-foreground border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">{isTracked ? '🔍 Tracking' : '📊 Track'}</span>
                </motion.button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
    
    {/* Post Tracker Modal */}
    <PostTracker 
      post={problem}
      isOpen={isTrackerOpen}
      onClose={() => setIsTrackerOpen(false)}
    />
  </>
  )
}