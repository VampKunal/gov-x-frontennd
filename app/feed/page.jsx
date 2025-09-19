"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Filter, Search, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProblemCard } from "@/components/ui/problem-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { NewPostModal } from "@/components/ui/new-post-modal"
import { useAuth } from "@/hooks/use-auth"

// Mock data
const mockProblems = [
  {
    id: 1,
    title: "Major pothole causing accidents on MG Road",
    description: "Large pothole near the traffic signal has been causing accidents and vehicle damage. Multiple bikes have fallen into it during rain. Urgent repair needed before more accidents occur.",
    category: "Pothole",
    department: "Municipal Corporation", 
    location: "MG Road, Sector 14, Gurgaon",
    image: "/placeholder.jpg",
    user: {
      name: "Rajesh Kumar",
      avatar: "/placeholder-user.jpg"
    },
    timestamp: "2 hours ago",
    likes: 34,
    comments: 12,
    reposts: 8,
    status: "Pending",
    isLiked: false,
    isReposted: false,
    isTracked: true
  },
  {
    id: 2,
    title: "Overflowing garbage bins at bus stop",
    description: "Garbage bins at the main bus stop have been overflowing for days. This is creating hygiene issues and bad smell. Stray dogs are also spreading garbage around.",
    category: "Garbage",
    department: "Municipal Corporation",
    location: "Bus Stop, Connaught Place, Delhi",
    image: "/placeholder.jpg",
    user: {
      name: "Priya Singh",
      avatar: "/placeholder-user.jpg"
    },
    timestamp: "4 hours ago",
    likes: 28,
    comments: 9,
    reposts: 5,
    status: "In Progress",
    isLiked: true,
    isReposted: false,
    isTracked: false
  },
  {
    id: 3,
    title: "Street light not working for weeks",
    description: "The street light on this road hasn't been working for 3 weeks now. It's getting very dark and unsafe for pedestrians, especially women and children walking at night.",
    category: "Street Light",
    department: "Electricity Board",
    location: "Park Street, Kolkata",
    image: "/placeholder.jpg",
    user: {
      name: "Amit Sharma",
      avatar: "/placeholder-user.jpg"
    },
    timestamp: "6 hours ago",
    likes: 45,
    comments: 18,
    reposts: 12,
    status: "Under Review",
    isLiked: false,
    isReposted: true,
    isTracked: true
  },
  {
    id: 4,
    title: "Water logging during monsoon",
    description: "Every monsoon, this area gets completely flooded due to poor drainage. Cars get stuck and people have to walk through knee-deep water. Need proper drainage system.",
    category: "Drainage",
    department: "PWD",
    location: "Bandra West, Mumbai",
    image: "/placeholder.jpg",
    user: {
      name: "Sneha Patel",
      avatar: "/placeholder-user.jpg"
    },
    timestamp: "8 hours ago",
    likes: 67,
    comments: 24,
    reposts: 15,
    status: "Resolved",
    isLiked: true,
    isReposted: false,
    isTracked: false
  },
  {
    id: 5,
    title: "Broken road barrier causing safety hazard",
    description: "The road barrier here is completely broken and vehicles are taking dangerous shortcuts. This could lead to serious accidents especially during rush hours.",
    category: "Road",
    department: "Traffic Police",
    location: "ORR, Hyderabad",
    image: "/api/placeholder/600/400",
    user: {
      name: "Mohammed Ali",
      avatar: "/api/placeholder/40/40"
    },
    timestamp: "12 hours ago",
    likes: 23,
    comments: 7,
    reposts: 3,
    status: "Pending",
    isLiked: false,
    isReposted: false,
    isTracked: true
  }
]

const trendingTopics = [
  { tag: "#PotholeAlert", count: "2.1K posts" },
  { tag: "#MumbaiRains", count: "845 posts" },
  { tag: "#DelhiTraffic", count: "567 posts" },
  { tag: "#StreetLights", count: "234 posts" },
  { tag: "#WaterLogging", count: "189 posts" }
]


export default function FeedPage() {
  const [problems, setProblems] = useState(mockProblems)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [isNewPostOpen, setIsNewPostOpen] = useState(false)
  const searchParams = useSearchParams()
  const { user } = useAuth()

  // Auto-open modal if coming from dashboard
  useEffect(() => {
    if (searchParams?.get('modal') === 'new') {
      setIsNewPostOpen(true)
      // Clean up URL without causing re-render
      window.history.replaceState({}, '', '/feed')
    }
  }, [searchParams])

  const handleNewPostSubmit = (postData) => {
    console.log('New post submitted:', postData)
    
    // Create new post object
    const newPost = {
      id: Date.now(), // Simple ID generation
      title: postData.title,
      description: postData.description,
      category: postData.category,
      department: postData.department,
      location: postData.location || "Location not provided",
      image: postData.image,
      user: {
        name: user?.displayName || user?.email?.split('@')[0] || "Anonymous",
        avatar: user?.photoURL || "/api/placeholder/40/40"
      },
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      reposts: 0,
      status: "Pending",
      isLiked: false,
      isReposted: false,
      isTracked: true
    }
    
    // Add new post to beginning of problems array
    setProblems(prevProblems => [newPost, ...prevProblems])
    
    // Close modal
    setIsNewPostOpen(false)
    
    console.log('Post added to feed:', newPost)
  }

  const filters = ["All", "Pothole", "Garbage", "Street Light", "Water", "Traffic", "Road", "Drainage"]

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "All" || problem.category === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              🇮🇳 Community Issues Feed
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              Stay updated on civic issues in your area and across India
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="px-2 sm:px-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues, locations, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border touch-target h-12"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 px-2 sm:px-0 scrollbar-hide">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="whitespace-nowrap touch-target min-w-fit"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onClick={(problem) => {
                  // Navigate to problem detail page
                  window.location.href = `/problems/${problem.id}`
                }}
              />
            ))}
            
            {filteredProblems.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-base sm:text-lg font-medium mb-2">No issues found</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Trending */}
            <Card className="glass border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                  <h3 className="font-semibold">Trending in India</h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <motion.div
                      key={index}
                      className="p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <div className="font-medium text-sm text-orange-400">{topic.tag}</div>
                      <div className="text-xs text-muted-foreground">{topic.count}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass border-border/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Today's Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">New Reports</span>
                    <span className="font-medium text-orange-400">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Resolved Issues</span>
                    <span className="font-medium text-green-400">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <span className="font-medium text-blue-400">2.1K</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating New Post Button */}
        <motion.button
          className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl z-50 touch-target"
          onClick={() => setIsNewPostOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="sr-only">Create new post</span>
        </motion.button>
        
        <NewPostModal 
          isOpen={isNewPostOpen} 
          onClose={() => setIsNewPostOpen(false)}
          onSubmit={handleNewPostSubmit}
        />
      </div>
    </div>
  )
}