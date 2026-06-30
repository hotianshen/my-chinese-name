import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container, Eyebrow, Hairline, Reveal } from '../components/ui'
import { GALLERY } from '../content/gallery'
import { useT } from '../i18n'

export function Gallery() {
  const t = useT()
  return (
    <>
      <section className="section pb-xl text-center">
        <Container reading>
          <Reveal>
            <Eyebrow className="mb-lg">A GALLERY OF FINE NAMES · 佳名集</Eyebrow>
            <h1 className="text-display-1 text-balance">{t('A good name is a miniature biography', '佳名，乃一篇微缩的传记')}</h1>
            <p className="text-lede text-ink-500 mt-xl text-pretty">
              {t(
                'Over four centuries, people from beyond China came to the characters and found a name. The finest have outlasted their bearers. Read a name, and you read a person.',
                '四百年间，来自中国之外的人们走近汉字，寻得一名。其中至美者，已长过其人。读一个名字，便是读一个人。',
              )}
            </p>
          </Reveal>
        </Container>
      </section>

      {GALLERY.map((group, gi) => (
        <section key={group.key} className="section pt-0" style={gi % 2 === 1 ? { background: 'var(--paper-300)', paddingTop: 'clamp(96px,14vh,192px)' } : {}}>
          <Container>
            <Reveal>
              <div className="flex items-center gap-lg mb-2xl">
                <span className="font-display text-5xl text-gold-500">{String(gi + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="text-display-2">{t(group.titleEn, group.titleZh)}</h2>
                  <p className="eyebrow mt-1">{group.titleZh}</p>
                </div>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-x-2xl gap-y-xl">
              {group.names.map((nm, i) => (
                <Reveal key={nm.hanzi} delay={(i % 2) * 80}>
                  <div className="flex gap-xl py-lg h-full">
                    <div className="shrink-0 text-center w-24">
                      <p className="han text-4xl text-ink-900 leading-tight">{nm.hanzi}</p>
                      <p className="font-display text-sm text-ink-500 mt-2">{nm.pinyin}</p>
                    </div>
                    <div className="flex-1">
                      <p className="eyebrow">{nm.person}</p>
                      <p className="text-ink-700 text-[0.97rem] mt-sm leading-relaxed">{t(nm.noteEn, nm.noteZh)}</p>
                      <p className="han text-sm text-gold-600 mt-md">{nm.palaces}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ))}

      <section className="section">
        <Container reading className="text-center">
          <Hairline className="mb-2xl" />
          <h2 className="text-display-2 text-balance">{t('The next fine name could be yours.', '下一个佳名，或许就是你的。')}</h2>
          <Link to="/finder" className="btn-seal mt-xl">{t('Find your name', '寻得你的名字')} <ArrowRight size={16} /></Link>
        </Container>
      </section>
    </>
  )
}
