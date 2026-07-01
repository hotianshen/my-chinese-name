import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Plus } from 'lucide-react'
import { Container, Eyebrow, Reveal } from '../components/ui'
import { useT } from '../i18n'
import { cn } from '../lib/cn'

export function FAQ() {
  const t = useT()
  const faqs: { q: [string, string]; a: [string, string] }[] = [
    {
      q: ['Is this just a transliteration of my name?', '这只是把我的名字音译吗？'],
      a: ['No. A transliteration spells your name out syllable by syllable and stops there. We take one resonant sound from your name as a thread, then build a real Chinese name around meaning, form, and roots — a name, not a record of a name.',
        '不是。音译只是把你的名字逐音拼出便止步于此。我们取你名字中一个有共鸣的音为线，再围绕意、形、脉，织就一个真正的中文名字——是一个名字，而非一个名字的记音。'],
    },
    {
      q: ['Is this fortune-telling, BaZi, or numerology?', '这是算命、八字或数理吗？'],
      a: ['No. We do not read birthdays, count strokes for luck, or consult the zodiac. The Ho Method works with sound, meaning, form, and roots — the same craft a Chinese scholar brings to naming a child.',
        '不是。我们不看生辰，不以笔画论吉凶，也不查生肖。何氏之法着力于声、义、形、脉——一如中国文人为子女取名之功。'],
    },
    {
      q: ['Will Chinese people take a name like this seriously?', '中国人会认真对待这样一个名字吗？'],
      a: ['Yes — that is the whole point. The most celebrated foreign Chinese names of the past century (Fairbank, Hessler, Rudd) were made exactly this way. A name made with care reads as a real Chinese name, and is met as one.',
        '会——这正是关键所在。近世最负盛名的外国中文名（费正清、何伟、陆克文）皆以此法所成。用心的名字读来即是真正的中文名，也会被如此相待。'],
    },
    {
      q: ['Do I need to know Chinese?', '我需要懂中文吗？'],
      a: ['Not at all. Everything is explained in English (and 中文). Your name comes with pinyin, a pronunciation and tone guide, and audio, so you can introduce yourself with confidence from day one.',
        '完全不需要。一切皆以英文（及中文）讲解。你的名字附有拼音、发音与声调指南及音频，使你从第一天起便能自信地自我介绍。'],
    },
    {
      q: ['What do the tiers unlock?', '各级套餐解锁什么？'],
      a: ['The free Seeker tier gives you one real name on screen. Unlock all three names, audio, intro scripts and the radar with Listener ($19) — or free, by sharing your name card with three friends. Insighter ($49) adds the full Name Dossier: etymology, classical sources, the complete twelve-palace reading, and a printable PDF. Master ($149) is a name hand-crafted by a name-master.',
        '免费的「寻名者」当即给你一个真名。以「闻音者」（$19）解锁全部三名、音频、介绍脚本与命盘——或免费：将你的名片分享给三位朋友。「明义者」（$49）再加完整《名册》：字源、典籍出处、十二宫全读，及可打印 PDF。「大师甄选」（$149）则由取名师亲手雕琢。'],
    },
    {
      q: ['What is the Master’s Name?', '何为《大师之名》？'],
      a: ['For $149, a name-master reviews your intake and crafts the name personally — with a written note in their hand, two rounds of revision, hi-res calligraphy, and a signed certificate. It is the closest thing to having a name made for you the old way.',
        '一百四十九美元，由取名师亲阅你的资料并亲手雕琢——附亲笔题记、两轮修订、高清书法及署名证书。这最近于以古法为你亲制一名。'],
    },
    {
      q: ['Can I use my name on a business card, WeChat, or documents?', '我能将此名用于名片、微信或证件吗？'],
      a: ['Absolutely — that is what it is for. Your Dossier includes usage notes for cards, WeChat, and introductions. (For official identity documents, follow your local authority’s transliteration rules; your crafted name is your everyday and professional name.)',
        '当然——它正为此而生。《名册》含名片、微信与介绍之用法。（至于官方身份证件，请遵循当地的音译规定；你所取之名，是你的日常与职业用名。）'],
    },
    {
      q: ['What if I don’t love my name?', '若我不喜欢我的名字怎么办？'],
      a: ['Love your name or your money back, within 14 days. For crafted tiers, we would rather revise it until it is right.',
        '心悦此名，否则十四日内全额退款。至于亲制各档，我们更愿为你修订至满意为止。'],
    },
  ]

  return (
    <>
      <section className="section pb-xl text-center">
        <Container reading>
          <Reveal>
            <Eyebrow className="mb-lg">FAQ · 常见问题</Eyebrow>
            <h1 className="text-display-1 text-balance">{t('Questions, answered', '答你所问')}</h1>
          </Reveal>
        </Container>
      </section>

      <section className="pb-section">
        <Container reading>
          <div className="space-y-px">
            {faqs.map((f, i) => <Item key={i} q={t(f.q[0], f.q[1])} a={t(f.a[0], f.a[1])} />)}
          </div>
        </Container>
      </section>

      <section className="pb-section">
        <Container reading className="text-center">
          <p className="text-lede text-ink-700">{t('Still wondering?', '仍有疑问？')}</p>
          <p className="text-ink-500 mt-sm">{t('The best answer is to try it.', '最好的答案，是亲自一试。')}</p>
          <Link to="/finder" className="btn-seal mt-xl">{t('Find your name', '寻得你的名字')} <ArrowRight size={16} /></Link>
        </Container>
      </section>
    </>
  )
}

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b" style={{ borderColor: 'var(--line-soft)' }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-lg py-lg text-left">
        <span className="font-display text-xl text-ink-900">{q}</span>
        <Plus size={20} className={cn('shrink-0 transition-transform duration-300', open && 'rotate-45')} style={{ color: 'var(--seal-500)' }} />
      </button>
      <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <p className="text-ink-500 pb-lg pr-2xl leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  )
}
