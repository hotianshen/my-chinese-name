# My Chinese Name — Product Design Document

*A companion product to the book **My Chinese Name: The Art of Choosing a Chinese Name That Is Truly Yours** (Ho Tianshen, v5.1). It turns the book's method — the Ho Method of Three Powers & Twelve Palaces — into a living tool and a 95%-automated business.*

---

## 1. Vision

> More than a translation — a bridge. Every English name carries a person; every Chinese name opens a door. We build the bridge between them, with the rigour of a 1,600-year tradition and the warmth of a name made for one person.

We are **not** a "fun" name generator and **not** transliteration. We sell **authenticity, understanding, and a beautiful artifact** — a name the bearer is proud to introduce, with the reasoning to back it up.

## 2. The market gap (from research)

The market is **barbell-shaped**: free AI toys ($0–$10, "just for fun") on one end, $5K+ brand agencies on the other. **The $30–$500 "premium authentic personal" tier is empty.** Incumbents (Legacy Name, GoEast, Laoshi, mychinese.name) compete on a free generator and monetise weakly. Our moat is the **named, documented methodology** (Three Powers & Twelve Palaces) — provenance that AI generators structurally cannot copy — plus a human master tier and a giftable artifact.

## 3. Personas & primary user stories

| # | Persona | Story | Tier they buy |
|---|---------|-------|---------------|
| 1 | **China-facing professional / founder** | "A Google-Translate name makes me look amateur to Chinese clients." | Dossier → Master's |
| 2 | **Serious Mandarin learner / study-abroad student** | "My teacher wants a real Chinese name I'll use for years." | Free → Dossier |
| 3 | **Gift buyer** | "I want a meaningful, beautiful personalised gift." | Dossier + print/seal |
| 4 | **Mixed-heritage parent** | "We want a culturally correct name for our child." | Master's |
| 5 | **Culture / fandom enthusiast** | "I want an authentic name, not something cringe." | Free → Dossier |
| 6 | **Brand / team entering China** | "We need a defensible Chinese name; $5K agencies are overkill." | Brand |

## 4. Methodology → product mapping

The book's **Tool 10 ("From Book to Tool")** already specifies the modules. We implement them faithfully:

| Book module | Product surface |
|---|---|
| Intake questionnaire (Set the Way) | The Name Finder wizard, steps 1–3 |
| Sound-bridge (Hybrid Method) | Phonetic anchor → neighbouring Chinese sounds |
| Risk scanner (Prudence Palace) | Live red-line/gender/tone screening |
| Name portfolio (Seven Steps) | Three candidates: **Safe · Cultural · Distinctive** |
| Name dossier (Return to the Way) | The paid PDF dossier + shareable card |
| Twelve-Palace Scorecard | The radar/scorecard shown on every result |

**Engine fidelity:** pure to the book — sound, form, meaning, imagery, roots, and the twelve-palace reckoning. We deliberately **avoid BaZi / zodiac / five-elements fortune-telling** (the book explicitly is "not fortune-telling"); that is also what separates us from the AI crowd.

## 5. Commercial model

| Tier | Price | Fulfilment |
|---|---|---|
| **The Name Finder** (free) | $0 | One name + 1-line meaning; the hook. Email-wall to unlock depth. |
| **The Name Dossier** ⭐ hero | **$39** | 100% automated: 3 names, full Twelve-Palace reckoning, etymology, pronunciation, usage, name card. |
| **The Master's Name** | **$149** | Human-in-loop: a name-master crafts & signs it. 3–5 days. |
| **The Name Society** | $19/mo | Recurring culture drops (phase 2). |
| **Brand & Bearer** | from $499 | Company / team / family names. Lightly assisted. |

**Add-ons (auto-fulfilled):** pronunciation audio +$9 · premium certificate +$12 · calligraphy wall-art +$15 · canvas print $49–89 · name seal/chop $39–59 · "name my family/team" +$79. Target blended **AOV ~$80**, ~78% margin.

**Funnel:** cold traffic → free tool (one real name) → **email wall** ("unlock your full reckoning + 2 more names") → Dossier $39 (+ order bumps) → thank-you upsell (print/seal) → nurture → Master's. **Growth loops:** programmatic SEO (a page per English name), shareable seal-cards (viral), the Amazon book (authority), referral/gifting.

**Automation:** Lemon Squeezy (Merchant of Record — auto VAT/tax across 170+ countries) for checkout + delivery; engine + templated dossier = instant fulfilment; POD for physical add-ons; email automation for nurture. **The 5% human work** = fulfilling Master's/Brand orders, approving content, edge-case support, high-level decisions.

## 6. Information architecture

`/` Home · `/method` The Method (Three Powers & Twelve Palaces) · `/finder` The Name Finder (free tool) · `/result` Your names + scorecard · `/pricing` · `/gallery` A Gallery of Fine Names · `/about` The Ho Method & the author · `/faq` · `/admin` back-office. Bilingual **EN (default) / 中文**; light + lacquer-dark themes.

## 7. Design system

Literati-luxe, East-meets-West. Rice-paper + ink with vermilion seal and gold hairlines (the **90 / 8 / 2** rule). Fonts: **Fraunces** (display), **Inter** (body), **Noto Serif SC** (the name as artifact), **LXGW WenKai** (warm accents). Signature moment: the **seal stamps** onto the paper when a name resolves. Motifs: the 印章 seal, the twelve-palace radial, vertical 竖排 type, gold hairlines, paper grain. No dragons, no fortune-cookie fonts, no flooding red.

## 8. Internal review — three rounds of self-critique

**Round 1 — the skeptical buyer ("why pay?").** A free generator gives a name instantly. → *Resolution:* the free tool returns one genuinely good name but **visibly gates the depth** (the twelve-palace reckoning, the two alternatives, the dossier, the artifact). The scorecard is the on-screen *proof of rigour* that makes the paid depth obviously worth $39.

**Round 2 — the cultural-authenticity critic ("is this respectful / real?").** Risk of looking like a gimmick or appropriation. → *Resolution:* lead with the book's own framing (a name as bridge-building, *enriching* Chinese), the 54-generation provenance, scholarly tone, and a reasoned rationale on every name. Strictly avoid clichés (design "don'ts"). Engine stays pure to the documented method.

**Round 3 — the operator ("can it really run 95% hands-off?").** The $149 tier needs a human. → *Resolution:* free + $39 are fully automated (engine → templated dossier → Lemon Squeezy delivery); Master's/Brand are a small queue surfaced in the **admin fulfilment board**. Everything else (payments, tax, email, POD) is outsourced to set-and-forget services.

**Round 4 — the engineer ("maintainable / deployable?").** → *Resolution:* static build, client-side engine, hosted checkout links — **no server to break**. Deploys free to Cloudflare Pages / GitHub Pages. Admin reads from the payment provider (phase 2 serverless) and works in demo mode today.

## 9. Roadmap

- **v1 (launch):** full marketing site + free Name Finder + dossier preview + pricing + checkout links + admin (demo data) + bilingual + deploy.
- **v1.1:** wire live Lemon Squeezy keys; dossier PDF generation; email capture to ESP.
- **v2:** programmatic SEO pages (per English name); shareable seal-cards; audio; POD add-ons; Society subscription; more languages (FR/DE/ES, then Arabic).
