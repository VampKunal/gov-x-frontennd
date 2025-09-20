"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DepartmentLayout } from '@/components/layouts/department-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Camera,
  Settings,
  Filter,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

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

export default function UnresolvedIssuesPage() {
  const [activeTab, setActiveTab] = useState('zero-action') // 'zero-action', 'in-progress', 'delayed'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [declineReason, setDeclineReason] = useState('')
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)

  // Mock data
  const zeroActionIssues = [
    {
      id: 1,
      title: 'Large pothole on MG Road causing traffic issues',
      description: 'Deep pothole near the Metro station entrance is causing vehicles to take detours. Multiple citizens have reported this issue.',
      location: 'MG Road, Near Metro Station, Sector 14',
      reportedBy: 'Rahul Sharma',
      reportedDate: '2024-01-20T10:30:00Z',
      category: 'Infrastructure',
      priority: 'high',
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
      likes: 15,
      comments: 8,
      department: 'Municipal Corporation'
    },
    {
      id: 2,
      title: 'Broken streetlight creating safety concerns',
      description: 'Street light has been non-functional for 3 days. The area becomes very dark at night, creating safety issues for pedestrians.',
      location: 'Park Street, Zone 3',
      reportedBy: 'Priya Gupta',
      reportedDate: '2024-01-19T16:45:00Z',
      category: 'Utilities',
      priority: 'medium',
      images: ['/api/placeholder/300/200'],
      likes: 7,
      comments: 3,
      department: 'Electricity Board'
    },
    {
      id: 3,
      title: 'Water leakage from main pipeline',
      description: 'Continuous water leakage from the main supply line. Water is being wasted and the road is getting damaged.',
      location: 'Mall Road, District 5',
      reportedBy: 'Amit Kumar',
      reportedDate: '2024-01-18T08:15:00Z',
      category: 'Utilities',
      priority: 'high',
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200', '/api/placeholder/300/200'],
      likes: 22,
      comments: 12,
      department: 'Water Department'
    }
  ]

  const inProgressIssues = [
    {
      id: 4,
      title: 'Road repair work on Central Avenue',
      description: 'Ongoing road repair and resurfacing work. Expected completion in 2 days.',
      location: 'Central Avenue, Block A',
      reportedBy: 'Municipal Team',
      reportedDate: '2024-01-15T09:00:00Z',
      category: 'Infrastructure',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'PWD Team Alpha',
      expectedCompletion: '2024-01-22T17:00:00Z'
    }
  ]

  const delayedIssues = [
    {
      id: 5,
      title: 'Drainage system cleaning - Behind schedule',
      description: 'Scheduled drainage cleaning is delayed due to equipment issues. New timeline being assessed.',
      location: 'Green Park, Sector 12',
      reportedBy: 'Health Department',
      reportedDate: '2024-01-10T11:00:00Z',
      category: 'Environment',
      priority: 'high',
      status: 'delayed',
      delayReason: 'Equipment maintenance required',
      originalDeadline: '2024-01-20T12:00:00Z',
      newDeadline: '2024-01-25T12:00:00Z'
    }
  ]

  const getCurrentIssues = () => {
    switch (activeTab) {
      case 'zero-action':
        return zeroActionIssues
      case 'in-progress':
        return inProgressIssues
      case 'delayed':
        return delayedIssues
      default:
        return []
    }
  }

  const handleAcceptIssue = (issueId) => {
    toast.success('Issue accepted and assigned to your team!')
    // Here you would typically update the issue status in your backend
  }

  const handleDeclineIssue = (issueId) => {
    if (!declineReason.trim()) {
      toast.error('Please provide a reason for declining')
      return
    }
    toast.success('Issue declined with reason provided')
    setShowDeclineDialog(false)
    setDeclineReason('')
    setSelectedIssue(null)
    // Here you would typically update the issue status in your backend
  }

  const getTabConfig = () => {
    const configs = {
      'zero-action': {
        title: '0 Action Issues',
        count: zeroActionIssues.length,
        color: 'bg-orange-500',
        description: 'New issues requiring your decision'
      },
      'in-progress': {
        title: 'In Progress',
        count: inProgressIssues.length,
        color: 'bg-blue-500',
        description: 'Issues currently being resolved'
      },
      'delayed': {
        title: 'Delayed',
        count: delayedIssues.length,
        color: 'bg-red-500',
        description: 'Issues behind schedule'
      }
    }
    return configs[activeTab] || configs['zero-action']
  }

  const tabConfig = getTabConfig()
  const currentIssues = getCurrentIssues()

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
                <div className={`h-10 w-10 ${tabConfig.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Unresolved Issues</h1>
                  <p className="text-sm text-muted-foreground">{tabConfig.description}</p>
                </div>
              </div>
            </div>

            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              {tabConfig.count} {tabConfig.count === 1 ? 'Issue' : 'Issues'}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Tabs */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'zero-action', label: '0 Action', count: zeroActionIssues.length, icon: Clock },
                      { key: 'in-progress', label: 'In Progress', count: inProgressIssues.length, icon: Play },
                      { key: 'delayed', label: 'Delayed', count: delayedIssues.length, icon: XCircle }
                    ].map((tab) => (
                      <Button
                        key={tab.key}
                        variant={activeTab === tab.key ? "default" : "outline"}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center space-x-2 transition-all duration-200 ${
                          activeTab === tab.key 
                            ? 'bg-primary text-primary-foreground shadow-lg' 
                            : 'hover:bg-background/80'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                        <Badge 
                          variant="secondary" 
                          className={`ml-1 ${
                            activeTab === tab.key 
                              ? 'bg-primary-foreground/20 text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {tab.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="flex items-center space-x-2 max-w-md">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search issues..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Issues List */}
          <motion.div variants={cardVariants} className="space-y-6">
            {currentIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                variants={cardVariants}
                className="group"
              >
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Issue Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={`${
                                issue.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              }`}
                            >
                              {issue.priority?.toUpperCase()} PRIORITY
                            </Badge>
                            <Badge variant="outline" className="bg-background/50">
                              {issue.category}
                            </Badge>
                            {issue.department && (
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                {issue.department}
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                            {issue.title}
                          </h3>
                          
                          <p className="text-muted-foreground mb-3 leading-relaxed">
                            {issue.description}
                          </p>

                          {/* Meta information */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{issue.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>Reported by {issue.reportedBy}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(issue.reportedDate).toLocaleDateString()}</span>
                            </div>
                            {issue.likes && (
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{issue.likes} likes</span>
                              </div>
                            )}
                            {issue.comments && (
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{issue.comments} comments</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Issue Status Indicator */}
                        <div className="flex-shrink-0">
                          {issue.status === 'in-progress' && (
                            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                              <Play className="h-5 w-5" />
                              <span className="text-sm font-medium">In Progress</span>
                            </div>
                          )}
                          {issue.status === 'delayed' && (
                            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                              <XCircle className="h-5 w-5" />
                              <span className="text-sm font-medium">Delayed</span>
                            </div>
                          )}
                          {!issue.status && (
                            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                              <Clock className="h-5 w-5" />
                              <span className="text-sm font-medium">Pending</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Images */}
                      {issue.images && issue.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {issue.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="relative group cursor-pointer">
                              <img
                                src={image}
                                alt={`Issue evidence ${imgIndex + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-border/50 group-hover:border-primary/50 transition-colors duration-200"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Additional Status Info */}
                      {issue.assignedTo && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Assigned to:</strong> {issue.assignedTo}
                            {issue.expectedCompletion && (
                              <span className="ml-2">
                                • Expected completion: {new Date(issue.expectedCompletion).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                      )}

                      {issue.status === 'delayed' && issue.delayReason && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Delay Reason:</strong> {issue.delayReason}
                            {issue.newDeadline && (
                              <span className="ml-2">
                                • New deadline: {new Date(issue.newDeadline).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {activeTab === 'zero-action' && (
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex space-x-3">
                            <Button
                              onClick={() => handleAcceptIssue(issue.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept Issue
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                setSelectedIssue(issue)
                                setShowDeclineDialog(true)
                              }}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Decline Issue
                            </Button>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {activeTab === 'in-progress' && (
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex space-x-3">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Settings className="h-4 w-4 mr-2" />
                              Update Status
                            </Button>
                            <Button variant="outline">
                              <Camera className="h-4 w-4 mr-2" />
                              Upload Progress Photo
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeTab === 'delayed' && (
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex space-x-3">
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                              <Calendar className="h-4 w-4 mr-2" />
                              Update Timeline
                            </Button>
                            <Button variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Add Update
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {currentIssues.length === 0 && (
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className={`mx-auto h-16 w-16 ${tabConfig.color} rounded-full flex items-center justify-center opacity-20`}>
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      No {tabConfig.title.toLowerCase()} found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {activeTab === 'zero-action' && "All new issues have been reviewed. Great job!"}
                      {activeTab === 'in-progress' && "No issues are currently being worked on."}
                      {activeTab === 'delayed' && "No issues are currently delayed. Excellent progress!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Decline Issue Dialog */}
      <AnimatePresence>
        {showDeclineDialog && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6 border-b border-border/50">
                <h3 className="text-lg font-semibold text-foreground">Decline Issue</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please provide a reason for declining this issue.
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Decline Reason
                  </label>
                  <Textarea
                    placeholder="Explain why this issue is being declined..."
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="min-h-24"
                  />
                </div>
              </div>
              
              <div className="p-6 pt-0 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeclineDialog(false)
                    setDeclineReason('')
                    setSelectedIssue(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeclineIssue(selectedIssue?.id)}
                  disabled={!declineReason.trim()}
                >
                  <X className="h-4 w-4 mr-2" />
                  Decline Issue
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DepartmentLayout>
  )
}