"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, X, MapPin, Sparkles, Building2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"

// Department and issue type data
const DEPARTMENTS = [
  { id: "municipal", name: "Municipal Corporation", icon: "🏛️", description: "Garbage, sanitation, roads, parks" },
  { id: "pwd", name: "Public Works Department (PWD)", icon: "🚧", description: "Road construction, bridges, drainage" },
  { id: "electricity", name: "Electricity Board", icon: "⚡", description: "Power outages, street lights, cables" },
  { id: "water", name: "Water Department", icon: "💧", description: "Water supply, pipelines, sewage" },
  { id: "traffic", name: "Traffic Police", icon: "🚦", description: "Traffic signals, road safety" },
  { id: "fire", name: "Fire Department", icon: "🚒", description: "Fire safety, emergency response" },
  { id: "health", name: "Health Department", icon: "🏥", description: "Public health, sanitation" },
  { id: "forest", name: "Forest Department", icon: "🌳", description: "Trees, parks, green spaces" }
]

const ISSUE_TYPES = {
  municipal: [
    { id: "pothole", name: "Pothole", icon: "🕳️", priority: "high" },
    { id: "garbage", name: "Garbage Collection", icon: "🗑️", priority: "medium" },
    { id: "road_damage", name: "Road Damage", icon: "🛣️", priority: "high" },
    { id: "park_maintenance", name: "Park Maintenance", icon: "🏞️", priority: "low" }
  ],
  pwd: [
    { id: "drainage", name: "Drainage Issues", icon: "🌊", priority: "high" },
    { id: "bridge_repair", name: "Bridge Repair", icon: "🌉", priority: "high" },
    { id: "construction", name: "Construction Issues", icon: "🏗️", priority: "medium" }
  ],
  electricity: [
    { id: "power_outage", name: "Power Outage", icon: "🔌", priority: "high" },
    { id: "street_light", name: "Street Light", icon: "💡", priority: "medium" },
    { id: "cable_damage", name: "Cable Damage", icon: "⚡", priority: "high" }
  ],
  water: [
    { id: "water_shortage", name: "Water Shortage", icon: "🚰", priority: "high" },
    { id: "pipe_leakage", name: "Pipe Leakage", icon: "💧", priority: "medium" },
    { id: "sewage", name: "Sewage Issues", icon: "🚱", priority: "high" }
  ],
  traffic: [
    { id: "traffic_signal", name: "Traffic Signal", icon: "🚦", priority: "high" },
    { id: "road_safety", name: "Road Safety", icon: "⚠️", priority: "high" },
    { id: "parking", name: "Parking Issues", icon: "🚗", priority: "low" }
  ],
  fire: [
    { id: "fire_safety", name: "Fire Safety", icon: "🔥", priority: "high" },
    { id: "emergency_access", name: "Emergency Access", icon: "🚨", priority: "high" }
  ],
  health: [
    { id: "public_health", name: "Public Health", icon: "🏥", priority: "high" },
    { id: "sanitation", name: "Sanitation", icon: "🧽", priority: "medium" }
  ],
  forest: [
    { id: "tree_cutting", name: "Illegal Tree Cutting", icon: "🪓", priority: "high" },
    { id: "park_damage", name: "Park Damage", icon: "🌳", priority: "medium" }
  ]
}

