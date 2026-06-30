// ============================================================================
// The Twelve-Palace Scorecard (Appendix 8, Tool 1). Each palace asks one
// question, answered 1–5 from computed signals. This is the product's
// "proof of rigour": every name shows its reckoning.
// ============================================================================
import type { Anchor, CharRecord, Intake, PalaceScore, RiskFlag, SurnameRecord } from './types'
import { soundMatchScore, toneHarmony } from './phonetics'
import { prudenceScore } from './risk'
import { professionSignal } from './data'

const IMAGERY_THEMES = new Set(['Nature & Landscape', 'Light & Clarity'])
const ASPIRATION_THEMES = new Set(['Ambition & Purpose', 'Character & Virtue', 'Peace & Joy'])

// markers that a character carries a classical source in its gloss
const CLASSIC_MARKERS = [
  'Analects', 'Book of', 'Songs of Chu', 'Book of Songs', 'Book of Changes', 'Book of Documents',
  'Doctrine of the Mean', 'Du Fu', 'Su Shi', 'Zhuangzi', 'Records of', 'Classic', 'poet', '(Analects)',
]
export function classicalSourceOf(given: CharRecord[]): string | undefined {
  for (const c of given) {
    for (const m of CLASSIC_MARKERS) {
      if (c.meaning.includes(m)) {
        // pull a short clause around the marker for display
        const idx = c.meaning.indexOf(m)
        const slice = c.meaning.slice(Math.max(0, idx - 4), idx + 60)
        return `“${c.hanzi}” — ${slice.replace(/^[—;,:\s]+/, '').trim()}…`
      }
    }
  }
  return undefined
}

function to5(signal: number): number {
  return Math.max(1, Math.min(5, Math.round(1 + 4 * signal)))
}

interface ScoreCtx {
  surname: SurnameRecord | null
  given: CharRecord[]
  anchor: Anchor
  intake: Intake
  risks: RiskFlag[]
}

