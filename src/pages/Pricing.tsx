import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Share2, Sparkles } from 'lucide-react'
import { Container, Eyebrow, Reveal, SectionHeading } from '../components/ui'
import { Seal } from '../components/Seal'
import { startCheckout } from '../lib/checkout'
import { loadResult } from '../lib/store'
import { TIERS, SHARE_UNLOCK_THRESHOLD, type Tier } from '../lib/tiers'
import { useT } from '../i18n'
import { cn } from '../lib/cn'

export function Pricing() {
  const t = useT()
  const nav = useNavigate()
  const [toast, setToast] = useState('')

  const act = (tier: Tier) => {
    if (tier.level === 0) { nav('/finder'); return }
    if (tier.level === 4) { window.location.href = 'mailto:hello@mychinese.name?subject=Legacy%20%2F%20Brand%20naming'; return }
    const checkoutTier = tier.level === 1 ? 'Listener' : tier.level === 2 ? 'Insighter' : "Master's Name"
    if (startCheckout(checkoutTier, tier.priceNum) !== 'demo') return
    // demo: entitlement granted — take them to the result/dossier if a name exists
    if (tier.level <= 1) nav(loadResult() ? '/result' : '/finder')
    else nav(loadResult() ? '/dossier' : '/finder')
    setToast(t(`Demo: ${tier.name} unlocked. Add your Lemon Squeezy link to go live.`, `演示：已解锁${tier.zh}。接入 Lemon Squeezy 链接即可上线。`))
    setTimeout(() => setToast(''), 5200)
  }

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
            <Eyebrow className="mb-lg">PRICING · 五级套餐</Eyebrow>
            <h1 className="text-display-1 text-balance">{t('Choose how far to go', '任你择取深浅')}</h1>
            <p className="text-lede text-ink-500 mt-lg max-w-xl mx-auto">
              {t('Begin free. Go deeper when you’re ready — or unlock your three names free by sharing with three friends.', '免费起步，待你愿时再深入——或分享予三位朋友，免费解锁你的三个名字。')}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <div className="grid gap-lg md:grid-cols-2 xl:grid-cols-5 items-start">
            {TIERS.map((tier, i) => {
              const hero = tier.level === 2
              return (
                <Reveal key={tier.id} delay={i * 60}>
                  <div className={cn('card-paper p-lg h-full flex flex-col relative')}
                    style={hero ? { borderColor: 'var(--seal-500)', boxShadow: '0 2px 4px rgba(28,27,24,.06), 0 18px 48px rgba(200,52,31,.12)' } : {}}>
                    {hero && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-md py-1 rounded-full text-xs font-body text-paper-100 whitespace-nowrap" style={{ background: 'var(--seal-500)' }}>
                        {t('Most chosen', '最受青睐')}
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs" style={{ color: 'var(--gold-600)' }}>{tier.id}</span>
                      <Eyebrow>{t(tier.taglineEn, tier.taglineZh)}</Eyebrow>
                    </div>
                    <h3 className="text-heading-3 mt-sm">{t(tier.name, tier.zh)}</h3>
                    <p className="font-display text-4xl text-ink-900 mt-1">{tier.price === 'Free' ? t('Free', '免费') : tier.price === 'from $9,999' ? t('from $9,999', '$9,999 起') : tier.price}</p>
                    <ul className="mt-lg space-y-2 flex-1">
                      {(t('en', 'zh') === 'zh' ? tier.featuresZh : tier.featuresEn).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[0.9rem] text-ink-700">
                          <Check size={14} className="mt-1 shrink-0" style={{ color: 'var(--seal-500)' }} /> {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => act(tier)} className={cn('mt-lg justify-center', hero ? 'btn-seal' : 'btn-ghost')}>
                      {tier.level === 0 ? t('Start free', '免费开始') : tier.level === 4 ? t('Enquire', '咨询') : t('Choose', '选择')} <ArrowRight size={15} />
                    </button>
                  </div>
                </Reveal>
              )
            })}
          </div>
          <Reveal>
            <div className="mt-2xl text-center flex items-center justify-center gap-2 text-ink-500">
              <Share2 size={16} style={{ color: 'var(--seal-500)' }} />
              <span>{t(`Or unlock Listener free — share your name card with ${SHARE_UNLOCK_THRESHOLD} friends.`, `或免费解锁「闻音者」——将你的名片分享给 ${SHARE_UNLOCK_THRESHOLD} 位朋友即可。`)}</span>
            </div>
          </Reveal>
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

      {/* guarantee */}
      <section className="section">
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
