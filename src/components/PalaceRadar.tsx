import type { PalaceScore } from '../engine/types'
import { PALACES } from '../content/method'

interface Props {
  scores: PalaceScore[]
  size?: number
  showLabels?: boolean
}

/**
 * The twelve-palace radar (命盘) — twelve spokes around a circle, each reaching
 * out by its 1–5 score. The brand's hero infographic and proof-of-rigour.
 */
export function PalaceRadar({ scores, size = 380, showLabels = true }: Props) {
  const cx = size / 2
  const cy = size / 2
  const pad = showLabels ? size * 0.16 : size * 0.06
  const R = size / 2 - pad
  const n = 12
  const max = 5

  // map score keys → score, in PALACES order
  const byKey = new Map(scores.map((s) => [s.key, s]))
  const ordered = PALACES.map((p) => ({ palace: p, score: byKey.get(p.key)?.score ?? 3 }))

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2
  const point = (i: number, r: number) => {
    const a = angleFor(i)
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const
  }

  const tierColor = (tier: string) =>
    tier === 'heaven' ? 'var(--seal-500)' : tier === 'human' ? 'var(--gold-600)' : 'var(--info)'

  const polygon = ordered
    .map((o, i) => point(i, (o.score / max) * R).join(','))
    .join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" role="img" aria-label="Twelve-Palace scorecard">
      {/* concentric rings */}
      {[1, 2, 3, 4, 5].map((ring) => (
        <circle key={ring} cx={cx} cy={cy} r={(ring / max) * R} fill="none" stroke="var(--line-soft)" strokeWidth={1} />
      ))}
      {/* spokes */}
      {ordered.map((_, i) => {
        const [x, y] = point(i, R)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line-soft)" strokeWidth={1} />
      })}

      {/* the score polygon */}
      <polygon
        points={polygon}
        fill="color-mix(in srgb, var(--seal-500) 14%, transparent)"
        stroke="var(--seal-500)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        style={{ transition: 'all .6s cubic-bezier(0.22,1,0.36,1)' }}
      />
      {/* vertices */}
      {ordered.map((o, i) => {
        const [x, y] = point(i, (o.score / max) * R)
        return <circle key={i} cx={x} cy={y} r={3} fill={tierColor(o.palace.tier)} />
      })}

      {/* labels — the single Chinese key word per palace */}
      {showLabels &&
        ordered.map((o, i) => {
          const [x, y] = point(i, R + pad * 0.62)
          return (
            <g key={i}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="han"
                style={{ fontSize: size * 0.052, fill: 'var(--ink-700)', fontWeight: 600 }}
              >
                {o.palace.word}
              </text>
              <text
                x={x}
                y={y + size * 0.05}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: size * 0.03, fill: tierColor(o.palace.tier), fontFamily: 'Fraunces, serif' }}
              >
                {o.score}
              </text>
            </g>
          )
        })}
      {/* center seal dot */}
      <circle cx={cx} cy={cy} r={size * 0.012} fill="var(--seal-500)" />
    </svg>
  )
}
