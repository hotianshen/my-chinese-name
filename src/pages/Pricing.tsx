import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Container, Eyebrow, Reveal, SectionHeading } from '../components/ui'
import { Seal } from '../components/Seal'
import { startCheckout } from '../lib/checkout'
import { useT } from '../i18n'
import { cn } from '../lib/cn'

export function Pricing() {
  const t = useT()
  const [toast, setToast] = useState('')

  const buy = (tier: 'Dossier' | "Master's Name", amount: number) => {
    const mode = startCheckout(tier, amount)
    if (mode === 'demo') {
      setToast(t('Demo checkout recorded — see the Admin board. Add your Lemon Squeezy link to go live.', '已记录演示订单——见后台。接入 Lemon Squeezy 链接即可上线。'))
      setTimeout(() => setToast(''), 5200)
    }
  }

  const tiers = [
    {
      name: t('The Name Finder', '寻名'), zh: '寻', price: '$0',
      tagline: t('Begin here', '由此开始'),
      features: [t('One authentic name, on screen', '即得一个真名'), t('Its sound anchor & meaning', '其声锚与意'), t('A first reading of the palaces', '十二宫之初读')],
      cta: t('Find your name', '寻得你的名字'), to: '/finder', highlight: false,
    },
    {
      name: t('The Name Dossier', '名册'), zh: '册', price: '$39',
      tagline: t('Most chosen', '众所择'),
      features: [
        t('All three names, fully explained', '三名俱全，逐一详解'),
        t('The complete twelve-palace reckoning', '十二宫完整品鉴'),
        t('Etymology, sources & pronunciation', '字源、出处与发音'),
        t('Audio + printable card & certificate', '音频，附名片与证书'),
        t('Delivered instantly', '即时交付'),
      ],
      cta: t('Get the Dossier', '获取名册'), action: () => buy('Dossier', 39), highlight: true,
    },
    {
      name: t('The Master’s Name', '大师之名'), zh: '匠', price: '$149',
      tagline: t('Hand-crafted', '亲手雕琢'),
      features: [
        t('A name-master crafts it personally', '由取名师亲自雕琢'),
        t('A written note, in their hand', '附亲笔题记'),
        t('Two rounds of revision', '两轮修订'),
        t('Hi-res calligraphy + signed certificate', '高清书法，附署名证书'),
        t('Delivered in 3–5 days', '三至五日交付'),
      ],
      cta: t('Commission a name', '委以取名'), action: () => buy("Master's Name", 149), highlight: false,
    },
  ]

  const addons = [
    { en: 'Pronunciation audio', zh: '发音音频', p: '+$9' },
    { en: 'Premium certificate', zh: '精制证书', p: '+$12' },
    { en: 'Calligraphy wall-art (file)', zh: '书法挂画（电子）', p: '+$15' },
    { en: 'Framed canvas print', zh: '装裱画布', p: '$49–89' },
    { en: 'Carved name seal / chop', zh: '篆刻名章', p: '$49–59' },
    { en: 'Name my family / team (up to 5)', zh: '为全家／团队取名（至五人）', p: '+$79' },
  ]

  return (
    <>
      <section className="section pb-xl text-center">
        <Container>
          <Reveal>
            <Eyebrow className="mb-lg">PRICING · 价格</Eyebrow>
            <h1 className="text-display-1 text-balance">{t('Choose how far to go', '任你择取深浅')}</h1>
            <p className="text-lede text-ink-500 mt-lg max-w-xl mx-auto">
              {t('Begin free. Go deeper when you’re ready. Every tier is built on the same 1,600-year method.', '免费起步，待你愿时再深入。每一档皆本于同一千六百年之法。')}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <div className="grid lg:grid-cols-3 gap-lg items-start">
            {tiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 100}>
                <div className={cn('card-paper p-xl h-full flex flex-col relative', tier.highlight && 'lg:-mt-4 lg:mb-4')}
                  style={tier.highlight ? { borderColor: 'var(--seal-500)', boxShadow: '0 2px 4px rgba(28,27,24,.06), 0 18px 48px rgba(200,52,31,.12)' } : {}}>
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-md py-1 rounded-full text-xs font-body text-paper-100" style={{ background: 'var(--seal-500)' }}>
                      {t('Most popular', '最受青睐')}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="grid place-items-center w-11 h-11 rounded-full han text-xl" style={{ border: '1px solid var(--gold-300)', color: 'var(--gold-600)' }}>{tier.zh}</span>
                    <Eyebrow>{tier.tagline}</Eyebrow>
                  </div>
                  <h3 className="text-heading-3 mt-lg">{tier.name}</h3>
                  <p className="font-display text-5xl text-ink-900 mt-sm">{tier.price}</p>
                  <ul className="mt-xl space-y-3 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[0.95rem] text-ink-700">
                        <Check size={16} className="mt-1 shrink-0" style={{ color: 'var(--seal-500)' }} /> {f}
                      </li>
                    ))}
                  </ul>
                  {tier.to ? (
                    <Link to={tier.to} className={cn('mt-xl justify-center', tier.highlight ? 'btn-seal' : 'btn-ghost')}>{tier.cta} <ArrowRight size={16} /></Link>
                  ) : (
                    <button onClick={tier.action} className={cn('mt-xl justify-center', tier.highlight ? 'btn-seal' : 'btn-ghost')}>{tier.cta} <ArrowRight size={16} /></button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Add-ons */}
      <section className="section" style={{ background: 'var(--paper-300)' }}>
        <Container>
          <Reveal>
            <SectionHeading center eyebrow={t('GIFTS & KEEPSAKES · 附赠', 'GIFTS & KEEPSAKES · 附赠')}
              title={t('Make it something you can hold', '使其成为可执于手之物')}
              lede={t('Optional add-ons, fulfilled automatically — from audio to carved seals and framed calligraphy.', '可选附加，皆自动交付——自音频，至篆刻名章与装裱书法。')}
              className="mx-auto" />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md mt-2xl max-w-4xl mx-auto">
            {addons.map((a) => (
              <div key={a.en} className="flex items-center justify-between card-paper px-lg py-md">
                <span className="text-ink-700">{t(a.en, a.zh)}</span>
                <span className="font-display text-lg text-seal-600">{a.p}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Brand tier */}
      <section className="section">
        <Container>
          <Reveal>
            <div className="card-paper p-xl md:p-2xl grid md:grid-cols-[1fr_auto] gap-xl items-center" style={{ borderTop: '3px solid var(--info)' }}>
              <div>
                <Eyebrow className="mb-sm">{t('BRAND & BEARER · 商名', 'BRAND & BEARER · 商名')}</Eyebrow>
                <h3 className="text-display-2">{t('Names for companies, teams & families', '为企业、团队与家庭取名')}</h3>
                <p className="text-ink-500 mt-md max-w-xl">
                  {t('Entering China, relocating a team, or naming a brand? A semi-bespoke package with trademark-sense checks, simplified + traditional forms, and logo-ready calligraphy.', '将入中国、迁移团队，或为品牌命名？半定制方案，含商标语感核查、简繁二体，及可制标识之书法。')}
                </p>
              </div>
              <div className="text-center shrink-0">
                <p className="font-display text-5xl text-ink-900">{t('from $499', '￥起 $499')}</p>
                <a href="mailto:hello@mychinese.name?subject=Brand%20%26%20Bearer%20enquiry" className="btn-ghost mt-lg">{t('Enquire', '咨询')} <ArrowRight size={16} /></a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* guarantee */}
      <section className="pb-section">
        <Container reading className="text-center">
          <Seal size={56} className="mx-auto mb-lg" />
          <p className="text-lede text-ink-700">{t('Love your name, or your money back — 14 days.', '心悦此名，否则十四日内全额退款。')}</p>
          <p className="text-caption text-ink-300 mt-sm">{t('Prices in USD. Tax handled at checkout.', '价格以美元计，税费于结账时处理。')}</p>
        </Container>
      </section>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 card-paper px-lg py-md flex items-center gap-3 max-w-md" style={{ borderColor: 'var(--gold-300)' }}>
          <Sparkles size={18} style={{ color: 'var(--gold-500)' }} />
          <span className="text-[0.9rem] text-ink-700">{toast}</span>
        </div>
      )}
    </>
  )
}
