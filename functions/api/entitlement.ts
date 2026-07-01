// Cloudflare Pages Function — server-authoritative entitlement.
// GET  /api/entitlement?email=...        → { email, level }
// POST /api/entitlement { email, level, secret } → grant (max wins)
//
// Binding required: KV namespace `MCN` (wrangler / Pages dashboard).
// Secret required:  GRANT_SECRET (for authorised grants from admin/webhook).
// Until Cloudflare is connected the client falls back to localStorage
// (src/lib/api.ts), so the live static site is unaffected.

interface Env {
  MCN: KVNamespace
  GRANT_SECRET: string
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

const key = (email: string) => `ent:${email.trim().toLowerCase()}`
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: CORS })

export const onRequestOptions: PagesFunction<Env> = () => new Response(null, { headers: CORS })

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const email = new URL(request.url).searchParams.get('email') || ''
  if (!email) return json({ error: 'email required' }, 400)
  const raw = await env.MCN.get(key(email))
  const level = raw ? (JSON.parse(raw).level ?? 0) : 0
  return json({ email, level })
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { email?: string; level?: number; secret?: string }
  try { body = await request.json() } catch { return json({ error: 'bad json' }, 400) }
  const { email, level, secret } = body
  if (secret !== env.GRANT_SECRET) return json({ error: 'unauthorised' }, 401)
  if (!email || typeof level !== 'number') return json({ error: 'email + level required' }, 400)

  const raw = await env.MCN.get(key(email))
  const current = raw ? (JSON.parse(raw).level ?? 0) : 0
  const next = Math.max(current, level) // grants only ever raise the level
  await env.MCN.put(key(email), JSON.stringify({ level: next, updatedAt: new Date().toISOString() }))
  return json({ email, level: next })
}
