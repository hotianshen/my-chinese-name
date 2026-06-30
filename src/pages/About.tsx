import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container, Eyebrow, Hairline, Reveal, SectionHeading } from '../components/ui'
import { Seal } from '../components/Seal'
import { useT } from '../i18n'

export function About() {
  const t = useT()
  return (
    <>
      <section className="section pb-xl">
        <Container reading className="text-center">
          <Reveal>
            <div className="flex justify-center mb-xl animate-breathe"><Seal size={88} /></div>
            <Eyebrow className="mb-lg">承天 · CHENGTIAN</Eyebrow>
            <h1 className="text-display-1 text-balance">{t('A family’s art of names', '一族取名之艺')}</h1>
            <p className="text-lede text-ink-500 mt-xl text-pretty">
              {t(
                'For more than 1,600 years and fifty-four generations, the Ho family has kept an art: the making of names. What was once a family’s quiet inheritance is now offered to anyone drawing near the Chinese script.',
                '一千六百余年，五十四代，何氏守一艺：取名。昔为一族静默之传承，今则献予每一位走近汉字之人。',
              )}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <div className="max-w-reading mx-auto space-y-2xl">
            <Reveal>
              <Block
                eyebrow={t('THE NAME · 承天', 'THE NAME · 承天')}
                title={t('Chengtian — “carrying Heaven”', '承天——承接天道')}
                body={t(
                  'The Ho tradition takes its name from chengtian: to carry, to receive, to be faithful to the Way of Heaven. A name is not invented from nothing; it is received — drawn down from what is true and good, and fitted to one particular life. The Way is the essence; the individual life is its expression. A good name holds both at once.',
                  '何氏之传，名曰「承天」：承接、领受、忠于天道。名非凭空所造，而是承接而来——自至真至善处引下，合于此一独特之生命。道为体，individual之生命为用。佳名者，体用兼摄。',
                )}
              />
            </Reveal>
            <Hairline />
            <Reveal>
              <Block
                eyebrow={t('THE PHILOSOPHY · 名以载道', 'THE PHILOSOPHY · 名以载道')}
                title={t('A name carries the Way', '名以载道')}
                body={t(
                  'Confucius taught that all order begins with the rectification of names: when a name is straight, speech accords; when speech accords, things come to completion. A name is the first word said about a person, and the last that endures. To name well is to set a life in accord with what it reaches for — a small act, and a serious one.',
                  '孔子有言，万事始于正名：名正则言顺，言顺则事成。名，是关于一个人最先说出的话，也是最后留存的话。善取名者，使一生与其所求相契——事小，而其义重。',
                )}
              />
            </Reveal>
            <Hairline />
            <Reveal>
              <Block
                eyebrow={t('FOR THE READER WHO’S UNSURE · 答疑', 'FOR THE READER WHO’S UNSURE · 答疑')}
                title={t('Is a Chinese name really for me?', '中文名字，真的适合我吗？')}
                body={t(
                  'Taking a Chinese name is not appropriation — it is participation. When you carry a name made with care, you do not take something away; you add to the long, living conversation of Chinese culture, and you give your Chinese friends a name they can say with warmth. A good name is a bridge built from both sides. You are welcome on it.',
                  '取一个中文名字，不是僭取，而是参与。当你承用一个用心的名字，你并未取走什么；你为中华文化绵长鲜活的对话添了一笔，也予你的中国朋友一个可以温暖地称呼你的名字。佳名是一座两端共筑之桥。桥上，欢迎你。',
                )}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper-300)' }}>
        <Container>
          <Reveal>
            <SectionHeading center
              eyebrow={t('THE AUTHOR · 何天申', 'THE AUTHOR · 何天申')}
              title={t('Ho Tianshen', '何天申')}
              lede={t(
                'Fifty-fourth-generation heir to the Ho naming tradition, and author of My Chinese Name. Over a decade, he has given names to hundreds of international friends — and distilled the family craft into a method anyone can follow.',
                '何氏取名之法第五十四代传人，《我有嘉名》一书作者。十余年间，他为数百位国际友人取名——并将这门家族之艺，凝练为人人可循之法。',
              )}
              className="mx-auto" />
          </Reveal>
          <Reveal>
            <div className="text-center mt-2xl">
              <a href="https://www.amazon.com/My-Chinese-Name-Choosing-Truly-ebook/dp/B0H6WDSNF7" target="_blank" rel="noreferrer" className="btn-ghost">
                {t('Read the book on Amazon', '于亚马逊阅读此书')} <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section">
        <Container reading className="text-center">
          <h2 className="text-display-2 text-balance">{t('May you, too, have a fine name.', '愿你，也有一个嘉名。')}</h2>
          <Link to="/finder" className="btn-seal mt-xl">{t('Find your name', '寻得你的名字')} <ArrowRight size={16} /></Link>
        </Container>
      </section>
    </>
  )
}

function Block({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div>
      <Eyebrow className="mb-md">{eyebrow}</Eyebrow>
      <h2 className="text-display-2 mb-lg text-balance">{title}</h2>
      <p className="text-body-serif text-ink-700 leading-relaxed" style={{ fontFamily: 'Fraunces, serif', fontSize: '1.19rem', lineHeight: 1.75 }}>{body}</p>
    </div>
  )
}
