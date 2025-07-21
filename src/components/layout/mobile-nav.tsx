'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  submenu?: { name: string; href: string }[]
}

interface MobileNavProps {
  navigation: NavigationItem[]
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ navigation, isOpen, onClose }: MobileNavProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  const handleSubmenuToggle = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name)
  }

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

          {/* Mobile Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-80 border-l bg-background p-6 shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            {/* Navigation */}
            <nav className="mt-6 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex-1',
                        pathname === item.href
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>

                    {item.submenu && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSubmenuToggle(item.name)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            activeSubmenu === item.name && 'rotate-180'
                          )}
                        />
                      </Button>
                    )}
                  </div>

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.submenu && activeSubmenu === item.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-6 mt-2 space-y-1 overflow-hidden"
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={onClose}
                            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* CTA */}
            <div className="mt-8 pt-6 border-t">
              <Button asChild className="w-full">
                <Link href="/newsletter" onClick={onClose}>
                  Subscribe to Newsletter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
