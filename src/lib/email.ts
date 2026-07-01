// Email automation — config-driven, no backend required. Set VITE_EMAIL_WEBHOOK
// to a Zapier / Make catch-hook or a small serverless endpoint that adds the
// subscriber to your ESP (MailerLite / ConvertKit / Mailchimp). With it unset,
// leads are still captured locally and shown in the Admin board.
export function isEmailLive(): boolean {
  return Boolean(import.meta.env.VITE_EMAIL_WEBHOOK)
}

export async function subscribe(email: string, meta?: Record<string, unknown>): Promise<boolean> {
  const url = import.meta.env.VITE_EMAIL_WEBHOOK as string | undefined
  if (!url) return false
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'mychinese.name', at: new Date().toISOString(), ...meta }),
    })
    return true
  } catch {
    return false // never block the UX on a delivery hiccup
  }
}