export function NewPostModal({ isOpen, onClose, onSubmit }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResults, setAiResults] = useState(null)
  const [userTitle, setUserTitle] = useState("")
  const [userDescription, setUserDescription] = useState("")
  const [location, setLocation] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedIssueType, setSelectedIssueType] = useState("")
  const [priority, setPriority] = useState("medium")
  
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const mockAIAnalysis = [
    {
      title: "Large pothole detected on main road",
      description: "AI detected a significant pothole approximately 2 feet in diameter. The surrounding road surface shows signs of wear and may require maintenance. Location appears to be on a busy road with regular traffic.",
      department: "municipal",
      issueType: "pothole",
      priority: "high",
      confidence: 94
    },
    {
      title: "Overflowing garbage collection point",
      description: "Waste management issue detected. Multiple garbage bags and scattered waste visible around collection point. Appears to be affecting pedestrian access and creating hygiene concerns.",
      department: "municipal",
      issueType: "garbage",
      priority: "medium",
      confidence: 89
    },
    {
      title: "Non-functional street lighting",
      description: "Street light infrastructure detected but appears to be non-operational. Area looks poorly lit which could affect pedestrian safety during night hours.",
      department: "electricity",
      issueType: "street_light",
      priority: "medium",
      confidence: 91
    },
    {
      title: "Water accumulation and drainage issue",
      description: "Standing water detected suggesting inadequate drainage. Road surface appears to have poor water runoff capability which could lead to water logging during heavy rainfall.",
      department: "pwd",
      issueType: "drainage",
      priority: "high",
      confidence: 87
    },
    {
      title: "Traffic signal malfunction detected",
      description: "Traffic light appears to be non-functional or showing incorrect signals. This could lead to traffic congestion and safety hazards during peak hours.",
      department: "traffic",
      issueType: "traffic_signal",
      priority: "high",
      confidence: 92
    },
    {
      title: "Water pipe leakage causing road damage",
      description: "Visible water leakage from underground pipes causing road surface damage and water wastage. Area shows signs of continuous water flow.",
      department: "water",
      issueType: "pipe_leakage",
      priority: "high",
      confidence: 88
    }
  ]

  const handleImageUpload = (file, source = "gallery") => {
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage({ url: imageUrl, file, source })
      simulateAIAnalysis()
    }
  }

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const randomAnalysis = mockAIAnalysis[Math.floor(Math.random() * mockAIAnalysis.length)]
      setAiResults(randomAnalysis)
      setUserTitle(randomAnalysis.title)
      setUserDescription(randomAnalysis.description)
      setSelectedDepartment(randomAnalysis.department)
      setSelectedIssueType(randomAnalysis.issueType)
      setPriority(randomAnalysis.priority)
      setIsAnalyzing(false)
    }, 2500)
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding
          const mockLocations = [
            "MG Road, Sector 14, Gurgaon, Haryana",
            "Connaught Place, New Delhi",
            "Park Street, Kolkata, West Bengal",
            "Bandra West, Mumbai, Maharashtra",
            "Commercial Street, Bangalore, Karnataka"
          ]
          const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)]
          setLocation(randomLocation)
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Location error:", error)
          setLocation("Location not available")
          setIsGettingLocation(false)
        }
      )
    } else {
      setLocation("Geolocation not supported")
      setIsGettingLocation(false)
    }
  }

  const handleSubmit = () => {
    if (!selectedImage || (!selectedDepartment || !selectedIssueType)) return

    const selectedDept = DEPARTMENTS.find(d => d.id === selectedDepartment)
    const selectedIssue = ISSUE_TYPES[selectedDepartment]?.find(i => i.id === selectedIssueType)

    const postData = {
      title: userTitle || aiResults?.title || "Civic Issue Report",
      description: userDescription || aiResults?.description || "No description provided",
      category: selectedIssue?.name || "General Issue",
      department: selectedDept?.name || "Unknown Department",
      location: location,
      image: selectedImage.url,
      confidence: aiResults?.confidence || 85,
      priority: priority,
      issueType: selectedIssue?.id || "general",
      departmentId: selectedDepartment
    }

    onSubmit?.(postData)
    handleClose()
  }

  const handleClose = () => {
    setSelectedImage(null)
    setIsAnalyzing(false)
    setAiResults(null)
    setUserTitle("")
    setUserDescription("")
    setLocation("")
    setSelectedDepartment("")
    setSelectedIssueType("")
    setPriority("medium")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass max-w-3xl max-h-[95vh] overflow-y-auto mobile-spacing">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            🚨 Report Civic Issue
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              New Enhanced
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Take a photo, let AI analyze it, and select the appropriate department for faster resolution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">📷 Capture or Upload Photo</Label>
            
            {!selectedImage ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Camera Capture */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-dashed border-border rounded-xl p-6 md:p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer touch-target mobile-card"
                  onClick={handleCameraCapture}
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-sm font-semibold mb-2 text-foreground">📱 Open Camera</div>
                  <div className="text-xs text-muted-foreground">
                    Take photo directly with your camera
                  </div>
                </motion.div>

                {/* File Upload */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-dashed border-border rounded-xl p-6 md:p-8 text-center hover:border-success/50 hover:bg-success/5 transition-all cursor-pointer touch-target mobile-card"
                  onClick={handleFileSelect}
                >
                  <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-success" />
                  </div>
                  <div className="text-sm font-semibold mb-2 text-foreground">📁 Choose File</div>
                  <div className="text-xs text-muted-foreground">
                    From gallery or device files
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={selectedImage.url} 
                  alt="Selected issue" 
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null)
                    setAiResults(null)
                    setIsAnalyzing(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    📷 {selectedImage.source === "camera" ? "Camera" : "Gallery"}
                  </Badge>
                </div>
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleImageUpload(e.target.files[0], "camera")}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], "gallery")}
              className="hidden"
            />
          </div>

          {/* AI Analysis Results */}
          <AnimatePresence>
            {(isAnalyzing || aiResults) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sparkles className="h-5 w-5 text-orange-400" />
                      <span className="font-medium">🤖 AI Analysis</span>
                      {isAnalyzing && (
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                    
                    {isAnalyzing ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <div className="text-sm text-muted-foreground">
                            🔍 Analyzing image for civic issues...
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">
                          🎯 Detecting issue type and severity...
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">
                          🏦 Identifying responsible department...
                        </div>
                      </div>
                    ) : aiResults && (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {ISSUE_TYPES[aiResults.department]?.find(i => i.id === aiResults.issueType)?.name || "Issue"}
                          </Badge>
                          <Badge variant="outline" className="border-success/30 text-success">
                            {DEPARTMENTS.find(d => d.id === aiResults.department)?.name || "Department"}
                          </Badge>
                          <Badge variant="outline" className="border-info/30 text-info">
                            ✅ {aiResults.confidence}% Confidence
                          </Badge>
                          <Badge variant="outline" className={`${
                            aiResults.priority === 'high' ? 'border-destructive/30 text-destructive' :
                            aiResults.priority === 'medium' ? 'border-warning/30 text-warning' :
                            'border-muted-foreground/30 text-muted-foreground'
                          }`}>
                            {aiResults.priority === 'high' ? '⚠️ High Priority' :
                             aiResults.priority === 'medium' ? '🟡 Medium Priority' :
                             '🟢 Low Priority'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="ai-title" className="text-sm font-medium text-foreground">
                              Generated Title
                            </Label>
                            <Input
                              id="ai-title"
                              value={userTitle}
                              onChange={(e) => setUserTitle(e.target.value)}
                              className="mt-2"
                              placeholder="Edit the generated title..."
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="ai-description" className="text-sm font-medium text-foreground">
                              AI Description
                            </Label>
                            <Textarea
                              id="ai-description"
                              value={userDescription}
                              onChange={(e) => setUserDescription(e.target.value)}
                              className="mt-2 min-h-[100px]"
                              placeholder="Edit or add to the AI description..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Department & Issue Type Selection */}
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 border-t border-border/50 pt-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold text-foreground">🏛️ Select Department & Issue Type</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">🏦 Responsible Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-full touch-target">
                      <SelectValue placeholder="Select department..." />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id} className="py-3">
                          <div className="flex items-start gap-3">
                            <span className="text-lg">{dept.icon}</span>
                            <div>
                              <div className="font-medium">{dept.name}</div>
                              <div className="text-xs text-muted-foreground">{dept.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Issue Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">📝 Issue Type</Label>
                  <Select 
                    value={selectedIssueType} 
                    onValueChange={(value) => {
                      setSelectedIssueType(value)
                      const issue = ISSUE_TYPES[selectedDepartment]?.find(i => i.id === value)
                      if (issue) setPriority(issue.priority)
                    }}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger className="w-full touch-target">
                      <SelectValue placeholder={selectedDepartment ? "Select issue type..." : "Select department first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDepartment && ISSUE_TYPES[selectedDepartment]?.map((issue) => (
                        <SelectItem key={issue.id} value={issue.id} className="py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{issue.icon}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{issue.name}</span>
                              <Badge variant="outline" size="sm" className={`text-xs ${
                                issue.priority === 'high' ? 'border-destructive/30 text-destructive' :
                                issue.priority === 'medium' ? 'border-warning/30 text-warning' :
                                'border-success/30 text-success'
                              }`}>
                                {issue.priority}
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Priority Indicator */}
              {selectedIssueType && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                >
                  <AlertTriangle className={`h-4 w-4 ${
                    priority === 'high' ? 'text-destructive' :
                    priority === 'medium' ? 'text-warning' :
                    'text-success'
                  }`} />
                  <span className="text-sm font-medium">
                    Priority Level: 
                    <span className={`ml-1 ${
                      priority === 'high' ? 'text-destructive' :
                      priority === 'medium' ? 'text-warning' :
                      'text-success'
                    }`}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Location Section */}
          {(selectedImage && selectedDepartment) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Label className="text-sm font-medium text-foreground">📍 Location Details</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location or get current location"
                  className="flex-1 touch-target"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex items-center gap-2 touch-target"
                >
                  {isGettingLocation ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>{isGettingLocation ? "Getting..." : "Current"}</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border/50">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="touch-target"
            >
              ❌ Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedImage || !selectedDepartment || !selectedIssueType || isAnalyzing}
              className="bg-primary hover:bg-primary/90 touch-target"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  📤 Submit Civic Report
                </>
              )}
            </Button>
          </div>

          {/* Helper Text */}
          {selectedImage && (!selectedDepartment || !selectedIssueType) && (
            <div className="text-center text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              📝 Please select both department and issue type to submit your report
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}