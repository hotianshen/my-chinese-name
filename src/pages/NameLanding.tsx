import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seal } from '../components/Seal'
import { PalaceRadar } from '../components/PalaceRadar'
import { Container, Eyebrow, Hairline, Reveal } from '../components/ui'
import { generateNames } from '../engine/generate'
import { saveResult, track } from '../lib/store'
import { useT } from '../i18n'

// Programmatic SEO — one landing page per English name (/chinese-name-for/emma).
// A real sample name is generated on the fly, then the visitor is invited to
// craft their own. Thousands of low-competition, high-intent pages.
export function NameLanding() {
  const t = useT()
  const nav = useNavigate()
  const { name = '' } = useParams()
  const display = name.replace(/[^a-zA-Z]/g, '').replace(/^./, (c) => c.toUpperCase()) || 'You'

  const result = useMemo(
    () => generateNames({
      givenName: display, surname: display, gender: 'neutral',
      themes: ['Character & Virtue', 'Wisdom & Learning'], takeSurname: true,
      surnameStrategy: 'sound', nativeLanguage: 'English', nameLength: 'auto',
    }),
    [display],
  )
  const sample = result.candidates[0]

  useEffect(() => {
    document.title = `Chinese Name for ${display} — Meaning, Pinyin & How to Choose | My Chinese Name`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', `What is a good Chinese name for ${display}? See an authentic example (${sample.fullHanzi} ${sample.fullPinyin}), its meaning, and craft your own by the 1,600-year Ho Method.`)
    track('name_landing_view', { name: display })
  }, [display, sample.fullHanzi, sample.fullPinyin])

  const craft = () => { saveResult(result); track('name_landing_cta', { name: display }); nav('/result') }

  return (
    <>
      <section className="section pb-xl">
        <Container reading className="text-center">
          <Reveal>
            <Eyebrow className="mb-lg">A CHINESE NAME FOR · 为你而取</Eyebrow>
            <h1 className="text-display-1 text-balance">{t(`Chinese name for ${display}`, `${display} 的中文名`)}</h1>
            <p className="text-lede text-ink-500 mt-lg text-pretty">
              {t(
                `Not a transliteration of “${display}”, but a real Chinese name — woven from its sound, then led by meaning, form, and roots.`,
                `不是把「${display}」音译过来，而是一个真正的中文名——先取其声，再以义、形、脉领之。`,
              )}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <div className="grid lg:grid-cols-[1fr_0.85fr] gap-2xl items-center max-w-band mx-auto">
            <Reveal>
              <div>
                <Eyebrow className="mb-md">{t('ONE EXAMPLE · 一例', 'ONE EXAMPLE · 一例')}</Eyebrow>
                <div className="flex items-start gap-lg">
                  <div>
                    <p className="han text-ink-900 leading-none" style={{ fontSize: 'clamp(3.5rem,11vw,6rem)' }}>{sample.fullHanzi}</p>
                    <p className="font-display text-2xl text-ink-700 mt-md">{sample.fullPinyin}</p>
                  </div>
                  <Seal size={56} />
                </div>
                <Hairline className="my-lg" />
                <p className="text-lede text-ink-900">{sample.meaningGloss}</p>
                <p className="text-ink-500 mt-md text-[1.02rem] leading-relaxed">{sample.rationale}</p>
                <p className="text-caption text-ink-300 mt-lg">
                  {t(`This is one of many names possible for ${display}. Yours should be built from your story.`, `这只是 ${display} 众多可能之一。你的名字，应由你的故事所成。`)}
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card-paper p-xl">
                <div className="max-w-[360px] mx-auto"><PalaceRadar scores={sample.scorecard} /></div>
                <button onClick={craft} className="btn-seal w-full justify-center mt-lg">{t(`Craft ${display}’s real name`, `为 ${display} 亲取真名`)} <ArrowRight size={16} /></button>
                <p className="text-caption text-ink-300 text-center mt-sm">{t('Free · two minutes', '免费 · 两分钟')}</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="section pt-0">
        <Container reading className="text-center">
          <Hairline className="mb-2xl" />
          <p className="text-ink-500">{t('Looking for another name?', '想找别的名字？')}</p>
          <Link to="/chinese-names" className="link-brush text-seal-600 font-medium">{t('Browse the name directory →', '浏览名字目录 →')}</Link>
        </Container>
      </section>
    </>
  )
}
