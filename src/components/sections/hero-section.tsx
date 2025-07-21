'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  TrendingUp, 
  Zap,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { ParticleBackground } from '@/components/ui/particle-background'
import { FloatingElements } from '@/components/ui/floating-elements'

const stats = [
  { label: 'Active Readers', value: 50000, suffix: '+' },
  { label: 'Expert Articles', value: 1200, suffix: '+' },
  { label: 'Success Stories', value: 300, suffix: '+' },
  { label: 'Growth Rate', value: 150, suffix: '%' },
]

const featuredLogos = [
  'Google', 'Facebook', 'Microsoft', 'Amazon', 'Apple', 'Netflix'
]

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Floating Elements */}
      <FloatingElements />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-small opacity-20" />
      
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          transition={{ type: 'spring', damping: 50 }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          transition={{ type: 'spring', damping: 50 }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          style={{ y, opacity }}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              #1 Digital Marketing Resource
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Master Digital
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Marketing Excellence
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Unlock growth secrets from industry leaders. Get expert insights, 
            proven strategies, and actionable tactics that drive real results for 
            modern businesses.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button 
              size="lg" 
              className="group px-8 py-4 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/blog">
                Explore Articles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="group px-8 py-4 text-lg border-2 hover:bg-accent hover:border-accent-foreground/20 transform hover:scale-105 transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center group"
              >
                <div className="flex items-center justify-center mb-2">
                  <AnimatedCounter
                    end={stat.value}
                    className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors"
                  />
                  <span className="text-2xl md:text-3xl font-bold text-primary ml-1">
                    {stat.suffix}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Trusted by marketing teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {featuredLogos.map((logo) => (
                <motion.div
                  key={logo}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {logo}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2 text-muted-foreground"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse" />
      <div className="absolute top-1/3 right-10 w-3 h-3 bg-secondary rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-20 w-1 h-1 bg-accent rounded-full opacity-80 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 right-20 w-2 h-2 bg-primary rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
    </section>
  )
}
