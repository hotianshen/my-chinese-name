// Edge-case hardening — unusual inputs must never crash and must always yield
// three valid, distinct, 2–3 character names. Run: npx tsx test/engine.edge.test.ts
import { generateNames } from '../src/engine/generate'
import type { Intake } from '../src/engine/types'

const base: Omit<Intake, 'givenName'> = {
  gender: 'neutral', themes: ['Character & Virtue'], takeSurname: true, surnameStrategy: 'sound',
}

const cases: Intake[] = [
  { ...base, givenName: 'Bo' },                                   // very short
  { ...base, givenName: 'Al', surname: 'Ng' },                    // tiny + tiny surname
  { ...base, givenName: 'J' },                                    // single letter
  { ...base, givenName: 'Maximilian', surname: 'Habsburg' },      // long
  { ...base, givenName: 'Quentin', surname: 'Quaye' },            // Q sound
  { ...base, givenName: 'Xavier', surname: 'Xu' },                // X sound
  { ...base, givenName: 'Yvonne', gender: 'fem' },                // Y + vowel
  { ...base, givenName: 'Wolfgang', nativeLanguage: 'German' },   // German
  { ...base, givenName: 'Giuseppe', nativeLanguage: 'Italian' },  // Italian
  { ...base, givenName: 'Dmitri', nativeLanguage: 'Russian' },    // Russian cluster
  { ...base, givenName: 'Hiroshi', nativeLanguage: 'Japanese' },  // Japanese
  { ...base, givenName: 'Aisha', takeSurname: false },            // no surname
  { ...base, givenName: 'Grace', surnameStrategy: 'meaning', themes: ['Peace & Joy', 'Light & Clarity'] },
  { ...base, givenName: 'Zoë', surname: "O'Brien" },              // diacritic + apostrophe
  { ...base, givenName: '  liam  ', surname: '  ' },              // whitespace / lowercase
]

let pass = 0, fail = 0
const ck = (c: boolean, m: string) => { c ? pass++ : (fail++, console.error('  ✗', m)) }

for (const intake of cases) {
  let r
  try { r = generateNames(intake) } catch (e) { fail++; console.error(`  ✗ CRASH on "${intake.givenName}":`, e); continue }
  const names = r.candidates.map((c) => c.fullHanzi)
  console.log(`  ${JSON.stringify(intake.givenName).padEnd(14)} → ${names.join(' / ').padEnd(16)} [${r.candidates.map((c) => c.totalScore).join('/')}]`)
  ck(r.candidates.length === 3, `${intake.givenName}: 3 candidates`)
  ck(new Set(names).size === 3, `${intake.givenName}: distinct (${names.join(',')})`)
  for (const c of r.candidates) {
    ck(c.fullHanzi.length >= 2 && c.fullHanzi.length <= 3, `${intake.givenName}/${c.type}: 2–3 chars (got "${c.fullHanzi}")`)
    ck(c.totalScore > 0 && c.totalScore <= 100, `${intake.givenName}/${c.type}: score 0–100`)
    ck(c.given.length >= 1 && c.given.every((g) => !!g.hanzi), `${intake.givenName}/${c.type}: valid given chars`)
    ck(c.fullPinyin.trim().length > 0, `${intake.givenName}/${c.type}: has pinyin`)
    if (!intake.takeSurname) ck(c.surname === null, `${intake.givenName}/${c.type}: no surname when opted out`)
  }
}
console.log(`\n${pass} checks passed, ${fail} failed.`)
if (fail > 0) process.exit(1)
