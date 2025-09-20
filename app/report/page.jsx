"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Camera,
  Upload,
  MapPin,
  Send,
  X,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Construction,
  Zap,
  FileImage
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

export default function ReportIssuePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [capturedImage, setCapturedImage] = useState(null)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('Mall Road, District 5') // Dummy location for now
  const [processing, setProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const streamRef = useRef(null)

  // Handle returning from camera page with captured image
  useEffect(() => {
    const imageParam = searchParams?.get('image')
    if (imageParam === 'captured') {
      // Get the image from sessionStorage
      const capturedImageUrl = sessionStorage.getItem('capturedImage')
      if (capturedImageUrl) {
        // Convert to File object for consistency
        fetch(capturedImageUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' })
            setCapturedImage({ file, url: capturedImageUrl })
            // Clean up sessionStorage
            sessionStorage.removeItem('capturedImage')
            // Clean up URL parameter
            router.replace('/report')
            toast.success('Photo loaded successfully!')
          })
          .catch(error => {
            console.error('Error loading captured image:', error)
            toast.error('Failed to load captured image')
          })
      }
    }
  }, [searchParams, router])

  // Check if device is mobile
  const checkIsMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
  }

  // Initialize camera for desktop
  const initializeCamera = async () => {
    try {
      setCameraError(null)
      console.log('Requesting camera access...')
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this browser')
      }
      
      const constraints = {
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Camera stream obtained:', stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        
        setShowCamera(true)
        
        // Set up event listeners
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded')
          console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
        }
        
        videoRef.current.oncanplay = () => {
          console.log('Video can start playing')
          videoRef.current.play().catch(playError => {
            console.error('Error starting video playback:', playError)
          })
        }
        
        videoRef.current.onerror = (error) => {
          console.error('Video element error:', error)
          setCameraError('Video playback error')
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      let userFriendlyError = error.message
      
      if (error.name === 'NotAllowedError') {
        userFriendlyError = 'Camera permission denied. Please allow camera access in your browser and try again.'
      } else if (error.name === 'NotFoundError') {
        userFriendlyError = 'No camera found. Please connect a camera and try again.'
      } else if (error.name === 'NotReadableError') {
        userFriendlyError = 'Camera is being used by another application.'
      }
      
      setCameraError(userFriendlyError)
      toast.error(`Unable to access camera: ${userFriendlyError}`)
    }
  }

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      // Set canvas size to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert to blob and create file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' })
          const imageUrl = URL.createObjectURL(blob)
          setCapturedImage({ file, url: imageUrl })
          stopCamera()
          setShowCamera(false)
          toast.success('Photo captured successfully!')
        }
      }, 'image/jpeg', 0.9)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  // Handle file input
  const handleFileInput = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setCapturedImage({ file, url: imageUrl })
    }
  }

  // Handle camera/upload button click
  const handleCameraClick = () => {
    // Always redirect to dedicated camera page
    router.push('/camera')
  }

  // Simulate AI analysis
  const analyzeImage = async () => {
    setProcessing(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock AI analysis results
    const mockResults = [
      {
        type: 'pothole',
        confidence: 0.92,
        description: 'Large pothole detected in road surface',
        department: 'Municipal Corporation',
        priority: 'high'
      },
      {
        type: 'street_light',
        confidence: 0.87,
        description: 'Non-functional street light identified',
        department: 'Electricity Board',
        priority: 'medium'
      },
      {
        type: 'drainage',
        confidence: 0.78,
        description: 'Blocked drainage system detected',
        department: 'Water Department',
        priority: 'high'
      }
    ]
    
    // Randomly select one result for simulation
    const result = mockResults[Math.floor(Math.random() * mockResults.length)]
    setAnalysisResult(result)
    setProcessing(false)
  }

  // Submit report
  const handleSubmit = async () => {
    if (!capturedImage || !description.trim()) {
      toast.error('Please add an image and description')
      return
    }

    try {
      const timestamp = Date.now()
      
      // Save to user reports (for tracking)
      const reportData = {
        id: timestamp,
        image: capturedImage.url,
        description: description.trim(),
        location: location,
        category: analysisResult?.type || 'other',
        department: analysisResult?.department || 'General',
        priority: analysisResult?.priority || 'medium',
        status: 'pending',
        reportedAt: new Date().toISOString(),
        reportedBy: 'Current User' // Will be replaced with actual user data
      }

      // Get existing reports from localStorage
      const existingReports = JSON.parse(localStorage.getItem('userReports') || '[]')
      existingReports.push(reportData)
      localStorage.setItem('userReports', JSON.stringify(existingReports))

      // Also save to feed (for public display)
      const feedPostData = {
        id: timestamp,
        title: `${analysisResult?.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Infrastructure'} Issue Reported`,
        description: description.trim(),
        category: analysisResult?.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Other',
        department: analysisResult?.department || 'General',
        location: location,
        image: capturedImage.url,
        user: {
          name: 'Current User', // Will be replaced with actual user data
          avatar: '/api/placeholder/40/40'
        },
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        reposts: 0,
        status: 'Pending',
        isLiked: false,
        isReposted: false,
        isTracked: true,
        priority: analysisResult?.priority || 'medium'
      }

      // Get existing feed posts from localStorage
      const existingFeedPosts = JSON.parse(localStorage.getItem('feedPosts') || '[]')
      existingFeedPosts.unshift(feedPostData) // Add to beginning (most recent first)
      localStorage.setItem('feedPosts', JSON.stringify(existingFeedPosts))

      toast.success('Issue reported successfully! It has been added to the community feed.')
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/track'
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('Failed to submit report. Please try again.')
    }
  }

  // Remove captured image
  const removeImage = () => {
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url)
    }
    setCapturedImage(null)
    setAnalysisResult(null)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    }
  }

  const getIssueIcon = (type) => {
    switch (type) {
      case 'pothole': return Construction
      case 'street_light': return Lightbulb
      case 'drainage': return AlertTriangle
      default: return AlertTriangle
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm border-b border-border/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              
              <div className="h-6 w-px bg-border/50" />
              
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Report Issue</h1>
                  <p className="text-sm text-muted-foreground">Help improve your community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Camera/Upload Section */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Capture or Upload Image</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!capturedImage ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <Camera className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-foreground font-medium mb-2">
                            Take a photo or upload a file
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Our AI will analyze the image to identify the issue type
                          </p>
                        </div>
                        <div className="flex space-x-3">
                          <Button onClick={handleCameraClick} className="bg-blue-600 hover:bg-blue-700">
                            <Camera className="h-4 w-4 mr-2" />
                            Take Photo
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={capturedImage.url}
                        alt="Captured issue"
                        className="w-full h-64 object-cover rounded-lg border border-border/50"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {!analysisResult && !processing && (
                      <Button 
                        onClick={analyzeImage} 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Analyze with AI
                      </Button>
                    )}
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture={isMobile ? "environment" : undefined}
                  onChange={handleFileInput}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </motion.div>


          {/* AI Analysis Processing */}
          {processing && (
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="font-medium text-foreground">Analyzing image...</p>
                      <p className="text-sm text-muted-foreground">AI is detecting issue type and priority</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* AI Analysis Result */}
          {analysisResult && (
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>AI Analysis Complete</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start space-x-3">
                      {(() => {
                        const IconComponent = getIssueIcon(analysisResult.type)
                        return <IconComponent className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5" />
                      })()}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-green-800 dark:text-green-200">
                            {analysisResult.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Detected
                          </h4>
                          <Badge className={`text-xs ${getPriorityColor(analysisResult.priority)}`}>
                            {analysisResult.priority?.toUpperCase()} PRIORITY
                          </Badge>
                        </div>
                        <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                          {analysisResult.description}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Confidence: {(analysisResult.confidence * 100).toFixed(0)}% • 
                          Department: {analysisResult.department}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Description and Location */}
          {capturedImage && (
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileImage className="h-5 w-5" />
                    <span>Issue Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    <Textarea
                      placeholder="Please describe the issue in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-background/50 border-border/50"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-background/50 border-border/50"
                        placeholder="Location will be auto-detected..."
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Location detection will be implemented with backend integration
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Submit Button */}
          {capturedImage && description.trim() && (
            <motion.div variants={cardVariants}>
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 shadow-lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Report
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}