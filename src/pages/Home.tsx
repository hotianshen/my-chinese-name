import { Link } from 'react-router-dom'
import { ArrowRight, Check, X } from 'lucide-react'
import { Seal } from '../components/Seal'
import { Container, Eyebrow, Hairline, Reveal, SectionHeading } from '../components/ui'
import { TIERS } from '../content/method'
import { useT } from '../i18n'

export function Home() {
  const t = useT()
  return (
    <>
      <Hero />
      <Contrast />
      <ThreePowersPreview />
      <ThreeNames />
      <SampleNames />
      <Authority />
      <FinalCta />
      {/* hide-unused */}
      <span hidden>{t('', '')}</span>
      <span hidden>{TIERS.heaven.en}</span>
    </>
  )
}

function Hero() {
  const t = useT()
  return (
    <section className="relative overflow-hidden" style={{ minHeight: 'min(92vh, 880px)' }}>
      {/* vertical gutter line — 名以载道 */}
      <div className="hidden xl:block absolute left-[max(24px,4vw)] top-1/2 -translate-y-1/2 z-10">
        <p className="writing-vertical han text-ink-300 text-2xl tracking-[0.3em]" style={{ letterSpacing: '0.35em' }}>名以载道</p>
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center" >
        <div className="pt-3xl pb-2xl flex flex-col items-center" style={{ paddingTop: 'clamp(64px,10vh,140px)' }}>
          <Reveal>
            <Eyebrow className="mb-xl">THE HO METHOD · 承天 · THREE POWERS & TWELVE PALACES</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-display-1 md:text-display-hero leading-[1.04] text-balance max-w-4xl">
              {t('A Chinese name', '一个中文名字')}<br />
              {t('that is truly ', '一个真正属于')}
              <em className="italic" style={{ fontVariationSettings: '"opsz" 100' }}>{t('yours', '你的名字')}</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-lede text-ink-500 mt-xl max-w-xl mx-auto text-pretty">
              {t(
                'Not a transliteration. Not fortune-telling. A name woven from sound, meaning, form, and roots — by a method more than 1,600 years old.',
                '不是音译，不是算命。一个由声、义、形、脉织就的名字——传习一千六百余年之法。',
              )}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="my-2xl animate-breathe">
              <Seal size={108} />
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="flex flex-col sm:flex-row items-center gap-md">
              <Link to="/finder" className="btn-seal">
                {t('Find your name', '寻得你的名字')} <ArrowRight size={18} />
              </Link>
              <Link to="/method" className="btn-ghost">{t('Explore the method', '细察取名之道')}</Link>
            </div>
            <p className="text-caption text-ink-300 mt-lg">{t('Free to begin · no account needed', '免费开始 · 无需注册')}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function Contrast() {
  const t = useT()
  const rows = [
    { sound: 'Suo-fei-ya', crafted: '苏菲', orig: 'Sophia', note: t('Three borrowed syllables vs. a name with its own meaning', '三个借来的音节 · 一个自有其意的名字') },
    { sound: 'Ke-li-si-tuo-fu', crafted: '柯睿', orig: 'Christopher', note: t('A five-character phrase vs. a real two-beat name', '五字长串 · 一个真正的两字之名') },
  ]
  return (
    <section className="section" style={{ background: 'var(--paper-300)' }}>
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={t('THE DIFFERENCE · 分别', 'THE DIFFERENCE · 分别')}
            title={t('A sound-alike is not a name.', '音近，并非成名。')}
            lede={t(
              'A translation app stops at “a character that sounds similar.” A name made with care goes further — it carries meaning, beauty, and a thread back to who you are.',
              '翻译软件止步于「一个音近的字」。用心取的名字则更进一步——它承载意义、美感，以及一条通往你之所是的线索。',
            )}
          />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-lg mt-2xl">
          {rows.map((r, i) => (
            <Reveal key={r.orig} delay={i * 100}>
              <div className="card-paper p-xl h-full">
                <Eyebrow className="mb-lg">{r.orig}</Eyebrow>
                <div className="flex items-center gap-md mb-md text-ink-300">
                  <X size={18} className="shrink-0" style={{ color: 'var(--ink-300)' }} />
                  <span className="font-display text-xl line-through decoration-1">{r.sound}</span>
                  <span className="text-caption">{t('offhand sound-alike', '随手音译')}</span>
                </div>
                <div className="flex items-center gap-md">
                  <Check size={18} className="shrink-0" style={{ color: 'var(--seal-500)' }} />
                  <span className="han text-3xl text-ink-900">{r.crafted}</span>
                  <span className="text-caption text-seal-600">{t('a name made with care', '一个用心的名字')}</span>
                </div>
                <Hairline className="my-lg" />
                <p className="text-ink-500 text-[0.95rem]">{r.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

function ThreePowersPreview() {
  const t = useT()
  const tiers = [TIERS.heaven, TIERS.human, TIERS.earth]
  return (
    <section className="section">
      <Container>
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-2xl items-center">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow={t('THE COSMOLOGY · 三才', 'THE COSMOLOGY · 三才')}
                title={t('Heaven, Human, and Earth', '天、人、地')}
                lede={t(
                  'Every name lives in three registers at once. The Ho Method reads all three — and twelve dimensions within them — so nothing is left to chance.',
                  '每个名字同时活在三重境界。何氏之法三才并观，其中又分十二宫，使无一处听天由命。',
                )}
              />
              <Link to="/method" className="inline-flex items-center gap-2 mt-xl text-seal-600 font-medium link-brush">
                {t('See all twelve palaces', '遍览十二宫')} <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-px">
              {tiers.map((tier, i) => (
                <div key={tier.en} className="card-paper p-xl flex items-center gap-xl" style={{ borderLeft: `3px solid ${['var(--seal-500)', 'var(--gold-600)', 'var(--info)'][i]}` }}>
                  <span className="han text-5xl text-ink-900 shrink-0 w-16 text-center">{tier.glyph}</span>
                  <div>
                    <h3 className="text-heading-3">{t(tier.en, tier.zh)} <span className="text-ink-300 text-base">· {tier.zh}</span></h3>
                    <p className="text-ink-500 text-[0.95rem] mt-1">{t(tier.blurbEn, tier.blurbZh)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function ThreeNames() {
  const t = useT()
  const types = [
    { type: t('Safe', '稳妥'), zh: '稳', desc: t('Easy, memorable, hard to get wrong — for daily life and business.', '易记、易称、难出错——宜于日常与商务。'), ex: '戴维' },
    { type: t('Cultural', '文蕴'), zh: '雅', desc: t('A touch more allusion and atmosphere — for those who tell their name’s story.', '多一分典故与气韵——宜于愿讲述名字之人。'), ex: '戴文' },
    { type: t('Distinctive', '卓然'), zh: '奇', desc: t('A stronger, more singular bearing — heard once, never forgotten.', '更具独特气度——一闻难忘。'), ex: '达川' },
  ]
  return (
    <section className="section" style={{ background: 'var(--paper-300)' }}>
      <Container>
        <Reveal>
          <SectionHeading center eyebrow={t('THREE CANDIDATES · 三式', 'THREE CANDIDATES · 三式')}
            title={t('You receive three kinds of name', '你将得到三种名字')}
            lede={t('One method, three temperaments — so you can choose the bearing that fits you.', '一法三式——任你择取最合心意的气度。')}
            className="mx-auto" />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-lg mt-2xl">
          {types.map((ty, i) => (
            <Reveal key={ty.type} delay={i * 100}>
              <div className="card-paper p-xl text-center h-full flex flex-col items-center">
                <div className="grid place-items-center w-14 h-14 rounded-full mb-lg" style={{ border: '1px solid var(--gold-300)' }}>
                  <span className="han text-2xl text-gold-600">{ty.zh}</span>
                </div>
                <h3 className="text-heading-3 mb-sm">{ty.type}</h3>
                <p className="text-ink-500 text-[0.95rem] flex-1">{ty.desc}</p>
                <p className="han text-3xl mt-lg text-ink-900">{ty.ex}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

function SampleNames() {
  const t = useT()
  const names = [
    { hz: '费正清', py: 'Fèi Zhèngqīng', en: 'John King Fairbank', note: t('The great sinologist — “upright and clear.”', '一代汉学宗师——「正而清」。') },
    { hz: '何伟', py: 'Hé Wěi', en: 'Peter Hessler', note: t('Writer — direct, strong, unmistakably his own.', '作家——直率、刚健，自成一格。') },
    { hz: '陆克文', py: 'Lù Kèwén', en: 'Kevin Rudd', note: t('Statesman — cultured, and easy on the ear.', '政治家——文雅而顺耳。') },
  ]
  return (
    <section className="section">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={t('A CENTURY OF FINE NAMES · 佳名', 'A CENTURY OF FINE NAMES · 佳名')}
            title={t('Names that opened doors', '名字，曾为他们开门')}
            lede={t('The most celebrated foreign Chinese names took one sound from the original — and let meaning take over. This is the method at work.', '近世最负盛名的外国中文名，皆只取本名一音——而后以义领之。此即此法之验。')} />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-lg mt-2xl">
          {names.map((nm, i) => (
            <Reveal key={nm.hz} delay={i * 80}>
              <div className="p-xl h-full flex flex-col" style={{ borderTop: '1px solid var(--gold-300)' }}>
                <p className="han text-5xl text-ink-900">{nm.hz}</p>
                <p className="font-display text-xl text-ink-700 mt-sm">{nm.py}</p>
                <p className="eyebrow mt-md">{nm.en}</p>
                <p className="text-ink-500 text-[0.95rem] mt-md">{nm.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="text-center mt-2xl">
            <Link to="/gallery" className="btn-ghost">{t('A gallery of fine names', '佳名集')} <ArrowRight size={16} /></Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

function Authority() {
  const t = useT()
  const stats = [
    { n: '1,600+', l: t('years of tradition', '年之传承') },
    { n: '54', l: t('generations of the Ho line', '代何氏相传') },
    { n: '12', l: t('palaces of appraisal', '宫之品鉴') },
    { n: '7', l: t('steps to a finished name', '步而成名') },
  ]
  return (
    <section className="section" style={{ background: 'var(--ink-900)' }}>
      <Container className="text-center">
        <Reveal>
          <p className="eyebrow mb-lg" style={{ color: 'var(--gold-500)' }}>承天 · CHENGTIAN</p>
          <h2 className="text-display-2 md:text-display-1 max-w-3xl mx-auto text-balance" style={{ color: 'var(--paper-100)' }}>
            {t('A family’s art of names, now a gift for the world.', '一族取名之艺，今为天下共享。')}
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-xl mt-3xl">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 80}>
              <div>
                <p className="font-display text-5xl md:text-6xl" style={{ color: 'var(--gold-500)' }}>{s.n}</p>
                <p className="text-caption mt-sm" style={{ color: 'var(--paper-400)' }}>{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

function FinalCta() {
  const t = useT()
  return (
    <section className="section">
      <Container reading className="text-center">
        <Reveal>
          <div className="flex justify-center mb-xl"><Seal size={64} /></div>
          <h2 className="text-display-2 text-balance">{t('Your name is waiting to be made.', '你的名字，正待成就。')}</h2>
          <p className="text-lede text-ink-500 mt-lg">{t('Begin in two minutes. See three names, and the reckoning behind each.', '两分钟即可开始。得见三名，与其背后之品鉴。')}</p>
          <Link to="/finder" className="btn-seal mt-2xl">{t('Find your name', '寻得你的名字')} <ArrowRight size={18} /></Link>
        </Reveal>
      </Container>
    </section>
  )
}
