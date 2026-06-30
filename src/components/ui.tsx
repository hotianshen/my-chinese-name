import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../lib/cn'

/** Small-caps gold eyebrow label, e.g. "METHODOLOGY · 法" */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('eyebrow', className)}>{children}</p>
}

/** A gold hairline that draws in from the left when scrolled into view. */
export function Hairline({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={cn('hairline', className)}
      style={{ transform: vis ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
    />
  )
}

/** Fade-and-rise reveal on scroll. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={cn('reveal-on-scroll', vis && 'is-visible', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function Container({ children, className, reading = false }: { children: ReactNode; className?: string; reading?: boolean }) {
  return <div className={cn(reading ? 'container-reading' : 'container-band', className)}>{children}</div>
}

export function SectionHeading({
  eyebrow, title, lede, center, className,
}: { eyebrow?: ReactNode; title: ReactNode; lede?: ReactNode; center?: boolean; className?: string }) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow className="mb-md">{eyebrow}</Eyebrow>}
      <h2 className="text-display-2 md:text-display-1 text-balance">{title}</h2>
      {lede && <p className="text-lede text-ink-500 mt-lg text-pretty">{lede}</p>}
    </div>
  )
}
