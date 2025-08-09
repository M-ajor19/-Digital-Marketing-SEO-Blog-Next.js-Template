'use client'

import { motion } from 'framer-motion'
import { Sparkles, Circle, Square } from 'lucide-react'

const items = [
  { key: 'a', Icon: Sparkles, left: '12%', top: '35%', size: 18, delay: 0 },
  { key: 'b', Icon: Circle, left: '70%', top: '20%', size: 14, delay: 0.6 },
  { key: 'c', Icon: Square, left: '80%', top: '60%', size: 22, delay: 1.2 },
]

export function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map(({ key, Icon, left, top, size, delay }) => (
        <motion.div
          key={key}
          className="absolute text-foreground/10"
          style={{ left, top }}
          initial={{ opacity: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 1, y: [-6, 0, -6], rotate: [0, 30, 0] }}
          transition={{ duration: 14, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon style={{ width: size, height: size }} />
        </motion.div>
      ))}
    </div>
  )
}
