'use client'; // This component uses client-side hooks like useState and useEffect

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CTASemanticSection from '@/components/cta-section';
import NewsletterSignup from '@/components/newsletter-signup';
import { CategoryTags } from '@/components/blog-categories';
import ContentRecommendations from '@/components/content-recommendations';
import SmartCTAManager from '@/components/smart-cta-manager';
import { generateWebsiteSchema } from '@/lib/schema'; // Import schema utility
import { useABTest } from '@/lib/ab-testing';
import { useLeadScoring } from '@/lib/lead-scoring';

// Define the BlogPost interface locally
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  image?: string;
  content: string;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  
  // A/B Testing for headline
  const { config: headlineConfig } = useABTest('headline_test');
  const { trackEvent } = useLeadScoring();

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const posts = await response.json();
          setAllPosts(posts);
          setFilteredPosts(posts);
        } else {
          console.error('Failed to fetch posts');
          // Set empty array as fallback
          setAllPosts([]);
          setFilteredPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Set empty array as fallback
        setAllPosts([]);
        setFilteredPosts([]);
      }
    };

    fetchPosts();
    
    // Track homepage view
    trackEvent('page_view', { page: 'homepage' });
  }, [trackEvent]);

  // Filter posts based on search term and category
  useEffect(() => {
    let filtered = allPosts;
    
    // Filter by search term
    if (searchTerm !== '') {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category (you'd need to add category field to your posts)
    if (selectedCategory !== '') {
      // This assumes you add a 'category' field to your BlogPost interface
      // filtered = filtered.filter((post) => post.category === selectedCategory);
    }
    
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, allPosts]);

  const websiteSchema = generateWebsiteSchema({
    name: 'Digital Marketing & SEO Blog',
    url: 'https://your-domain.com', // Replace with your actual domain
    description: 'A high-performance Next.js template for digital marketing and SEO professionals.',
  });

  return (
    <>
      {/* Add JSON-LD Schema for the homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <header className="bg-primary-600 text-white py-12 shadow-lg">
        <div className="container text-center">
          <h1 className="text-5xl font-extrabold leading-tight">
            {headlineConfig?.headline || 'Boost Your Online Presence'}
          </h1>
          <p className="mt-4 text-xl opacity-90">
            Insights, Strategies, and Tools for Digital Marketing & SEO Success.
          </p>
          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full max-w-md p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-300 text-zinc-900"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length > 2) {
                  trackEvent('page_view', { search_query: e.target.value });
                }
              }}
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button 
                onClick={() => {
                  trackEvent('page_view', { source: 'hero', action: 'browse_articles' });
                  document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Browse Articles
              </button>
              <button 
                onClick={() => {
                  trackEvent('newsletter_signup', { source: 'hero_cta' });
                  document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors font-semibold"
              >
                Get Weekly Tips
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-12">
        {/* Category Filter */}
        <section className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
            <CategoryTags 
              selectedCategory={selectedCategory} 
              onCategorySelect={setSelectedCategory} 
            />
          </div>
        </section>

        <section id="articles-section" className="mb-12">
          <h2 className="title text-center mb-8">Latest Articles</h2>
          {filteredPosts.length === 0 && (
            <p className="text-center text-zinc-600 dark:text-zinc-400">No articles found for your search.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} trackEvent={trackEvent} />
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section id="newsletter-section" className="mb-12">
          <NewsletterSignup />
        </section>

        {/* Content Recommendations */}
        <section className="mb-12">
          <ContentRecommendations 
            currentPost={undefined} 
            maxRecommendations={6}
          />
        </section>

        <CTASemanticSection />
        <SmartCTAManager pageType="home" />
      </main>

      <footer className="bg-zinc-800 text-white py-8 text-center">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Digital Marketing Blog. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

// Component for displaying a blog post card
function BlogPostCard({ 
  post, 
  trackEvent 
}: { 
  post: BlogPost; 
  trackEvent: (eventType: import('@/lib/lead-scoring').LeadEventType, metadata?: Record<string, any>) => void;
}) {
  return (
    <div className="card p-6 flex flex-col h-full hover-glow">
      <Link 
        href={`/blog/${post.slug}`}
        onClick={() => trackEvent('blog_read', { post_title: post.title, post_slug: post.slug })}
      >
        <h3 className="text-xl font-semibold text-primary-500 hover:underline mb-2">
          {post.title}
        </h3>
      </Link>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 flex-grow">
        {post.excerpt}
      </p>
      <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-300">
        <span>{post.date}</span>
        <Link 
          href={`/blog/${post.slug}`} 
          className="btn-secondary text-xs py-1 px-3"
          onClick={() => trackEvent('blog_read', { post_title: post.title, post_slug: post.slug })}
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
