// Build-time pre-render for the programmatic-SEO name pages. For each English
// name it runs the real engine, then writes dist/chinese-name-for/<name>/index.html
// with a unique <title>, meta description, canonical, OG tags, and a fallback
// content block (the actual generated name) that non-JS crawlers and social
// scrapers can read. The SPA takes over on load. Run after `vite build`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { generateNames } from '../src/engine/generate'
import type { Intake } from '../src/engine/types'

// keep in sync with src/pages/NameDirectory.tsx
const NAMES = [
  'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
  'Grace', 'Chloe', 'Zoe', 'Lily', 'Nora', 'Hazel', 'Aria', 'Ella', 'Aurora', 'Ruby',
  'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
  'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Sebastian', 'Jack', 'Owen',
  'David', 'Joseph', 'Samuel', 'Matthew', 'Leo', 'Julian', 'Isaac', 'Thomas', 'Aiden', 'Nathan',
  'Sarah', 'Emily', 'Anna', 'Laura', 'Julia', 'Sophie', 'Hannah', 'Alice', 'Clara', 'Rose',
  'Maria', 'Elena', 'Aisha', 'Fatima', 'Yuki', 'Mei', 'Ana', 'Ingrid', 'Sofia', 'Nina',
  'Ryan', 'Kevin', 'Peter', 'John', 'George', 'Adam', 'Eric', 'Simon', 'Victor', 'Max',
]

const DIST = 'dist'
const PROD = 'https://www.mychinese.name'
const shell = readFileSync(join(DIST, 'index.html'), 'utf8')
const base = (shell.match(/href="(\/[^"]*?)assets\//) || [, '/'])[1] || '/'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

let count = 0
for (const name of NAMES) {
  const intake: Intake = {
    givenName: name, surname: name, gender: 'neutral',
    themes: ['Character & Virtue', 'Wisdom & Learning'], takeSurname: true,
    surnameStrategy: 'sound', nativeLanguage: 'English', nameLength: 'auto',
  }
  const s = generateNames(intake).candidates[0]
  const slug = name.toLowerCase()
  const title = `Chinese Name for ${name} — Meaning, Pinyin & How to Choose | My Chinese Name`
  const desc = `What is a good Chinese name for ${name}? See an authentic example (${s.fullHanzi} ${s.fullPinyin}), its meaning, and craft your own by the 1,600-year Ho Method.`
  const url = `${PROD}/chinese-name-for/${slug}`

  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace('</head>', `  <link rel="canonical" href="${url}" />\n  </head>`)

  // Schema.org structured data → richer search results
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: desc,
    url,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'My Chinese Name', url: PROD },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Chinese Names', item: `${PROD}/chinese-names` },
        { '@type': 'ListItem', position: 2, name: `Chinese name for ${name}`, item: url },
      ],
    },
  }
  html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`)

  const fallback =
    `<main style="max-width:680px;margin:0 auto;padding:48px 24px;font-family:Georgia,serif;color:#57534A">` +
    `<p style="letter-spacing:.18em;text-transform:uppercase;color:#9A7B33;font-size:12px">A Chinese name for</p>` +
    `<h1 style="font-size:44px;color:#1C1B18;line-height:1.1">Chinese name for ${esc(name)}</h1>` +
    `<p style="font-size:20px">An authentic example: <strong lang="zh">${s.fullHanzi}</strong> (${s.fullPinyin}) — ${esc(s.meaningGloss)}.</p>` +
    `<p>Not a transliteration — a real Chinese name woven from sound, meaning, form, and roots by the 1,600-year Ho Method. ` +
    `<a href="${base}finder">Craft your own name »</a></p></main>`
  html = html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`)

  const dir = join(DIST, 'chinese-name-for', slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  count++
}
console.log(`Prerendered ${count} SEO name pages into ${DIST}/chinese-name-for/*`)
