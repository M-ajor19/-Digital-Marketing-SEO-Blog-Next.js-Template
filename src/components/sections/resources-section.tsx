'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Wrench, 
  FileText, 
  BookOpen, 
  TrendingUp,
  ArrowRight,
  Download,
  Eye,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const resources = [
  {
    icon: Wrench,
    title: 'Marketing Tools',
    description: 'Curated collection of the best digital marketing tools and software.',
    items: ['SEO Tools', 'Analytics Platforms', 'Social Media Tools', 'Email Marketing'],
    link: '/resources/tools',
    stats: { items: '50+ Tools', users: '10K+ Users' },
  },
  {
    icon: FileText,
    title: 'Templates & Checklists',
    description: 'Ready-to-use templates that save time and ensure consistency.',
    items: ['Content Calendars', 'SEO Checklists', 'Campaign Templates', 'Report Templates'],
    link: '/resources/templates',
    stats: { items: '25+ Templates', downloads: '5K+ Downloads' },
  },
  {
    icon: BookOpen,
    title: 'Guides & eBooks',
    description: 'Comprehensive guides covering every aspect of digital marketing.',
    items: ['SEO Mastery', 'Content Strategy', 'Paid Advertising', 'Analytics Guide'],
    link: '/resources/guides',
    stats: { items: '15+ Guides', pages: '500+ Pages' },
  },
  {
    icon: TrendingUp,
    title: 'Case Studies',
    description: 'Real-world examples of successful marketing campaigns and strategies.',
    items: ['Growth Hacking', 'Lead Generation', 'Brand Building', 'Revenue Growth'],
    link: '/resources/case-studies',
    stats: { items: '30+ Studies', results: '$2M+ Generated' },
  },
]

export function ResourcesSection() {
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
            Marketing Resources That Drive Results
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access our premium collection of tools, templates, and guides to 
            accelerate your marketing success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-xl border p-8 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <resource.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <p className="text-muted-foreground">{resource.description}</p>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {resource.items.map((item) => (
                  <li key={item} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{Object.values(resource.stats)[0]}</span>
                  <span>•</span>
                  <span>{Object.values(resource.stats)[1]}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={resource.link}>
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button size="lg" asChild>
            <Link href="/resources">
              Browse All Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
