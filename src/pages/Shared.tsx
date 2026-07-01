import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seal } from '../components/Seal'
import { Container, Eyebrow, Reveal } from '../components/ui'
import { track } from '../lib/store'
import { useT } from '../i18n'

// Where a shared card lands. Shows the friend's name, then converts the viewer
// into a new namer — closing the viral loop.
export function Shared() {
  const t = useT()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const hanzi = params.get('n') || ''
  const pinyin = params.get('p') || ''
  const meaning = params.get('m') || ''
  const from = params.get('from') || ''
  const ref = params.get('ref') || 'link'

  useEffect(() => {
    if (!hanzi) { nav('/'); return }
    track('share_landing_view', { ref, from })
  }, [hanzi, ref, from, nav])

  if (!hanzi) return null

  return (
    <section className="section">
      <Container reading className="text-center">
        <Reveal>
          <Eyebrow className="mb-lg">A FINE CHINESE NAME · 一个嘉名</Eyebrow>
          <p className="text-ink-500">{from ? t(`${from}’s Chinese name is`, `${from} 的中文名是`) : t('This name was made by the Ho Method', '此名由何氏之法所成')}</p>
          <div className="my-xl flex items-center justify-center gap-lg">
            <div>
              <p className="han text-ink-900 leading-none" style={{ fontSize: 'clamp(4rem,15vw,7rem)' }}>{hanzi}</p>
              {pinyin && <p className="font-display text-2xl text-ink-700 mt-md">{pinyin}</p>}
            </div>
            <div className="animate-breathe"><Seal size={72} /></div>
          </div>
          {meaning && <p className="text-lede text-ink-500 italic">{meaning}</p>}
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-3xl pt-2xl" style={{ borderTop: '1px solid var(--line-soft)' }}>
            <h1 className="text-display-2 text-balance">{t('Now find yours.', '现在，寻得你的。')}</h1>
            <p className="text-ink-500 mt-md max-w-lg mx-auto">
              {t('Not a transliteration — a real Chinese name woven from sound, meaning, form, and roots. Free to begin.', '不是音译——一个由声、义、形、脉织就的真正中文名字。免费开始。')}
            </p>
            <Link to="/finder" className="btn-seal mt-xl" onClick={() => track('share_landing_cta', { ref })}>
              {t('Find your Chinese name', '寻得你的中文名')} <ArrowRight size={18} />
            </Link>
            <div className="mt-lg">
              <Link to="/method" className="text-caption text-ink-500 link-brush">{t('or see how the method works →', '或看看此法如何运作 →')}</Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
