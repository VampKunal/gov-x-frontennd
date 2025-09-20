"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DepartmentLayout } from '@/components/layouts/department-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FileText,
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
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

export default function AllIssuesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data for all issues
  const allIssues = [
    {
      id: 1,
      title: 'Large pothole on MG Road causing traffic issues',
      description: 'Deep pothole near the Metro station entrance is causing vehicles to take detours.',
      location: 'MG Road, Near Metro Station, Sector 14',
      reportedBy: 'Rahul Sharma',
      reportedDate: '2024-01-20T10:30:00Z',
      category: 'Infrastructure',
      priority: 'high',
      status: 'pending',
      department: 'Municipal Corporation',
      likes: 15,
      comments: 8
    },
    {
      id: 2,
      title: 'Broken streetlight creating safety concerns',
      description: 'Street light has been non-functional for 3 days.',
      location: 'Park Street, Zone 3',
      reportedBy: 'Priya Gupta',
      reportedDate: '2024-01-19T16:45:00Z',
      category: 'Utilities',
      priority: 'medium',
      status: 'in_progress',
      department: 'Electricity Board',
      likes: 7,
      comments: 3
    },
    {
      id: 3,
      title: 'Water leakage from main pipeline',
      description: 'Continuous water leakage from the main supply line.',
      location: 'Mall Road, District 5',
      reportedBy: 'Amit Kumar',
      reportedDate: '2024-01-18T08:15:00Z',
      category: 'Utilities',
      priority: 'high',
      status: 'resolved',
      department: 'Water Department',
      likes: 22,
      comments: 12
    },
    {
      id: 4,
      title: 'Garbage dump near residential area',
      description: 'Large garbage accumulation causing health hazards.',
      location: 'Green Park, Sector 12',
      reportedBy: 'Sunita Singh',
      reportedDate: '2024-01-17T14:20:00Z',
      category: 'Environment',
      priority: 'high',
      status: 'pending',
      department: 'Municipal Corporation',
      likes: 18,
      comments: 6
    },
    {
      id: 5,
      title: 'Road construction blocking traffic',
      description: 'Ongoing road work without proper traffic management.',
      location: 'Central Avenue, Block A',
      reportedBy: 'Rajesh Patel',
      reportedDate: '2024-01-16T11:00:00Z',
      category: 'Infrastructure',
      priority: 'medium',
      status: 'in_progress',
      department: 'PWD',
      likes: 9,
      comments: 4
    }
  ]

  const filteredIssues = allIssues.filter(issue => {
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

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
                <div className="h-10 w-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">All Issues</h1>
                  <p className="text-sm text-muted-foreground">Complete overview of reported issues</p>
                </div>
              </div>
            </div>

            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {filteredIssues.length} Issues
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
          {/* Filters */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'in_progress', 'resolved'].map((status) => (
                      <Button
                        key={status}
                        variant={filterStatus === status ? "default" : "outline"}
                        onClick={() => setFilterStatus(status)}
                        className="capitalize"
                      >
                        {status === 'all' ? 'All Issues' : status.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>

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
          <motion.div variants={cardVariants} className="space-y-4">
            {filteredIssues.map((issue, index) => (
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
                              {issue.priority === 'high' && <Star className="h-3 w-3 mr-1" />}
                              {issue.priority?.toUpperCase()} PRIORITY
                            </Badge>
                            <Badge variant="outline" className="bg-background/50">
                              {issue.category}
                            </Badge>
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              {issue.department}
                            </Badge>
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
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0">
                          <Badge className={`flex items-center space-x-1 ${getStatusColor(issue.status)}`}>
                            {getStatusIcon(issue.status)}
                            <span className="capitalize">{issue.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>👍 {issue.likes} likes</span>
                          <span>💬 {issue.comments} comments</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {issue.status === 'pending' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredIssues.length === 0 && (
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No issues found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterStatus !== 'all' 
                      ? "Try adjusting your search or filter criteria."
                      : "No issues have been reported yet."
                    }
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DepartmentLayout>
  )
}