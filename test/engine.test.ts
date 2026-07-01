// Engine smoke test — run with: npx tsx test/engine.test.ts
import { generateNames } from '../src/engine/generate'
import type { Intake } from '../src/engine/types'

const cases: Intake[] = [
  { givenName: 'Michael', surname: 'Brown', gender: 'masc', themes: ['Light & Clarity', 'Ambition & Purpose'], takeSurname: true, surnameStrategy: 'sound', profession: 'Finance / Law', nativeLanguage: 'English' },
  { givenName: 'Sophia', surname: 'Anderson', gender: 'fem', themes: ['Wisdom & Learning', 'Feminine Grace (fem)'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'English' },
  { givenName: 'David', surname: 'Klein', gender: 'masc', themes: ['Character & Virtue'], takeSurname: true, surnameStrategy: 'sound', profession: 'Tech / Engineering', nativeLanguage: 'German', personality: ['Ambitious', 'Calm'] },
  { givenName: 'Aisha', surname: 'Rahman', gender: 'fem', themes: ['Peace & Joy', 'Light & Clarity'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'Arabic' },
  { givenName: 'Henri', surname: 'Dubois', gender: 'masc', themes: ['Wisdom & Learning'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'French', useContext: 'academic' },
  { givenName: 'Emma', surname: 'Wilson', gender: 'fem', themes: ['Peace & Joy'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'English' },
  { givenName: 'Olivia', surname: 'Wei', gender: 'neutral', themes: ['Nature & Landscape'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'English', cultureAffinity: 'mountains and rivers, poetry' },
]

let pass = 0, fail = 0
function check(cond: boolean, msg: string) {
  if (cond) { pass++ } else { fail++; console.error('  ✗ FAIL:', msg) }
}

for (const intake of cases) {
  const r = generateNames(intake)
  console.log(`\n=== ${intake.givenName} ${intake.surname ?? ''} (${intake.gender}) — anchor "${r.anchor.syllable}" ===`)
  check(r.candidates.length === 3, 'exactly 3 candidates')
  const names = new Set(r.candidates.map((c) => c.fullHanzi))
  check(names.size === 3, `3 distinct names (got ${[...names].join(', ')})`)
  for (const c of r.candidates) {
    console.log(`  [${c.type.padEnd(11)}] ${c.fullHanzi.padEnd(4)} ${c.fullPinyin.padEnd(16)} score ${c.totalScore}  tones[${c.tonePattern.join('')}]  nick ${c.nicknames.join('/')}`)
    // 3-character names are the default (surname + 2 given). Compound surname = 3.
    check(c.fullHanzi.length === 3, `${c.type}: 3-character name (got "${c.fullHanzi}" len ${c.fullHanzi.length})`)
    check(c.totalScore >= 40 && c.totalScore <= 100, `${c.type}: score in range (got ${c.totalScore})`)
    check(c.scorecard.length === 12, `${c.type}: 12 palaces scored`)
    check(c.nicknames.length >= 1 && c.introEn.length > 10 && c.introZh.length > 6, `${c.type}: has nicknames + intros`)
    if (intake.gender === 'masc') {
      const femChar = c.given.find((g) => g.gender === 'fem')
      check(!femChar, `${c.type}: no feminine char for masc intake (found ${femChar?.hanzi ?? 'none'})`)
    }
  }
}

// —— STABILITY: identical intake → identical names ——
const base: Intake = { givenName: 'Catherine', surname: 'Johnson', gender: 'fem', themes: ['Wisdom & Learning', 'Feminine Grace (fem)'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'English' }
const a = generateNames(base).candidates.map((c) => c.fullHanzi).join(',')
const b = generateNames({ ...base }).candidates.map((c) => c.fullHanzi).join(',')
check(a === b, `stability: same input → same names (${a} vs ${b})`)
console.log(`\nStability: "${a}" == "${b}" → ${a === b}`)

// —— UNIQUENESS (realistic): distinct people (different first + last) → no repeats ——
const people = [
  ['James', 'Smith'], ['Robert', 'Miller'], ['Liam', 'Davis'], ['Noah', 'Garcia'], ['Ethan', 'Wilson'],
  ['Lucas', 'Moore'], ['Mason', 'Taylor'], ['Logan', 'Brown'], ['Oliver', 'Thomas'], ['Aiden', 'Jackson'],
  ['Grace', 'White'], ['Chloe', 'Harris'], ['Zoe', 'Martin'], ['Nora', 'Lee'], ['Lily', 'Walker'],
  ['Ava', 'Hall'], ['Mia', 'Allen'], ['Ella', 'Young'], ['Ruby', 'King'], ['Ivy', 'Wright'],
]
const seen = new Map<string, string>()
let collisions = 0
for (const [f, l] of people) {
  const nm = generateNames({ givenName: f, surname: l, gender: 'neutral', themes: ['Character & Virtue'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'English' }).candidates[0].fullHanzi
  if (seen.has(nm)) { collisions++; console.error(`  ✗ collision: ${f} ${l} and ${seen.get(nm)} both → ${nm}`) }
  else seen.set(nm, `${f} ${l}`)
}
check(collisions === 0, `uniqueness (realistic): ${people.length} people had ${collisions} collisions`)
console.log(`Uniqueness (realistic): ${people.length} people → ${seen.size} distinct names, ${collisions} collision(s)`)

// —— UNIQUENESS (adversarial): same surname/theme/gender, only first name varies ——
const adv = ['James', 'Robert', 'Liam', 'Noah', 'Ethan', 'Lucas', 'Mason', 'Logan', 'Oliver', 'Aiden', 'Grace', 'Chloe', 'Zoe', 'Nora', 'Lily', 'Ava', 'Mia', 'Ella', 'Ruby', 'Ivy', 'Owen', 'Leo', 'Max', 'Kai', 'Rex']
const seen2 = new Map<string, string>()
let coll2 = 0
for (const f of adv) {
  const nm = generateNames({ givenName: f, surname: 'Lee', gender: 'neutral', themes: ['Character & Virtue'], takeSurname: true, surnameStrategy: 'meaning', nativeLanguage: 'English' }).candidates[0].fullHanzi
  if (seen2.has(nm)) { coll2++; console.error(`  ✗ adversarial collision: ${f} and ${seen2.get(nm)} → ${nm}`) }
  else seen2.set(nm, f)
}
check(coll2 === 0, `uniqueness (adversarial): ${adv.length} same-surname names had ${coll2} collisions`)
console.log(`Uniqueness (adversarial): ${adv.length} inputs → ${seen2.size} distinct names, ${coll2} collision(s)`)

// —— input sensitivity: changing a parameter changes the name ——
const p1 = generateNames({ ...base, themes: ['Ambition & Purpose'] }).candidates[0].fullHanzi
const p2 = generateNames({ ...base, themes: ['Nature & Landscape'] }).candidates[0].fullHanzi
check(p1 !== p2, `sensitivity: different themes → different name (${p1} vs ${p2})`)

console.log(`\n———\n${pass} checks passed, ${fail} failed.`)
if (fail > 0) process.exit(1)
