import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@/components/analytics'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/ui/back-to-top'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
})

export const metadata: Metadata = {
  title: {
    default: 'Premium Digital Marketing Blog',
    template: '%s | Premium Digital Marketing Blog',
  },
  description: 'Professional digital marketing insights, SEO strategies, and growth tactics for modern businesses.',
  metadataBase: new URL('https://premium-marketing-blog.com'),
  openGraph: {
    title: 'Premium Digital Marketing Blog',
    description: 'Professional digital marketing insights, SEO strategies, and growth tactics for modern businesses.',
    url: 'https://premium-marketing-blog.com',
    siteName: 'Premium Digital Marketing Blog',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(inter.variable, merriweather.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <BackToTop />
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
