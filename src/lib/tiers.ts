// The L0–L4 tier ladder (migrated from the production site) plus the
// share-to-unlock viral mechanic. Entitlement is the max of: what was paid or
// admin-granted, and whether the share threshold has been reached. Client-side
// today (localStorage); server-backed in production.
import { track } from './store'

export type TierId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4'

export interface Tier {
  id: TierId
  level: number
  name: string
  zh: string
  price: string
  priceNum: number
  taglineEn: string
  taglineZh: string
  featuresEn: string[]
  featuresZh: string[]
}

export const SHARE_UNLOCK_THRESHOLD = 3

export const TIERS: Tier[] = [
  {
    id: 'L0', level: 0, name: 'Seeker', zh: '寻名者', price: 'Free', priceNum: 0,
    taglineEn: 'Begin here', taglineZh: '由此开始',
    featuresEn: ['One authentic name, on screen', 'Its sound anchor & meaning', 'A first reading of the palaces'],
    featuresZh: ['即得一个真名', '其声锚与意', '十二宫之初读'],
  },
  {
    id: 'L1', level: 1, name: 'Listener', zh: '闻音者', price: '$19', priceNum: 19,
    taglineEn: 'Unlock all three', taglineZh: '三名俱解',
    featuresEn: ['All three names revealed', 'Pronunciation & tone audio', 'Nicknames & intro scripts', 'The twelve-palace radar', 'A shareable name card'],
    featuresZh: ['三名尽现', '发音与声调音频', '昵称与自我介绍脚本', '十二宫命盘', '可分享的名片'],
  },
  {
    id: 'L2', level: 2, name: 'Insighter', zh: '明义者', price: '$49', priceNum: 49,
    taglineEn: 'The full dossier', taglineZh: '完整名册',
    featuresEn: ['Everything in Listener', 'The complete Name Dossier', 'Character etymology & classical sources', 'Full twelve-palace reckoning', 'Printable PDF & certificate'],
    featuresZh: ['含闻音者全部', '完整《名册》', '字源考据与典籍出处', '十二宫完整品鉴', '可打印 PDF 与证书'],
  },
  {
    id: 'L3', level: 3, name: 'Master', zh: '大师甄选', price: '$149', priceNum: 149,
    taglineEn: 'Hand-crafted', taglineZh: '亲手雕琢',
    featuresEn: ['A name-master crafts it personally', 'A written note, two revisions', 'Hi-res calligraphy & signed certificate', 'Delivered in 3–5 days'],
    featuresZh: ['取名师亲自雕琢', '亲笔题记，两轮修订', '高清书法与署名证书', '三至五日交付'],
  },
  {
    id: 'L4', level: 4, name: 'Legacy', zh: '传承者', price: 'from $499', priceNum: 499,
    taglineEn: 'Brand & enterprise', taglineZh: '品牌与企业',
    featuresEn: ['Company, team & family naming', 'Trademark-sense screening', 'Simplified + traditional forms', 'Logo-ready calligraphy'],
    featuresZh: ['企业、团队与家庭命名', '商标语感核查', '简繁二体', '可制标识之书法'],
  },
]

const LEVEL_KEY = 'mcn-level'
const SHARES_KEY = 'mcn-shares'

function num(key: string): number {
  try { return parseInt(localStorage.getItem(key) || '0', 10) || 0 } catch { return 0 }
}

/** Unique-ish share actions recorded toward the unlock. */
export function shareProgress(): number {
  return Math.min(num(SHARES_KEY), SHARE_UNLOCK_THRESHOLD)
}
export function recordShare(): number {
  const n = num(SHARES_KEY) + 1
  try { localStorage.setItem(SHARES_KEY, String(n)) } catch { /* ignore */ }
  track('share_progress', { count: n })
  return Math.min(n, SHARE_UNLOCK_THRESHOLD)
}

/** Paid or admin-granted level. */
export function grantedLevel(): number {
  return num(LEVEL_KEY)
}
export function grantLevel(level: number): void {
  try { if (level > grantedLevel()) localStorage.setItem(LEVEL_KEY, String(level)) } catch { /* ignore */ }
  track('tier_granted', { level })
}

/** The bearer's current entitlement level (0–4). */
export function unlockedLevel(): number {
  const paid = grantedLevel()
  const shared = shareProgress() >= SHARE_UNLOCK_THRESHOLD ? 1 : 0
  return Math.max(paid, shared)
}
