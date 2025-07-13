import { NextResponse } from 'next/server';
import { getSortedPosts } from '@/lib/posts';

export async function GET() {
  try {
    const posts = getSortedPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
