# Server backend — Cloudflare Pages Functions

## ✅ LIVE (deployed 2026-07)
- **Cloudflare Pages project:** `my-chinese-name` · **URL:** https://my-chinese-name-b80.pages.dev
- **KV** namespace `MCN` (id `51956f67b046458a8c5aa8014522dc02`) bound via `wrangler.toml`.
- **Secret** `GRANT_SECRET` set (Cloudflare Pages → production).
- Verified live: `GET/POST /api/entitlement` works (grant persists in KV; bad secret rejected).
- Redeploy anytime with: `npm run deploy:cf`
- Client build uses `VITE_SERVER_BACKED=1` → same-origin `/api` (works on pages.dev and the apex domain).

### Remaining (needs your action)
1. **PayPal secrets** — in Cloudflare Pages → Settings → Variables, add `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_WEBHOOK_ID`; then point a PayPal webhook at `https://my-chinese-name-b80.pages.dev/api/paypal-webhook` (event `PAYMENT.CAPTURE.COMPLETED`). Then payments auto-grant entitlement.
2. **Custom domain `mychinese.name`** — add it to this Pages project in the dashboard. ⚠️ This REPLACES the currently-live old site on that domain — a deliberate cutover, do it when ready. (I have zone-read only, so I cannot and will not repoint DNS.)

---


These make entitlement **server-authoritative** (paid/share unlocks can no longer
be bypassed in the browser) and let **PayPal auto-grant** access after payment —
closing the gap that raw PayPal payment links leave (no callback → no auto
unlock/delivery).

They activate only when the site is deployed on **Cloudflare Pages** (GitHub
Pages has no server runtime). Until then the client falls back to `localStorage`
(`src/lib/api.ts`), so the live static site keeps working unchanged.

## Endpoints
- `GET  /api/entitlement?email=…` → `{ email, level }`
- `POST /api/entitlement` `{ email, level, secret }` → grant (max wins; needs `GRANT_SECRET`)
- `POST /api/paypal-webhook` → verifies the PayPal signature, maps amount → tier level, raises entitlement

## Activate (≈15 min)
1. **Deploy on Cloudflare Pages** — connect the GitHub repo; build `npm run build`, output `dist`. (Also gives the apex domain `mychinese.name` + these Functions.)
2. **KV namespace** — create one, bind it as `MCN` (Pages → Settings → Functions → KV bindings).
3. **Secrets** (Pages → Settings → Environment variables):
   - `GRANT_SECRET` — any long random string (for admin/manual grants)
   - `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_WEBHOOK_ID` (from your PayPal app)
4. **PayPal webhook** — in the PayPal dashboard point a webhook at
   `https://<your-domain>/api/paypal-webhook` for `PAYMENT.CAPTURE.COMPLETED`.
5. **Client** — set `VITE_API_BASE=https://<your-domain>` and redeploy. The app
   then reconciles entitlement from the server on load.

## Amount → level mapping (`paypal-webhook.ts`)
`≥$9 → L1 · ≥$99 → L2 · ≥$999 → L3 · ≥$9999 → L4` — keep in step with your PayPal link amounts.

## Note
Signature verification is enforced (spoofed grants are rejected). For admin auth,
move the passcode check to a Function + a signed cookie before handling real
customer data (currently a front-end passcode — demo-grade).
