'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const stats = [
  {
    icon: Users,
    label: 'Active Readers',
    value: 50000,
    suffix: '+',
    description: 'Digital marketing professionals trust our content',
  },
  {
    icon: BookOpen,
    label: 'Expert Articles',
    value: 1200,
    suffix: '+',
    description: 'In-depth guides and actionable insights',
  },
  {
    icon: TrendingUp,
    label: 'Growth Rate',
    value: 150,
    suffix: '%',
    description: 'Average ROI improvement for our readers',
  },
  {
    icon: Award,
    label: 'Success Stories',
    value: 300,
    suffix: '+',
    description: 'Documented case studies and wins',
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Marketing Professionals Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of marketers who rely on our insights to drive growth 
            and achieve exceptional results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <stat.icon className="h-8 w-8" />
              </div>
              
              <div className="flex items-center justify-center mb-2">
                <AnimatedCounter
                  end={stat.value}
                  className="text-4xl font-bold text-foreground"
                />
                <span className="text-3xl font-bold text-primary ml-1">
                  {stat.suffix}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
