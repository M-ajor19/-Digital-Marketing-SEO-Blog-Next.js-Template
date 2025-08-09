'use client';

import { useEffect, useState } from 'react';
import { getPostBySlug, getAllPostSlugs, BlogPost, getSortedPosts } from '@/lib/posts';
import { generateArticleSchema } from '@/lib/schema';
import Link from 'next/link';
import CTASemanticSection from '@/components/cta-section';
import ContentRecommendations from '@/components/content-recommendations';
import { useLeadScoring } from '@/lib/lead-scoring';

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const { trackEvent } = useLeadScoring();

  useEffect(() => {
    const currentPost = getPostBySlug(params.slug);
    const posts = getSortedPosts();
    
    setPost(currentPost ?? null);
    setAllPosts(posts);

    // Track blog read event
    if (currentPost) {
      trackEvent('blog_read', {
        postTitle: currentPost.title,
        postSlug: currentPost.slug,
        author: currentPost.author || 'Anonymous',
      });
    }
  }, [params.slug, trackEvent]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Generate article schema for the current post
  const articleSchema = generateArticleSchema({
    headline: post.title,
    description: post.excerpt,
    author: post.author || 'Digital Marketing Team',
    datePublished: post.date,
    url: `https://your-domain.com/blog/${post.slug}`, // Replace with your actual domain
  });

  return (
    <>
      {/* Add JSON-LD Schema for the article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-gray-500 mb-8 not-prose">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/#articles-section" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8 not-prose">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-600 text-sm">
              {post.author && (
                <>
                  <span>By {post.author}</span>
                  <span className="mx-2">•</span>
                </>
              )}
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</time>
            </div>
          </header>

          {/* Article Content */}
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="prose prose-lg max-w-none"
            style={{
              lineHeight: '1.8',
              fontSize: '1.1rem'
            }}
          />

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200 not-prose">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  trackEvent('social_share', { platform: 'twitter', post: post.slug });
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
                className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => {
                  trackEvent('social_share', { platform: 'linkedin', post: post.slug });
                  window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
              >
                Share on LinkedIn
              </button>
              <button
                onClick={() => {
                  trackEvent('social_share', { platform: 'facebook', post: post.slug });
                  window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Share on Facebook
              </button>
            </div>
          </div>
        </article>

        {/* Content Recommendations */}
        <section className="mt-16">
          <ContentRecommendations 
            currentPost={post} 
            maxRecommendations={3}
          />
        </section>

        {/* CTA Section */}
        <section className="mt-16">
          <CTASemanticSection />
        </section>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/#articles-section"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => trackEvent('page_view', { source: 'blog_post', destination: 'blog_list' })}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </main>
    </>
  );
}
