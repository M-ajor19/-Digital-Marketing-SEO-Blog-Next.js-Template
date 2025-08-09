'use client'

import dynamic from 'next/dynamic'

// Client-only dynamic import with skeleton fallback
const ResourcesSection = dynamic(
  () => import('./resources-section').then((m) => m.ResourcesSection),
  {
    ssr: false,
    loading: () => (
      <section className="section">
        <div className="container">
          <div className="h-10 w-48 rounded bg-muted/40 mb-6 animate-pulse" />
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    ),
  }
)

export default function ClientResourcesSection() {
  return <ResourcesSection />
}
