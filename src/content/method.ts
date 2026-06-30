// The Three Powers and the Twelve Palaces — the structural heart of the Ho
// Method, distilled from the book for use across the site. Bilingual.
export type Tier = 'heaven' | 'human' | 'earth'

export interface Palace {
  key: string
  num: number
  tier: Tier
  word: string // single Chinese key word, e.g. 道
  nameZh: string // palace name in Chinese, e.g. 太极宫
  nameEn: string // e.g. "Taiji Palace"
  essenceEn: string
  essenceZh: string
}

export const TIERS: Record<Tier, { zh: string; en: string; glyph: string; blurbEn: string; blurbZh: string }> = {
  heaven: {
    zh: '天', en: 'Heaven', glyph: '天',
    blurbEn: 'The Way, the momentum, the measure — what the name reaches toward.',
    blurbZh: '道、势、格——名字所朝向的方向与气象。',
  },
  human: {
    zh: '人', en: 'Human', glyph: '人',
    blurbEn: 'Sound, form, meaning, imagery — the living body of the name.',
    blurbZh: '音、形、意、象——名字活生生的身体。',
  },
  earth: {
    zh: '地', en: 'Earth', glyph: '地',
    blurbEn: 'Roots, red lines, wishes, canon, true self — where the name stands.',
    blurbZh: '脉、忌、愿、典、命——名字立足的根基。',
  },
}

export const PALACES: Palace[] = [
  { key: 'dao', num: 1, tier: 'heaven', word: '道', nameZh: '太极宫', nameEn: 'Taiji Palace', essenceEn: 'The supreme source — does the name fit who you are and what you reach for?', essenceZh: '万化之源——名字是否契合你之所是、所求？' },
  { key: 'shi', num: 2, tier: 'heaven', word: '势', nameZh: '乘势宫', nameEn: 'Momentum Palace', essenceEn: 'The driving force — does it ride the momentum of your name and your moment?', essenceZh: '名字的推力——是否乘你本名与际遇之势？' },
  { key: 'ge', num: 3, tier: 'heaven', word: '格', nameZh: '立格宫', nameEn: 'Stature Palace', essenceEn: 'The measure — is its bearing well-proportioned, neither cramped nor overfull?', essenceZh: '名字的格局——气度是否得宜，不局促、不过满？' },
  { key: 'yin', num: 4, tier: 'human', word: '音', nameZh: '凤鸣宫', nameEn: 'Phoenix-Song Palace', essenceEn: 'The gate of sound — does it echo your original name and read smoothly?', essenceZh: '声音之门——是否与本名相应，且诵之顺口？' },
  { key: 'xing', num: 5, tier: 'human', word: '形', nameZh: '六书宫', nameEn: 'Six-Scripts Palace', essenceEn: 'The body on the page — are the characters upright, easy to write, not obscure?', essenceZh: '纸上之形——字是否端正、易写、不生僻？' },
  { key: 'yi', num: 6, tier: 'human', word: '意', nameZh: '立意宫', nameEn: 'Meaning Palace', essenceEn: 'The soul — does the meaning truly fit your aims and character?', essenceZh: '名字的灵魂——其意是否真合你的志与性？' },
  { key: 'xiang', num: 7, tier: 'human', word: '象', nameZh: '星河宫', nameEn: 'Stellar-River Palace', essenceEn: 'Vista and atmosphere — does it leave an image in the mind, a scene?', essenceZh: '意境气象——可曾在心中留下一幅景、一种气？' },
  { key: 'mai', num: 8, tier: 'earth', word: '脉', nameZh: '承脉宫', nameEn: 'Lineage Palace', essenceEn: 'Roots and lineage — does its surname give you a place in the world of the characters?', essenceZh: '根脉所系——其姓是否予你立身于汉字世界之地？' },
  { key: 'ji', num: 9, tier: 'earth', word: '忌', nameZh: '慎微宫', nameEn: 'Prudence Palace', essenceEn: 'The red lines — have homophones, dialect, and gender been screened?', essenceZh: '红线之防——谐音、方言、性别可曾一一筛过？' },
  { key: 'yuan', num: 10, tier: 'earth', word: '愿', nameZh: '祈愿宫', nameEn: 'Aspiration Palace', essenceEn: 'The blessing — does it carry a wish you would gladly receive?', essenceZh: '名中之愿——是否承一份你乐于领受的祝福？' },
  { key: 'dian', num: 11, tier: 'earth', word: '典', nameZh: '用典宫', nameEn: 'Classics Palace', essenceEn: 'The roots in literature — is there a source, graceful and never obscure?', essenceZh: '典出有据——可有出处，雅而不僻？' },
  { key: 'ming', num: 12, tier: 'earth', word: '命', nameZh: '定命宫', nameEn: 'Destiny Palace', essenceEn: 'The final fit — taken as a whole, is it truly you?', essenceZh: '终极之合——通体观之，可真是你？' },
]

export const SEVEN_STEPS: { num: number; titleEn: string; titleZh: string; bodyEn: string; bodyZh: string }[] = [
  { num: 1, titleEn: 'Set the Way', titleZh: '定其道', bodyEn: 'Establish direction and character — who you are, what you reach for.', bodyZh: '立方向、定其性——你是谁，你所求为何。' },
  { num: 2, titleEn: 'Know the Person', titleZh: '知其人', bodyEn: 'Read the situation, and find the sound to ride from your original name.', bodyZh: '审其境，并自本名中觅可乘之音。' },
  { num: 3, titleEn: 'Clarify Wishes', titleZh: '明其愿', bodyEn: 'Define scope and the red lines — what must be kept out.', bodyZh: '定范围、立红线——何者必须摒除。' },
  { num: 4, titleEn: 'Build the Body', titleZh: '立其身', bodyEn: 'Weave sound, form, meaning, and imagery into living characters.', bodyZh: '织音、形、意、象，成鲜活之字。' },
  { num: 5, titleEn: 'Forge the Roots', titleZh: '铸其根', bodyEn: 'Choose the surname; infuse the classics for depth.', bodyZh: '择其姓，注典籍以厚其底。' },
  { num: 6, titleEn: 'Ride the Momentum', titleZh: '乘其势', bodyEn: 'Tone-harmonise and refine the whole until it breathes.', bodyZh: '谐其声调，通体打磨，至于呼吸自如。' },
  { num: 7, titleEn: 'Return to the Way', titleZh: '归其道', bodyEn: 'Verify across all twelve palaces, and write the Naming Note.', bodyZh: '十二宫逐一勘验，终成《取名记》。' },
]
