"use client"

import Link from "next/link"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Sparkles, Zap, ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const FloatingCard = ({ delay = 0, className = "" }) => (
  <motion.div
    className={`absolute bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-4 ${className}`}
    initial={{ opacity: 0, y: 100, rotate: -10 }}
    animate={{ opacity: 1, y: 0, rotate: 0 }}
    transition={{
      duration: 0.8,
      delay,
      type: "spring",
      stiffness: 100,
      damping: 10,
    }}
    whileHover={{ scale: 1.05, rotate: 2 }}
  >
    <div className="flex items-center space-x-3">
      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
      <div className="flex-1">
        <div className="h-2 bg-white/20 rounded-full mb-2" />
        <div className="h-1 bg-white/10 rounded-full w-2/3" />
      </div>
    </div>
  </motion.div>
)

const AnimatedStats = ({ value, label, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true })
  
  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
      >
        {value}
      </motion.div>
      <div className="text-gray-300 text-sm font-medium">{label}</div>
    </motion.div>
  )
}

const HeroButton = ({ children, variant = "primary", className = "", href, ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Link href={href}>
      <Button
        className={`group relative overflow-hidden transition-all duration-500 ${
          variant === "primary"
            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-purple-500/25"
            : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-sm"
        } ${className}`}
        {...props}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8 }}
        />
        <span className="relative z-10 flex items-center">
          {children}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </Button>
    </Link>
  </motion.div>
)

export function HoverHero() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left - width / 2)
    mouseY.set(clientY - top - height / 2)
  }

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-purple-900/20 to-black"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-600/20 to-green-600/20 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-gray-300">
                🇮🇳 Serving India's Smart Cities
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-white">Scan, Report,</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                  Transform India
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Take a photo, let AI detect civic issues like potholes and garbage dumps, and automatically send reports to the right authorities. Join your community in building a better India.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <HeroButton
                href="/auth"
                variant="primary"
                size="lg"
                className="text-lg px-8 py-4 h-14 bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Scanning
              </HeroButton>
              <HeroButton
                href="#demo"
                variant="secondary"
                size="lg"
                className="text-lg px-8 py-4 h-14"
              >
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </HeroButton>
            </motion.div>

            {/* Stats (neutralized for hackathon) */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <AnimatedStats value="" label="" delay={0.1} />
              <AnimatedStats value="" label="" delay={0.2} />
              <AnimatedStats value="" label="" delay={0.3} />
            </motion.div>
          </motion.div>

          {/* Interactive Visual */}
          <motion.div
            className="relative lg:h-[600px] flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ rotateX, rotateY }}
          >
            {/* Main Phone Mockup */}
            <motion.div
              className="relative w-80 h-[600px] mx-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl" />
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
                {/* Phone Content */}
                <div className="p-6 space-y-6">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-green-500 rounded-sm" />
                      <div className="w-4 h-2 bg-green-500 rounded-sm" />
                      <div className="w-4 h-2 bg-gray-600 rounded-sm" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                      Gov-X India
                    </h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>

                  {/* Cards */}
                  <div className="space-y-4">
                    {[
                      { color: "from-orange-500 to-red-500", title: "🕳️ Pothole Detected", status: "AI Scanned" },
                      { color: "from-blue-500 to-cyan-500", title: "📍 Sent to BMC", status: "In Review" },
                      { color: "from-green-500 to-emerald-500", title: "✅ Road Repaired", status: "Complete" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-2xl bg-gradient-to-r ${item.color} bg-opacity-20 border border-white/10 backdrop-blur-sm`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <span className="text-xs px-2 py-1 bg-white/20 rounded-full text-white">
                            {item.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <FloatingCard delay={1.2} className="top-16 -left-8 w-32 h-20" />
            <FloatingCard delay={1.4} className="top-32 -right-12 w-28 h-16" />
            <FloatingCard delay={1.6} className="bottom-32 -left-16 w-36 h-24" />
            <FloatingCard delay={1.8} className="bottom-16 -right-8 w-32 h-20" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}