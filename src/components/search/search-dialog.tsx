'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border bg-popover p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Search Articles</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for articles, topics, or authors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                autoFocus
              />
            </div>

            {query && (
              <div className="mt-4 text-sm text-muted-foreground">
                Search functionality will be implemented here
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
