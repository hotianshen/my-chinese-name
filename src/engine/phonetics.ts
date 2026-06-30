// ============================================================================
// Phonetics — the Hybrid Method, steps one & two: EXTRACT the phonetic anchor
// from the original name, then MAP it to a family of neighbouring Chinese sounds.
// "Take one or two sounds, not all of them; ride the momentum, don't copy the
// syllables." — Ch. 11, Phoenix-Song Palace.
// ============================================================================
import type { Anchor, CharRecord } from './types'

// Leading-cluster normalisation → a base consonant (longest match first).
const CLUSTER: [RegExp, string][] = [
  [/^chr/, 'k'], // Christopher, Chris → "k"
  [/^chl/, 'k'], // Chloe
  [/^sch/, 'sh'],
  [/^thr/, 't'],
  [/^th/, 't'], // Thomas → Tian, Theo → Ti
  [/^ph/, 'f'], // Philip → Fei
  [/^wh/, 'h'],
  [/^wr/, 'r'],
  [/^kn/, 'n'],
  [/^gn/, 'n'],
  [/^qu/, 'k'],
  [/^ch/, 'ch'],
  [/^sh/, 'sh'],
  [/^zh/, 'zh'],
  [/^ck/, 'k'],
]

// Base consonant → ranked Chinese initials (closest first).
const ONSET_TO_INITIALS: Record<string, string[]> = {
  b: ['b', 'p'],
  p: ['p', 'b'],
  m: ['m'],
  f: ['f', 'h'],
  v: ['w', 'f'],
  d: ['d', 't'],
  t: ['t', 'd'],
  n: ['n', 'l'],
  l: ['l', 'n'],
  g: ['g', 'j', 'k'],
  k: ['k', 'g'],
  c: ['k', 'g', 's'],
  h: ['h'],
  j: ['j', 'zh', 'ch'],
  r: ['r', 'l'],
  s: ['s', 'x', 'sh'],
  z: ['z', 'c', 's'],
  w: ['w', 'h'],
  y: ['y'],
  x: ['s', 'sh', 'z'],
  ch: ['ch', 'q', 'j'],
  sh: ['sh', 'x', 's'],
  zh: ['zh', 'j'],
  '': ['', 'y', 'w'], // vowel-initial names (Emma, Oliver, Anna)
}

// English vowel nucleus → ranked Chinese finals.
const VOWEL_TO_FINALS: Record<string, string[]> = {
  a: ['a', 'an', 'ai', 'ang'],
  e: ['e', 'ei', 'en', 'eng'],
  i: ['i', 'in', 'ing', 'ai'],
  o: ['o', 'ou', 'uo', 'ao', 'ong'],
  u: ['u', 'ou', 'e'],
  ai: ['ai', 'ei'],
  ay: ['ai', 'ei'],
  ee: ['i', 'ei'],
  ea: ['i', 'e'],
  oo: ['u', 'ou'],
  ou: ['ou', 'ao'],
  ow: ['ou', 'ao'],
  oa: ['ao', 'o'],
  au: ['ao', 'o'],
  ie: ['i', 'ai'],
}

/** EXTRACT — find the phonetic anchor (the opening syllable). */
export function extractAnchor(name: string): Anchor {
  const raw = (name || '').trim().toLowerCase().replace(/[^a-z]/g, '')
  if (!raw) {
    return { syllable: '', onset: '', vowel: 'a', chineseInitials: ['', 'y'], chineseFinals: ['a', 'an'] }
  }

  // 1. leading consonant cluster
  let onset = ''
  let rest = raw
  for (const [re, base] of CLUSTER) {
    if (re.test(raw)) {
      onset = base
      rest = raw.replace(re, '')
      break
    }
  }
  if (!onset) {
    const m = rest.match(/^[^aeiouy]+/)
    if (m) {
      onset = m[0][0] // first consonant carries the identity
      rest = rest.slice(m[0].length)
    }
  }

  // 2. first vowel group
  let vowel = ''
  const vm = rest.match(/^[aeiouy]+/)
  if (vm) vowel = vm[0]
  // normalise common digraphs / reduce long vowel runs to the recognisable nucleus
  if (vowel.length > 2) vowel = vowel.slice(0, 2)
  const vowelKey = VOWEL_TO_FINALS[vowel] ? vowel : vowel[0] || 'a'

  const chineseInitials = ONSET_TO_INITIALS[onset] ?? ['', 'y']
  const chineseFinals = VOWEL_TO_FINALS[vowelKey] ?? ['a', 'an']
  const syllable = (onset + (vowel || '')).replace(/[^a-z]/g, '') || raw.slice(0, 2)

  return { syllable, onset, vowel: vowelKey, chineseInitials, chineseFinals }
}

