// Cloudflare Pages Function — cookie-protected admin data.
// GET /api/admin-data → { orders } from KV. Requires the signed session cookie
// issued by /api/admin-login (real server-side gate, not front-end only).
//
// Bindings/secrets: KV `MCN`, ADMIN_SECRET.

interface Env {
  MCN: KVNamespace
  ADMIN_SECRET: string
}

async function hmacHex(key: string, msg: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function cookie(request: Request, name: string): string {
  const raw = request.headers.get('Cookie') || ''
  const m = raw.match(new RegExp('(?:^|; )' + name + '=([^;]+)'))
  return m ? m[1] : ''
}

// constant-time-ish compare
function eq(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json' } })

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const expected = await hmacHex(env.ADMIN_SECRET, 'admin-session-v1')
  if (!eq(cookie(request, 'mcn_admin'), expected)) return json({ error: 'unauthorised' }, 401)

  // list order:* keys (the PayPal webhook writes these)
  const list = await env.MCN.list({ prefix: 'order:', limit: 1000 })
  const orders = await Promise.all(
    list.keys.map(async (k) => {
      const raw = await env.MCN.get(k.name)
      return raw ? { id: k.name.replace('order:', ''), ...JSON.parse(raw) } : null
    }),
  )
  const clean = orders.filter(Boolean) as Array<{ amount?: number }>
  const revenue = clean.reduce((a, o) => a + (o.amount || 0), 0)
  return json({ orders: clean, revenue, count: clean.length })
}
