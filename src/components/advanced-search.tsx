'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLeadScoring } from '@/lib/lead-scoring';

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  searchScore: number;
}

interface SearchResponse {
  posts: SearchResult[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    query: string;
    category: string;
    author: string;
  };
}

interface AdvancedSearchProps {
  initialQuery?: string;
  onResultClick?: (post: SearchResult) => void;
}

export default function AdvancedSearch({ initialQuery = '', onResultClick }: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { trackEvent } = useLeadScoring();

  const searchPosts = useCallback(async (searchQuery: string, searchCategory: string, searchAuthor: string, page: number = 1) => {
    if (!searchQuery.trim() && !searchCategory && !searchAuthor) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        limit: '6'
      });
      
      if (searchCategory) params.append('category', searchCategory);
      if (searchAuthor) params.append('author', searchAuthor);

      const response = await fetch(`/api/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        
        // Track search event
        trackEvent('page_view', {
          search_query: searchQuery,
          results_count: data.pagination.totalPosts
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [trackEvent]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPosts(query, category, author, currentPage);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, category, author, currentPage, searchPosts]);

  const handleResultClick = (post: SearchResult) => {
    trackEvent('blog_read', {
      postTitle: post.title,
      postSlug: post.slug,
      source: 'search',
      searchQuery: query
    });
    
    if (onResultClick) {
      onResultClick(post);
    }
  };

  const categories = [
    'SEO',
    'PPC',
    'Social Media',
    'Content Marketing',
    'Email Marketing',
    'Analytics',
    'Strategy'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Articles
            </label>
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for SEO tips, marketing strategies..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Filter by author name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      )}

      {/* Search Results */}
      {results && !isLoading && (
        <div>
          {/* Results Summary */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Search Results</h2>
            <p className="text-gray-600">
              Found {results.pagination.totalPosts} articles
              {results.filters.query && ` for "${results.filters.query}"`}
              {results.filters.category && ` in ${results.filters.category}`}
            </p>
          </div>

          {/* Results Grid */}
          {results.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {results.posts.map((post) => (
                <article key={post.slug} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600">
                        Score: {post.searchScore}
                      </span>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      onClick={() => handleResultClick(post)}
                      className="block group"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        By {post.author}
                      </span>
                      <Link 
                        href={`/blog/${post.slug}`}
                        onClick={() => handleResultClick(post)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {results.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!results.pagination.hasPrevPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <span className="text-gray-600">
                Page {results.pagination.currentPage} of {results.pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!results.pagination.hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
