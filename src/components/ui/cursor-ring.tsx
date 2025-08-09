"use client"

import { useEffect, useRef } from 'react'

export function CursorRing() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    if (!root || !ring || !dot) return

    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isCoarse || prefersReducedMotion) {
      // Hide on touch devices or when user prefers reduced motion
      root.style.display = 'none'
      return
    }

    let raf = 0
    let mx = -9999, my = -9999 // start hidden offscreen
    let tx = mx, ty = my
    let s = 1, ts = 1 // scale & target scale
    let o = 0, to = 0 // opacity & target opacity
    let idleTimer: number | undefined

    const scheduleIdle = () => {
      if (idleTimer) window.clearTimeout(idleTimer)
      // keep calmer idle fade
      idleTimer = window.setTimeout(() => { to = 0 }, 1600)
    }

    const move = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      // dot follows directly for crispness
      dot.style.transform = `translate(${mx - 2}px, ${my - 2}px)`
      to = 1
      scheduleIdle()
    }

    const loop = () => {
      // speed up while keeping smoothness
      tx += (mx - tx) * 0.16
      ty += (my - ty) * 0.16
      s += (ts - s) * 0.18
      o += (to - o) * 0.18
      ring.style.transform = `translate(${tx - 12}px, ${ty - 12}px) scale(${s})`
      ring.style.opacity = String(o)
      dot.style.opacity = String(Math.min(1, o + 0.2))
      raf = requestAnimationFrame(loop)
    }

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, input, textarea, select, [role="button"], [data-interactive="true"]')
      if (interactive) {
        ring.style.borderColor = 'hsl(var(--brand))'
        ts = 1.06
      } else {
        ring.style.borderColor = 'hsl(var(--muted-foreground) / 0.4)'
        ts = 1
      }
    }

    const onLeave = () => {
      to = 0
    }

    const onClick = (e: PointerEvent) => {
      const ripple = document.createElement('div')
      ripple.style.position = 'absolute'
      ripple.style.left = `${e.clientX - 12}px`
      ripple.style.top = `${e.clientY - 12}px`
      ripple.style.width = '24px'
      ripple.style.height = '24px'
      ripple.style.borderRadius = '9999px'
      ripple.style.border = '2px solid hsl(var(--brand))'
      ripple.style.opacity = '0.4'
      ripple.style.transform = 'scale(0)'
      // keep ripple timings
      ripple.style.transition = 'transform 400ms ease-out, opacity 520ms ease-out'
      root.appendChild(ripple)
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(2.2)'
        ripple.style.opacity = '0'
      })
      window.setTimeout(() => ripple.remove(), 520)
    }

    // Pointer events with passive listeners for smoother scroll/paint
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', onOver)
    window.addEventListener('pointerout', onOver)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onClick)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      if (idleTimer) window.clearTimeout(idleTimer)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOver)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onClick)
    }
  }, [])

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <div
        ref={ringRef}
        className="h-6 w-6 rounded-full border border-muted-foreground/40 will-change-transform will-change-opacity"
        style={{ transition: 'border-color 200ms ease-out' }}
      />
      <div ref={dotRef} className="h-1 w-1 rounded-full bg-foreground will-change-transform will-change-opacity" />
    </div>
  )
}
