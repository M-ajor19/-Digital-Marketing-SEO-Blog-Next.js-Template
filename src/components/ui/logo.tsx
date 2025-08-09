"use client"

import Link from 'next/link'
import { Staatliches } from 'next/font/google'
import { cn } from '@/lib/utils'

const staatliches = Staatliches({ subsets: ['latin'], weight: '400' })

interface LogoProps {
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ href = '/', className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-4xl md:text-5xl',
  }[size]

  const Wordmark = (
    <div
      className={cn(
        staatliches.className,
        'logo select-none tracking-[0.15em] text-muted-foreground',
        sizes,
        className
      )}
      aria-label="MU RANKSPACE"
    >
      <span className="whitespace-nowrap">
        MU RANKSP<span className="a relative inline-block">A</span>CE
      </span>

      {/* Stencil cutout styling */}
      <style jsx>{`
        .logo { font-weight: 700; letter-spacing: 0.15em; }
        .logo .a::before {
          content: "";
          position: absolute;
          top: 0.62em;
          left: 0.36em;
          width: 0.45em;
          height: 0.45em;
          background: transparent;
          box-shadow: 0 0 0 9999px hsl(var(--background));
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
      `}</style>
    </div>
  )

  if (!href) return Wordmark
  return (
    <Link href={href} className="inline-flex items-center" aria-label="MU RANKSPACE home">
      {Wordmark}
    </Link>
  )
}
