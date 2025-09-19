"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Eye, 
  Users, 
  MessageSquare,
  Calendar,
  MapPin,
  Building2,
  Zap,
  TrendingUp,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Status configurations
const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    label: "Pending Review",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    progress: 20
  },
  "under-review": {
    icon: Eye,
    label: "Under Review",
    color: "text-info",
    bgColor: "bg-info/10",
    borderColor: "border-info/20",
    progress: 40
  },
  "in-progress": {
    icon: Zap,
    label: "In Progress",
    color: "text-info",
    bgColor: "bg-info/10",
    borderColor: "border-info/20",
    progress: 70
  },
  resolved: {
    icon: CheckCircle,
    label: "Resolved",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    progress: 100
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    progress: 0
  }
}

// Mock timeline data
const generateTimelineData = (status, submittedDate) => {
  const baseTimeline = [
    {
      id: 1,
      status: "submitted",
      title: "Report Submitted",
      description: "Your civic issue report has been successfully submitted to the system.",
      timestamp: submittedDate,
      icon: TrendingUp,
      completed: true,
      user: {
        name: "System",
        avatar: null
      }
    },
    {
      id: 2,
      status: "pending",
      title: "Pending Review",
      description: "Report is waiting for department review and verification.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: Clock,
      completed: status !== "pending",
      user: {
        name: "Auto System",
        avatar: null
      }
    }
  ]

  // Add status-specific timeline items
  if (status !== "pending" && status !== "rejected") {
    baseTimeline.push({
      id: 3,
      status: "under-review",
      title: "Under Department Review",
      description: "Assigned department is reviewing the report details and assessing priority.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      icon: Eye,
      completed: status === "in-progress" || status === "resolved",
      user: {
        name: "Department Officer",
        avatar: "/api/placeholder/32/32"
      }
    })
  }

  if (status === "in-progress" || status === "resolved") {
    baseTimeline.push({
      id: 4,
      status: "in-progress",
      title: "Work in Progress",
      description: "Department team has started working on resolving the issue.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      icon: Zap,
      completed: status === "resolved",
      user: {
        name: "Field Team",
        avatar: "/api/placeholder/32/32"
      }
    })
  }

  if (status === "resolved") {
    baseTimeline.push({
      id: 5,
      status: "resolved",
      title: "Issue Resolved",
      description: "The reported issue has been successfully resolved. Thank you for your civic participation!",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      icon: CheckCircle,
      completed: true,
      user: {
        name: "Completion Team",
        avatar: "/api/placeholder/32/32"
      },
      resolvedImages: [
        "/api/placeholder/200/150",
        "/api/placeholder/200/150"
      ]
    })
  }

  if (status === "rejected") {
    baseTimeline.push({
      id: 3,
      status: "rejected",
      title: "Report Rejected",
      description: "Report was rejected due to insufficient information or duplicate entry. Please check details and resubmit if needed.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      icon: XCircle,
      completed: true,
      user: {
        name: "Review Team",
        avatar: "/api/placeholder/32/32"
      },
      rejectionReason: "Duplicate report already exists for this location"
    })
  }

  return baseTimeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}

export function PostTracker({ post, isOpen, onClose }) {
  if (!post || !isOpen) return null

  const currentStatus = post.status?.toLowerCase() || "pending"
  const statusInfo = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending
  const StatusIcon = statusInfo.icon
  const timeline = generateTimelineData(currentStatus, post.timestamp || new Date().toISOString())

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto mobile-spacing">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-lg font-semibold text-foreground pr-8">
              🔍 Issue Progress Tracker
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Issue Summary Card */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {post.category}
                    </Badge>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <Building2 className="h-3 w-3 mr-1" />
                      {post.department}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {post.location}
                  </div>
                </div>
                {post.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Current Status */}
          <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
                  <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{statusInfo.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current status of your civic issue report
                  </p>
                </div>
                <Badge variant="outline" className={`${statusInfo.color} border-current`}>
                  {statusInfo.progress}% Complete
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{statusInfo.progress}%</span>
                </div>
                <Progress value={statusInfo.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="glass border-border/50">
            <CardHeader>
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                📊 Progress Timeline
              </h4>
            </CardHeader>
            <CardContent className="space-y-0">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                  )}
                  
                  <div className="flex gap-4 pb-6">
                    {/* Timeline icon */}
                    <div className={`relative z-10 p-2 rounded-full ${
                      item.completed 
                        ? 'bg-success/20 text-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    
                    {/* Timeline content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-foreground">{item.title}</h5>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      
                      {/* User info */}
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={item.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {item.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {item.user.name}
                        </span>
                      </div>

                      {/* Resolved images */}
                      {item.resolvedImages && (
                        <div className="flex gap-2 mt-3">
                          {item.resolvedImages.map((img, idx) => (
                            <div key={idx} className="w-16 h-12 rounded overflow-hidden bg-muted">
                              <img 
                                src={img} 
                                alt={`Resolution ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Rejection reason */}
                      {item.rejectionReason && (
                        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded">
                          <p className="text-xs text-destructive">
                            <strong>Reason:</strong> {item.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Engagement Stats */}
          <Card className="glass border-border/50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                📈 Community Engagement
              </h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">{post.likes || 0}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-success">{post.comments || 0}</div>
                  <div className="text-xs text-muted-foreground">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-info">{post.reposts || 0}</div>
                  <div className="text-xs text-muted-foreground">Shares</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 touch-target">
              <MessageSquare className="h-4 w-4 mr-2" />
              💬 Add Comment
            </Button>
            <Button variant="outline" className="flex-1 touch-target">
              <Users className="h-4 w-4 mr-2" />
              🤝 Share Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}