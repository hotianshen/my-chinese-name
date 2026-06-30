import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container, Eyebrow, Hairline, Reveal, SectionHeading } from '../components/ui'
import { PALACES, SEVEN_STEPS, TIERS, type Tier } from '../content/method'
import { useT } from '../i18n'
import { cn } from '../lib/cn'

export function Method() {
  const t = useT()
  return (
    <>
      <section className="section pb-xl text-center">
        <Container reading>
          <Reveal>
            <Eyebrow className="mb-lg">THE HO METHOD · 取名之道</Eyebrow>
            <h1 className="text-display-1 text-balance">{t('The Three Powers and the Twelve Palaces', '三才与十二宫')}</h1>
            <p className="text-lede text-ink-500 mt-xl text-pretty">
              {t(
                'A good name is not assembled from parts. It is read across three registers — Heaven, Human, Earth — and twelve dimensions within them. This is the architecture behind every name we craft.',
                '佳名非由零件拼凑。它须于三重境界——天、人、地——并其中十二宫之间通观。此即我们为每一个名字所立的法度与构造。',
              )}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Three powers */}
      <section className="pb-section">
        <Container>
          <div className="grid md:grid-cols-3 gap-lg">
            {(['heaven', 'human', 'earth'] as Tier[]).map((tk, i) => {
              const tier = TIERS[tk]
              const color = ['var(--seal-500)', 'var(--gold-600)', 'var(--info)'][i]
              return (
                <Reveal key={tk} delay={i * 100}>
                  <div className="card-paper p-xl h-full text-center" style={{ borderTop: `3px solid ${color}` }}>
                    <span className="han text-7xl text-ink-900">{tier.glyph}</span>
                    <h3 className="text-heading-3 mt-md">{t(tier.en, tier.zh)}</h3>
                    <p className="text-ink-500 text-[0.95rem] mt-sm">{t(tier.blurbEn, tier.blurbZh)}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Twelve palaces */}
      <section className="section" style={{ background: 'var(--paper-300)' }}>
        <Container>
          <Reveal>
            <SectionHeading center eyebrow={t('TWELVE PALACES · 十二宫', 'TWELVE PALACES · 十二宫')}
              title={t('Every dimension of a name', '名字的每一维')}
              lede={t('Twelve questions, asked of every name. Four of them — sound, form, meaning, roots — are where the work concentrates for a foreign friend.', '十二问，问于每一名。其中四者——音、形、意、脉——尤为外国友人取名着力之处。')}
              className="mx-auto" />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md mt-2xl">
            {PALACES.map((p, i) => {
              const color = p.tier === 'heaven' ? 'var(--seal-500)' : p.tier === 'human' ? 'var(--gold-600)' : 'var(--info)'
              return (
                <Reveal key={p.key} delay={(i % 3) * 80}>
                  <div className="card-paper p-lg h-full flex gap-lg">
                    <div className="shrink-0 flex flex-col items-center">
                      <span className="han text-4xl text-ink-900">{p.word}</span>
                      <span className="font-display text-xs mt-1" style={{ color }}>{String(p.num).padStart(2, '0')}</span>
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-ink-900">{t(p.nameEn, p.nameZh)}</h4>
                      <p className="text-caption text-ink-300">{p.nameZh} · {p.word}</p>
                      <p className="text-ink-500 text-[0.92rem] mt-sm leading-relaxed">{t(p.essenceEn, p.essenceZh)}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Seven steps */}
      <section className="section">
        <Container>
          <Reveal>
            <SectionHeading eyebrow={t('THE ORTHODOX SEVEN STEPS · 七步正法', 'THE ORTHODOX SEVEN STEPS · 七步正法')}
              title={t('From the Way, back to the Way', '由道而始，归道而终')}
              lede={t('How a name is actually made — seven steps that open with direction and close with verification.', '一个名字究竟如何成就——七步之法，始于立向，终于勘验。')} />
          </Reveal>
          <div className="mt-2xl max-w-reading mx-auto">
            {SEVEN_STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 50}>
                <div className="flex gap-xl py-lg" style={{ borderBottom: i < 6 ? '1px solid var(--line-soft)' : 'none' }}>
                  <span className="font-display text-4xl text-gold-500 shrink-0 w-12">{s.num}</span>
                  <div>
                    <h4 className="text-heading-3">{t(s.titleEn, s.titleZh)} <span className="han text-ink-300 text-lg">· {s.titleZh}</span></h4>
                    <p className="text-ink-500 mt-1">{t(s.bodyEn, s.bodyZh)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* What it is not */}
      <section className="section" style={{ background: 'var(--ink-900)' }}>
        <Container reading className="text-center">
          <Reveal>
            <Eyebrow className="mb-lg" >{t('A CLARIFICATION · 辨', 'A CLARIFICATION · 辨')}</Eyebrow>
            <h2 className="text-display-2" style={{ color: 'var(--paper-100)' }}>{t('Not fortune-telling. Not a transliteration app.', '非算命，亦非音译软件。')}</h2>
            <p className="mt-lg text-[1.05rem]" style={{ color: 'var(--paper-400)' }}>
              {t(
                'We do not read birthdays, count strokes for luck, or convert your name syllable by syllable. We work with sound, form, meaning, and roots — the same craft a Chinese scholar would bring to naming a child. The result is a real Chinese name, not a record of a foreign one.',
                '我们不看生辰，不以笔画论吉凶，也不将你的名字逐音转写。我们着力于声、形、义、脉——一如中国文人为子女取名之功。所得是一个真正的中文名字，而非一个外国名字的记音。',
              )}
            </p>
            <Link to="/finder" className="btn-seal mt-2xl">{t('Find your name', '寻得你的名字')} <ArrowRight size={16} /></Link>
            <Hairline className="mt-3xl opacity-30" />
          </Reveal>
        </Container>
      </section>
      <span className={cn('hidden')} />
    </>
  )
}
