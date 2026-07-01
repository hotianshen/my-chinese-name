// Cloudflare Pages Function — server-side admin auth.
// POST /api/admin-login { code } → sets a signed HttpOnly session cookie.
// Replaces the front-end passcode: the real gate is the server verifying the
// code and issuing a cookie that the data endpoints require.
//
// Secrets: ADMIN_CODE (the passcode), ADMIN_SECRET (HMAC signing key).

interface Env {
  ADMIN_CODE: string
  ADMIN_SECRET: string
}

async function hmacHex(key: string, msg: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const json = (d: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json', ...headers } })

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { code?: string }
  try { body = await request.json() } catch { return json({ error: 'bad json' }, 400) }
  if (!env.ADMIN_CODE || body.code !== env.ADMIN_CODE) return json({ error: 'unauthorised' }, 401)

  const token = await hmacHex(env.ADMIN_SECRET, 'admin-session-v1')
  return json({ ok: true }, 200, {
    'Set-Cookie': `mcn_admin=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
  })
}
