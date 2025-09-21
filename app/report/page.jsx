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
  FileImage,
  Locate,
  Star,
  Clock,
  Shield,
  Building2
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
  const [location, setLocation] = useState('Detecting location...') // Will be auto-detected
  const [processing, setProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [priority, setPriority] = useState('medium')
  const [locationLoading, setLocationLoading] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const [selectedDepartment, setSelectedDepartment] = useState('')
  
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
            // Trigger AI analysis automatically
            setTimeout(() => {
              analyzeImage()
            }, 1000)
          })
          .catch(error => {
            console.error('Error loading captured image:', error)
            toast.error('Failed to load captured image')
          })
      }
    }
  }, [searchParams, router])

  // Auto-trigger AI analysis when image is set
  useEffect(() => {
    if (capturedImage && !processing && !analysisResult) {
      console.log('Auto-triggering AI analysis for captured image')
      setTimeout(() => {
        analyzeImage()
      }, 500)
    }
  }, [capturedImage])

  // Auto-detect location on page load
  useEffect(() => {
    getCurrentLocation()
  }, [])

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
          // Automatically trigger AI analysis
          setTimeout(() => {
            analyzeImage()
          }, 500) // Small delay to ensure image is loaded
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
      toast.success('Image uploaded successfully!')
      // AI analysis will be triggered automatically by useEffect
    }
  }

  // Handle camera/upload button click
  const handleCameraClick = () => {
    // Always redirect to dedicated camera page
    router.push('/camera')
  }
  
  // Get user's current location
  const getCurrentLocation = async () => {
    setLocationLoading(true)
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser')
      }
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })
      
      const { latitude, longitude } = position.coords
      
      // Format coordinates with better precision
      const formattedLocation = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      setLocation(formattedLocation)
      toast.success('Location detected successfully!')
    } catch (error) {
      console.error('Location error:', error)
      toast.error('Unable to get location. Please enter manually.')
    } finally {
      setLocationLoading(false)
    }
  }

  // Simulate AI analysis
  const analyzeImage = async () => {
    console.log('Starting AI analysis...')
    setProcessing(true)
    setConfidence(0)
    
    // Simulate progressive analysis with confidence building
    const analysisSteps = [
      { message: 'Initializing AI model...', progress: 20 },
      { message: 'Detecting objects...', progress: 40 },
      { message: 'Analyzing issue type...', progress: 60 },
      { message: 'Determining priority...', progress: 80 },
      { message: 'Finalizing results...', progress: 100 }
    ]
    
    for (let step of analysisSteps) {
      await new Promise(resolve => setTimeout(resolve, 600))
      setConfidence(step.progress)
    }
    
    // Mock AI analysis results
    const mockResults = [
      {
        type: 'pothole',
        confidence: 0.92,
        description: 'Large pothole detected in road surface requiring immediate attention',
        department: 'Municipal Corporation',
        priority: 'high'
      },
      {
        type: 'street_light',
        confidence: 0.87,
        description: 'Non-functional street light identified affecting safety',
        department: 'Electricity Board',
        priority: 'medium'
      },
      {
        type: 'drainage',
        confidence: 0.78,
        description: 'Blocked drainage system detected causing water stagnation',
        department: 'Water Department',
        priority: 'high'
      },
      {
        type: 'garbage',
        confidence: 0.85,
        description: 'Illegal dumping of waste materials identified',
        department: 'Sanitation Department',
        priority: 'medium'
      }
    ]
    
    // Randomly select one result for simulation
    const result = mockResults[Math.floor(Math.random() * mockResults.length)]
    setAnalysisResult(result)
    setPriority(result.priority)
    setSelectedDepartment(result.department)
    setProcessing(false)
    
    // Show success message
    console.log('AI analysis completed:', result)
    toast.success(`${result.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} detected! Routing to ${result.department}`)
  }

  // Submit report
  const handleSubmit = async () => {
    if (!capturedImage) {
      toast.error('Please capture or upload an image')
      return
    }
    
    if (!analysisResult) {
      toast.error('Please wait for AI analysis to complete')
      return
    }
    
    // Only require description, make it shorter minimum
    if (!description.trim()) {
      toast.error('Please provide a brief description')
      return
    }
    
    if (description.trim().length < 10) {
      toast.error('Description must be at least 10 characters long')
      return
    }

    if (!selectedDepartment) {
      toast.error('Department assignment is required')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl border-b border-blue-200/50 dark:border-blue-800/50">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="font-medium hidden sm:inline">Back to Dashboard</span>
              </Link>
              
              <div className="h-8 w-px bg-blue-200/50 dark:bg-blue-800/50" />
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-ping opacity-20" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Report Issue</h1>
                  <p className="text-sm text-blue-600/70 dark:text-blue-400/70">Help build a better community</p>
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
          className="max-w-6xl mx-auto"
        >
          {/* Compact Single-Column Layout */}
          <div className="space-y-6">
            {/* Camera Section - Compact */}
            <motion.div variants={cardVariants}>
              <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-950/30 border-blue-200/50 dark:border-blue-800/30 shadow-lg">
                <CardContent className="p-4">
                  {!capturedImage ? (
                    <div className="text-center space-y-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Add Photo</h2>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Snap or upload the issue</p>
                      </div>
                      
                      <div className="flex gap-3 justify-center">
                        <Button 
                          onClick={handleCameraClick}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg flex-1 max-w-32"
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          Camera
                        </Button>
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline" 
                          className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl flex-1 max-w-32"
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Issue Photo</h2>
                        <button
                          onClick={removeImage}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <img
                        src={capturedImage.url}
                        alt="Captured issue"
                        className="w-full h-48 object-cover rounded-xl border border-blue-200/50 dark:border-blue-800/50"
                      />
                      
                      {/* Manual AI Analysis Button if auto-trigger fails */}
                      {!processing && !analysisResult && (
                        <div className="mt-3">
                          <Button
                            onClick={analyzeImage}
                            size="sm"
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Start AI Analysis
                          </Button>
                        </div>
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
          
            {/* AI Analysis Processing - Compact */}
            {processing && (
              <motion.div variants={cardVariants}>
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <div className="absolute inset-0 border-3 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        <div 
                          className="absolute inset-0 border-3 border-blue-500 rounded-full transition-all duration-300 ease-out"
                          style={{
                            clipPath: `inset(0 ${100 - confidence}% 0 0)`,
                            transform: 'rotate(-90deg)'
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-600">{confidence}%</span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="h-4 w-4 text-blue-500 animate-pulse" />
                          <p className="font-medium text-foreground text-sm">AI Analysis in Progress</p>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* AI Analysis Result - Compact */}
            {analysisResult && (
              <motion.div variants={cardVariants}>
                <Card className="bg-green-50/50 dark:bg-green-900/20 border-green-200/50 dark:border-green-800/50 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {(() => {
                          const IconComponent = getIssueIcon(analysisResult.type)
                          return <IconComponent className="h-5 w-5 text-green-600 dark:text-green-400" />
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-green-800 dark:text-green-200 text-sm truncate">
                            {analysisResult.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Detected
                          </h4>
                          <Badge className={`text-xs flex-shrink-0 ${getPriorityColor(analysisResult.priority)}`}>
                            {analysisResult.priority?.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-green-700 dark:text-green-300 text-xs">
                          {(analysisResult.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Department Selection */}
            {capturedImage && selectedDepartment && (
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-900 dark:to-purple-950/30 border-purple-200/50 dark:border-purple-800/30 shadow-lg">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">Department Assignment</h3>
                    </div>
                    <div className="bg-purple-50/50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-purple-800 dark:text-purple-200 text-sm">
                            {selectedDepartment}
                          </p>
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            AI recommended department
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            Auto-Selected
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Description and Location - Compact Single Column */}
            {capturedImage && (
              <>
                {/* Description Section */}
                <motion.div variants={cardVariants}>
                  <Card className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/30 border-indigo-200/50 dark:border-indigo-800/30 shadow-lg">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <FileImage className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 text-sm">Describe the Issue</h3>
                      </div>
                      <Textarea
                        placeholder="Brief description (e.g., size, location, safety impact)..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white/50 dark:bg-slate-900/50 border-indigo-200/50 dark:border-indigo-800/50 focus:border-indigo-500 transition-colors rounded-xl resize-none"
                        rows={3}
                        minLength={10}
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {description.length}/500 chars
                        </span>
                        {description.length >= 10 && (
                          <span className="text-green-600 dark:text-green-400 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ready
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Location Section */}
                <motion.div variants={cardVariants}>
                  <Card className="bg-gradient-to-br from-white to-cyan-50/30 dark:from-slate-900 dark:to-cyan-950/30 border-cyan-200/50 dark:border-cyan-800/30 shadow-lg">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 text-sm">Location</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-9 bg-white/50 dark:bg-slate-900/50 border-cyan-200/50 dark:border-cyan-800/50 focus:border-cyan-500 transition-colors rounded-xl h-9 text-sm"
                            placeholder="Latitude, Longitude (auto-detected)"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={getCurrentLocation}
                          disabled={locationLoading}
                          className="px-2 h-9 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700 text-cyan-600 dark:text-cyan-400 rounded-xl"
                        >
                          {locationLoading ? (
                            <motion.div
                              className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <Locate className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}

            {/* Submit Section - Compact */}
            {capturedImage && (
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-300/50 dark:border-purple-800/50 shadow-xl">
                  <CardContent className="p-4">
                    {/* Progress indicators */}
                    <div className="flex items-center justify-center space-x-6 mb-4">
                      <div className={`flex items-center space-x-2 ${
                        capturedImage ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          capturedImage ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <CheckCircle className={`h-3 w-3 ${capturedImage ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-xs font-medium">Photo</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        analysisResult ? 'text-emerald-600' : processing ? 'text-blue-500' : 'text-gray-400'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          analysisResult ? 'bg-emerald-100 dark:bg-emerald-900/30' : processing ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          {processing ? (
                            <motion.div
                              className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <CheckCircle className={`h-3 w-3 ${analysisResult ? 'fill-current' : ''}`} />
                          )}
                        </div>
                        <span className="text-xs font-medium">AI Analysis</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        description.length >= 10 ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          description.length >= 10 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <CheckCircle className={`h-3 w-3 ${description.length >= 10 ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-xs font-medium">Description</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        selectedDepartment ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          selectedDepartment ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <CheckCircle className={`h-3 w-3 ${selectedDepartment ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-xs font-medium">Department</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleSubmit}
                      disabled={!description.trim() || description.length < 10 || !selectedDepartment || !analysisResult}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl h-12 font-semibold rounded-2xl transition-all duration-200 mb-2"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {!analysisResult
                        ? 'Waiting for AI Analysis...' 
                        : !description.trim() || description.length < 10
                        ? 'Add Description to Submit'
                        : !selectedDepartment
                        ? 'Waiting for Department Assignment...'
                        : `Submit to ${selectedDepartment}`
                      }
                    </Button>
                    
                    <p className="text-xs text-center text-blue-600/70 dark:text-blue-400/70">
                      Your report will be sent to the relevant authorities
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}