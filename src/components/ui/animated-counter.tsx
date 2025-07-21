'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AnimatedCounterProps {
  end: number
  start?: number
  duration?: number
  className?: string
  decimals?: number
}

export function AnimatedCounter({ 
  end, 
  start = 0, 
  duration = 2, 
  className = '',
  decimals = 0 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return

    const increment = (end - start) / (duration * 60) // 60fps
    let current = start
    
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        setHasAnimated(true)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [end, start, duration, hasAnimated])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
    </motion.span>
  )
}
