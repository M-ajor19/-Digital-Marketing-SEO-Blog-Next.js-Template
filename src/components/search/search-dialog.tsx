'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  searchScore: number
}

interface SearchResponse {
  posts: SearchResult[]
  pagination: {
    currentPage: number
    totalPages: number
    totalPosts: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  filters: {
    query: string
    category: string
    author: string
  }
}

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [author, setAuthor] = useState('')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const categories = ['SEO','PPC','Social Media','Content Marketing','Email Marketing','Analytics','Strategy']

  // Fetch search results (debounced)
  useEffect(() => {
    if (!isOpen) return
    const handle = setTimeout(async () => {
      if (!query.trim() && !category && !author) {
        setResults(null)
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const url = new URL('/api/search', window.location.origin)
        if (query.trim()) url.searchParams.set('q', query)
        url.searchParams.set('limit', '5')
        if (category) url.searchParams.set('category', category)
        if (author.trim()) url.searchParams.set('author', author)
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Search failed')
        const data: SearchResponse = await res.json()
        setResults(data)
        setActiveIndex(0)
      } catch (e) {
        setResults({
          posts: [],
          pagination: { currentPage: 1, totalPages: 1, totalPosts: 0, hasNextPage: false, hasPrevPage: false },
          filters: { query: '', category: '', author: '' },
        })
      } finally {
        setIsLoading(false)
      }
    }, 250)
    return () => clearTimeout(handle)
  }, [query, category, author, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50)
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (!results?.posts?.length) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.posts.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const post = results.posts[activeIndex]
        if (post) {
          window.location.href = `/blog/${post.slug}`
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, results, activeIndex, onClose])

  const highlight = useMemo(() => {
    if (!query.trim()) return (t: string) => t
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const reg = new RegExp(`(${esc})`, 'ig')
    return (t: string) => t.split(reg).map((part, i) => (
      i % 2 === 1 ? <mark key={i} className="bg-primary/20 text-primary px-0.5 rounded">{part}</mark> : part
    ))
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-xl -translate-x-1/2 rounded-lg border bg-popover p-4 shadow-lg"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Search Articles</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for articles, topics, or authors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                autoFocus
                aria-label="Search"
              />
            </div>

            {/* Filters */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Category filter"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Filter by author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Author filter"
              />
            </div>

            {/* Results */}
            <div className="mt-3">
              {isLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              )}

              {!isLoading && results && (
                <div role="listbox" aria-label="Search results" className="divide-y divide-border rounded-md border mt-2">
                  {results.posts.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground">No results for “{query}”.</div>
                  )}
                  {results.posts.map((post, idx) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      role="option"
                      aria-selected={activeIndex === idx}
                      className={
                        'block p-3 hover:bg-accent/50 focus:bg-accent/50 outline-none ' +
                        (activeIndex === idx ? 'bg-accent/50' : '')
                      }
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={onClose}
                    >
                      <div className="text-sm font-medium">{highlight(post.title)}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{highlight(post.excerpt)}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Use ↑ ↓ to navigate, Enter to open</span>
              <span>Esc to close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
