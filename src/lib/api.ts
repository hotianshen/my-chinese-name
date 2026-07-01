// Client bridge to the server-authoritative backend (Cloudflare Pages Functions).
// When VITE_API_BASE is set, entitlement is fetched from the server and cached
// into localStorage so the existing synchronous reads (src/lib/tiers.ts) see the
// server truth. With no API configured, everything falls back to localStorage —
// the current static-site behaviour — so the live site is unaffected.
const API = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

export function isServerBacked(): boolean {
  return Boolean(API)
}

export async function fetchEntitlement(email: string): Promise<number | null> {
  if (!API || !email) return null
  try {
    const r = await fetch(`${API}/api/entitlement?email=${encodeURIComponent(email)}`)
    if (!r.ok) return null
    const d = (await r.json()) as { level?: number }
    return typeof d.level === 'number' ? d.level : null
  } catch {
    return null
  }
}

/** Pull server entitlement into localStorage so sync reads reflect it (grants
 * only ever raise the level, matching the server). */
export async function syncEntitlement(email: string): Promise<void> {
  const level = await fetchEntitlement(email)
  if (level == null) return
  try {
    const cur = parseInt(localStorage.getItem('mcn-level') || '0', 10) || 0
    if (level > cur) localStorage.setItem('mcn-level', String(level))
  } catch {
    /* ignore */
  }
}

const EMAIL_KEY = 'mcn-email'
export function rememberEmail(email: string): void {
  try { localStorage.setItem(EMAIL_KEY, email) } catch { /* ignore */ }
}
export function knownEmail(): string {
  try { return localStorage.getItem(EMAIL_KEY) || '' } catch { return '' }
}

/** Called once on app load: if we know the visitor's email and a server is
 * configured, reconcile their entitlement from the server. */
export async function reconcileOnLoad(): Promise<void> {
  if (!API) return
  const email = knownEmail()
  if (email) await syncEntitlement(email)
}
