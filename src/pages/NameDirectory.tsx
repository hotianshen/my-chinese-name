import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container, Eyebrow, Reveal } from '../components/ui'
import { useT } from '../i18n'

// The internal-linking hub for the programmatic-SEO name pages.
const NAMES = [
  'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
  'Grace', 'Chloe', 'Zoe', 'Lily', 'Nora', 'Hazel', 'Aria', 'Ella', 'Aurora', 'Ruby',
  'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
  'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Sebastian', 'Jack', 'Owen',
  'David', 'Joseph', 'Samuel', 'Matthew', 'Leo', 'Julian', 'Isaac', 'Thomas', 'Aiden', 'Nathan',
  'Sarah', 'Emily', 'Anna', 'Laura', 'Julia', 'Sophie', 'Hannah', 'Alice', 'Clara', 'Rose',
  'Maria', 'Elena', 'Aisha', 'Fatima', 'Yuki', 'Mei', 'Ana', 'Ingrid', 'Sofia', 'Nina',
  'Ryan', 'Kevin', 'Peter', 'John', 'George', 'Adam', 'Eric', 'Simon', 'Victor', 'Max',
]

export function NameDirectory() {
  const t = useT()
  useEffect(() => {
    document.title = 'Chinese Names for English Names — Directory | My Chinese Name'
  }, [])
  return (
    <>
      <section className="section pb-xl text-center">
        <Container reading>
          <Reveal>
            <Eyebrow className="mb-lg">NAME DIRECTORY · 名字目录</Eyebrow>
            <h1 className="text-display-1 text-balance">{t('A Chinese name for every name', '为每一个名字，寻一个中文名')}</h1>
            <p className="text-lede text-ink-500 mt-lg text-pretty">
              {t('Start from your English name, then let the Ho Method build a real Chinese one — sound, meaning, form, and roots.', '自你的英文名起，让何氏之法为你织就一个真正的中文名——声、义、形、脉。')}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <Reveal>
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
              {NAMES.map((n) => (
                <Link key={n} to={`/chinese-name-for/${n.toLowerCase()}`}
                  className="px-3.5 py-1.5 rounded-chip text-[0.95rem] text-ink-700 transition-colors hover:border-seal-500 hover:text-seal-600"
                  style={{ border: '1px solid var(--line-mid)' }}>
                  {n}
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="text-center mt-3xl">
              <p className="text-ink-500 mb-md">{t('Don’t see yours? Every name has one.', '没找到你的？每个名字都有其名。')}</p>
              <Link to="/finder" className="btn-seal">{t('Find your name', '寻得你的名字')} <ArrowRight size={16} /></Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
