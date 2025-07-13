import { NextResponse } from 'next/server';
import { getSortedPosts } from '@/lib/posts';

// Force dynamic rendering for this route since it uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';
    const author = searchParams.get('author') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    let posts = getSortedPosts();

    // Filter by search query
    if (query) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        (post.author && post.author.toLowerCase().includes(query))
      );
    }

    // Filter by category (if you add categories to your posts)
    if (category) {
      posts = posts.filter(post => 
        (post as any).category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by author
    if (author) {
      posts = posts.filter(post => 
        post.author?.toLowerCase().includes(author.toLowerCase())
      );
    }

    // Calculate pagination
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    // Add search result scoring
    const scoredPosts = paginatedPosts.map(post => {
      let score = 0;
      const searchLower = query.toLowerCase();
      
      if (post.title.toLowerCase().includes(searchLower)) score += 10;
      if (post.excerpt.toLowerCase().includes(searchLower)) score += 5;
      if (post.content.toLowerCase().includes(searchLower)) score += 1;
      
      return {
        ...post,
        searchScore: score
      };
    }).sort((a, b) => b.searchScore - a.searchScore);

    return NextResponse.json({
      posts: scoredPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        query,
        category,
        author
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
