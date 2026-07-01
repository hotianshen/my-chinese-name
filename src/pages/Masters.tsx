import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seal } from '../components/Seal'
import { Container, Eyebrow, Hairline, Reveal } from '../components/ui'
import { useT } from '../i18n'

const MASTERS = [
  {
    initial: '何', nameEn: 'Ho Tianshen', nameZh: '何天申',
    roleEn: '54th-generation heir · Founder', roleZh: '第五十四代传人 · 创始',
    bioEn: 'Keeper of the Ho family naming tradition and author of My Chinese Name. Over a decade he has given names to hundreds of international friends, and distilled the family craft into a method anyone can follow.',
    bioZh: '何氏取名之法守成者，《我有嘉名》一书作者。十余年间为数百位国际友人取名，并将这门家族之艺凝练为人人可循之法。',
  },
  {
    initial: '陈', nameEn: 'Dr. Chen Mingyuan', nameZh: '陈明远 博士',
    roleEn: 'Classical philology · Sources', roleZh: '古典文献 · 典据',
    bioEn: 'A scholar of classical Chinese, he verifies each name’s literary sources — that an allusion is graceful and never obscure, and that every character stands on solid ground.',
    bioZh: '古典文献学者，为每一个名字勘验其典出——务使用典雅而不僻，字字有据。',
  },
  {
    initial: '李', nameEn: 'Master Li Wanqing', nameZh: '李婉清 女史',
    roleEn: 'Calligraphy & sound · Form', roleZh: '书法与音韵 · 形音',
    bioEn: 'A calligrapher and student of phonology, she attends to how a name looks on the page and sounds in the mouth — the brushstroke, the balance, the rise and fall of the tones.',
    bioZh: '书法家兼音韵之学者，专司名字于纸上之形、于口中之声——一笔一画、间架平衡、声调起落。',
  },
]

export function Masters() {
  const t = useT()
  return (
    <>
      <section className="section pb-xl text-center">
        <Container reading>
          <Reveal>
            <div className="flex justify-center mb-xl"><Seal size={72} /></div>
            <Eyebrow className="mb-lg">THE MASTERS · 取名师</Eyebrow>
            <h1 className="text-display-1 text-balance">{t('The hands behind the names', '名字背后的匠人')}</h1>
            <p className="text-lede text-ink-500 mt-lg text-pretty">
              {t('The free tool carries the method. For a name crafted by hand, three people bring a lifetime of study to yours.', '免费工具承载此法。若求亲手雕琢之名，三位匠人将毕生所学付于你的名字。')}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <div className="max-w-reading mx-auto space-y-2xl">
            {MASTERS.map((m, i) => (
              <Reveal key={m.nameEn} delay={i * 80}>
                <div className="flex gap-xl items-start">
                  <div className="shrink-0 grid place-items-center w-20 h-20 rounded-full han text-4xl text-seal-600" style={{ border: '1px solid var(--gold-300)', background: 'var(--paper-100)' }}>{m.initial}</div>
                  <div>
                    <h2 className="text-heading-3">{t(m.nameEn, m.nameZh)} <span className="text-ink-300 text-base han">· {m.nameZh}</span></h2>
                    <p className="eyebrow mt-1">{t(m.roleEn, m.roleZh)}</p>
                    <p className="text-ink-500 mt-md leading-relaxed">{t(m.bioEn, m.bioZh)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section pt-0">
        <Container reading className="text-center">
          <Hairline className="mb-2xl" />
          <h2 className="text-display-2 text-balance">{t('Let a master craft yours.', '请匠人为你亲取。')}</h2>
          <Link to="/pricing" className="btn-seal mt-xl">{t('The Master’s Name', '大师之名')} <ArrowRight size={16} /></Link>
        </Container>
      </section>
    </>
  )
}
