// Engine smoke test — run with: npx tsx test/engine.test.ts
import { generateNames } from '../src/engine/generate'
import type { Intake } from '../src/engine/types'

const cases: Intake[] = [
  { givenName: 'Michael', surname: 'Brown', gender: 'masc', themes: ['Light & Clarity', 'Ambition & Purpose'], takeSurname: true, surnameStrategy: 'sound', profession: 'Finance / Law', nativeLanguage: 'English' },
  { givenName: 'Sophia', surname: 'Anderson', gender: 'fem', themes: ['Wisdom & Learning', 'Feminine Grace (fem)'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'English' },
  { givenName: 'David', surname: 'Klein', gender: 'masc', themes: ['Character & Virtue'], takeSurname: true, surnameStrategy: 'sound', profession: 'Tech / Engineering', nativeLanguage: 'German' },
  { givenName: 'Aisha', surname: 'Rahman', gender: 'fem', themes: ['Peace & Joy', 'Light & Clarity'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'Arabic' },
  { givenName: 'Henri', surname: 'Dubois', gender: 'masc', themes: ['Wisdom & Learning'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'French' },
  { givenName: 'Emma', gender: 'fem', themes: ['Peace & Joy'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'English' },
  { givenName: 'Olivia', surname: 'Wei', gender: 'neutral', themes: ['Nature & Landscape'], takeSurname: true, surnameStrategy: 'sound', nativeLanguage: 'English' },
]

let pass = 0, fail = 0
function check(cond: boolean, msg: string) {
  if (cond) { pass++ } else { fail++; console.error('  ✗ FAIL:', msg) }
}

for (const intake of cases) {
  const r = generateNames(intake)
  console.log(`\n=== ${intake.givenName} ${intake.surname ?? ''} (${intake.gender}) — anchor "${r.anchor.syllable}" ===`)
  if (r.referenceSeed) console.log(`  book seed: ${r.referenceSeed.hanzi} (${r.referenceSeed.pinyin}) — ${r.referenceSeed.sense}`)
  check(r.candidates.length === 3, 'exactly 3 candidates')
  const names = new Set(r.candidates.map((c) => c.fullHanzi))
  check(names.size === 3, `3 distinct names (got ${[...names].join(', ')})`)
  for (const c of r.candidates) {
    console.log(
      `  [${c.type.padEnd(11)}] ${c.fullHanzi.padEnd(4)} ${c.fullPinyin.padEnd(16)} ` +
      `score ${c.totalScore}  tones[${c.tonePattern.join('')}]  ${c.risks.length} risk(s)`)
    console.log(`      gloss: ${c.meaningGloss}`)
    check(c.fullHanzi.length >= 2 && c.fullHanzi.length <= 3, `${c.type}: name is 2–3 chars (got ${c.fullHanzi.length})`)
    check(c.totalScore >= 40 && c.totalScore <= 100, `${c.type}: score in range (got ${c.totalScore})`)
    check(c.scorecard.length === 12, `${c.type}: 12 palaces scored`)
    check(c.scorecard.every((p) => p.score >= 1 && p.score <= 5), `${c.type}: all palace scores 1–5`)
    // gender: masc intake should not surface a strongly-feminine char unflagged
    if (intake.gender === 'masc') {
      const femChar = c.given.find((g) => g.gender === 'fem')
      check(!femChar, `${c.type}: no feminine char for masc intake (found ${femChar?.hanzi ?? 'none'})`)
    }
  }
}

console.log(`\n———\n${pass} checks passed, ${fail} failed.`)
if (fail > 0) process.exit(1)
