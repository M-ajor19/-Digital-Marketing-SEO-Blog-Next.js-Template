'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FloatingElements } from '@/components/ui/floating-elements'

// Lightweight generic blur placeholder (1x1 transparent gif)
const BLUR_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

const stats = [
	{ label: 'Monthly Readers', value: '50K+' },
	{ label: 'Avg ROI Uplift', value: '148%' },
	{ label: 'Case Studies', value: '30+' },
]

const easeInOutCubic = [0.25, 0.1, 0.25, 1] as const

export function HeroSection() {
	return (
		<section className="section relative overflow-hidden">
			{/* background washes */}
			<div className="pointer-events-none absolute inset-0 opacity-60">
				<div
					className="absolute -top-24 left-0 h-[50vh] w-[60vw] rounded-full blur-3xl"
					style={{
						background:
							'radial-gradient(600px 400px at 0% 0%, hsl(var(--foreground)/0.05), transparent 50%)',
					}}
				/>
				<div
					className="absolute -top-10 right-0 h-[40vh] w-[40vw] rounded-full blur-3xl"
					style={{
						background:
							'radial-gradient(500px 350px at 100% 0%, hsl(var(--foreground)/0.04), transparent 45%)',
					}}
				/>
			</div>

			{/* subtle floating shapes */}
			<FloatingElements />

			<div className="container relative z-10 grid items-center gap-10 md:grid-cols-2">
				{/* Left: copy */}
				<div>
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							ease: easeInOutCubic,
						}}
						className="mb-4 inline-block stat-pill"
					>
						Trusted by 10,000+ marketers
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.65,
							ease: easeInOutCubic,
							delay: 0.05,
						}}
						className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance mb-5"
					>
						<span className="text-[hsl(var(--brand))]">Growth</span> Made
						Simple
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.65,
							ease: easeInOutCubic,
							delay: 0.12,
						}}
						className="text-lg md:text-xl text-muted-foreground max-w-xl"
					>
						Strategic insights and actionable tactics from industry leaders.
						Build better campaigns and scale your business.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							ease: easeInOutCubic,
							delay: 0.18,
						}}
						className="mt-8 flex items-center gap-3"
					>
						<Button size="xl" className="cta-primary" asChild>
							<Link href="/blog">
								Start Reading
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button size="xl" variant="secondary" asChild>
							<Link href="/resources">Browse Resources</Link>
						</Button>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							duration: 0.6,
							ease: easeInOutCubic,
							delay: 0.28,
						}}
						className="mt-10 grid grid-cols-3 gap-4 max-w-md"
					>
						{stats.map((s) => (
							<div
								key={s.label}
								className="rounded-2xl border border-border/60 bg-secondary/50 p-4 text-center"
							>
								<div className="text-2xl font-semibold">{s.value}</div>
								<div className="text-xs text-muted-foreground">
									{s.label}
								</div>
							</div>
						))}
					</motion.div>
				</div>

				{/* Right: visual */}
				<motion.div
					initial={{ opacity: 0, x: 30 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						duration: 0.65,
						ease: easeInOutCubic,
						delay: 0.15,
					}}
					className="relative"
				>
					<div className="relative rounded-2xl border border-border/60 bg-secondary/40 p-2 overflow-hidden">
						<div className="relative aspect-[4/3] w-full">
							<Image
								src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1800&auto=format&fit=crop"
								alt="Abstract premium hero visual"
								fill
								sizes="(min-width: 1024px) 560px, 100vw"
								className="object-cover"
								priority
								placeholder="blur"
								blurDataURL={BLUR_DATA_URL}
								fetchPriority="high"
							/>
						</div>
						{/* Overlapping stat bubbles */}
						<div className="absolute -top-3 -right-3 rounded-full bg-background/80 border border-border px-4 py-2 shadow-sm">
							SEO +32%
						</div>
						<div className="absolute bottom-6 -left-3 rounded-full bg-background/80 border border-border px-4 py-2 shadow-sm">
							CTR 5.8%
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
