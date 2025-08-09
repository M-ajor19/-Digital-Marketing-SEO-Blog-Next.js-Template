'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, Search, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MobileNav } from './mobile-nav'
import { SearchDialog } from '@/components/search/search-dialog'
import { Logo } from '@/components/ui/logo'

const navigation = [
	{ name: 'Blog', href: '/blog' },
	{ name: 'Resources', href: '/resources' },
	{ name: 'About', href: '/about' },
]

export function Header() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isHidden, setIsHidden] = useState(false)
	const lastY = useRef(0)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const pathname = usePathname()
	const { theme, setTheme } = useTheme()

	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY
			setIsScrolled(y > 8)
			const goingDown = y > lastY.current
			// Hide when scrolling down, reveal when scrolling up
			setIsHidden(goingDown && y > 72)
			lastY.current = y
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	// Keyboard shortcuts for search (⌘K / Ctrl+K), and Esc to close
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null
			const tag = target?.tagName
			const isEditing =
				target?.isContentEditable ||
				tag === 'INPUT' ||
				tag === 'TEXTAREA' ||
				tag === 'SELECT'
			if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
				if (isEditing) return
				e.preventDefault()
				setIsSearchOpen((v) => !v)
			}
			if (e.key === 'Escape') {
				setIsSearchOpen(false)
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	return (
		<>
			<motion.header
				className={cn(
					'sticky top-0 z-50 w-full transition-all duration-300 will-change-transform',
					isScrolled
						? 'bg-background/70 backdrop-blur-md border-b border-border/60'
						: 'bg-transparent',
					isHidden ? '-translate-y-full' : 'translate-y-0'
				)}
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ type: 'spring', stiffness: 300, damping: 30 }}
			>
				<div className="container">
					<div className="flex h-16 items-center justify-between">
						{/* Logo */}
						<Link
							href="/"
							className="flex items-center gap-2 hover:opacity-90 transition-opacity"
							aria-label="MU RANKSPACE home"
						>
							<Logo size="sm" />
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center gap-8">
							{navigation.map((item) => {
								const active = pathname === item.href
								return (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											'text-sm font-medium text-muted-foreground hover:text-foreground nav-underline',
											active && 'text-foreground is-active'
										)}
									>
										{item.name}
									</Link>
								)
							})}
						</nav>

						{/* Right Actions */}
						<div className="flex items-center gap-3">
							{/* Search */}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsSearchOpen(true)}
								className="hidden md:inline-flex items-center gap-2 text-muted-foreground hover:text-foreground px-3"
								aria-label="Open search"
								type="button"
							>
								<Search className="h-4 w-4" />
								<span className="text-sm">Search</span>
								<kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground hidden lg:inline-flex">
									⌘K
								</kbd>
							</Button>

							{/* Theme Toggle */}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
								className="text-muted-foreground hover:text-foreground w-9 h-9 p-0"
								aria-label="Toggle theme"
								type="button"
							>
								<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
							</Button>

							{/* CTA Button */}
							<Button asChild className="hidden md:inline-flex h-9 px-4 text-sm">
								<Link href="/newsletter">Subscribe</Link>
							</Button>

							{/* Mobile Menu */}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsMobileMenuOpen(true)}
								className="md:hidden w-9 h-9 p-0"
								aria-label="Open menu"
								type="button"
							>
								<Menu className="h-5 w-5" />
							</Button>
						</div>
					</div>
				</div>
			</motion.header>

			{/* Mobile Navigation */}
			<MobileNav
				navigation={navigation}
				isOpen={isMobileMenuOpen}
				onClose={() => setIsMobileMenuOpen(false)}
			/>

			{/* Command palette style Search */}
			<SearchDialog
				isOpen={isSearchOpen}
				onClose={() => setIsSearchOpen(false)}
			/>
		</>
	)
}
