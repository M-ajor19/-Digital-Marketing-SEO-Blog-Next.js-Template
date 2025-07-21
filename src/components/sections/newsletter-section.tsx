'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your newsletter service
    setIsSubscribed(true)
    setEmail('')
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-small opacity-20" />
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Join 50,000+ Marketers
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get Weekly Marketing Insights
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Receive expert strategies, case studies, and growth tactics delivered 
            to your inbox every Tuesday. No spam, unsubscribe anytime.
          </p>

          {/* Newsletter Form */}
          {!isSubscribed ? (
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center space-x-2 text-green-600 mb-8"
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Successfully subscribed!</span>
            </motion.div>
          )}

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Weekly expert insights</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Exclusive case studies</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No spam, ever</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
