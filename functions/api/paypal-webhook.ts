// Cloudflare Pages Function — PayPal webhook → server-authoritative entitlement.
// POST /api/paypal-webhook
//
// On a completed capture it verifies the webhook signature with PayPal, maps the
// paid amount to a tier level, and raises the payer's entitlement in KV — which
// closes the gap that raw PayPal payment links leave (no callback → no auto
// unlock/delivery).
//
// Bindings/secrets: KV `MCN`; PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_WEBHOOK_ID,
// PAYPAL_API (default https://api-m.paypal.com).

interface Env {
  MCN: KVNamespace
  PAYPAL_CLIENT_ID: string
  PAYPAL_SECRET: string
  PAYPAL_WEBHOOK_ID: string
  PAYPAL_API?: string
}

// paid amount (USD) → entitlement level
function amountToLevel(amount: number): number {
  if (amount >= 9999) return 4
  if (amount >= 999) return 3
  if (amount >= 99) return 2
  if (amount >= 9) return 1
  return 0
}

async function accessToken(env: Env, api: string): Promise<string> {
  const res = await fetch(`${api}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json<{ access_token: string }>()
  return data.access_token
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const api = env.PAYPAL_API || 'https://api-m.paypal.com'
  const bodyText = await request.text()
  let event: Record<string, unknown>
  try { event = JSON.parse(bodyText) } catch { return new Response('bad json', { status: 400 }) }

  // 1) verify the webhook signature with PayPal (reject spoofed grants)
  try {
    const token = await accessToken(env, api)
    const verify = await fetch(`${api}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo: request.headers.get('paypal-auth-algo'),
        cert_url: request.headers.get('paypal-cert-url'),
        transmission_id: request.headers.get('paypal-transmission-id'),
        transmission_sig: request.headers.get('paypal-transmission-sig'),
        transmission_time: request.headers.get('paypal-transmission-time'),
        webhook_id: env.PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      }),
    })
    const vr = await verify.json<{ verification_status: string }>()
    if (vr.verification_status !== 'SUCCESS') return new Response('signature failed', { status: 401 })
  } catch (e) {
    return new Response('verify error: ' + (e as Error).message, { status: 502 })
  }

  // 2) act on completed payments only
  const type = event.event_type as string
  if (type !== 'PAYMENT.CAPTURE.COMPLETED' && type !== 'CHECKOUT.ORDER.APPROVED') {
    return new Response(JSON.stringify({ ok: true, ignored: type }), { status: 200 })
  }
  const resource = (event.resource || {}) as Record<string, any>
  const amount = parseFloat(resource?.amount?.value ?? resource?.purchase_units?.[0]?.amount?.value ?? '0')
  const email =
    resource?.payer?.email_address ??
    resource?.payee?.email_address ??
    (event as any)?.resource?.payer?.email_address ??
    ''
  const level = amountToLevel(amount)
  if (!email || !level) return new Response(JSON.stringify({ ok: true, note: 'no email/level' }), { status: 200 })

  const k = `ent:${String(email).trim().toLowerCase()}`
  const raw = await env.MCN.get(k)
  const current = raw ? (JSON.parse(raw).level ?? 0) : 0
  await env.MCN.put(k, JSON.stringify({ level: Math.max(current, level), updatedAt: new Date().toISOString(), source: 'paypal' }))
  // also log the order for the admin board
  await env.MCN.put(`order:${Date.now()}`, JSON.stringify({ email, amount, level, at: new Date().toISOString() }))

  return new Response(JSON.stringify({ ok: true, email, level }), { status: 200 })
}
