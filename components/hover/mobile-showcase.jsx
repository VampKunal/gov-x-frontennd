"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Smartphone, Camera, Zap, MapPin, Users, Bell } from "lucide-react"

const MobileFeature = ({ icon: Icon, title, description, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })
  
  return (
    <motion.div
      ref={ref}
      className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center flex-shrink-0">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export function MobileShowcase() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const features = [
    {
      icon: Camera,
      title: "📱 Smart Camera",
      description: "One-tap photo capture with built-in AI analysis for instant issue detection and categorization."
    },
    {
      icon: Zap,
      title: "⚡ Instant Processing",
      description: "Real-time AI identifies potholes, garbage dumps, and infrastructure issues within seconds."
    },
    {
      icon: MapPin,
      title: "📍 Auto Location",
      description: "GPS coordinates automatically added to reports with precise location mapping for authorities."
    },
    {
      icon: Users,
      title: "🏘️ Community Hub", 
      description: "Connect with neighbors, vote on issues, and collaborate to solve problems faster together."
    },
    {
      icon: Bell,
      title: "🔔 Live Updates",
      description: "Push notifications for status changes from submission to resolution with photo verification."
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-black via-orange-900/10 to-green-900/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center space-y-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
            Mobile-First Design
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Built for India's mobile-first users. Works seamlessly on any device, from basic smartphones to tablets.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mobile Mockup */}
          <motion.div
            className="flex justify-center lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="w-80 h-[600px] bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="p-6 space-y-4">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-green-500 rounded-sm" />
                      <div className="w-4 h-2 bg-green-500 rounded-sm" />
                      <div className="w-4 h-2 bg-green-500 rounded-sm" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                      Gov-X India
                    </div>
                    <div className="text-sm text-gray-400">Building Better Bharat</div>
                  </div>

                  {/* Camera Button */}
                  <motion.div
                    className="w-full h-32 bg-gradient-to-br from-orange-500/20 to-green-500/20 rounded-2xl border-2 border-dashed border-orange-400/50 flex items-center justify-center"
                    animate={{ 
                      borderColor: ["rgba(251, 146, 60, 0.5)", "rgba(34, 197, 94, 0.5)", "rgba(251, 146, 60, 0.5)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-center space-y-2">
                      <Camera className="h-8 w-8 text-orange-400 mx-auto" />
                      <div className="text-sm text-gray-300">Tap to Scan Issue</div>
                    </div>
                  </motion.div>

                  {/* Recent Issues */}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-300">Recent Scans</div>
                    {[
                      { type: "🕳️ Pothole", location: "MG Road", status: "Resolved" },
                      { type: "🗑️ Garbage", location: "Park Street", status: "In Progress" },
                      { type: "🚰 Water Issue", location: "Sector 5", status: "Submitted" }
                    ].map((issue, index) => (
                      <motion.div
                        key={index}
                        className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 1 }}
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-white">{issue.type}</div>
                          <div className="text-xs text-gray-400">{issue.location}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          issue.status === 'Resolved' ? 'bg-green-500/20 text-green-400' :
                          issue.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {issue.status}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500/20 rounded-full blur-sm"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-500/20 rounded-full blur-sm"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Features List */}
          <div className="space-y-6 lg:order-1">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold text-white mb-8">
                🇮🇳 Made for Indian Users
              </h3>
              {features.map((feature, index) => (
                <MobileFeature
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}