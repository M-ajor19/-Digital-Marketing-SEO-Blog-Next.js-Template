'use client'

import { motion } from 'framer-motion'
import { Zap, TrendingUp, Target, Sparkles } from 'lucide-react'

const floatingElements = [
  { icon: Zap, color: 'text-blue-500', size: 'h-8 w-8', delay: 0 },
  { icon: TrendingUp, color: 'text-green-500', size: 'h-6 w-6', delay: 0.5 },
  { icon: Target, color: 'text-purple-500', size: 'h-7 w-7', delay: 1 },
  { icon: Sparkles, color: 'text-yellow-500', size: 'h-5 w-5', delay: 1.5 },
]

export function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingElements.map((element, index) => {
        const Icon = element.icon
        return (
          <motion.div
            key={index}
            className={`absolute ${element.color} ${element.size} opacity-20`}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              rotate: 0,
              scale: 0
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [0, 1, 0.8, 1],
            }}
            transition={{
              duration: 6,
              delay: element.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + index * 15}%`,
            }}
          >
            <Icon className={element.size} />
          </motion.div>
        )
      })}
    </div>
  )
}
