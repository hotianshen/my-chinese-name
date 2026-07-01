// ============================================================================
// The Ho Method — engine types
// Three Powers (Heaven · Human · Earth), Twelve Palaces, the Seven Steps,
// and the Hybrid Method ("letting sound ride the momentum of the Western name").
// ============================================================================

export type Gender = 'masc' | 'fem' | 'neutral'
export type Tier = 'core' | 'cultural' | 'strong'
export type CandidateType = 'Safe' | 'Cultural' | 'Distinctive'

/** A single Chinese character, enriched with accurate phonetics. */
export interface CharRecord {
  hanzi: string
  toned: string // e.g. "jiā"
  plain: string // e.g. "jia"
  tone: number // 1–4, 0 = neutral
  initial: string // pinyin initial, '' for zero-initial
  final: string // pinyin final
  meaning: string
  suits: string
  theme: string
  gender: Gender
  tier: Tier
  source: 'book' | 'ext'
}

export interface SurnameRecord {
  hanzi: string
  toned: string
  plain: string
  tone: number
  initial: string
  final: string
  register: string
  origin: string
  compound: boolean
}

/** What the user tells us — the intake questionnaire (Step One & Two). */
export interface Intake {
  givenName: string
  surname?: string
  middleName?: string
  gender: Gender
  /** chosen meaning themes (keys into THEMES) */
  themes: string[]
  /** free-text qualities / aspirations (Heaven tier) */
  qualities?: string
  /** professional field key (profession_fit) */
  profession?: string
  /** whether to take a Chinese surname */
  takeSurname: boolean
  /** sound-led or meaning-led surname */
  surnameStrategy: 'sound' | 'meaning'
  nativeLanguage?: string
  /** characters or sounds to avoid (red lines) */
  avoid?: string
  // —— richer, all optional (migrated from the production intake) ——
  /** default 'auto' → 3-character name (surname + 2 given) */
  nameLength?: 'auto' | 'surname_plus_1' | 'surname_plus_2'
  /** personality traits (Outgoing, Calm, Creative, Kind, Ambitious, …) */
  personality?: string[]
  /** where the name will be used (daily, business, academic, social, longterm) */
  useContext?: string
  /** free-text cultural leanings (poetry, mountains, jade, modern business, …) */
  cultureAffinity?: string
  /** how tightly the sound should match the original name */
  soundCloseness?: 'very' | 'moderate' | 'loose' | 'meaning'
  /** optional birth year — powers the L2+ Five-Elements cultural layer only
   * (never affects name generation; 命 is one palace of twelve, not decisive) */
  birthYear?: number
}

export interface PalaceScore {
  key: string // 'dao', 'shi', ...
  palace: string // 'Taiji Palace (道)'
  question: string
  score: number // 1–5
  note: string
}

export type RiskLevel = 'info' | 'caution' | 'warning'
export interface RiskFlag {
  level: RiskLevel
  palace: string
  message: string
}

export interface NameCandidate {
  type: CandidateType
  surname: SurnameRecord | null
  given: CharRecord[]
  fullHanzi: string
  fullPinyin: string
  tonePattern: number[]
  /** which sound of the original name this echoes */
  soundAnchor: string
  meaningGloss: string
  rationale: string
  classicalSource?: string
  scorecard: PalaceScore[]
  totalScore: number // 0–100
  risks: RiskFlag[]
  /** suggested Chinese nicknames */
  nicknames: string[]
  /** self-introduction scripts */
  introEn: string
  introZh: string
}

export interface GenerateResult {
  intake: Intake
  anchor: Anchor
  candidates: NameCandidate[]
  /** book reference seed, if the given name appears in Appendix 4 */
  referenceSeed?: { english: string; hanzi: string; pinyin: string; approach: string; sense: string }
  generatedAt: string
}

export interface Anchor {
  syllable: string
  onset: string
  vowel: string
  chineseInitials: string[]
  chineseFinals: string[]
}
