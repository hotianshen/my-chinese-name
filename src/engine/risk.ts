// ============================================================================
// The Prudence Palace (忌) — the name's floor. Not what to add, but what to
// keep out: gender mismatch, tone difficulty, hard-sound stacking, the
// surname–given seam, and anything on the bearer's avoid-list.
// "Walk the name through every junction where it might embarrass its owner."
// ============================================================================
import type { CharRecord, Gender, Intake, RiskFlag, SurnameRecord } from './types'
import { isHardForBearer } from './phonetics'

export function scanRisks(
  surname: SurnameRecord | null,
  given: CharRecord[],
  intake: Intake,
): RiskFlag[] {
  const flags: RiskFlag[] = []
  const tones = [...(surname ? [surname.tone] : []), ...given.map((g) => g.tone)]

  // —— Danger three: gender mismatch ——
  if (intake.gender !== 'neutral') {
    const opposite: Gender = intake.gender === 'masc' ? 'fem' : 'masc'
    const clash = given.find((g) => g.gender === opposite)
    if (clash) {
      flags.push({
        level: 'warning',
        palace: 'Prudence · Gender',
        message: `“${clash.hanzi}” reads as conventionally ${clash.gender === 'fem' ? 'feminine' : 'masculine'} to Chinese ears, which differs from your stated preference. Consider a neutral character instead.`,
      })
    }
  }

  // —— Crossable in both directions: tones & hard sounds for the bearer ——
  const hard = given.filter(isHardForBearer)
  if (hard.length >= 2) {
    flags.push({
      level: 'caution',
      palace: 'Prudence · Sound',
      message: `“${hard.map((h) => h.hanzi).join('', )}” stack retroflex/palatal initials (${hard.map((h) => h.initial).join(', ')}) that English speakers find hard to say. The name may tie your own tongue.`,
    })
  }
  if (given.length && given.every((g) => g.tone === 4) && (!surname || surname.tone === 4)) {
    flags.push({
      level: 'caution',
      palace: 'Prudence · Tone',
      message: 'Every syllable falls on the fourth tone — the name thuds downward. A rising tone would let it breathe.',
    })
  }
  for (let i = 1; i < given.length; i++) {
    if (given[i].tone === 3 && given[i - 1].tone === 3) {
      flags.push({
        level: 'caution',
        palace: 'Prudence · Tone',
        message: 'Two third tones in a row trigger a tone shift and are awkward for a learner to pronounce.',
      })
    }
  }
  // three identical tones in a row
  for (let i = 2; i < tones.length; i++) {
    if (tones[i] === tones[i - 1] && tones[i - 1] === tones[i - 2]) {
      flags.push({
        level: 'caution',
        palace: 'Prudence · Tone',
        message: 'Three identical tones run flat — the name loses its rise and fall.',
      })
      break
    }
  }

  // —— Red line four: characters that ask for care ——
  const strong = given.filter((g) => g.tier === 'strong')
  if (strong.length) {
    flags.push({
      level: 'info',
      palace: 'Prudence · Form',
      message: `“${strong.map((s) => s.hanzi).join('')}” is a vivid, strong character — striking, but heavier to carry. Make sure its boldness matches you.`,
    })
  }

  // —— Red lines two & one: the bearer's own avoid-list ——
  if (intake.avoid && intake.avoid.trim()) {
    const avoid = intake.avoid.trim()
    const hit = given.find((g) => avoid.includes(g.hanzi)) || (surname && avoid.includes(surname.hanzi) ? surname : null)
    if (hit) {
      flags.push({
        level: 'warning',
        palace: 'Prudence · Taboo',
        message: `“${hit.hanzi}” appears on your avoid-list and was kept out of the final reckoning where possible.`,
      })
    }
  }

  // —— The surname–given seam (homophone junction) ——
  // Full homophone screening needs a native ear; we surface the standing advice.
  if (surname && given.length) {
    // a light heuristic: identical adjacent syllables read as a stutter
    if (surname.plain === given[0].plain) {
      flags.push({
        level: 'caution',
        palace: 'Prudence · Homophone',
        message: `The surname and first given syllable are both “${surname.plain}”, which stutters when spoken. A different surname would read more smoothly.`,
      })
    }
  }

  return flags
}

/** A 0..1 cleanliness score for the Prudence Palace from the risk flags. */
export function prudenceScore(flags: RiskFlag[]): number {
  let s = 1
  for (const f of flags) {
    if (f.level === 'warning') s -= 0.35
    else if (f.level === 'caution') s -= 0.18
    else s -= 0.04
  }
  return Math.max(0, s)
}
