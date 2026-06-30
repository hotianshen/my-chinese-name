// Hosted-checkout layer. In production set the VITE_CHECKOUT_* env vars to your
// Lemon Squeezy (recommended — Merchant of Record, auto VAT/tax) or Stripe
// Payment Links. With no link configured the app runs in DEMO mode: it records
// a local order and returns 'demo', so the whole funnel is testable today.
import { addOrder, track, type Order } from './store'

type Tier = Order['tier']

const LINKS: Record<Tier, string> = {
  Dossier: import.meta.env.VITE_CHECKOUT_DOSSIER ?? '',
  "Master's Name": import.meta.env.VITE_CHECKOUT_MASTERS ?? '',
  'Brand & Bearer': import.meta.env.VITE_CHECKOUT_BRAND ?? '',
}

export function isLive(tier: Tier): boolean {
  return Boolean(LINKS[tier])
}

/** Begin checkout. Returns 'redirect' (live) or 'demo' (recorded locally). */
export function startCheckout(tier: Tier, amount: number, name = ''): 'redirect' | 'demo' {
  track('checkout_start', { tier, amount })
  const link = LINKS[tier]
  if (link) {
    window.location.href = link
    return 'redirect'
  }
  // demo fulfilment
  const id = 'MCN-' + Math.floor(1000 + (Date.now() % 9000))
  addOrder({
    id, email: 'demo@buyer.test', tier, amount, name: name || '(from pricing)',
    status: tier === 'Dossier' ? 'paid' : 'in-fulfilment', at: new Date().toISOString(),
  })
  return 'demo'
}
