"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// Shimmer Button
export const ShimmerButton = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Button
      className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.8 }}
      />
      <span className="relative z-10">{children}</span>
    </Button>
  </motion.div>
)

// Magnetic Button
export const MagneticButton = ({ children, className = "", ...props }) => {
  const handleMouseMove = (e) => {
    const { currentTarget: target } = e
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    target.style.setProperty("--mouse-x", `${x}px`)
    target.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
        onMouseMove={handleMouseMove}
        style={{
          "--mouse-x": "0px",
          "--mouse-y": "0px",
        }}
        {...props}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(100px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.2), transparent 40%)`,
          }}
        />
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  )
}

// Glow Button
export const GlowButton = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Button
      className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <span className="relative z-10">{children}</span>
    </Button>
  </motion.div>
)

// Liquid Button
export const LiquidButton = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Button
      className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-500 ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500"
        initial={{ scale: 0, borderRadius: "50%" }}
        whileHover={{ scale: 1.5, borderRadius: "0%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
        {children}
      </span>
    </Button>
  </motion.div>
)

// Pulse Button
export const PulseButton = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Button
      className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        animate={{ scale: [0, 2], opacity: [0.7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative z-10">{children}</span>
    </Button>
  </motion.div>
)

// Flip Button
export const FlipButton = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ rotateY: 180 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.6 }}
    style={{ perspective: 1000 }}
  >
    <Button
      className={`relative bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 rounded"
        style={{ rotateY: 180, backfaceVisibility: "hidden" }}
      />
      <span className="relative z-10">{children}</span>
    </Button>
  </motion.div>
)

// Morphing Button
export const MorphingButton = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Button
      className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-500 ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        whileHover={{ clipPath: "circle(100% at 50% 50%)" }}
        transition={{ duration: 0.5 }}
      />
      <span className="relative z-10">{children}</span>
    </Button>
  </motion.div>
)

// Wobble Button
export const WobbleButton = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ 
      rotate: [0, -3, 3, -3, 3, 0],
      scale: 1.05 
    }}
    whileTap={{ scale: 0.95 }}
    transition={{ 
      rotate: { duration: 0.5 },
      scale: { type: "spring", stiffness: 400, damping: 17 }
    }}
  >
    <Button
      className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </Button>
  </motion.div>
)

// Gradient Shift Button
export const GradientShiftButton = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Button
      className={`group relative overflow-hidden text-white shadow-lg hover:shadow-xl transition-all duration-500 ${className}`}
      style={{
        background: "linear-gradient(45deg, #8b5cf6, #06b6d4, #8b5cf6, #06b6d4)",
        backgroundSize: "300% 300%",
        animation: "gradient-shift 3s ease infinite"
      }}
      {...props}
    >
      <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
        {children}
      </span>
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Button>
  </motion.div>
)

// Neon Button
export const NeonButton = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Button
      className={`group relative overflow-hidden bg-transparent border-2 border-purple-500 text-purple-400 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10">{children}</span>
    </Button>
  </motion.div>
)