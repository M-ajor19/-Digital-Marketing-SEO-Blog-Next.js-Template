import type { Metadata } from 'next'
import { Inter, Merriweather, Sora } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@/components/analytics'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/ui/back-to-top'
import { cn } from '@/lib/utils'
import { CursorRing } from '../components/ui/cursor-ring'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: true,
})

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
  adjustFontFallback: true,
})

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: {
    default: 'MU RANKSPACE',
    template: '%s | MU RANKSPACE',
  },
  description: 'MU RANKSPACE — Calm, premium insights on digital marketing, SEO, and growth.',
  openGraph: {
    title: 'MU RANKSPACE',
    description: 'Calm, premium insights on digital marketing, SEO, and growth.',
    siteName: 'MU RANKSPACE',
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
    <html lang="en" className={cn(inter.variable, merriweather.variable, sora.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <CursorRing />
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
