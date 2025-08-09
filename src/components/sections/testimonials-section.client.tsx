'use client'

import dynamic from 'next/dynamic'

// Client-only dynamic import with skeleton fallback
const TestimonialsSection = dynamic(
  () => import('./testimonials-section').then((m) => m.TestimonialsSection),
  {
    ssr: false,
    loading: () => (
      <section className="section">
        <div className="container">
          <div className="h-10 w-56 rounded bg-muted/40 mb-6 animate-pulse" />
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    ),
  }
)

export default function ClientTestimonialsSection() {
  return <TestimonialsSection />
}
