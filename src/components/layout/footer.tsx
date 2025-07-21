import Link from 'next/link'
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone,
  ArrowRight,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = {
  content: [
    { name: 'Blog', href: '/blog' },
    { name: 'SEO Guide', href: '/blog/category/seo' },
    { name: 'Content Marketing', href: '/blog/category/content-marketing' },
    { name: 'Social Media', href: '/blog/category/social-media' },
  ],
  resources: [
    { name: 'Tools', href: '/resources/tools' },
    { name: 'Templates', href: '/resources/templates' },
    { name: 'Case Studies', href: '/resources/case-studies' },
    { name: 'Guides', href: '/resources/guides' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Status', href: '/status' },
    { name: 'Contact Support', href: '/support' },
  ],
}

const socialMedia = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: '#', icon: Instagram },
]

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border/50">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated with Latest Insights
            </h3>
            <p className="text-muted-foreground mb-6">
              Get expert digital marketing tips, case studies, and growth strategies 
              delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <Button>
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                P
              </div>
              <span className="font-bold text-lg">Premium Marketing</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your trusted source for digital marketing excellence. We help businesses 
              grow through proven strategies, expert insights, and actionable content.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@premiummarketing.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h4 className="font-semibold mb-4">Content</h4>
            <ul className="space-y-2">
              {navigation.content.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4 md:mb-0">
            <span>© 2025 Premium Marketing. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by Premium Templates</span>
          </div>

          {/* Social Media */}
          <div className="flex items-center space-x-4">
            {socialMedia.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
