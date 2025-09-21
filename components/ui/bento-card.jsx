'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function BentoCard({ 
  children, 
  className, 
  size = 'default',
  gradient = false,
  hover = true,
  ...props 
}) {
  const sizeClasses = {
    small: 'p-4',
    default: 'p-6', 
    large: 'p-8',
  }

  const hoverAnimation = hover ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  } : {}

  return (
    <motion.div
      className={cn(
        'rounded-2xl border border-border/50 bg-card backdrop-blur-sm shadow-sm',
        'hover:shadow-lg hover:border-border/80 transition-all duration-300',
        gradient && 'bg-gradient-to-br from-card/50 to-card/80',
        sizeClasses[size],
        className
      )}
      {...hoverAnimation}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function BentoGrid({ children, className, ...props }) {
  return (
    <div 
      className={cn(
        'grid gap-4 md:gap-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function BentoMetric({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'primary',
  trend = 'up'
}) {
  const colorClasses = {
    primary: {
      icon: 'text-primary',
      bg: 'bg-primary/10',
      text: 'text-primary'
    },
    success: {
      icon: 'text-green-600',
      bg: 'bg-green-500/10',
      text: 'text-green-600'
    },
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-500/10', 
      text: 'text-yellow-600'
    },
    error: {
      icon: 'text-red-600',
      bg: 'bg-red-500/10',
      text: 'text-red-600'
    }
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground'
  }

  return (
    <BentoCard className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          'p-2 rounded-lg',
          colorClasses[color].bg
        )}>
          <Icon className={cn('h-4 w-4', colorClasses[color].icon)} />
        </div>
        {change && (
          <span className={cn('text-xs font-medium', trendColors[trend])}>
            {change}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {title}
        </div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
        <Icon className="h-full w-full" />
      </div>
    </BentoCard>
  )
}

export function BentoFeature({ 
  title, 
  description, 
  icon: Icon, 
  action,
  className
}) {
  return (
    <BentoCard className={cn('space-y-4', className)}>
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">
          {title}
        </h3>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      
      {action && (
        <div className="pt-2">
          {action}
        </div>
      )}
    </BentoCard>
  )
}

export function BentoList({ items, title, icon: Icon }) {
  return (
    <BentoCard>
      <div className="flex items-center space-x-2 mb-4">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h3 className="font-semibold text-foreground">
          {title}
        </h3>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              {item.icon && (
                <div className="p-1 rounded bg-primary/10">
                  <item.icon className="h-3 w-3 text-primary" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
            {item.value && (
              <span className="text-xs font-medium text-muted-foreground">
                {item.value}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </BentoCard>
  )
}