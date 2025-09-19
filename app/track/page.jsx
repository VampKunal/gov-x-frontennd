"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle, AlertCircle, XCircle, MapPin, Calendar, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Mock data for user's problems
const mockUserProblems = [
  {
    id: 1,
    title: "Major pothole on my daily route",
    description: "Large pothole near the traffic signal has been causing accidents and vehicle damage.",
    category: "Pothole",
    department: "Municipal Corporation",
    location: "MG Road, Sector 14, Gurgaon",
    image: "/api/placeholder/400/300",
    status: "In Progress",
    priority: "High",
    submittedDate: "2024-01-15",
    lastUpdate: "2024-01-18",
    trackingId: "GGN2024001",
    estimatedCompletion: "2024-01-25",
    progress: 60,
    assignedDept: "Road Maintenance Division",
    assignedOfficer: "Ramesh Singh (ID: 1234)"
  },
  {
    id: 2,
    title: "Overflowing garbage bins causing hygiene issues",
    description: "Garbage bins at the main bus stop have been overflowing for days.",
    category: "Garbage",
    department: "Municipal Corporation",
    location: "Bus Stop, Connaught Place, Delhi",
    image: "/api/placeholder/400/300",
    status: "Resolved",
    priority: "Medium",
    submittedDate: "2024-01-10",
    lastUpdate: "2024-01-16",
    trackingId: "DEL2024087",
    estimatedCompletion: "2024-01-16",
    progress: 100,
    assignedDept: "Sanitation Department",
    assignedOfficer: "Sunita Devi (ID: 5678)",
    resolvedDate: "2024-01-16"
  },
  {
    id: 3,
    title: "Street light not working - safety concern",
    description: "The street light hasn't been working for 3 weeks, making it unsafe for pedestrians.",
    category: "Street Light",
    department: "Electricity Board",
    location: "Park Street, Kolkata",
    image: "/api/placeholder/400/300",
    status: "Pending",
    priority: "High",
    submittedDate: "2024-01-12",
    lastUpdate: "2024-01-12",
    trackingId: "KOL2024156",
    estimatedCompletion: "2024-01-22",
    progress: 10,
    assignedDept: "Street Lighting Division",
    assignedOfficer: "Pending Assignment"
  },
  {
    id: 4,
    title: "Water logging during monsoon",
    description: "Area gets completely flooded due to poor drainage system.",
    category: "Drainage",
    department: "PWD",
    location: "Bandra West, Mumbai",
    image: "/api/placeholder/400/300",
    status: "Under Review",
    priority: "Low",
    submittedDate: "2024-01-05",
    lastUpdate: "2024-01-14",
    trackingId: "MUM2024234",
    estimatedCompletion: "2024-02-05",
    progress: 25,
    assignedDept: "Drainage Division",
    assignedOfficer: "Anil Kumar (ID: 9012)"
  },
  {
    id: 5,
    title: "Broken road barrier - safety hazard",
    description: "Road barrier is broken and vehicles are taking dangerous shortcuts.",
    category: "Road",
    department: "Traffic Police",
    location: "ORR, Hyderabad",
    image: "/api/placeholder/400/300",
    status: "Rejected",
    priority: "Medium",
    submittedDate: "2024-01-01",
    lastUpdate: "2024-01-08",
    trackingId: "HYD2024011",
    progress: 0,
    assignedDept: "Traffic Management",
    assignedOfficer: "N/A",
    rejectionReason: "Issue falls under Highway Authority jurisdiction"
  }
]

const getPriorityColor = (priority) => {
  const colors = {
    "High": "text-red-400",
    "Medium": "text-yellow-400",
    "Low": "text-green-400"
  }
  return colors[priority] || "text-gray-400"
}

function ProblemSummaryCard({ problem, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
      onClick={() => onClick(problem)}
    >
      <Card className="glass border-border/50 hover:border-border transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-foreground truncate">{problem.title}</h3>
                <StatusBadge status={problem.status} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {problem.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {problem.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {problem.submittedDate}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">ID: {problem.trackingId}</div>
              <Badge variant="outline" className={getPriorityColor(problem.priority)}>
                {problem.priority} Priority
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{problem.progress}%</span>
            </div>
            <Progress value={problem.progress} className="h-2" />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Last Update: {problem.lastUpdate}</span>
              {problem.status !== "Rejected" && problem.estimatedCompletion && (
                <span>ETA: {problem.estimatedCompletion}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function TrackPage() {
  const [problems, setProblems] = useState(mockUserProblems)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProblem, setSelectedProblem] = useState(null)

  const statusFilters = ["All", "Pending", "Under Review", "In Progress", "Resolved", "Rejected"]
  
  const filteredProblems = problems.filter(problem => {
    const matchesStatus = selectedStatus === "All" || problem.status === selectedStatus
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: problems.length,
    pending: problems.filter(p => p.status === "Pending").length,
    inProgress: problems.filter(p => p.status === "In Progress").length,
    resolved: problems.filter(p => p.status === "Resolved").length,
    rejected: problems.filter(p => p.status === "Rejected").length
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
            📋 Track My Problems
          </h1>
          <p className="text-muted-foreground">
            Monitor the progress of your submitted civic issues
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Issues</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
                <div className="text-xs text-muted-foreground">Resolved</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statusFilters.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="whitespace-nowrap"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <ProblemSummaryCard
              key={problem.id}
              problem={problem}
              onClick={(problem) => {
                // Navigate to problem detail page
                window.location.href = `/problems/${problem.id}`
              }}
            />
          ))}

          {filteredProblems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">No issues found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedStatus !== "All" 
                  ? "Try adjusting your search or filters"
                  : "You haven't submitted any issues yet"
                }
              </p>
              {!searchQuery && selectedStatus === "All" && (
                <Button
                  onClick={() => window.location.href = "/feed"}
                  className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600"
                >
                  📤 Report Your First Issue
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}