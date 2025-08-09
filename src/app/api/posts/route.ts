export const dynamic = 'force-static'
export const revalidate = 60

import { NextResponse } from 'next/server';
import { getSortedPosts } from '@/lib/posts';

export async function GET() {
  try {
    const posts = getSortedPosts();
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
