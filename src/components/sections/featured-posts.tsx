'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Lightweight generic blur placeholder (1x1 transparent gif)
const BLUR_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
const FALLBACK_IMAGE = 'https://placehold.co/800x450/111827/FFFFFF?text=Featured+Image'

interface BlogPost {
	slug: string
	title: string
	date: string
	excerpt: string
	author: string
	image?: string
	content: string
}

export function FeaturedPosts({ initialPosts = [] as BlogPost[] }: { initialPosts?: BlogPost[] }) {
	function estimateReadTime(content: string) {
		const words = content?.trim()?.split(/\s+/).length || 0
		const minutes = Math.max(1, Math.round(words / 200))
		return `${minutes} min`
	}

	const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
	const [loading, setLoading] = useState(initialPosts.length === 0)

	useEffect(() => {
		if (initialPosts.length > 0) return // no fetch needed

		let active = true
		const load = async () => {
			try {
				const res = await fetch('/api/posts')
				if (!res.ok) return
				const all: BlogPost[] = await res.json()
				const latest = [...all]
					.sort((a, b) => +new Date(b.date) - +new Date(a.date))
					.slice(0, 3)
				if (active) setPosts(latest)
			} finally {
				if (active) setLoading(false)
			}
		}
		load()
		return () => { active = false }
	}, [initialPosts])

	const items: (BlogPost | null)[] = loading ? Array.from({ length: 2 }).map(() => null) : posts

	return (
		<section className="py-20 md:py-24">
			<div className="container">
				<div className="text-center mb-10 md:mb-16">
					<h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
						Latest Insights
					</h2>
					<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
						Actionable strategies from marketing leaders
					</p>
				</div>

				<div className="grid gap-8 md:gap-10">
					{items.map((post, i) => (
						<motion.article
							key={post?.slug ?? `skeleton-${i}`}
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.45,
								ease: 'easeOut',
								delay: i * 0.05,
							}}
							className="group grid md:grid-cols-2 gap-6 md:gap-8 items-center card-border rounded-xl"
						>
							<div className="card p-6 md:p-8">
								{post ? (
									<>
										<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
											<div className="flex items-center gap-1">
												<Calendar className="h-3 w-3" />
												{new Date(post.date).toLocaleDateString()}
											</div>
											<div className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{estimateReadTime(post.content)}
											</div>
										</div>

										<h3 className="text-xl md:text-2xl font-semibold leading-tight mb-2">
											<Link
												href={`/blog/${post.slug}`}
												className="link-underline"
											>
												{post.title}
											</Link>
										</h3>

										<p className="text-muted-foreground leading-relaxed mb-6">
											{post.excerpt}
										</p>

										<div className="flex items-center justify-between">
											<span className="text-sm text-muted-foreground">
												By {post.author}
											</span>
											<Button variant="ghost" size="sm" asChild>
												<Link href={`/blog/${post.slug}`}>
													Read More
													<ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</div>
									</>
								) : (
									<div className="h-[140px] rounded-lg bg-muted/40 animate-pulse" />
								)}
							</div>

							<div className="rounded-xl overflow-hidden border border-border/60 bg-secondary/40">
								{post ? (
									<div className="aspect-video relative w-full">
										<Image
											src={post.image || FALLBACK_IMAGE}
											alt={post.title}
											fill
											sizes="(min-width: 768px) 50vw, 100vw"
											className="object-cover"
											priority={i === 0}
											placeholder="blur"
											blurDataURL={BLUR_DATA_URL}
										/>
									</div>
								) : (
									<div className="aspect-video w-full grid place-items-center text-muted-foreground text-sm">
										Featured Image
									</div>
								)}
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	)
}