/** Rough syllable count of an English name. */
export function syllableCount(name: string): number {
  const w = (name || '').toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 0
  const groups = w.match(/[aeiouy]+/g)
  let n = groups ? groups.length : 1
  if (w.endsWith('e') && n > 1) n -= 1 // silent final e
  return Math.max(1, n)
}

/**
 * MAP/SELECT signal — how well a character's sound neighbours the anchor.
 * Initial-family match dominates (the opening sound is the identity); the
 * vowel/final is a bonus. Returns 0..1.
 */
export function soundMatchScore(char: CharRecord, anchor: Anchor): number {
  const ci = char.initial || ''
  const ii = anchor.chineseInitials.indexOf(ci)
  let initialScore: number
  if (ii === 0) initialScore = 1
  else if (ii === 1) initialScore = 0.82
  else if (ii >= 2) initialScore = 0.66
  else initialScore = 0.22 // no kinship — meaning-led only

  const fi = anchor.chineseFinals.findIndex((f) => char.final === f || char.final.startsWith(f) || f.startsWith(char.final))
  const finalScore = fi === 0 ? 1 : fi === 1 ? 0.7 : fi >= 2 ? 0.5 : 0.15

  return 0.72 * initialScore + 0.28 * finalScore
}

// "Crossable in both directions": retroflex zh/ch/sh/r and palatal x/q are
// the sounds most challenging for English/Romance speakers.
const HARD_FOR_BEARER = new Set(['zh', 'ch', 'sh', 'r', 'x', 'q'])
export function isHardForBearer(char: CharRecord): boolean {
  return HARD_FOR_BEARER.has(char.initial)
}

export type ToneClass = 'level' | 'oblique'
/** Classical prosody: 1st & 2nd tone = level (ping); 3rd & 4th = oblique (ze). */
export function toneClass(tone: number): ToneClass {
  return tone === 1 || tone === 2 ? 'level' : 'oblique'
}

/**
 * Tone-harmony score for a full name (surname + given), 0..1.
 * Rewards rise-and-fall (alternating level/oblique), one well-placed third tone;
 * penalises three identical tones in a row and back-to-back third tones.
 */
export function toneHarmony(tones: number[]): { score: number; note: string } {
  if (tones.length < 2) return { score: 0.6, note: 'Single syllable — limited rhythm.' }
  let score = 0.6
  const notes: string[] = []

  // alternation of level/oblique
  let alternations = 0
  for (let i = 1; i < tones.length; i++) {
    if (toneClass(tones[i]) !== toneClass(tones[i - 1])) alternations++
  }
  score += 0.25 * (alternations / (tones.length - 1))
  if (alternations === tones.length - 1) notes.push('rises and falls cleanly')

  // three identical tones in a row
  for (let i = 2; i < tones.length; i++) {
    if (tones[i] === tones[i - 1] && tones[i - 1] === tones[i - 2]) {
      score -= 0.3
      notes.push('three identical tones run flat')
    }
  }
  // all the same tone
  if (new Set(tones).size === 1) {
    score -= 0.2
  }
  // one third tone gives depth; two in a row trigger sandhi
  const thirds = tones.filter((t) => t === 3).length
  if (thirds === 1) {
    score += 0.12
    notes.push('a third tone lends depth')
  }
  for (let i = 1; i < tones.length; i++) {
    if (tones[i] === 3 && tones[i - 1] === 3) {
      score -= 0.12
      notes.push('two third tones in a row are hard to say')
    }
  }

  score = Math.max(0, Math.min(1, score))
  const note = notes.length ? notes.join('; ') : 'a serviceable rhythm'
  return { score, note }
}
