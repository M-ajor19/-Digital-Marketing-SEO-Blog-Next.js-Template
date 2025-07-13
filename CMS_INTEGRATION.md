# Headless CMS Integration Guide

This guide covers integrating popular headless CMS solutions with your Digital Marketing & SEO Blog Next.js template.

## Table of Contents
1. [Sanity.io Integration](#sanityio-integration)
2. [Contentful Integration](#contentful-integration) 
3. [Strapi Integration](#strapi-integration)
4. [Ghost CMS Integration](#ghost-cms-integration)
5. [WordPress Headless Integration](#wordpress-headless-integration)

## Sanity.io Integration

### 1. Installation

```bash
npm install @sanity/client @sanity/image-url next-sanity
npm install -D @sanity/cli
```

### 2. Setup Sanity Studio

```bash
npx sanity init
```

### 3. Configuration

Create `lib/sanity.ts`:

```typescript
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
})

const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => builder.image(source)
```

### 4. Schema Definitions

Create `schemas/blog.js` in your Sanity project:

```javascript
export default {
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'}
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}]
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string'
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text'
        },
        {
          name: 'focusKeyword',
          title: 'Focus Keyword',
          type: 'string'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage'
    },
    prepare(selection) {
      const {author} = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      })
    }
  }
}
```

### 5. Data Fetching

```typescript
// lib/sanity-queries.ts
import { client } from './sanity'

export async function getAllPosts() {
  return await client.fetch(`
    *[_type == "blog"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author->{name, image},
      excerpt,
      featuredImage,
      categories[]->{title, slug},
      publishedAt,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
    }
  `)
}

export async function getPostBySlug(slug: string) {
  return await client.fetch(`
    *[_type == "blog" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      author->{name, image, bio},
      excerpt,
      featuredImage,
      body,
      categories[]->{title, slug},
      publishedAt,
      seo,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
    }
  `, { slug })
}
```

---

## Contentful Integration

### 1. Installation

```bash
npm install contentful
```

### 2. Configuration

Create `lib/contentful.ts`:

```typescript
import { createClient } from 'contentful'

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export interface BlogPost {
  fields: {
    title: string
    slug: string
    excerpt: string
    content: any
    featuredImage: {
      fields: {
        file: {
          url: string
        }
      }
    }
    author: {
      fields: {
        name: string
        avatar: any
      }
    }
    publishDate: string
    categories: Array<{
      fields: {
        title: string
        slug: string
      }
    }>
    seoTitle?: string
    seoDescription?: string
  }
}
```

### 3. Data Fetching

```typescript
// lib/contentful-api.ts
import { client, BlogPost } from './contentful'

export async function getAllPosts(): Promise<BlogPost[]> {
  const response = await client.getEntries({
    content_type: 'blogPost',
    order: '-fields.publishDate',
  })
  
  return response.items as BlogPost[]
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  })
  
  return response.items[0] as BlogPost || null
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const response = await client.getEntries({
    content_type: 'blogPost',
    'fields.categories.sys.contentType.sys.id': 'category',
    'fields.categories.fields.slug': categorySlug,
    order: '-fields.publishDate',
  })
  
  return response.items as BlogPost[]
}
```

---

## Strapi Integration

### 1. Installation

```bash
npm install @strapi/sdk-js
```

### 2. Configuration

```typescript
// lib/strapi.ts
import Strapi from '@strapi/sdk-js'

const strapi = new Strapi({
  url: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  prefix: '/api',
  store: {
    key: 'strapi_jwt',
    useLocalStorage: false,
    cookieOptions: { path: '/' },
  },
  axiosOptions: {},
})

export default strapi

export interface StrapiPost {
  id: number
  attributes: {
    title: string
    slug: string
    excerpt: string
    content: string
    publishedAt: string
    createdAt: string
    updatedAt: string
    featuredImage: {
      data: {
        attributes: {
          url: string
          alternativeText: string
        }
      }
    }
    author: {
      data: {
        attributes: {
          name: string
          avatar: any
        }
      }
    }
    categories: {
      data: Array<{
        attributes: {
          name: string
          slug: string
        }
      }>
    }
    seo: {
      metaTitle: string
      metaDescription: string
      keywords: string
    }
  }
}
```

### 3. API Functions

```typescript
// lib/strapi-api.ts
import strapi, { StrapiPost } from './strapi'

export async function getAllPosts(): Promise<StrapiPost[]> {
  const response = await strapi.find('blog-posts', {
    populate: ['featuredImage', 'author', 'categories', 'seo'],
    sort: ['publishedAt:desc'],
  })
  
  return response.data
}

export async function getPostBySlug(slug: string): Promise<StrapiPost | null> {
  const response = await strapi.find('blog-posts', {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: ['featuredImage', 'author', 'categories', 'seo'],
  })
  
  return response.data[0] || null
}
```

---

## Implementation Example

Here's how to modify your existing blog pages to work with any CMS:

### 1. Update `app/blog/page.tsx`

```typescript
import { getAllPosts } from '@/lib/your-cms-api'
import BlogGrid from '@/components/blog-grid'

export default async function BlogPage() {
  const posts = await getAllPosts()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12">Latest Articles</h1>
      <BlogGrid posts={posts} />
    </div>
  )
}
```

### 2. Update `app/blog/[slug]/page.tsx`

```typescript
import { getPostBySlug, getAllPosts } from '@/lib/your-cms-api'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <article className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="prose max-w-none">
        {/* Render post content based on your CMS format */}
      </div>
    </article>
  )
}
```

## Environment Variables

Add these to your `.env.local`:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Contentful
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token

# Strapi
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# WordPress
WORDPRESS_API_URL=https://your-site.com/wp-json/wp/v2
```

## Content Modeling Best Practices

### Required Fields for Blog Posts
- **Title**: SEO-optimized title
- **Slug**: URL-friendly identifier
- **Excerpt**: Meta description and preview text
- **Content/Body**: Main article content
- **Author**: Reference to author content type
- **Published Date**: Publication timestamp
- **Featured Image**: Main article image
- **Categories/Tags**: Content classification
- **SEO Fields**: Meta title, description, keywords

### SEO Content Structure
```json
{
  "seo": {
    "metaTitle": "Custom title or fallback to post title",
    "metaDescription": "Custom description or fallback to excerpt",
    "focusKeyword": "Primary SEO keyword",
    "canonicalUrl": "Canonical URL if different",
    "noIndex": false,
    "noFollow": false,
    "ogTitle": "Custom OpenGraph title",
    "ogDescription": "Custom OpenGraph description",
    "ogImage": "Custom social sharing image"
  }
}
```

## Conclusion

Choose the CMS that best fits your needs:

- **Sanity**: Great for developers, flexible schemas, real-time collaboration
- **Contentful**: User-friendly, great API, excellent CDN
- **Strapi**: Self-hosted, full control, customizable
- **Ghost**: Publishing-focused, built-in SEO, great for content teams
- **WordPress**: Most popular, extensive ecosystem, familiar to content creators

Each integration maintains the same API surface, making it easy to switch between CMSs if needed.
