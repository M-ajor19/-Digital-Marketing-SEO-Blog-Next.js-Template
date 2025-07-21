'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateRelative } from '@/lib/utils'

// Mock data - in real app, this would come from your CMS/API
const featuredPosts = [
  {
    id: 1,
    title: 'The Complete Guide to SEO in 2025: Strategies That Actually Work',
    excerpt: 'Discover the latest SEO techniques that are driving real results. From E-A-T optimization to Core Web Vitals, learn what matters most.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    category: 'SEO',
    publishedAt: '2024-12-15',
    readTime: 12,
    views: 15420,
    featured: true,
  },
  {
    id: 2,
    title: 'Content Marketing Automation: Scale Your Strategy Without Losing Quality',
    excerpt: 'Learn how to automate your content marketing while maintaining authenticity and engagement. Tools, workflows, and best practices.',
    image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=600&fit=crop',
    category: 'Content Marketing',
    publishedAt: '2024-12-12',
    readTime: 8,
    views: 9830,
    featured: true,
  },
  {
    id: 3,
    title: 'Social Media ROI: How to Measure and Improve Your Returns',
    excerpt: 'Stop guessing about social media performance. Master the metrics that matter and optimize for real business outcomes.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    category: 'Social Media',
    publishedAt: '2024-12-10',
    readTime: 10,
    views: 12450,
    featured: true,
  },
]

export function FeaturedPosts() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest Expert Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay ahead with cutting-edge strategies, proven tactics, and 
            actionable insights from industry leaders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {featuredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1 text-xs">
                        <Eye className="h-3 w-3" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateRelative(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Posts Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
