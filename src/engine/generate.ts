// ============================================================================
// The Seven Steps, end to end (v2). Given an intake, produce three candidate
// names — Safe, Cultural, Distinctive (Appendix 8, Tool 2) — each scored across
// the Twelve Palaces, with sound rationale, meaning gloss, risk flags,
// nicknames, and self-introduction scripts.
//
// Two properties hold by construction:
//   • STABLE  — identical intake always yields identical names.
//   • UNIQUE  — any change to the intake shifts the fingerprint seed, so two
//               different people receive two different names.
//
// Names are three characters by default (surname + two given), the form 90% of
// Chinese names take; a two-character form (surname + one) is available on
// request. Compound surnames (欧阳) pair with a single given character.
// ============================================================================
import type {
  Anchor, CandidateType, CharRecord, GenerateResult, Intake, NameCandidate, SurnameRecord,
} from './types'
import { CHARS, LETTER_SURNAMES, NAME_SEEDS, professionSignal } from './data'
import { extractAnchor, isHardForBearer, soundMatchScore, toneHarmony } from './phonetics'
import { scanRisks } from './risk'
import { classicalSourceOf, scoreTwelvePalaces } from './scoring'
import { fingerprint, hashString, mulberry32 } from './hash'

// A small, deterministic per-(character, seed) jitter. Same seed → same ranking
// (stable); a different seed reorders near-equal characters, so two similar
// inputs diverge into different names.
function jitter(hanzi: string, seed: number): number {
  return (hashString(hanzi + ':' + seed) % 100000) / 100000 // 0..1
}

// ——— personality / context / affinity → theme signals ———
const PERSONALITY_THEME: Record<string, string> = {
  outgoing: 'Light & Clarity', calm: 'Peace & Joy', creative: 'Arts', kind: 'Character & Virtue',
  ambitious: 'Ambition & Purpose', humorous: 'Peace & Joy', elegant: 'Feminine Grace (fem)',
  brave: 'Strength & Vigor (masc)', intellectual: 'Wisdom & Learning', gentle: 'Peace & Joy',
}
const CONTEXT_THEME: Record<string, string[]> = {
  business: ['Ambition & Purpose', 'Character & Virtue'],
  academic: ['Wisdom & Learning'],
  social: ['Light & Clarity', 'Peace & Joy'],
  longterm: ['Character & Virtue', 'Nature & Landscape'],
  daily: [],
}
const AFFINITY_KEYWORDS: [RegExp, string][] = [
  [/poet|poem|literat|classic|book|scholar|wisdom/i, 'Wisdom & Learning'],
  [/mountain|river|nature|water|sea|ocean|forest|sky|moon|star|wind|cloud/i, 'Nature & Landscape'],
  [/jade|elegan|grace|beaut|flower|orchid/i, 'Feminine Grace (fem)'],
  [/light|bright|clear|clarity|sun/i, 'Light & Clarity'],
  [/peace|calm|harmony|zen|dao|tao|serene/i, 'Peace & Joy'],
  [/business|modern|success|ambiti|enterpr|found/i, 'Ambition & Purpose'],
  [/virtue|integrity|honou?r|moral|sincer/i, 'Character & Virtue'],
  [/strength|strong|courage|brave|vigor/i, 'Strength & Vigor (masc)'],
]

/** Weighted theme map: chosen themes (first = 3×), plus personality, context, affinity. */
function themeWeights(intake: Intake): Record<string, number> {
  const w: Record<string, number> = {}
  const add = (t: string | undefined, n: number) => { if (t) w[t] = (w[t] || 0) + n }
  intake.themes.forEach((t, i) => add(t, i === 0 ? 3 : i === 1 ? 2 : 1)) // first choice carries 3× weight
  ;(intake.personality || []).forEach((p) => add(PERSONALITY_THEME[p.toLowerCase()], 1.2))
  ;(CONTEXT_THEME[intake.useContext || ''] || []).forEach((t) => add(t, 1))
  if (intake.cultureAffinity) {
    for (const [re, t] of AFFINITY_KEYWORDS) if (re.test(intake.cultureAffinity)) add(t, 1)
  }
  return w
}

