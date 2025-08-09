'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/posts';
import { trackLeadEvent } from '@/lib/lead-scoring';

interface RelatedPost extends BlogPost {
  similarity: number;
  readingTime: number;
}

interface ContentRecommendationsProps {
  currentPost?: BlogPost;
  maxRecommendations?: number;
  className?: string;
}

export default function ContentRecommendations({
  currentPost,
  maxRecommendations = 3,
  className = ''
}: ContentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      setIsLoading(true);
      try {
        const related = await getRelatedPosts(currentPost, maxRecommendations);
        setRecommendations(related);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecommendations();
  }, [currentPost, maxRecommendations]);

  const handlePostClick = (post: RelatedPost) => {
    // Track content engagement
    trackLeadEvent('blog_read', {
      postTitle: post.title,
      postSlug: post.slug,
      similarity: post.similarity,
      source: 'recommendations',
    });
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
              <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Recommended for You</h3>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          AI-powered suggestions
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((post) => (
          <RecommendationCard
            key={post.slug}
            post={post}
            onClick={() => handlePostClick(post)}
          />
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ 
  post, 
  onClick 
}: { 
  post: RelatedPost; 
  onClick: () => void; 
}) {
  return (
    <div className="card p-6 hover-glow transition-transform hover:scale-105">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {post.readingTime} min read
        </div>
        <div className="flex items-center text-xs text-green-600 dark:text-green-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          {Math.round(post.similarity * 100)}% match
        </div>
      </div>
      
      <Link href={`/blog/${post.slug}`} onClick={onClick}>
        <h4 className="text-lg font-semibold text-primary-500 hover:underline mb-2 line-clamp-2">
          {post.title}
        </h4>
      </Link>
      
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-300">
        <span>By {post.author}</span>
        <Link 
          href={`/blog/${post.slug}`} 
          onClick={onClick}
          className="btn-secondary text-xs py-1 px-3"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

// Content recommendation algorithm
async function getRelatedPosts(
  currentPost?: BlogPost,
  maxResults: number = 3
): Promise<RelatedPost[]> {
  // In a real implementation, this would call your recommendation API
  // For now, we'll simulate intelligent recommendations
  
  const allPosts = await getAllBlogPosts();
  
  if (!currentPost) {
    // Return popular posts if no current post
    return allPosts
      .slice(0, maxResults)
      .map(post => ({
        ...post,
        similarity: 0.8,
        readingTime: calculateReadingTime(post.content),
      }));
  }
  
  // Calculate similarity scores
  const scoredPosts = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => ({
      ...post,
      similarity: calculateSimilarity(currentPost, post),
      readingTime: calculateReadingTime(post.content),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults);
  
  return scoredPosts;
}

// Simple content similarity calculation
function calculateSimilarity(postA: BlogPost, postB: BlogPost): number {
  const wordsA = extractKeywords(postA.title + ' ' + postA.excerpt);
  const wordsB = extractKeywords(postB.title + ' ' + postB.excerpt);
  
  const intersection = wordsA.filter(word => wordsB.includes(word));
  const union = Array.from(new Set([...wordsA, ...wordsB]));
  
  const jaccardSimilarity = intersection.length / union.length;
  
  // Add some randomness to avoid always showing the same recommendations
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  
  return Math.min(jaccardSimilarity * randomFactor, 1);
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
  ]);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 20); // Limit to top 20 keywords
}

// Calculate reading time based on word count
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Mock function to get all blog posts (replace with your actual implementation)
async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/posts');
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to fetch posts from API');
      // Fallback to sample posts if API fails
      return getSamplePosts();
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Fallback to sample posts if API fails
    return getSamplePosts();
  }
}

function getSamplePosts(): BlogPost[] {
  // Fallback sample posts if API is not available
  return [
    {
      slug: 'future-of-seo',
      title: 'The Future of SEO: What You Need to Know in 2025',
      date: '2025-07-10',
      excerpt: 'Explore the evolving landscape of SEO and discover key strategies to stay ahead in 2025.',
      author: 'Jane Doe',
      content: 'The world of Search Engine Optimization is constantly evolving...',
    },
    {
      slug: 'digital-marketing-strategy',
      title: 'Building a Robust Digital Marketing Strategy for Small Businesses',
      date: '2025-06-25',
      excerpt: 'Small businesses can thrive online with the right digital marketing strategy.',
      author: 'John Smith',
      content: 'For small businesses, a well-defined digital marketing strategy...',
    },
    {
      slug: 'content-marketing-guide',
      title: 'Content Marketing: Creating Valuable Content That Converts',
      date: '2025-07-05',
      excerpt: 'Learn how to create compelling content that not only engages your audience but also drives conversions.',
      author: 'Sarah Johnson',
      content: 'Content marketing remains one of the most effective ways...',
    },
  ];
}

// Popular posts component
export function PopularPosts({ 
  maxPosts = 5,
  className = '' 
}: { 
  maxPosts?: number;
  className?: string;
}) {
  const [popularPosts, setPopularPosts] = useState<RelatedPost[]>([]);
  
  useEffect(() => {
    async function loadPopularPosts() {
      const posts = await getRelatedPosts(undefined, maxPosts);
      setPopularPosts(posts);
    }
    
    loadPopularPosts();
  }, [maxPosts]);
  
  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-bold mb-4">Popular Articles</h3>
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          <div key={post.slug} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <Link 
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-primary-500 line-clamp-2"
                onClick={() => trackLeadEvent('blog_read', { 
                  postTitle: post.title, 
                  source: 'popular_posts' 
                })}
              >
                {post.title}
              </Link>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {post.readingTime} min read • {post.author}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
