// ============================================================================
// Five Elements & Birth Harmony (五行 · 生辰之和) — an OPTIONAL, L3/L4-only
// cultural layer. This is CULTURAL INTERPRETATION, NOT fortune-telling: it
// reads the birth-year tradition (heavenly stem → element, zodiac animal) the
// way a Chinese family would *also* consider a name, and notes how the chosen
// name harmonises. It makes no prediction and no promise about fate — 命 is one
// of the twelve palaces, never decisive.
// ============================================================================

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water'

export interface ElementMeta {
  el: Element
  zh: string
  glyph: string
  qualitiesEn: string
  qualitiesZh: string
  season: string
}

export const ELEMENTS: Record<Element, ElementMeta> = {
  Wood: { el: 'Wood', zh: '木', glyph: '木', qualitiesEn: 'growth, benevolence, upward reach, spring vitality', qualitiesZh: '生长、仁德、向上、春之生机', season: 'spring' },
  Fire: { el: 'Fire', zh: '火', glyph: '火', qualitiesEn: 'warmth, passion, courtesy, radiant expression', qualitiesZh: '温暖、热忱、礼、光明外显', season: 'summer' },
  Earth: { el: 'Earth', zh: '土', glyph: '土', qualitiesEn: 'stability, trust, nourishment, steady centre', qualitiesZh: '稳重、诚信、厚德载物、居中', season: 'late summer' },
  Metal: { el: 'Metal', zh: '金', glyph: '金', qualitiesEn: 'clarity, resolve, righteousness, refinement', qualitiesZh: '清明、决断、义、精炼', season: 'autumn' },
  Water: { el: 'Water', zh: '水', glyph: '水', qualitiesEn: 'wisdom, adaptability, depth, quiet flow', qualitiesZh: '智慧、灵动、深沉、静水流深', season: 'winter' },
}

const ZODIAC = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
const ZODIAC_ZH = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
// heavenly-stem element by year: 甲乙(Wood) 丙丁(Fire) 戊己(Earth) 庚辛(Metal) 壬癸(Water)
const STEM_ELEMENT: Element[] = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth']
// index by (year % 10): 2020→庚(Metal)… so year%10==0 → Metal
const STEM_ZH = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己']

// the generating cycle (相生): Wood→Fire→Earth→Metal→Water→Wood
const GENERATES: Record<Element, Element> = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' }

export interface BirthReading {
  year: number
  element: Element
  stemZh: string
  zodiac: string
  zodiacZh: string
  supportsEn: string // the element that nourishes theirs
  supports: Element
}

/** Derive the birth-year element + zodiac. Year pillar only — an honest, light
 * reading (not a full four-pillar BaZi). */
export function birthReading(year: number): BirthReading | null {
  if (!year || year < 1900 || year > 2100) return null
  const el = STEM_ELEMENT[((year % 10) + 10) % 10]
  const stemZh = STEM_ZH[((year % 10) + 10) % 10]
  const zi = ((year - 4) % 12 + 12) % 12
  // the element that generates (nourishes) theirs
  const supports = (Object.keys(GENERATES) as Element[]).find((k) => GENERATES[k] === el)!
  return {
    year, element: el, stemZh, zodiac: ZODIAC[zi], zodiacZh: ZODIAC_ZH[zi],
    supports, supportsEn: ELEMENTS[supports].qualitiesEn,
  }
}

/** A framed, non-predictive cultural note. Never promises fortune or fate. */
export function harmonyNote(r: BirthReading, lang: 'en' | 'zh'): string {
  const m = ELEMENTS[r.element]
  const s = ELEMENTS[r.supports]
  if (lang === 'zh') {
    return `你生于${r.year}年（${r.stemZh}·属${r.zodiacZh}），于传统五行属**${m.zh}**——${m.qualitiesZh}。` +
      `依相生之说，${s.zh}生${m.zh}，故名中若含${s.zh}或${m.zh}之气象（${s.qualitiesZh}），与你的生辰相和。` +
      `此为文化视角，非占卜、不言吉凶；命，只是十二宫之一。`
  }
  return `You were born in ${r.year} (year of the ${r.zodiac}), which in the Five-Elements tradition carries **${m.el} (${m.zh})** — ${m.qualitiesEn}. ` +
    `By the generating cycle, ${s.el} nourishes ${m.el}, so a name whose imagery leans toward ${s.el} or ${m.el} (${s.qualitiesEn}) sits in harmony with your birth year. ` +
    `This is a cultural lens, not a prediction — it names no fortune, and 命 (destiny) is only one of the twelve palaces.`
}