export function scoreTwelvePalaces(ctx: ScoreCtx): { scorecard: PalaceScore[]; total: number } {
  const { surname, given, anchor, intake, risks } = ctx
  const tones = [...(surname ? [surname.tone] : []), ...given.map((g) => g.tone)]
  const themes = new Set(intake.themes)

  // —— signals ——
  // theme alignment (Meaning / Taiji)
  const themeHits = given.filter((g) => themes.has(g.theme)).length
  const themeSignal = given.length ? 0.5 + 0.5 * (themeHits / given.length) : 0.5
  const profSignal = given.reduce((a, g) => a + professionSignal(g.hanzi, intake.profession), 0)
  const daoSignal = Math.max(0, Math.min(1, 0.55 + 0.3 * (themeHits / Math.max(1, given.length)) + 0.1 * profSignal))

  // sound (Momentum / Phoenix-Song)
  const bestSound = given.length ? Math.max(...given.map((g) => soundMatchScore(g, anchor))) : 0.3
  const tone = toneHarmony(tones)
  const phoenixSignal = 0.55 * bestSound + 0.45 * tone.score

  // stature — 2–3 char names are well-proportioned; lone given char is thin
  const totalChars = (surname ? 1 : 0) + given.length
  const statureSignal = totalChars === 3 ? 0.95 : totalChars === 2 ? 0.82 : totalChars >= 4 ? 0.4 : 0.5

  // form — core characters are uprightest & easiest
  const formSignal =
    given.reduce((a, g) => a + (g.tier === 'core' ? 1 : g.tier === 'cultural' ? 0.8 : 0.55), 0) / Math.max(1, given.length)

  // imagery (Stellar-River)
  const imagerySignal = given.some((g) => IMAGERY_THEMES.has(g.theme)) ? 0.9 : 0.55

  // lineage
  const lineageSignal = surname ? 0.9 : 0.4

  // prudence
  const prudence = prudenceScore(risks)

  // aspiration
  const aspirationSignal = given.some((g) => ASPIRATION_THEMES.has(g.theme)) ? 0.92 : 0.6

  // classics
  const classicsSignal = classicalSourceOf(given) ? 0.92 : 0.5

  // momentum
  const momentumSignal = Math.max(0, Math.min(1, 0.45 + 0.5 * bestSound))

  const rows: Omit<PalaceScore, 'score'>[] = [
    { key: 'dao', palace: 'Taiji Palace (道)', question: 'Does it fit who you are and what you reach for?', note: noteFor(daoSignal) },
    { key: 'shi', palace: 'Momentum Palace (势)', question: 'Does it ride the momentum of your name and situation?', note: `Echoes your “${anchor.syllable}”.` },
    { key: 'ge', palace: 'Stature Palace (格)', question: 'Are length, scope, and bearing well-proportioned?', note: `${totalChars}-character name.` },
    { key: 'yin', palace: 'Phoenix-Song Palace (音)', question: 'Does it echo your original, and read smoothly?', note: capitalise(tone.note) + '.' },
    { key: 'xing', palace: 'Six-Scripts Palace (形)', question: 'Are the characters upright, easy to write, not obscure?', note: noteFor(formSignal) },
    { key: 'yi', palace: 'Meaning Palace (意)', question: 'Does the meaning truly fit your aims and character?', note: noteFor(themeSignal) },
    { key: 'xiang', palace: 'Stellar-River Palace (象)', question: 'Does it leave an image — a scene, an atmosphere?', note: imagerySignal > 0.7 ? 'Opens a landscape in the mind.' : 'A quieter, inward image.' },
    { key: 'mai', palace: 'Lineage Palace (脉)', question: 'Does its surname give you roots in the world of the characters?', note: surname ? `${surname.register || 'A grounded surname'}.` : 'No surname taken.' },
    { key: 'ji', palace: 'Prudence Palace (忌)', question: 'Have homophones, dialect, and gender been screened?', note: risks.length ? `${risks.length} note(s) raised.` : 'Clean on every junction.' },
    { key: 'yuan', palace: 'Aspiration Palace (愿)', question: 'Does it carry a wish you would gladly receive?', note: noteFor(aspirationSignal) },
    { key: 'dian', palace: 'Classics Palace (典)', question: 'Is there a literary source — graceful, not obscure?', note: classicsSignal > 0.7 ? 'Rooted in the classics.' : 'Plainspoken, without allusion.' },
    { key: 'ming', palace: 'Destiny Palace (命)', question: 'Taken as a whole, is it truly you?', note: '' },
  ]

  const signals: Record<string, number> = {
    dao: daoSignal, shi: momentumSignal, ge: statureSignal, yin: phoenixSignal,
    xing: formSignal, yi: themeSignal, xiang: imagerySignal, mai: lineageSignal,
    ji: prudence, yuan: aspirationSignal, dian: classicsSignal, ming: 0,
  }
  // Destiny = the whole: mean of the other eleven, lightly penalised by risks
  const others = Object.entries(signals).filter(([k]) => k !== 'ming').map(([, v]) => v)
  signals.ming = Math.max(0, Math.min(1, others.reduce((a, b) => a + b, 0) / others.length - (risks.length ? 0.06 : 0)))

  const scorecard: PalaceScore[] = rows.map((r) => ({ ...r, score: to5(signals[r.key]) }))
  scorecard[scorecard.length - 1].note = `A composite of all twelve — ${descriptor(signals.ming)}.`

  const total = Math.round((scorecard.reduce((a, s) => a + s.score, 0) / (scorecard.length * 5)) * 100)
  return { scorecard, total }
}

function noteFor(s: number): string {
  return s > 0.8 ? 'A strong, clear fit.' : s > 0.62 ? 'A sound fit.' : 'A reasonable fit.'
}
function descriptor(s: number): string {
  return s > 0.82 ? 'a coherent whole' : s > 0.66 ? 'well-knit' : 'serviceable'
}
function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
