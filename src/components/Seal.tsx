import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

interface SealProps {
  /** characters on the chop; default 我有嘉名 ("I have a fine name") */
  chars?: string
  size?: number
  /** play the press-and-settle stamp animation */
  stamp?: boolean
  className?: string
  title?: string
}

/**
 * The 印章 — the brand keystone. A square vermilion chop with white characters,
 * deliberately a touch imperfect (organic edge, faint ink unevenness). Reused as
 * the logo mark, the favicon, and the "authentic" stamp on a finished name.
 */
export function Seal({ chars = '我有嘉名', size = 64, stamp = false, className, title = '我有嘉名 — I have a fine name' }: SealProps) {
  const list = [...chars]
  // 4 chars → 2×2 read right-to-left, top-to-bottom (我有嘉名). Else a vertical column.
  const grid =
    list.length === 4
      ? [list[2], list[0], list[3], list[1]] // 嘉 我 / 名 有
      : list

  const cols = list.length === 4 ? 2 : 1
  const inner = (
    <div
      className={cn('relative select-none', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={title}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--seal-500)',
          borderRadius: Math.max(4, size * 0.08),
          // organic, slightly uneven ink edge
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 ' + Math.max(2, size * 0.05) + 'px var(--seal-500)',
          filter: 'saturate(1.05)',
        }}
      />
      {/* faint paper-bleed texture */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-20"
        style={{
          borderRadius: Math.max(4, size * 0.08),
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-0 grid place-items-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          padding: size * 0.1,
          gap: size * 0.02,
        }}
      >
        {grid.map((ch, i) => (
          <span
            key={i}
            className="han leading-none"
            style={{ color: '#FAF6EC', fontSize: cols === 2 ? size * 0.34 : size * 0.5, fontWeight: 600 }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  )

  if (!stamp) return inner
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.4, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: size, height: size }}
    >
      {inner}
    </motion.div>
  )
}
