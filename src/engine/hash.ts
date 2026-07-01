// Deterministic hashing + PRNG. The whole engine is a pure function of the
// intake: the same input always yields the same names (stability), while any
// change to the input shifts the seed and diverges the tie-breaking, so two
// different people get two different names (non-repetition).

/** FNV-1a 32-bit string hash. */
export function hashString(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

/** mulberry32 — a small, fast, seeded PRNG. Returns a function → [0,1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A stable fingerprint of every field that should influence the name. */
export function fingerprint(parts: (string | undefined | string[])[]): number {
  const norm = parts
    .map((p) => (Array.isArray(p) ? p.join(',') : p ?? ''))
    .join('|')
    .toLowerCase()
    .trim()
  return hashString(norm)
}
