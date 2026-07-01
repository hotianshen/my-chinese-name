// Hosted-checkout layer. In production set the VITE_CHECKOUT_* env vars to your
// Lemon Squeezy (recommended — Merchant of Record, auto VAT/tax) or Stripe
// Payment Links. With no link configured the app runs in DEMO mode: it records
// a local order, grants the tier level, and returns 'demo' — so the whole
// funnel (and the L0–L4 unlock) is testable today.
import { addOrder, track, type Order } from './store'
import { grantLevel } from './tiers'

type Tier = Order['tier']

// The four live PayPal payment links, reused from the production site. These are
// public URLs (safe to ship); an env var overrides each if you later switch to
// Lemon Squeezy / Stripe. NOTE: each link charges the amount configured in
// PayPal — keep the displayed tier price (tiers.ts) equal to the link's amount.
const PAYPAL = {
  listener: 'https://www.paypal.com/ncp/payment/5QJKSYE2C9B3N', // L1
  insighter: 'https://www.paypal.com/ncp/payment/LE4EBE7L3XMD8', // L2
  masters: 'https://www.paypal.com/ncp/payment/2SRZZPTREN5Q6', // L3
  brand: 'https://www.paypal.com/ncp/payment/75VTSDG9PJ4DY', // L4
}

const LINKS: Record<Tier, string> = {
  Listener: import.meta.env.VITE_CHECKOUT_LISTENER ?? PAYPAL.listener,
  Insighter: import.meta.env.VITE_CHECKOUT_INSIGHTER ?? PAYPAL.insighter,
  "Master's Name": import.meta.env.VITE_CHECKOUT_MASTERS ?? PAYPAL.masters,
  'Brand & Bearer': import.meta.env.VITE_CHECKOUT_BRAND ?? PAYPAL.brand,
}

const TIER_LEVEL: Record<Tier, number> = {
  Listener: 1, Insighter: 2, "Master's Name": 3, 'Brand & Bearer': 4,
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
  // demo fulfilment — grant entitlement + record the order
  grantLevel(TIER_LEVEL[tier])
  const id = 'MCN-' + Math.floor(1000 + (Date.now() % 9000))
  addOrder({
    id, email: 'demo@buyer.test', tier, amount, name: name || '(from pricing)',
    status: tier === 'Listener' || tier === 'Insighter' ? 'paid' : 'in-fulfilment', at: new Date().toISOString(),
  })
  return 'demo'
}
