// Lightweight client persistence — carries the generated result between the
// Finder and the Result page, and keeps demo leads/orders for the admin board.
// In production these become a serverless KV + the payment provider's API.
import type { GenerateResult } from '../engine/types'

const RESULT_KEY = 'mcn-result'
const LEADS_KEY = 'mcn-leads'
const ORDERS_KEY = 'mcn-orders'
const EVENTS_KEY = 'mcn-events'

export function saveResult(r: GenerateResult) {
  try { sessionStorage.setItem(RESULT_KEY, JSON.stringify(r)) } catch { /* ignore */ }
}
export function loadResult(): GenerateResult | null {
  try {
    const raw = sessionStorage.getItem(RESULT_KEY)
    return raw ? (JSON.parse(raw) as GenerateResult) : null
  } catch { return null }
}

export interface Lead { email: string; givenName: string; topName: string; at: string }
export interface Order {
  id: string
  email: string
  tier: 'Dossier' | "Master's Name" | 'Brand & Bearer'
  amount: number
  name: string
  status: 'paid' | 'in-fulfilment' | 'delivered'
  at: string
}

function read<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback } catch { return fallback }
}
function write<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* ignore */ }
}

export function captureLead(lead: Lead) {
  const leads = read<Lead[]>(LEADS_KEY, [])
  leads.unshift(lead)
  write(LEADS_KEY, leads.slice(0, 500))
  track('email_capture', { email: lead.email })
}
export const getLeads = () => read<Lead[]>(LEADS_KEY, [])
export const getOrders = () => read<Order[]>(ORDERS_KEY, [])
export function addOrder(o: Order) {
  const orders = read<Order[]>(ORDERS_KEY, [])
  orders.unshift(o)
  write(ORDERS_KEY, orders.slice(0, 500))
}
export function updateOrderStatus(id: string, status: Order['status']) {
  const orders = read<Order[]>(ORDERS_KEY, [])
  const o = orders.find((x) => x.id === id)
  if (o) { o.status = status; write(ORDERS_KEY, orders) }
}

export interface AnalyticsEvent { name: string; props?: Record<string, unknown>; at: string }
export function track(name: string, props?: Record<string, unknown>) {
  const events = read<AnalyticsEvent[]>(EVENTS_KEY, [])
  events.unshift({ name, props, at: new Date().toISOString() })
  write(EVENTS_KEY, events.slice(0, 1000))
}
export const getEvents = () => read<AnalyticsEvent[]>(EVENTS_KEY, [])

/** Seed some demo data so the admin board isn't empty on first run. */
export function ensureDemoData() {
  if (read<Order[]>(ORDERS_KEY, []).length) return
  const now = Date.now()
  const day = 86400000
  const demo: Order[] = [
    { id: 'MCN-1042', email: 'james.w@example.com', tier: 'Dossier', amount: 39, name: '高明哲 Gāo Míngzhé', status: 'delivered', at: new Date(now - 1 * day).toISOString() },
    { id: 'MCN-1043', email: 'sofia.k@example.com', tier: 'Dossier', amount: 51, name: '苏菲 Sū Fēi', status: 'delivered', at: new Date(now - 1 * day).toISOString() },
    { id: 'MCN-1044', email: 'm.dubois@example.com', tier: "Master's Name", amount: 149, name: '亨立 Hēng Lì', status: 'in-fulfilment', at: new Date(now - 0.4 * day).toISOString() },
    { id: 'MCN-1045', email: 'contact@nordictech.io', tier: 'Brand & Bearer', amount: 999, name: '(brand intake)', status: 'in-fulfilment', at: new Date(now - 0.2 * day).toISOString() },
    { id: 'MCN-1046', email: 'priya.n@example.com', tier: 'Dossier', amount: 60, name: '潘宁 Pān Níng', status: 'paid', at: new Date(now - 0.1 * day).toISOString() },
  ]
  write(ORDERS_KEY, demo)
  const leads: Lead[] = [
    { email: 'emma.t@example.com', givenName: 'Emma', topName: '叶安悦 Yè Ānyuè', at: new Date(now - 0.5 * day).toISOString() },
    { email: 'liam.o@example.com', givenName: 'Liam', topName: '林安 Lín Ān', at: new Date(now - 0.3 * day).toISOString() },
    { email: 'noah.r@example.com', givenName: 'Noah', topName: '诺远 Nuò Yuǎn', at: new Date(now - 0.2 * day).toISOString() },
  ]
  write(LEADS_KEY, leads)
}
