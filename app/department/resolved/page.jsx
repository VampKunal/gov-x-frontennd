"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DepartmentLayout } from '@/components/layouts/department-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  CheckCircle,
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  User,
  Calendar,
  Star,
  Camera,
  Upload,
  MessageSquare,
  ThumbsUp,
  X
} from 'lucide-react'
import Link from 'next/link'
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

export default function ResolvedIssuesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [showProofUpload, setShowProofUpload] = useState(false)

  // Mock data for resolved issues
  const resolvedIssues = [
    {
      id: 3,
      title: 'Water leakage from main pipeline',
      description: 'Continuous water leakage from the main supply line causing road damage.',
      location: 'Mall Road, District 5',
      reportedBy: 'Amit Kumar',
      reportedDate: '2024-01-18T08:15:00Z',
      resolvedDate: '2024-01-20T14:30:00Z',
      category: 'Utilities',
      priority: 'high',
      status: 'resolved',
      department: 'Water Department',
      likes: 22,
      comments: 12,
      feedback: {
        rating: 4.5,
        comment: "Great work! The issue was resolved quickly and the area looks much better now. Thank you for the prompt response.",
        citizenName: "Amit Kumar"
      },
      proofImages: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
      resolutionNote: "Replaced damaged pipeline section and restored water supply. Road surface repaired."
    },
    {
      id: 6,
      title: 'Broken streetlight on Park Street',
      description: 'Street light has been non-functional for over a week, creating safety concerns.',
      location: 'Park Street, Zone 3',
      reportedBy: 'Priya Gupta',
      reportedDate: '2024-01-15T09:20:00Z',
      resolvedDate: '2024-01-19T16:45:00Z',
      category: 'Utilities',
      priority: 'medium',
      status: 'resolved',
      department: 'Electricity Board',
      likes: 12,
      comments: 5,
      feedback: {
        rating: 5.0,
        comment: "Excellent service! The streetlight is working perfectly now. The area feels much safer at night.",
        citizenName: "Priya Gupta"
      },
      proofImages: ['/api/placeholder/300/200'],
      resolutionNote: "Replaced faulty bulb and electrical connections. Light tested and working properly."
    },
    {
      id: 7,
      title: 'Pothole repair on MG Road',
      description: 'Large pothole was causing traffic congestion and vehicle damage.',
      location: 'MG Road, Sector 14',
      reportedBy: 'Rahul Sharma',
      reportedDate: '2024-01-12T11:00:00Z',
      resolvedDate: '2024-01-18T10:15:00Z',
      category: 'Infrastructure',
      priority: 'high',
      status: 'resolved',
      department: 'Municipal Corporation',
      likes: 28,
      comments: 8,
      feedback: {
        rating: 4.2,
        comment: "The pothole has been fixed and the road is smooth now. However, it took a bit longer than expected.",
        citizenName: "Rahul Sharma"
      },
      proofImages: [],
      resolutionNote: "Filled pothole with asphalt and compacted surface. Road marking restored."
    }
  ]

  const filteredIssues = resolvedIssues.filter(issue => 
    !searchQuery || issue.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleProofUpload = (issueId) => {
    setSelectedIssue(resolvedIssues.find(issue => issue.id === issueId))
    setShowProofUpload(true)
  }

  const handleUploadSubmit = () => {
    toast.success('Proof images uploaded successfully!')
    setShowProofUpload(false)
    setSelectedIssue(null)
  }

  const getRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
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
                <div className="h-10 w-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Resolved Issues</h1>
                  <p className="text-sm text-muted-foreground">Successfully completed issues with feedback</p>
                </div>
              </div>
            </div>

            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              {filteredIssues.length} Resolved
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
          {/* Search */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resolved issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resolved Issues List */}
          <motion.div variants={cardVariants} className="space-y-6">
            {filteredIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                variants={cardVariants}
                className="group"
              >
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Issue Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              RESOLVED
                            </Badge>
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
                          </div>
                          
                          <h3 className="text-xl font-semibold text-foreground mb-2">
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
                              <span>Resolved on {new Date(issue.resolvedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resolution Details */}
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Resolution Details:</h4>
                        <p className="text-green-700 dark:text-green-300 text-sm">{issue.resolutionNote}</p>
                      </div>

                      {/* Citizen Feedback */}
                      {issue.feedback && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200 flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Citizen Feedback
                            </h4>
                            <div className="flex items-center space-x-1">
                              {getRatingStars(issue.feedback.rating)}
                              <span className="text-sm text-blue-700 dark:text-blue-300 ml-1">
                                ({issue.feedback.rating}/5)
                              </span>
                            </div>
                          </div>
                          <p className="text-blue-700 dark:text-blue-300 text-sm italic mb-2">
                            "{issue.feedback.comment}"
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            - {issue.feedback.citizenName}
                          </p>
                        </div>
                      )}

                      {/* Proof Images */}
                      {issue.proofImages.length > 0 ? (
                        <div>
                          <h4 className="font-medium text-foreground mb-3 flex items-center">
                            <Camera className="h-4 w-4 mr-2" />
                            Resolution Proof
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {issue.proofImages.map((image, imgIndex) => (
                              <div key={imgIndex} className="relative group cursor-pointer">
                                <img
                                  src={image}
                                  alt={`Resolution proof ${imgIndex + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-border/50 group-hover:border-primary/50 transition-colors duration-200"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                  <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-orange-300 dark:border-orange-800 rounded-lg p-6 text-center">
                          <Camera className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <p className="text-orange-700 dark:text-orange-300 font-medium mb-2">
                            Proof Images Pending
                          </p>
                          <p className="text-orange-600 dark:text-orange-400 text-sm mb-4">
                            Upload before/after images to complete the resolution record.
                          </p>
                          <Button
                            onClick={() => handleProofUpload(issue.id)}
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Proof
                          </Button>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {issue.likes} likes
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {issue.comments} comments
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {issue.proofImages.length === 0 && (
                            <Button 
                              onClick={() => handleProofUpload(issue.id)}
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Add Proof
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
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No resolved issues found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? "Try adjusting your search criteria."
                      : "Issues will appear here once they are resolved."
                    }
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Proof Upload Modal */}
      <AnimatePresence>
        {showProofUpload && (
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Upload Resolution Proof</h3>
                  <button
                    onClick={() => setShowProofUpload(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload before and after images to document the resolution
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Click to upload or drag and drop images
                  </p>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>
              
              <div className="p-6 pt-0 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowProofUpload(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUploadSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Proof
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DepartmentLayout>
  )
}