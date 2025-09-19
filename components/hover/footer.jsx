"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { 
  Sparkles, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  ArrowUp,
  Heart
} from "lucide-react"

const FooterLink = ({ href, children }) => (
  <motion.div
    whileHover={{ x: 4 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Link
      href={href}
      className="group text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
    >
      <span className="group-hover:scale-105 transition-transform duration-300">
        {children}
      </span>
    </Link>
  </motion.div>
)

const SocialLink = ({ href, icon: Icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Link
      href={href}
      className="group w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-white/20"
      aria-label={label}
    >
      <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
    </Link>
  </motion.div>
)

const AnimatedSection = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

const ScrollToTop = () => (
  <motion.button
    className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl z-50"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <ArrowUp className="w-5 h-5 text-white" />
  </motion.button>
)

export function HoverFooter() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const footerSections = [
    {
      title: "Platform",
      links: [
        { href: "#", label: "Scan Issues" },
        { href: "#", label: "Community" },
        { href: "#", label: "Track Progress" }
      ]
    },
    {
      title: "Support",
      links: [
        { href: "#", label: "Help Center" },
        { href: "#", label: "Contact Us" },
        { href: "#", label: "Feedback" }
      ]
    }
  ]

  const socialLinks = [
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Github, label: "GitHub" },
    { href: "#", icon: Linkedin, label: "LinkedIn" },
    { href: "#", icon: Mail, label: "Email" }
  ]

  return (
    <>
      <footer 
        ref={ref}
        className="relative bg-gradient-to-br from-black via-gray-900 to-black border-t border-white/10"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -30, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <AnimatedSection delay={0.1}>
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="relative">
                    <motion.div
                      className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-600 to-green-600 flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Sparkles className="h-6 w-6 text-white" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 h-12 w-12 rounded-xl bg-gradient-to-br from-orange-600 to-green-600 opacity-20"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                    Gov-X India
                  </span>
                </motion.div>

                <p className="text-gray-400 leading-relaxed max-w-md">
                  🇮🇳 Empowering Indian citizens to build better communities through AI-powered civic engagement.
                </p>

                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>Made in India 🇮🇳</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>hello@gov-x.in</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-4 pt-4">
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                    >
                      <SocialLink {...social} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Footer Links */}
            {footerSections.map((section, sectionIndex) => (
              <AnimatedSection key={section.title} delay={0.2 + sectionIndex * 0.1}>
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <motion.li
                        key={link.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: 0.3 + sectionIndex * 0.1 + linkIndex * 0.05 
                        }}
                      >
                        <FooterLink href={link.href}>
                          {link.label}
                        </FooterLink>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>


          {/* Bottom Bar */}
          <AnimatedSection delay={1.0}>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>&copy; Gov-X India. All rights reserved.</span>
              </div>
              
              <motion.div
                className="flex items-center space-x-2 text-gray-400 text-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-red-500" />
                </motion.div>
                <span>for भारत 🇮🇳</span>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </footer>

      <ScrollToTop />
    </>
  )
}