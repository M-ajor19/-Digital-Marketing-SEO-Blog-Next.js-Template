export const dynamic = 'force-static'
export const revalidate = 60

import { HeroSection } from '@/components/sections/hero-section'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import ClientResourcesSection from '../components/sections/resources-section.client'
import ClientTestimonialsSection from '../components/sections/testimonials-section.client'
import { getSortedPosts, BlogPost } from '@/lib/posts'

export default async function HomePage() {
  const all: BlogPost[] = getSortedPosts()
  const initialPosts = [...all]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3)

  return (
    <>
      <HeroSection />
      <section className="section">
        <FeaturedPosts initialPosts={initialPosts} />
      </section>
      <ClientResourcesSection />
      <ClientTestimonialsSection />
    </>
  )
}