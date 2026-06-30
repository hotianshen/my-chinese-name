// ============================================================================
// The Seven Steps, end to end. Given an intake, produce three candidate names —
// Safe, Cultural, Distinctive (Appendix 8, Tool 2) — each scored across the
// Twelve Palaces, with sound rationale, meaning gloss, and risk flags.
//
//   1 Set the Way        → read direction, character, gender, themes
//   2 Know the Person    → extract the phonetic anchor (Hybrid Method)
//   3 Clarify & Scope    → red lines, the avoid-list
//   4 Build the Body     → Sound · Form · Meaning · Imagery (select characters)
//   5 Forge the Roots    → choose the surname; infuse the classics
//   6 Ride the Momentum  → tone-harmonise and refine the whole
//   7 Return to the Way  → score the Twelve Palaces, scan risks, write the note
//
// Safe names take the clean two-beat form (surname + one character, like 何伟 /
// 戴维 / 苏菲); Cultural and Distinctive take the richer three-character form.
// Compound surnames (欧阳, 司徒) always pair with a single given character.
// ============================================================================
import type {
  Anchor, CandidateType, CharRecord, GenerateResult, Intake, NameCandidate, SurnameRecord,
} from './types'
import { CHARS, LETTER_SURNAMES, NAME_SEEDS, professionSignal } from './data'
import { extractAnchor, isHardForBearer, soundMatchScore, toneHarmony } from './phonetics'
import { scanRisks } from './risk'
import { classicalSourceOf, scoreTwelvePalaces } from './scoring'

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

// ——— tier preference by candidate type ———
function tierFit(tier: CharRecord['tier'], type: CandidateType): number {
  if (type === 'Safe') return tier === 'core' ? 1 : tier === 'cultural' ? 0.7 : 0.3
  if (type === 'Cultural') return tier === 'cultural' ? 1 : tier === 'core' ? 0.78 : 0.62
  return tier === 'strong' ? 1 : tier === 'cultural' ? 0.88 : 0.55 // Distinctive
}

function shortGloss(char: CharRecord): string {
  return char.meaning.split(/[;—(]/)[0].trim().replace(/,$/, '')
}

// Characters that are fine in the abstract but read faintly bleak, cold, or
// over-philosophical as a given name — the Prudence Palace lightly down-ranks
// them so they surface only when nothing warmer fits.
const CAUTION_CHARS = new Set(['幽', '淡', '寂', '孤', '残', '零', '幻', '冷', '霜'])

interface ScoredChar { char: CharRecord; score: number; sound: number }

function rankChars(
  anchor: Anchor, intake: Intake, type: CandidateType, role: 'sound' | 'meaning',
  penalize: Set<string>,
): ScoredChar[] {
  const themes = new Set(intake.themes)
  const out: ScoredChar[] = []
  for (const char of CHARS) {
    if (!genderOk(char, intake.gender)) continue
    if (intake.avoid && intake.avoid.includes(char.hanzi)) continue
    const sound = soundMatchScore(char, anchor)
    const themeHit = themes.has(char.theme) ? 1 : 0
    const prof = professionSignal(char.hanzi, intake.profession)
    const tf = tierFit(char.tier, type)
    const gf = genderFit(char, intake.gender)
    const friendly = isHardForBearer(char) ? 0.6 : 1

    let score: number
    if (role === 'sound') {
      score = 0.52 * sound + 0.16 * tf + 0.12 * gf + 0.1 * friendly + 0.1 * themeHit + 0.06 * prof
    } else {
      score = 0.42 * themeHit + 0.2 * tf + 0.14 * gf + 0.12 * sound + 0.06 * friendly + 0.08 * prof
    }
    if (type === 'Cultural' && classicalSourceOf([char])) score += 0.06
    if (CAUTION_CHARS.has(char.hanzi)) score -= 0.28
    // diversify across the three types
    if (penalize.has(char.hanzi)) score -= role === 'meaning' ? 0.3 : 0.18
    out.push({ char, score, sound })
  }
  out.sort((a, b) => b.score - a.score)
  return out
}

function pickSurname(intake: Intake, type: CandidateType): SurnameRecord | null {
  if (!intake.takeSurname) return null
  const basis = (intake.surnameStrategy === 'sound' ? intake.surname || intake.givenName : intake.givenName) || 'A'
  const letter = (basis.trim()[0] || 'A').toUpperCase()
  const entry = LETTER_SURNAMES[letter] || LETTER_SURNAMES['A']
  const key = type === 'Safe' ? 'safe' : type === 'Cultural' ? 'cultural' : 'distinctive'
  return entry[key]
}

function buildCandidate(
  type: CandidateType, anchor: Anchor, intake: Intake, penalize: Set<string>,
): NameCandidate {
  const surname = pickSurname(intake, type)
  // Safe = clean two-beat (surname + 1). Cultural/Distinctive = 3 chars.
  // A compound surname always pairs with a single given character.
  const givenCount = surname?.compound ? 1 : type === 'Safe' ? 1 : 2

  const soundRanked = rankChars(anchor, intake, type, 'sound', penalize)
  const meaningRanked = rankChars(anchor, intake, type, 'meaning', penalize)

  // Char A — the sound anchor (the thread back to the original name)
  const charA = soundRanked[0]?.char ?? meaningRanked[0].char
  const given: CharRecord[] = [charA]

  // Char B — the meaning carrier; harmonise tone, avoid repeating A
  if (givenCount === 2) {
    const surTone = surname ? [surname.tone] : []
    let best = -Infinity
    let pick: CharRecord | null = null
    for (const cand of meaningRanked.slice(0, 28)) {
      if (cand.char.hanzi === charA.hanzi) continue
      const harmony = toneHarmony([...surTone, charA.tone, cand.char.tone]).score
      const total = 0.62 * cand.score + 0.38 * harmony
      if (total > best) { best = total; pick = cand.char }
    }
    if (pick) given.push(pick)
  }

  return finalizeCandidate(type, surname, given, anchor, intake)
}

function finalizeCandidate(
  type: CandidateType, surname: SurnameRecord | null, given: CharRecord[], anchor: Anchor, intake: Intake,
): NameCandidate {
  const fullHanzi = (surname ? surname.hanzi : '') + given.map((g) => g.hanzi).join('')
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

  const risks = scanRisks(surname, given, intake)
  const { scorecard, total } = scoreTwelvePalaces({ surname, given, anchor, intake, risks })

  return {
    type, surname, given, fullHanzi, fullPinyin, tonePattern,
    soundAnchor: anchor.syllable, meaningGloss: cap(gloss),
    rationale: cap(rationale), classicalSource: classical,
    scorecard, totalScore: total, risks,
  }
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

/** The full pipeline. Deterministic for a given intake. */
export function generateNames(intake: Intake): GenerateResult {
  const anchor = extractAnchor(intake.givenName)
  const used = new Set<string>()

  const safe = buildCandidate('Safe', anchor, intake, used)
  safe.given.forEach((g) => used.add(g.hanzi))

  const cultural = buildCandidate('Cultural', anchor, intake, used)
  cultural.given.forEach((g) => used.add(g.hanzi))

  const distinctive = buildCandidate('Distinctive', anchor, intake, used)

  const candidates = [safe, cultural, distinctive]
  const referenceSeed = findSeed(intake.givenName)
  return { intake, anchor, candidates, referenceSeed, generatedAt: new Date().toISOString() }
}
