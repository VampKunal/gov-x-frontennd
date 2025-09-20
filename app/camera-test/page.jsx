"use client"

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function CameraTestPage() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState('')
  const [capturedImage, setCapturedImage] = useState(null)

  const startCamera = async () => {
    try {
      setError('')
      console.log('Starting camera...')
      
      // Check if running on HTTPS or localhost (required for camera access)
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
          width: { ideal: 640 }, 
          height: { ideal: 480 } 
        } 
      }
      
      console.log('Requesting camera permission...')
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Got stream:', stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Metadata loaded - dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
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

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      
      const imageData = canvas.toDataURL('image/png')
      setCapturedImage(imageData)
      console.log('Photo captured!')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Camera Test</h1>
      
      {error && (
        <div className="bg-red-900 text-white p-4 rounded mb-4">
          <div className="font-bold mb-2">Camera Error:</div>
          <div className="mb-3">{error}</div>
          
          {error.includes('permission') && (
            <div className="text-sm bg-red-800 p-3 rounded">
              <div className="font-semibold mb-2">To fix this:</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Look for a camera icon 📷 or lock icon 🔒 in your address bar</li>
                <li>Click it and select "Allow" for camera</li>
                <li>Refresh this page and try again</li>
              </ol>
              <div className="mt-2 text-xs text-red-200">
                URL: {window.location.href}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          {!isStreaming ? (
            <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
              Start Camera
            </Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                📸 Capture
              </Button>
              <Button onClick={stopCamera} className="bg-red-600 hover:bg-red-700">
                Stop Camera
              </Button>
            </div>
          )}
        </div>
        
        <div className="border border-gray-600 p-4">
          <h3 className="text-lg mb-2">Live Preview:</h3>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-md border border-gray-500"
            style={{ maxHeight: '400px' }}
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        {capturedImage && (
          <div className="border border-gray-600 p-4">
            <h3 className="text-lg mb-2">Captured Photo:</h3>
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full max-w-md border border-gray-500"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}