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
  Shield
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
  const [priority, setPriority] = useState('medium')
  const [locationLoading, setLocationLoading] = useState(false)
  const [confidence, setConfidence] = useState(0)
  
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
      
      // Mock reverse geocoding (in real app, use a geocoding service)
      const mockAddress = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`
      setLocation(mockAddress)
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
    setProcessing(false)
  }

  // Submit report
  const handleSubmit = async () => {
    if (!capturedImage) {
      toast.error('Please capture or upload an image')
      return
    }
    
    if (!description.trim()) {
      toast.error('Please provide a description')
      return
    }
    
    if (description.trim().length < 20) {
      toast.error('Description must be at least 20 characters long')
      return
    }
    
    if (!location.trim()) {
      toast.error('Please provide a location')
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
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
            {/* Camera/Upload Section - Large Bento Card */}
            <motion.div variants={cardVariants} className="lg:col-span-2 lg:row-span-2">
              <Card className="h-full bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-950/30 border-blue-200/50 dark:border-blue-800/30 shadow-xl">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Capture Issue</h2>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Take or upload a photo of the problem</p>
                    </div>
                  </div>
                  
                  {!capturedImage ? (
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-2xl p-8 text-center bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
                            <Camera className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">Ready to Report?</h3>
                            <p className="text-blue-600 dark:text-blue-400 mt-2 max-w-md">
                              Capture a clear photo showing the issue. Good lighting and multiple angles help authorities respond faster.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <Button 
                          onClick={handleCameraClick}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white h-12 rounded-xl shadow-lg"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Use Camera
                        </Button>
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline" 
                          className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-12 rounded-xl"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Upload File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="relative mb-4">
                        <img
                          src={capturedImage.url}
                          alt="Captured issue"
                          className="w-full h-64 object-cover rounded-2xl border border-blue-200/50 dark:border-blue-800/50"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {!analysisResult && !processing && (
                        <Button 
                          onClick={analyzeImage} 
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white h-12 rounded-xl shadow-lg"
                        >
                          <Zap className="h-5 w-5 mr-2" />
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
          
          {/* Quick Tips - Side Panel */}
          <motion.div variants={cardVariants}>
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200/50 dark:border-purple-800/30 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">Quick Tips</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-purple-700 dark:text-purple-300">Take photos in good lighting</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-purple-700 dark:text-purple-300">Show the full scope of the problem</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-purple-700 dark:text-purple-300">Include nearby landmarks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Progress Stats - Side Panel */}
          <motion.div variants={cardVariants}>
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200/50 dark:border-emerald-800/30 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Your Impact</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">Reports Made</span>
                    <span className="font-semibold text-emerald-900 dark:text-emerald-100">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">Issues Resolved</span>
                    <span className="font-semibold text-emerald-900 dark:text-emerald-100">8</span>
                  </div>
                  <div className="w-full bg-emerald-200 dark:bg-emerald-900/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full" style={{width: '67%'}}></div>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">67% resolution rate</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          </div>
          
          {/* AI Analysis Processing - Full Width */}
          {processing && (
            <motion.div variants={cardVariants}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                      <div 
                        className="absolute inset-0 border-4 border-blue-500 rounded-full transition-all duration-300 ease-out"
                        style={{
                          clipPath: `inset(0 ${100 - confidence}% 0 0)`,
                          transform: 'rotate(-90deg)'
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="h-5 w-5 text-blue-500 animate-pulse" />
                        <p className="font-medium text-foreground">AI Analysis in Progress</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Advanced AI is detecting issue type and determining priority level</p>
                      
                      {/* Progress bar */}
                      <div className="w-full max-w-xs mx-auto">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${confidence}%` }}
                          ></div>
                        </div>
                      </div>
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

          {/* Description and Location - Full Width */}
          {capturedImage && (
            <motion.div variants={cardVariants} className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/30 border-indigo-200/50 dark:border-indigo-800/30 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-100">
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
                      placeholder="Please describe the issue in detail... (e.g., size, location, safety impact)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                      rows={4}
                      minLength={20}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {description.length}/500 characters • Minimum 20 characters required
                    </p>
                  </div>
                  
                  {/* Priority Selector */}
                  {!analysisResult && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'low', label: 'Low', color: 'green', description: 'Minor issue' },
                          { value: 'medium', label: 'Medium', color: 'yellow', description: 'Needs attention' },
                          { value: 'high', label: 'High', color: 'red', description: 'Urgent issue' }
                        ].map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => setPriority(level.value)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              priority === level.value
                                ? `border-${level.color}-500 bg-${level.color}-50 dark:bg-${level.color}-900/20`
                                : 'border-border/50 hover:border-border/80'
                            }`}
                          >
                            <div className={`text-sm font-medium ${
                              priority === level.value ? `text-${level.color}-700 dark:text-${level.color}-300` : 'text-foreground'
                            }`}>
                              {level.label}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {level.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  </CardContent>
                </Card>
                
                {/* Location Card */}
                <Card className="bg-gradient-to-br from-white to-cyan-50/30 dark:from-slate-900 dark:to-cyan-950/30 border-cyan-200/50 dark:border-cyan-800/30 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-cyan-900 dark:text-cyan-100">
                      <MapPin className="h-5 w-5" />
                      <span>Location</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10 bg-white/50 dark:bg-slate-900/50 border-cyan-200/50 dark:border-cyan-800/50 focus:border-cyan-500 transition-colors rounded-xl"
                          placeholder="Enter location or detect automatically..."
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className="px-3 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700 text-cyan-600 dark:text-cyan-400 rounded-xl"
                      >
                        {locationLoading ? (
                          <motion.div
                            className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <Locate className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-start space-x-2 text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/20 p-3 rounded-xl">
                      <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>Your location data is kept private and only used for reporting purposes</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Submit Section */}
          {capturedImage && (
            <motion.div variants={cardVariants} className="mt-8">
              <Card className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-300/50 dark:border-purple-800/50 shadow-xl">
                <CardContent className="p-6">
                  <div className="text-center space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Ready to Submit?</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Review your report and help make your community better</p>
                    </div>
                    
                    {/* Form completion indicator */}
                    <div className="flex items-center justify-center space-x-6">
                      <div className={`flex flex-col items-center space-y-2 ${
                        capturedImage ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          capturedImage ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <CheckCircle className={`h-4 w-4 ${capturedImage ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-xs font-medium">Photo</span>
                      </div>
                      <div className={`flex flex-col items-center space-y-2 ${
                        description.length >= 20 ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          description.length >= 20 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <CheckCircle className={`h-4 w-4 ${description.length >= 20 ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-xs font-medium">Details</span>
                      </div>
                      <div className={`flex flex-col items-center space-y-2 ${
                        location.trim() ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          location.trim() ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <CheckCircle className={`h-4 w-4 ${location.trim() ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-xs font-medium">Location</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleSubmit}
                      disabled={!description.trim() || description.length < 20 || !location.trim()}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl h-14 text-lg font-semibold rounded-2xl transition-all duration-200"
                    >
                      <Send className="h-5 w-5 mr-3" />
                      {!description.trim() || description.length < 20 || !location.trim() 
                        ? 'Complete All Fields to Submit' 
                        : 'Submit Report to Authorities'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}