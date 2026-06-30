# Launch Checklist — what to prepare

*The site is built, deployed, and testable today in **demo mode**. To switch on real payments and go fully commercial, gather the items below. Nothing here requires code from you — most are accounts + a few links I'll paste into config.*

Legend: **[You]** = you provide it · **[Me]** = I wire it up once you've provided it · ⏱ = rough effort.

---

## 1. Payments — the revenue switch ⭐ (highest priority)
- [ ] **[You]** Create a **Lemon Squeezy** account (recommended — it's a Merchant of Record, so it collects & remits VAT/sales-tax worldwide automatically). ⏱ 20 min
  - Alternative: **Stripe** (cheaper fees, but you'd handle tax yourself).
- [ ] **[You]** Create 3 products and copy their **checkout/buy-link URLs**:
  - The Name Dossier — **$39**
  - The Master's Name — **$149**
  - Brand & Bearer — **$499** (or a "request a quote" product)
- [ ] **[You]** (optional, for upsells) products for add-ons: audio +$9, certificate +$12, calligraphy +$15, canvas print, name seal.
- [ ] **[Me]** Paste the links into `VITE_CHECKOUT_DOSSIER`, `VITE_CHECKOUT_MASTERS`, `VITE_CHECKOUT_BRAND` and redeploy. Demo mode turns off automatically.

## 2. Domain — your real address
- [ ] **[You]** Decide the launch domain. You own **mychinese.name** — we can point it here.
- [ ] **[You]** In your domain registrar's DNS, I'll give you the exact records (a `CNAME` to GitHub Pages, or move hosting to Cloudflare Pages / Vercel for the apex domain + better SEO). ⏱ 10 min + DNS propagation
- [ ] **[Me]** Add the custom domain to the deployment and set `VITE_BASE=/`.

## 3. Email — capture & nurture (turns free users into buyers)
- [ ] **[You]** Create an email-marketing account (**MailerLite** is the cheapest start; **ConvertKit/Kit** is the standard). ⏱ 20 min
- [ ] **[You]** Provide its API key / form ID.
- [ ] **[Me]** Connect the Result-page email capture to it, and I'll draft a 5–7 email nurture sequence for you to approve.

## 4. Fulfilment — the auto-delivered Dossier
- [ ] **[Decision]** How should the $39 Dossier be delivered? (a) an auto-generated **PDF**, (b) a private **web page** link, or (c) both. *(Recommended: a beautiful web dossier + a downloadable PDF.)*
- [ ] **[You]** (optional) An **AI writing key** (Anthropic API) if you want each dossier's prose individually composed rather than templated. I can do high-quality templated prose without it.
- [ ] **[Me]** Build the dossier generator + delivery.

## 5. Brand assets — the finishing polish
- [ ] **[You]** Author **photo / portrait** of Ho Tianshen for the About page (optional but powerful).
- [ ] **[You]** Confirm the **seal characters** (currently 我有嘉名, "I have a fine name") and the wordmark are right.
- [ ] **[You]** Any **testimonials / quotes** from people you've named (first name + role is enough). These lift conversion a lot.
- [ ] **[Me]** Create the social-share **OG image** + the shareable **name card** design.

## 6. Trust & legal (low effort, builds confidence)
- [ ] **[You]** A **support email** (e.g. hello@mychinese.name).
- [ ] **[Decision]** Confirm the **refund policy** wording ("14-day, love-your-name-or-money-back" is live).
- [ ] **[Me]** Add **Terms**, **Privacy**, and **Refund** pages (I'll draft standard versions for your review).

## 7. Analytics & support (optional for day one)
- [ ] **[You]** A **Plausible** (privacy-friendly) or **Google Analytics** account.
- [ ] **[Me]** Add the snippet; the funnel events are already instrumented.

---

## Already done ✓
- Full bilingual site (EN default / 中文), light + dark themes, fully responsive.
- The naming engine (Ho Method: Three Powers, Twelve Palaces, Seven Steps, Hybrid Method) — faithful to the book, with a 149-character lexicon + curated extensions.
- The free Name Finder → three names (Safe / Cultural / Distinctive) → Twelve-Palace scorecard → email-gate → Dossier upsell funnel.
- Pricing with checkout (demo-mode now, one-line switch to live).
- Admin back-office (orders, fulfilment queue, leads, analytics, settings) at `/admin` (passcode `chengtian` — change via `VITE_ADMIN_CODE`).
- Deployed to GitHub Pages, auto-redeploying on every push.

## The minimum to be live & taking money tomorrow
Just **#1 (Lemon Squeezy links)** + **#2 (domain)**. Everything else can follow after launch. Send me those two and we flip the switch.
