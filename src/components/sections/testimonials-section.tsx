'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'VP Marketing',
    company: 'TechCorp',
    content: 'This blog has completely transformed our marketing strategy. The actionable insights and real-world examples have helped us increase our ROI by 180%.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b776?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Growth Manager',
    company: 'StartupX',
    content: 'The SEO strategies shared here are gold. We went from page 3 to top 3 rankings for our target keywords in just 4 months.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Emily Johnson',
    role: 'Digital Marketing Director',
    company: 'E-commerce Plus',
    content: 'I\'ve been following this blog for 2 years. The content quality is consistently excellent, and the strategies actually work in practice.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
]

export function TestimonialsSection() {
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
            What Marketing Leaders Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful marketers who trust our insights to 
            drive their business growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-xl border p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <Quote className="h-6 w-6 text-primary mb-4" />

              <p className="text-muted-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
