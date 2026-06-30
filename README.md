# My Chinese Name · 我有嘉名

> More than a translation — a bridge between the name you carry and the culture you meet.

The companion web product to the book **My Chinese Name: The Art of Choosing a Chinese Name That Is Truly Yours** (Ho Tianshen). It turns the **Ho Method** — *Three Powers & Twelve Palaces*, a naming tradition more than 1,600 years old — into a living tool and a 95%-automated business: a free name generator, a paid name dossier, a master-crafted tier, and an admin back-office.

This is **not** transliteration and **not** fortune-telling. The engine works with sound, meaning, form, and roots, faithful to the book's method, and shows its reckoning across the twelve palaces.

---

## Stack

- **Vite + React 19 + TypeScript**, **Tailwind CSS**, **Framer Motion** — builds to fully static output (zero-maintenance, free hosting).
- A pure-TypeScript **naming engine** (`src/engine/`) — the Hybrid Method, the Twelve-Palace scorecard, a risk scanner, and three candidate types (Safe / Cultural / Distinctive).
- Bilingual **EN (default) / 中文**, light + lacquer-dark themes.
- Hosted checkout (Lemon Squeezy / Stripe) with a working demo fallback; client-side persistence for the funnel and admin.

## Project layout

```
src/
  engine/        the Ho Method naming engine + knowledge base (from the book)
  content/       Three Powers, Twelve Palaces, Seven Steps, the gallery
  components/    Seal, PalaceRadar, Nav, Footer, UI primitives
  pages/         Home, Method, Finder, Result, Pricing, Gallery, About, FAQ
  admin/         the back-office dashboard
  i18n/ lib/     translation, theme, store, checkout
docs/PRODUCT.md  the product design document + self-critique
test/            engine smoke test
```

## Develop

```bash
npm install
npm run dev        # http://localhost:5273
npx tsx test/engine.test.ts   # run the engine smoke test
npm run build      # production build → dist/
```

## Go live (configuration)

Create a `.env` (see `.env.example`) and set:

| Variable | Purpose |
|---|---|
| `VITE_CHECKOUT_DOSSIER` | Lemon Squeezy / Stripe link for the $39 Dossier |
| `VITE_CHECKOUT_MASTERS` | link for the $149 Master's Name |
| `VITE_CHECKOUT_BRAND` | link for the Brand tier |
| `VITE_ADMIN_CODE` | passcode for `/admin` (default `chengtian`) |

With no checkout links set, the app runs in **demo mode** — orders are recorded locally and shown in the admin board, so the whole funnel is testable before you connect payments.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to **GitHub Pages**. For a custom domain (e.g. `mychinese.name`) or server-rendered SEO, deploy `dist/` to Cloudflare Pages / Vercel / Netlify with `VITE_BASE=/`.

---

*承天 · 名以载道 — Chengtian, the Ho family's art of names.*
