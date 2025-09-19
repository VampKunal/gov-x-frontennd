"use client"

import { HoverHero } from "@/components/hover/hero"
import { HoverFooter } from "@/components/hover/footer"
import { MobileShowcase } from "@/components/hover/mobile-showcase"
import { ShimmerButton, MagneticButton, GlowButton } from "@/components/hover/buttons"
import { HoverNavbar } from "@/components/hover/navbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Camera, Bot, Users, MessageSquare, TrendingUp, CheckCircle, Shield, Sparkles, MapPin, AlertTriangle } from "lucide-react"

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
}

export default function HomePage() {
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="min-h-screen bg-black overflow-hidden">

      <HoverNavbar />
      <HoverHero />

      {/* Modern Features Section */}
      <section ref={featuresRef} className="py-20 relative bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center space-y-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              How Gov-X Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Snap a photo, let AI do the work, connect with authorities. Building a better India, one report at a time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Camera,
                title: "📱 Snap & Scan",
                description: "Take a photo of potholes, garbage dumps, or broken infrastructure. Our AI instantly analyzes and categorizes the issue type.",
                gradient: "from-orange-500 to-red-500",
                delay: 0.2,
              },
              {
                icon: Bot,
                title: "🤖 AI Detection",
                description: "Advanced AI identifies the problem type and determines the right authority (Municipal Corp, PWD, etc.) to send your report to.",
                gradient: "from-blue-500 to-cyan-500",
                delay: 0.4,
              },
              {
                icon: CheckCircle,
                title: "✅ Track & Resolve",
                description: "Get real-time updates on your report's progress. Join the community discussion and see issues get resolved faster.",
                gradient: "from-green-500 to-emerald-500",
                delay: 0.6,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                whileHover={{ y: -10 }}
              >
                <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:bg-white/10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Features Section */}
      <section className="py-20 bg-gradient-to-br from-black via-blue-900/10 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center space-y-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Community Power
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Connect with your neighbors, track issue resolutions, and get feedback on your reports.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* Community Tab Feature */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6`}>
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                🏘️ Community Tab
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                See what issues your neighbors are reporting in real-time. Upvote important problems, comment with additional details, and collaborate to get faster resolutions from authorities.
              </p>
              <ul className="space-y-3 text-gray-300">
                {[
                  "🗳️ Vote on community issues",
                  "💬 Add comments and updates",
                  "📍 View issues on interactive map",
                  "🏆 See top contributors"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Feedback System */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6`}>
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                📬 Real-time Feedback
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Get instant notifications when authorities respond to your reports. Track progress from 'Submitted' to 'In Progress' to 'Resolved' with photo proof of completed work.
              </p>
              <ul className="space-y-3 text-gray-300">
                {[
                  "🔔 Instant status notifications",
                  "📊 Progress tracking dashboard",
                  "📸 Before/after photo verification",
                  "⭐ Rate authority response time"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Showcase Section */}
      <MobileShowcase />

      {/* CTA Section with Hover.dev Buttons */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform India?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              Join thousands of Indians already making a difference. Start scanning issues and building better communities today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <ShimmerButton className="text-lg px-8 py-4 h-14 bg-blue-600">
                📱 Start Scanning Now
              </ShimmerButton>
              {/* Removed Watch Demo button for hackathon neutrality */}
              <GlowButton className="text-lg px-8 py-4 h-14">
                🏘️ Join Community
              </GlowButton>
            </div>
          </motion.div>
        </div>
      </section>

      <HoverFooter />
    </div>
  )
}
