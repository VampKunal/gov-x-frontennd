"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Users, 
  ArrowRight, 
  Shield, 
  Camera, 
  FileText,
  CheckCircle,
  Settings,
  ArrowLeft,
  Sparkles
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
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const floatingAnimation = {
  y: [-5, 5, -5],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

export default function AuthChoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"
          animate={{
            y: [10, -10, 10],
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-800/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back button */}
          <motion.div variants={cardVariants} className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={cardVariants} className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">GX</span>
                </div>
                <div className="absolute inset-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 animate-ping opacity-20" />
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Gov-X India
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Login Type
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the type of account you want to access. Citizens report issues, departments manage and resolve them.
            </p>
          </motion.div>

          {/* Split Screen Cards */}
          <motion.div variants={cardVariants}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Citizen/User Card */}
              <motion.div
                className="group cursor-pointer"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href="/auth">
                  <Card className="h-full bg-gradient-to-br from-purple-600/10 to-violet-600/10 border-purple-500/20 hover:border-purple-400/40 backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden relative">
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={floatingAnimation}
                    />
                    
                    <CardContent className="p-8 relative z-10">
                      <div className="text-center space-y-6">
                        {/* Icon */}
                        <motion.div
                          className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                          whileHover={{ rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Users className="h-10 w-10 text-white" />
                        </motion.div>

                        {/* Badge */}
                        <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                          <Camera className="h-3 w-3 mr-1" />
                          For Citizens
                        </Badge>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-foreground group-hover:text-purple-300 transition-colors duration-300">
                          Citizen Login
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">
                          Report civic issues, track your submissions, and contribute to building a better community through AI-powered issue detection.
                        </p>

                        {/* Features */}
                        <div className="space-y-3 text-left">
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                            <span>Scan and report potholes, garbage dumps, and more</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                            <span>Track your issue reports and resolutions</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                            <span>Join community discussions and voting</span>
                          </div>
                        </div>

                        {/* Button */}
                        <div className="pt-4">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl">
                            <span>Continue as Citizen</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              {/* Department Card */}
              <motion.div
                className="group cursor-pointer"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href="/department/auth">
                  <Card className="h-full bg-gradient-to-br from-orange-600/10 to-orange-700/10 border-orange-500/20 hover:border-orange-400/40 backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden relative">
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-orange-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        y: [5, -5, 5],
                        transition: {
                          duration: 4.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                    />
                    
                    <CardContent className="p-8 relative z-10">
                      <div className="text-center space-y-6">
                        {/* Icon */}
                        <motion.div
                          className="mx-auto w-20 h-20 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                          whileHover={{ rotate: -5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Building2 className="h-10 w-10 text-white" />
                        </motion.div>

                        {/* Badge */}
                        <Badge variant="secondary" className="bg-orange-600/20 text-orange-300 border-orange-600/30">
                          <Shield className="h-3 w-3 mr-1" />
                          For Departments
                        </Badge>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-foreground group-hover:text-orange-300 transition-colors duration-300">
                          Department Login
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">
                          Manage civic issues, track resolutions, and coordinate with your team to efficiently solve community problems.
                        </p>

                        {/* Features */}
                        <div className="space-y-3 text-left">
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                            <span>Review and assign incoming issue reports</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                            <span>Track team progress and performance metrics</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                            <span>Upload resolution proof and manage workflows</span>
                          </div>
                        </div>

                        {/* Button */}
                        <div className="pt-4">
                          <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl">
                            <span>Continue as Department</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                          </Button>
                        </div>

                        {/* Test Credentials Note */}
                        <div className="pt-2 border-t border-gray-700/50">
                          <p className="text-xs text-muted-foreground">
                            Test Login: admin@dept.gov.in / admin123
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Note */}
          <motion.div variants={cardVariants} className="text-center mt-12">
            <p className="text-muted-foreground text-sm">
              Having trouble logging in?{' '}
              <Link href="/auth/forgot-password" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
                Reset your password
              </Link>{' '}
              or contact support for assistance.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}