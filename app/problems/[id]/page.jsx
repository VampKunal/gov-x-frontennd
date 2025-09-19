"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Calendar, User, Building, Clock, Heart, MessageCircle, Repeat2, Eye, Share, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Timeline } from "@/components/ui/timeline"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"

// Mock data for problem details
const mockProblemDetails = {
  1: {
    id: 1,
    title: "Major pothole causing accidents on MG Road",
    description: "Large pothole near the traffic signal has been causing accidents and vehicle damage. Multiple bikes have fallen into it during rain. Urgent repair needed before more accidents occur. The pothole is approximately 3 feet wide and 1 foot deep, making it extremely dangerous for two-wheelers.",
    category: "Pothole",
    department: "Municipal Corporation",
    location: "MG Road, Sector 14, Gurgaon, Haryana",
    coordinates: "28.4595° N, 77.0266° E",
    image: "/api/placeholder/800/600",
    user: {
      name: "Rajesh Kumar",
      avatar: "/api/placeholder/40/40",
      joinDate: "Member since 2023"
    },
    status: "In Progress",
    priority: "High",
    submittedDate: "January 15, 2024",
    lastUpdate: "January 18, 2024",
    trackingId: "GGN2024001",
    estimatedCompletion: "January 25, 2024",
    progress: 60,
    assignedDept: "Road Maintenance Division",
    assignedOfficer: "Ramesh Singh (ID: 1234)",
    likes: 34,
    comments: 12,
    reposts: 8,
    views: 245,
    isLiked: false,
    isReposted: false,
    isTracked: true,
    timeline: [
      {
        title: "Issue Submitted",
        time: "Jan 15, 2024 at 10:30 AM",
        status: "Pending",
        description: "Issue reported by citizen with photo evidence"
      },
      {
        title: "Acknowledgment Received",
        time: "Jan 15, 2024 at 2:15 PM", 
        status: "Pending",
        description: "Municipal Corporation acknowledged the complaint. Tracking ID: GGN2024001 assigned"
      },
      {
        title: "Assigned to Department",
        time: "Jan 16, 2024 at 9:00 AM",
        status: "In Progress",
        description: "Issue forwarded to Road Maintenance Division. Officer Ramesh Singh assigned"
      },
      {
        title: "Site Inspection Completed",
        time: "Jan 17, 2024 at 11:30 AM",
        status: "In Progress", 
        description: "Technical team visited the site. Repair work estimated to take 5-7 days"
      },
      {
        title: "Work Order Issued",
        time: "Jan 18, 2024 at 4:45 PM",
        status: "In Progress",
        description: "Materials procured. Road repair work will begin on Jan 22, 2024"
      }
    ],
    additionalInfo: {
      weatherCondition: "Reported during monsoon season",
      affectedVehicles: "2-wheelers, 4-wheelers",
      estimatedCost: "₹15,000 - ₹20,000",
      contractorAssigned: "ABC Road Construction Pvt Ltd"
    }
  }
}

const mockComments = [
  {
    id: 1,
    user: { name: "Priya Sharma", avatar: "/api/placeholder/32/32" },
    content: "I also faced the same issue yesterday! My bike skidded because of this pothole. Thanks for reporting.",
    timestamp: "2 hours ago",
    likes: 5
  },
  {
    id: 2,
    user: { name: "Amit Gupta", avatar: "/api/placeholder/32/32" },
    content: "This pothole has been there for months. Finally someone reported it! 👏",
    timestamp: "4 hours ago",
    likes: 8
  },
  {
    id: 3,
    user: { name: "Local Resident", avatar: "/api/placeholder/32/32" },
    content: "The municipal corporation should prioritize such dangerous spots. Hope this gets fixed soon.",
    timestamp: "6 hours ago", 
    likes: 12
  }
]

export default function ProblemDetailPage({ params }) {
  const [problem, setProblem] = useState(null)
  const [comments, setComments] = useState(mockComments)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadProblem = async () => {
      try {
        // Handle both direct ID and extracted ID from tracking number
        const id = await params.id
        const problemId = id.includes('2024') ? '1' : id
        const problemData = mockProblemDetails[problemId] || mockProblemDetails['1']
        setProblem(problemData)
      } catch (error) {
        console.error('Error loading problem:', error)
        setProblem(mockProblemDetails['1']) // Fallback
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProblem()
  }, [params])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading problem details...</p>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested problem could not be found.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Problem Details</h1>
            <p className="text-sm text-muted-foreground">ID: {problem.trackingId}</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={problem.user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-green-400 text-white">
                          {problem.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{problem.user.name}</p>
                        <p className="text-xs text-muted-foreground">{problem.user.joinDate}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {problem.category} Issue
                          </Badge>
                          <StatusBadge status={problem.status} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">{problem.submittedDate}</p>
                      <Badge variant="outline" className={problem.priority === "High" ? "text-red-400" : problem.priority === "Medium" ? "text-yellow-400" : "text-green-400"}>
                        {problem.priority} Priority
                      </Badge>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-3">{problem.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-2 mb-4 p-3 bg-muted/30 rounded-lg">
                    <MapPin className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{problem.location}</p>
                      <p className="text-xs text-muted-foreground">{problem.coordinates}</p>
                    </div>
                  </div>

                  {/* Image */}
                  {problem.image && (
                    <div className="mb-6">
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={problem.image}
                          alt={problem.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center space-x-6">
                      <motion.button
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          problem.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart className={`h-4 w-4 ${problem.isLiked ? 'fill-current' : ''}`} />
                        <span>{problem.likes}</span>
                      </motion.button>
                      
                      <motion.button
                        className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{problem.comments}</span>
                      </motion.button>
                      
                      <motion.button
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          problem.isReposted ? 'text-green-500' : 'text-muted-foreground hover:text-green-500'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Repeat2 className="h-4 w-4" />
                        <span>{problem.reposts}</span>
                      </motion.button>

                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{problem.views}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Community Discussion ({comments.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex space-x-3 p-4 bg-muted/30 rounded-lg"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-xs">
                          {comment.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-foreground">{comment.user.name}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-red-500 transition-colors">
                            <Heart className="h-3 w-3" />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-blue-500 transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-orange-400" />
                    Progress Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Overall Progress</span>
                      <span className="text-sm font-medium">{problem.progress}%</span>
                    </div>
                    <Progress value={problem.progress} className="h-3" />
                    <div className="text-xs text-muted-foreground">
                      Expected completion: {problem.estimatedCompletion}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Department Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-400" />
                    Assignment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium">{problem.assignedDept}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned Officer</p>
                    <p className="text-sm font-medium">{problem.assignedOfficer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Update</p>
                    <p className="text-sm font-medium">{problem.lastUpdate}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Status Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline steps={problem.timeline} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(problem.additionalInfo).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}