// ——— gender compatibility ———
function genderOk(char: CharRecord, want: Intake['gender']): boolean {
  if (want === 'neutral') return true
  if (want === 'masc') return char.gender !== 'fem'
  return char.gender !== 'masc'
}
function genderFit(char: CharRecord, want: Intake['gender']): number {
  if (want === 'neutral') return char.gender === 'neutral' ? 1 : 0.65
  if (char.gender === want) return 1
  if (char.gender === 'neutral') return 0.9
  return 0.15
}
function tierFit(tier: CharRecord['tier'], type: CandidateType): number {
  if (type === 'Safe') return tier === 'core' ? 1 : tier === 'cultural' ? 0.72 : 0.35
  if (type === 'Cultural') return tier === 'cultural' ? 1 : tier === 'core' ? 0.78 : 0.66
  return tier === 'strong' ? 1 : tier === 'cultural' ? 0.9 : 0.55 // Distinctive
}
function shortGloss(char: CharRecord): string {
  return char.meaning.split(/[;—(]/)[0].trim().replace(/,$/, '')
}

// Faintly bleak / over-abstract characters — down-ranked (Prudence Palace).
const CAUTION_CHARS = new Set(['幽', '淡', '寂', '孤', '残', '零', '幻', '冷', '霜', '野'])

const CLOSENESS_FACTOR: Record<string, number> = { very: 1, moderate: 0.8, loose: 0.55, meaning: 0.32 }

interface ScoredChar { char: CharRecord; score: number; sound: number }

function rankChars(
  anchor: Anchor, intake: Intake, type: CandidateType, role: 'sound' | 'meaning',
  weights: Record<string, number>, penalize: Set<string>, jitterSeed: number,
): ScoredChar[] {
  const maxW = Math.max(1, ...Object.values(weights))
  const closeness = CLOSENESS_FACTOR[intake.soundCloseness || 'moderate']
  const out: ScoredChar[] = []
  for (const char of CHARS) {
    if (!genderOk(char, intake.gender)) continue
    if (intake.avoid && intake.avoid.includes(char.hanzi)) continue
    const sound = soundMatchScore(char, anchor) * closeness
    const themeAffinity = (weights[char.theme] || 0) / maxW // 0..1
    const prof = professionSignal(char.hanzi, intake.profession)
    const tf = tierFit(char.tier, type)
    const gf = genderFit(char, intake.gender)
    const friendly = isHardForBearer(char) ? 0.6 : 1

    let score: number
    if (role === 'sound') {
      score = 0.46 * sound + 0.16 * tf + 0.12 * gf + 0.1 * friendly + 0.14 * themeAffinity + 0.06 * prof
    } else {
      score = 0.44 * themeAffinity + 0.2 * tf + 0.14 * gf + 0.1 * sound + 0.06 * friendly + 0.08 * prof
    }
    if (type === 'Cultural' && classicalSourceOf([char])) score += 0.06
    if (CAUTION_CHARS.has(char.hanzi)) score -= 0.28
    if (penalize.has(char.hanzi)) score -= role === 'meaning' ? 0.3 : 0.18
    score += 0.1 * jitter(char.hanzi, jitterSeed) // seed-driven divergence
    out.push({ char, score, sound })
  }
  out.sort((a, b) => b.score - a.score)
  return out
}

/** Pick from the near-best (within `band` of the top) using the seeded rng — the
 * heart of non-repetition: equally-good candidates are chosen by fingerprint. */
function seededPick(ranked: ScoredChar[], rng: () => number, band = 0.1, cap = 12): CharRecord {
  if (!ranked.length) throw new Error('empty pool')
  const best = ranked[0].score
  const pool = ranked.filter((r) => r.score >= best - band).slice(0, cap)
  return pool[Math.floor(rng() * pool.length)].char
}

function pickSurname(intake: Intake, type: CandidateType): SurnameRecord | null {
  if (!intake.takeSurname) return null
  const basis = (intake.surnameStrategy === 'sound' ? intake.surname || intake.givenName : intake.givenName) || 'A'
  const letter = (basis.trim()[0] || 'A').toUpperCase()
  const entry = LETTER_SURNAMES[letter] || LETTER_SURNAMES['A']
  const key = type === 'Safe' ? 'safe' : type === 'Cultural' ? 'cultural' : 'distinctive'
  return entry[key]
}

function givenCountFor(intake: Intake, surname: SurnameRecord | null): number {
  if (surname?.compound) return 1 // 欧阳 + 1 = a clean 3-character name
  if (!surname) return 2 // given-name-only still reads as a name
  if (intake.nameLength === 'surname_plus_1') return 1
  return 2 // default (auto / surname_plus_2) → 3-character name
}

function buildCandidate(
  type: CandidateType, anchor: Anchor, intake: Intake,
  weights: Record<string, number>, penalize: Set<string>, seed: number,
): NameCandidate {
  const rng = mulberry32(seed)
  const surname = pickSurname(intake, type)
  const count = givenCountFor(intake, surname)
  const notSurname = (h: string) => h !== surname?.hanzi

  const soundRanked = rankChars(anchor, intake, type, 'sound', weights, penalize, seed).filter((s) => notSurname(s.char.hanzi))
  const meaningRanked = rankChars(anchor, intake, type, 'meaning', weights, penalize, seed ^ 0x5bd1e995).filter((s) => notSurname(s.char.hanzi))

  // Char A — the sound anchor (the thread back to the original name)
  const charA = seededPick(soundRanked, rng)
  const given: CharRecord[] = [charA]

  // Char B — the meaning carrier; harmonise tone, avoid repeating A
  if (count === 2) {
    const surTone = surname ? [surname.tone] : []
    const scored = meaningRanked
      .filter((c) => c.char.hanzi !== charA.hanzi)
      .map((c) => ({
        char: c.char,
        score: 0.6 * c.score + 0.4 * toneHarmony([...surTone, charA.tone, c.char.tone]).score,
        sound: c.sound,
      }))
      .sort((a, b) => b.score - a.score)
    if (scored.length) given.push(seededPick(scored, rng))
  }

  return finalizeCandidate(type, surname, given, anchor, intake)
}

function finalizeCandidate(
  type: CandidateType, surname: SurnameRecord | null, given: CharRecord[], anchor: Anchor, intake: Intake,
): NameCandidate {
  const fullHanzi = (surname ? surname.hanzi : '') + given.map((g) => g.hanzi).join('')
  const givenHanzi = given.map((g) => g.hanzi).join('')
  const givenPinyin = given.map((g) => g.toned).join('')
  const fullPinyin = surname ? `${cap(surname.toned)} ${cap(givenPinyin)}` : cap(givenPinyin)
  const tonePattern = [...(surname ? [surname.tone] : []), ...given.map((g) => g.tone)]

  const gloss = given.map(shortGloss).join(', ')
  const classical = classicalSourceOf(given)
  const hasSound = soundMatchScore(given[0], anchor) > 0.5
  const soundLine = hasSound
    ? `“${cap(given[0].toned)}” rides the opening sound of ${intake.givenName}`
    : `built meaning-first, since ${intake.givenName} did not yield a clean sound-match`
  const rationale =
    `${soundLine}; ${given.map((g) => `${g.hanzi} (${shortGloss(g).toLowerCase()})`).join(' and ')}` +
    `${surname ? `, rooted in the surname ${surname.hanzi} ${cap(surname.toned)}` : ''}. ` +
    capSentence(toneHarmony(tonePattern).note) + '.'

  const nicknames = makeNicknames(given)
  const introZh = `你好，我叫${fullHanzi}（${fullPinyin}）。你可以叫我${givenHanzi}。`
  const introEn =
    `Hi, I’m ${fullPinyin} — ${fullHanzi}. ` +
    `${surname ? `${surname.hanzi} (${cap(surname.toned)}) is my family name; ` : ''}` +
    `${given.map((g) => `${g.hanzi} means ${shortGloss(g).toLowerCase()}`).join(', ')}. ` +
    `You can call me ${cap(givenPinyin)}.`

  const risks = scanRisks(surname, given, intake)
  const { scorecard, total } = scoreTwelvePalaces({ surname, given, anchor, intake, risks })

  return {
    type, surname, given, fullHanzi, fullPinyin, tonePattern,
    soundAnchor: anchor.syllable, meaningGloss: cap(gloss),
    rationale: cap(rationale), classicalSource: classical,
    scorecard, totalScore: total, risks, nicknames, introEn, introZh,
  }
}

function makeNicknames(given: CharRecord[]): string[] {
  const g1 = given[0].hanzi
  const g2 = given[given.length - 1].hanzi
  const out = new Set<string>()
  out.add('小' + g2)
  if (given.length >= 2) out.add(g1 + g2)
  out.add('阿' + g2)
  return [...out].slice(0, 3)
}

function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
function capSentence(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function findSeed(givenName: string) {
  const n = givenName.trim().toLowerCase()
  if (!n) return undefined
  let s = NAME_SEEDS.find((x) => x.english.toLowerCase() === n)
  if (!s) s = NAME_SEEDS.find((x) => x.english.toLowerCase().startsWith(n) && n.length >= 3)
  if (!s) s = NAME_SEEDS.find((x) => n.startsWith(x.english.toLowerCase()) && x.english.length >= 4)
  return s
}

/** The full pipeline. Deterministic in the intake; different intakes diverge. */
export function generateNames(intake: Intake): GenerateResult {
  const anchor = extractAnchor(intake.givenName)
  const weights = themeWeights(intake)
  const seed = fingerprint([
    intake.givenName, intake.surname, intake.middleName, intake.gender, intake.themes,
    intake.qualities, intake.profession, intake.surnameStrategy, intake.nativeLanguage,
    intake.avoid, intake.nameLength, intake.personality, intake.useContext,
    intake.cultureAffinity, intake.soundCloseness,
  ])

  const used = new Set<string>()
  const types: CandidateType[] = ['Safe', 'Cultural', 'Distinctive']
  const candidates = types.map((t, i) => {
    // each type gets its own seed derived from the shared fingerprint
    const typeSeed = (seed ^ (0x9e3779b9 * (i + 1))) >>> 0
    const c = buildCandidate(t, anchor, intake, weights, used, typeSeed)
    c.given.forEach((g) => used.add(g.hanzi))
    return c
  })

  const referenceSeed = findSeed(intake.givenName)
  return { intake, anchor, candidates, referenceSeed, generatedAt: new Date().toISOString() }
}
