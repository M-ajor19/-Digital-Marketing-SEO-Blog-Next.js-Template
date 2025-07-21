'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Search, 
  Sun, 
  Moon, 
  ChevronDown,
  ArrowRight,
  Zap,
  TrendingUp,
  BookOpen,
  Users,
  Mail,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MobileNav } from './mobile-nav'
import { SearchDialog } from '@/components/search/search-dialog'

const navigation = [
  { 
    name: 'Home', 
    href: '/',
    icon: Zap,
  },
  {
    name: 'Blog',
    href: '/blog',
    icon: BookOpen,
    submenu: [
      { name: 'All Posts', href: '/blog' },
      { name: 'SEO Strategy', href: '/blog/category/seo' },
      { name: 'Content Marketing', href: '/blog/category/content-marketing' },
      { name: 'Social Media', href: '/blog/category/social-media' },
      { name: 'Analytics', href: '/blog/category/analytics' },
      { name: 'Growth Hacking', href: '/blog/category/growth' },
    ],
  },
  {
    name: 'Resources',
    href: '/resources',
    icon: TrendingUp,
    submenu: [
      { name: 'Tools', href: '/resources/tools' },
      { name: 'Templates', href: '/resources/templates' },
      { name: 'Guides', href: '/resources/guides' },
      { name: 'Case Studies', href: '/resources/case-studies' },
    ],
  },
  { 
    name: 'About', 
    href: '/about',
    icon: Users,
  },
  { 
    name: 'Contact', 
    href: '/contact',
    icon: Mail,
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setActiveSubmenu(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmenuToggle = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name)
  }

  return (
    <>
      <motion.header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-all duration-300',
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-border/50 shadow-sm'
            : 'bg-background/95 border-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                P
              </div>
              <span className="hidden font-bold text-lg sm:inline-block">
                Premium Marketing
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                      'hover:bg-accent hover:text-accent-foreground',
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.submenu && (
                      <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                    )}
                  </Link>

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.submenu && activeSubmenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-56 rounded-lg border bg-popover p-2 shadow-lg"
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
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

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline text-sm">Search</span>
                <kbd className="hidden lg:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* CTA Button */}
              <Button asChild className="hidden lg:inline-flex">
                <Link href="/newsletter">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Button */}
        <div className="border-t border-border/50 px-4 py-2 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="w-full justify-start text-muted-foreground"
          >
            <Search className="mr-2 h-4 w-4" />
            Search articles...
          </Button>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <MobileNav
        navigation={navigation}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}
