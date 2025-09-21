"use client"

import Link from "next/link"
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

  {/* Features Section */}
  <section
    ref={featuresRef}
    className="py-8 xxs:py-12 xs:py-16 sm:py-20 relative bg-gradient-to-br from-gray-900 via-black to-gray-900"
  >
    <div className="container mx-auto px-2 xxs:px-3 xs:px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center space-y-3 xxs:space-y-4 xs:space-y-5 sm:space-y-6 mb-6 xxs:mb-8 xs:mb-12 sm:mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl xxs:text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white px-2">
          How Gov-X Works
        </h2>
        <p className="text-sm xxs:text-base xs:text-lg md:text-xl text-gray-300 max-w-sm xxs:max-w-xl sm:max-w-3xl mx-auto leading-relaxed px-2">
          Snap a photo, let AI do the work, connect with authorities. Building a better India, one report at a time.
        </p>
      </motion.div>

      {/* Grid Adjustments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xxs:gap-5 xs:gap-6 sm:gap-8 lg:gap-12">
        {[
          {
            icon: Camera,
            title: "📱 Snap & Scan",
            description:
              "Take a photo of potholes, garbage dumps, or broken infrastructure. Our AI instantly analyzes and categorizes the issue type.",
            gradient: "from-orange-500 to-red-500",
            delay: 0.2,
          },
          {
            icon: Bot,
            title: "🤖 AI Detection",
            description:
              "Advanced AI identifies the problem type and determines the right authority (Municipal Corp, PWD, etc.) to send your report to.",
            gradient: "from-blue-500 to-cyan-500",
            delay: 0.4,
          },
          {
            icon: CheckCircle,
            title: "✅ Track & Resolve",
            description:
              "Get real-time updates on your report's progress. Join the community discussion and see issues get resolved faster.",
            gradient: "from-green-500 to-emerald-500",
            delay: 0.6,
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="group"
            initial={{ opacity: 0, y: 50 }}
            animate={
              featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.8, delay: feature.delay }}
            whileHover={{ y: -10 }}
          >
            <div className="relative p-4 xxs:p-5 xs:p-6 sm:p-8 rounded-xl xxs:rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:bg-white/10">
              <div
                className={`w-10 h-10 xxs:w-12 xxs:h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-lg xxs:rounded-xl sm:rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-3 xxs:mb-4 xs:mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-5 w-5 xxs:h-6 xxs:w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base xxs:text-lg xs:text-xl sm:text-2xl font-bold text-white mb-2 xxs:mb-3 xs:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-xs xxs:text-sm xs:text-base text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>

  {/* CTA Section Buttons */}
  <section className="py-8 xxs:py-12 xs:py-16 sm:py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
    <div className="container mx-auto px-2 xxs:px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        className="space-y-4 xxs:space-y-5 xs:space-y-6 sm:space-y-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl xxs:text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 xxs:mb-4 xs:mb-6 px-2">
          Ready to Transform India?
        </h2>
        <p className="text-sm xxs:text-base xs:text-lg md:text-xl text-gray-300 max-w-xs xxs:max-w-md xs:max-w-lg sm:max-w-2xl mx-auto mb-6 xxs:mb-8 xs:mb-10 sm:mb-12 px-2 leading-relaxed">
          Join thousands of Indians already making a difference. Start scanning issues and building better communities today.
        </p>

        <div className="flex flex-col xxs:flex-col xs:flex-row gap-3 xxs:gap-4 sm:gap-6 justify-center items-center">
          <Link href="/auth/choice" className="w-full xxs:w-full xs:w-auto max-w-xs">
            <ShimmerButton className="text-sm xxs:text-base sm:text-lg px-4 xxs:px-6 sm:px-8 py-2.5 xxs:py-3 sm:py-4 h-10 xxs:h-12 sm:h-14 bg-blue-600 w-full">
              📱 Start Scanning Now
            </ShimmerButton>
          </Link>
          <Link href="/auth/choice" className="w-full xxs:w-full xs:w-auto max-w-xs">
            <GlowButton className="text-sm xxs:text-base sm:text-lg px-4 xxs:px-6 sm:px-8 py-2.5 xxs:py-3 sm:py-4 h-10 xxs:h-12 sm:h-14 w-full">
              🏘️ Join Community
            </GlowButton>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>

  <HoverFooter />
</div>

  )
}
