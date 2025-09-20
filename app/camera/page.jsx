"use client"

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Camera,
  X,
  RotateCcw,
  Zap,
  Check,
  RefreshCw,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CameraPage() {
  const router = useRouter()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState('')
  const [capturedImage, setCapturedImage] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    // Auto-start camera when page loads
    startCamera()
    
    // Cleanup on unmount
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setError('')
      console.log('Starting camera...')
      
      // Check if running on HTTPS or localhost
      const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost'
      if (!isSecureContext) {
        throw new Error('Camera requires HTTPS or localhost')
      }
      
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser')
      }
      
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'environment' // Try to use back camera
        }
      }
      
      console.log('Requesting camera permission...')
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Got stream:', stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded - dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
          videoRef.current.play()
        }
        
        videoRef.current.onplay = () => {
          console.log('Video started playing')
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      let userFriendlyError = err.message
      
      if (err.name === 'NotAllowedError') {
        userFriendlyError = 'Camera permission denied. Please allow camera access and try again.'
      } else if (err.name === 'NotFoundError') {
        userFriendlyError = 'No camera found. Please connect a camera and try again.'
      } else if (err.name === 'NotReadableError') {
        userFriendlyError = 'Camera is being used by another application.'
      }
      
      setError(userFriendlyError)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
  }

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true)
      
      // Add a small delay for animation
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob)
          setCapturedImage(imageUrl)
          setShowPreview(true)
          setIsCapturing(false)
          toast.success('Photo captured!')
        }
      }, 'image/jpeg', 0.9)
    }
  }

  const retakePhoto = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
    }
    setCapturedImage(null)
    setShowPreview(false)
  }

  const usePhoto = () => {
    if (capturedImage) {
      // Store the image in sessionStorage to pass to the report page
      sessionStorage.setItem('capturedImage', capturedImage)
      toast.success('Photo selected! Redirecting...')
      
      setTimeout(() => {
        router.push('/report?image=captured')
      }, 1000)
    }
  }

  const goBack = () => {
    stopCamera()
    router.push('/report')
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Camera Stream or Error */}
      <div className="relative w-full h-full">
        {error ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center p-8 max-w-md">
              <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">Camera Error</p>
              <p className="text-sm text-gray-300 mb-4">{error}</p>
              
              {error.includes('permission') && (
                <div className="text-xs bg-gray-800 p-3 rounded mb-4 text-left">
                  <div className="font-semibold mb-2">To fix camera permission:</div>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Look for camera 📷 or lock 🔒 icon in address bar</li>
                    <li>Click it and select "Allow" for camera</li>
                    <li>Click "Try Again" below</li>
                  </ol>
                </div>
              )}
              
              <div className="space-y-2">
                <Button 
                  onClick={startCamera}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={goBack}
                  variant="outline"
                  className="bg-gray-700 hover:bg-gray-600 border-gray-600 w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera Flash Effect */}
            <AnimatePresence>
              {isCapturing && (
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Grid Lines for Composition */}
              <div className="absolute inset-8">
                <div className="w-full h-full relative border border-white/20 rounded-lg">
                  {/* Rule of thirds lines */}
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20"></div>
                  <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white/20"></div>
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20"></div>
                  <div className="absolute right-1/3 top-0 bottom-0 w-px bg-white/20"></div>
                </div>
              </div>
              
              {/* Focus Point */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-white/60 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
          <motion.button
            onClick={goBack}
            className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
          
          <div className="text-white text-center">
            <h1 className="font-semibold">Take a Photo</h1>
            <p className="text-xs text-white/70">Position your issue in the frame</p>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      {!error && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              {/* Gallery Button */}
              <motion.button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const imageUrl = URL.createObjectURL(file)
                      setCapturedImage(imageUrl)
                      setShowPreview(true)
                    }
                  }
                  input.click()
                }}
                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ImageIcon className="h-6 w-6 text-white" />
              </motion.button>

              {/* Capture Button */}
              <motion.button
                onClick={capturePhoto}
                disabled={!isStreaming || isCapturing}
                className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isCapturing ? { scale: [1, 0.9, 1] } : {}}
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center">
                  {isCapturing ? (
                    <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="h-8 w-8 text-gray-600" />
                  )}
                </div>
              </motion.button>

              {/* Settings/Switch Camera Button */}
              <motion.button
                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="h-6 w-6 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {showPreview && capturedImage && (
          <motion.div
            className="absolute inset-0 bg-black z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full h-full">
              {/* Preview Image */}
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              
              {/* Preview Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-center space-x-4">
                  <motion.button
                    onClick={retakePhoto}
                    className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="h-5 w-5" />
                    <span>Retake</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={usePhoto}
                    className="flex items-center space-x-2 px-8 py-3 bg-blue-600 rounded-full text-white font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Check className="h-5 w-5" />
                    <span>Use Photo</span>
                  </motion.button>
                </div>
              </div>
              
              {/* Preview Header */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                <div className="text-center text-white">
                  <h2 className="font-semibold">Photo Preview</h2>
                  <p className="text-xs text-white/70">Review your capture</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}