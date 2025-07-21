'use client'

import { motion } from 'framer-motion'

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full" />
      </motion.div>
    </div>
  )
}
