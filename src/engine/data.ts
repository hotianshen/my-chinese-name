// Typed access to the knowledge base distilled from the book
// (My Chinese Name v5.1 — appendices, the Twelve-Palace scorecard, and the
// character/surname tables), plus a curated extension lexicon for broader
// sound coverage. See src/engine/data/kb.json.
import kb from './data/kb.json'
import type { CharRecord, SurnameRecord } from './types'

interface KB {
  chars: CharRecord[]
  surnames: SurnameRecord[]
  surname_by_sound: { first_sound: string; surnames: { pinyin: string; hanzi: string }[]; notes: string }[]
  compound_surnames: { hanzi: string; pinyin: string; origin: string; sound_match: string; register: string }[]
  english_to_chinese: {
    men: NameSeed[]
    women: NameSeed[]
  }
  scorecard: { palace: string; question: string }[]
  candidate_types: { type: string; character: string; best_for: string; example: string }[]
  profession_fit: { field: string; favored: string; cautioned: string }[]
  sound_bridge: { language: string; note: string }[]
  middle_name: { if: string; do: string; palace: string }[]
  letter_surnames: Record<string, Record<'safe' | 'cultural' | 'distinctive', SurnameRecord>>
}

export interface NameSeed {
  english: string
  hanzi: string
  pinyin: string
  approach: string
  sense: string
}

const data = kb as unknown as KB

export const CHARS: CharRecord[] = data.chars
export const SURNAMES: SurnameRecord[] = data.surnames
export const SURNAME_BY_SOUND = data.surname_by_sound
export const COMPOUND_SURNAMES = data.compound_surnames
export const NAME_SEEDS: NameSeed[] = [...data.english_to_chinese.men, ...data.english_to_chinese.women]
export const SCORECARD = data.scorecard
export const LETTER_SURNAMES = data.letter_surnames
export const PROFESSION_FIT = data.profession_fit
export const SOUND_BRIDGE = data.sound_bridge
export const MIDDLE_NAME_GUIDE = data.middle_name

// The nine meaning themes (Appendix 3), with display metadata.
export interface ThemeMeta {
  key: string
  label: string
  hanzi: string
  blurb: string
}
export const THEMES: ThemeMeta[] = [
  { key: 'Ambition & Purpose', label: 'Ambition & Purpose', hanzi: '志', blurb: 'Resolve, direction, the will to reach far' },
  { key: 'Character & Virtue', label: 'Character & Virtue', hanzi: '德', blurb: 'Integrity, sincerity, the moral spine' },
  { key: 'Nature & Landscape', label: 'Nature & Landscape', hanzi: '川', blurb: 'Mountains, rivers, sky — breadth and calm' },
  { key: 'Light & Clarity', label: 'Light & Clarity', hanzi: '明', blurb: 'Brightness, lucidity, an open mind' },
  { key: 'Wisdom & Learning', label: 'Wisdom & Learning', hanzi: '文', blurb: 'Thought, letters, the scholar’s path' },
  { key: 'Peace & Joy', label: 'Peace & Joy', hanzi: '和', blurb: 'Harmony, ease, a settled and glad heart' },
  { key: 'Strength & Vigor (masc)', label: 'Strength & Vigour', hanzi: '毅', blurb: 'Tenacity, courage, forward momentum' },
  { key: 'Feminine Grace (fem)', label: 'Grace & Elegance', hanzi: '雅', blurb: 'Refinement, beauty, quiet distinction' },
  { key: 'Unisex', label: 'Quiet & Universal', hanzi: '安', blurb: 'Calm, clear characters that suit anyone' },
]

export const PROFESSIONS = [
  { key: '', label: '— Prefer not to say —' },
  { key: 'Finance / Law', label: 'Finance / Law' },
  { key: 'Tech / Engineering', label: 'Technology / Engineering' },
  { key: 'Education / Academia', label: 'Education / Academia' },
  { key: 'Medicine / Nonprofit', label: 'Medicine / Non-profit' },
  { key: 'Arts / Creative', label: 'Arts / Creative' },
]

export const NATIVE_LANGUAGES = [
  'English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese',
  'Russian', 'Arabic', 'Japanese', 'Korean', 'Other',
]

/** Map a character into a profession-fit signal: +1 favored, -1 cautioned, 0 neutral. */
export function professionSignal(hanzi: string, field?: string): number {
  if (!field) return 0
  const row = PROFESSION_FIT.find((p) => p.field === field)
  if (!row) return 0
  if (row.favored.includes(hanzi)) return 1
  if (row.cautioned.includes(hanzi)) return -1
  return 0
}

// Index characters by initial for fast sound-matching.
export const CHARS_BY_INITIAL: Record<string, CharRecord[]> = {}
for (const c of CHARS) {
  const key = c.initial || '∅'
  ;(CHARS_BY_INITIAL[key] ||= []).push(c)
}
