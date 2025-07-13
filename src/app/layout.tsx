import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AnalyticsProvider from "@/components/analytics-provider";
import PerformanceMonitor from "@/components/performance-monitor";
import { generateOrganizationSchema } from "@/lib/schema";

// Configure the Inter font for optimal performance with next/font
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Define metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "Digital Marketing & SEO Blog - Expert Tips & Strategies",
    template: "%s | Digital Marketing & SEO Blog"
  },
  description: "Discover proven digital marketing strategies, SEO tips, and growth hacks that drive real results. Expert insights for businesses of all sizes.",
  keywords: ['digital marketing', 'SEO', 'content marketing', 'PPC', 'social media marketing', 'email marketing', 'conversion optimization'],
  authors: [{ name: "Digital Marketing Team" }],
  creator: "Digital Marketing & SEO Blog",
  publisher: "Digital Marketing & SEO Blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Digital Marketing & SEO Blog - Expert Tips & Strategies',
    description: 'Discover proven digital marketing strategies, SEO tips, and growth hacks that drive real results.',
    siteName: 'Digital Marketing & SEO Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing & SEO Blog - Expert Tips & Strategies',
    description: 'Discover proven digital marketing strategies, SEO tips, and growth hacks that drive real results.',
    creator: '@yourtwitterhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema({
    name: "Digital Marketing & SEO Blog",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/logo.png`,
    description: "Expert digital marketing strategies, SEO tips, and growth hacks for businesses.",
    email: "info@digitalmarketingblog.com",
    socialMedia: [
      "https://twitter.com/yourtwitterhandle",
      "https://linkedin.com/company/yourcompany"
    ]
  });

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
      </head>
      <body className="bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 font-sans">
        <AnalyticsProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <PerformanceMonitor />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
