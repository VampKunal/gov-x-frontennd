"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle, AlertCircle } from "lucide-react"

export function Timeline({ steps = [] }) {
  return (
    <div className="relative pl-6">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const Icon = step.status === 'Resolved' ? CheckCircle2 : step.status === 'In Progress' ? AlertCircle : Circle

        return (
          <motion.div
            key={index}
            className="relative pb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {!isLast && (
              <div className="absolute left-[-2px] top-6 bottom-0 w-[2px] bg-border" />
            )}
            <div className="absolute left-[-10px] top-0">
              <Icon className={`h-4 w-4 ${
                step.status === 'Resolved' ? 'text-green-400' : step.status === 'In Progress' ? 'text-blue-400' : 'text-muted-foreground'
              }`} />
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-foreground">{step.title}</div>
              <div className="text-xs text-muted-foreground">{step.time}</div>
              {step.description && (
                <div className="text-sm text-muted-foreground mt-1">{step.description}</div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
