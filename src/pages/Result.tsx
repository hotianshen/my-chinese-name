import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Lock, Share2, Sparkles, Volume2 } from 'lucide-react'
import { Container, Eyebrow, Hairline, Reveal } from '../components/ui'
import { Seal } from '../components/Seal'
import { ShareCard } from '../components/ShareCard'
import { PalaceRadar } from '../components/PalaceRadar'
import type { GenerateResult, NameCandidate } from '../engine/types'
import { captureLead, loadResult, track } from '../lib/store'
import { startCheckout } from '../lib/checkout'
import { subscribe } from '../lib/email'
import { speakChinese } from '../lib/speak'
import { SHARE_UNLOCK_THRESHOLD, shareProgress, unlockedLevel } from '../lib/tiers'
import { useT } from '../i18n'
import { cn } from '../lib/cn'

export function Result() {
  const t = useT()
  const nav = useNavigate()
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [level, setLevel] = useState(0)
  const [shares, setShares] = useState(0)

  const refresh = () => { setLevel(unlockedLevel()); setShares(shareProgress()) }

  useEffect(() => {
    const r = loadResult()
    if (!r) { nav('/finder'); return }
    setResult(r)
    refresh()
    track('result_view', { givenName: r.intake.givenName })
  }, [nav])

  if (!result) return null
  const [safe, ...rest] = result.candidates
  const unlocked = level >= 1

  return (
    <>
      {/* —— ceremony header —— */}
      <section className="pt-2xl pb-xl text-center" style={{ background: 'var(--paper-300)' }}>
        <Container>
          <Eyebrow className="mb-md">{t('YOUR NAMES · 你的名字', 'YOUR NAMES · 你的名字')}</Eyebrow>
          <h1 className="text-display-2 md:text-display-1">
            {t('For', '为')} <span className="italic">{result.intake.givenName}</span>
          </h1>
          <p className="text-ink-500 mt-md max-w-xl mx-auto">
            {t('We took the sound', '我们取其音')} <strong className="text-ink-900">“{result.anchor.syllable}”</strong> {t(
              'as the thread back to your name — then let meaning lead the way.',
              '为通往你本名之线——而后以义领之。',
            )}
          </p>
        </Container>
      </section>

      {/* —— the primary (Safe) name reveal —— */}
      <section className="section pt-2xl">
        <Container>
          <PrimaryName candidate={safe} />
        </Container>
      </section>

      {/* —— the other two names —— */}
      <section className="section pt-0">
        <Container>
          <div className="text-center mb-2xl">
            <Eyebrow className="mb-sm">{t('TWO MORE TEMPERAMENTS · 另二式', 'TWO MORE TEMPERAMENTS · 另二式')}</Eyebrow>
            <h2 className="text-display-2">{t('The same method, two other bearings', '同一法度，另两种气度')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-lg">
            {rest.map((c) => (
              <LockedName key={c.type} candidate={c} unlocked={unlocked} />
            ))}
          </div>
          {!unlocked && <UnlockGate result={result} shares={shares} onChange={refresh} nav={nav} />}
        </Container>
      </section>

      {/* —— share (the viral loop + free unlock) —— */}
      <section className="section pt-0">
        <Container>
          <ShareCard candidate={safe} fromName={result.intake.givenName} onShared={refresh} />
        </Container>
      </section>

      {/* —— dossier upsell (L2) —— */}
      <DossierCta level={level} nav={nav} />
    </>
  )
}

function ToneRow({ candidate }: { candidate: NameCandidate }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {candidate.tonePattern.map((tn, i) => (
        <span key={i} className="text-caption text-ink-300">
          <span className="inline-block w-5 text-center font-display text-ink-500">{tn || '·'}</span>
        </span>
      ))}
    </div>
  )
}

function PrimaryName({ candidate }: { candidate: NameCandidate }) {
  const t = useT()
  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-2xl items-center">
      <div>
        <div className="flex items-center gap-md mb-lg">
          <span className="grid place-items-center w-10 h-10 rounded-full text-sm" style={{ border: '1px solid var(--gold-300)', color: 'var(--gold-600)' }}>稳</span>
          <Eyebrow>{t('THE SAFE NAME · 稳妥之名', 'THE SAFE NAME · 稳妥之名')}</Eyebrow>
        </div>
        <div className="flex items-start gap-xl">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="han text-ink-900 leading-none" style={{ fontSize: 'clamp(4rem, 12vw, 7rem)' }}
            >
              {candidate.fullHanzi}
            </motion.h2>
            <p className="font-display text-2xl text-ink-700 mt-md">{candidate.fullPinyin}</p>
            <div className="mt-sm"><ToneRow candidate={candidate} /></div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 1.4, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <Seal size={64} />
          </motion.div>
        </div>

        <Hairline className="my-xl" />

        <p className="text-lede text-ink-900">{candidate.meaningGloss}</p>
        <p className="text-ink-500 mt-md text-[1.02rem] leading-relaxed">{candidate.rationale}</p>
        {candidate.classicalSource && (
          <p className="text-ink-500 mt-md text-[0.95rem] italic" style={{ borderLeft: '2px solid var(--gold-400)', paddingLeft: '1rem' }}>
            {candidate.classicalSource}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-lg">
          <span className="text-caption text-ink-300">{t('Also called', '亦可称')}</span>
          {candidate.nicknames.map((n) => (
            <span key={n} className="han text-ink-700 px-2.5 py-0.5 rounded-chip text-[0.95rem]" style={{ background: 'var(--paper-300)' }}>{n}</span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-md mt-xl">
          <button className="btn-ghost !py-2.5" onClick={() => { track('pronounce_click'); speakChinese(candidate.fullHanzi) }}>
            <Volume2 size={16} /> {t('Hear it', '听其声')}
          </button>
          <span className="text-caption text-ink-300">{t('Score', '总评')} <strong className="font-display text-lg text-seal-600">{candidate.totalScore}</strong>/100</span>
        </div>
      </div>

      <div>
        <div className="card-paper p-xl">
          <p className="eyebrow text-center mb-md">{t('THE TWELVE-PALACE RECKONING · 十二宫', 'THE TWELVE-PALACE RECKONING · 十二宫')}</p>
          <div className="max-w-[380px] mx-auto">
            <PalaceRadar scores={candidate.scorecard} />
          </div>
          <p className="text-caption text-ink-300 text-center mt-md">
            {t('Each spoke is one palace, scored 1–5. The full reading is in your Dossier.', '每一辐为一宫，评一至五。详读见于《名册》。')}
          </p>
        </div>
      </div>
    </div>
  )
}

function LockedName({ candidate, unlocked }: { candidate: NameCandidate; unlocked: boolean }) {
  const t = useT()
  const label = candidate.type === 'Cultural' ? { en: 'The Cultural Name', zh: '文蕴之名', glyph: '雅' } : { en: 'The Distinctive Name', zh: '卓然之名', glyph: '奇' }
  return (
    <div className="card-paper p-xl relative overflow-hidden h-full">
      <div className="flex items-center gap-md mb-lg">
        <span className="grid place-items-center w-9 h-9 rounded-full text-sm" style={{ border: '1px solid var(--gold-300)', color: 'var(--gold-600)' }}>{label.glyph}</span>
        <Eyebrow>{t(label.en, label.zh)}</Eyebrow>
      </div>
      <div className={cn('transition-all duration-500', !unlocked && 'blur-md select-none pointer-events-none')}>
        <p className="han text-6xl text-ink-900">{candidate.fullHanzi}</p>
        <p className="font-display text-xl text-ink-700 mt-sm">{candidate.fullPinyin}</p>
        <p className="text-ink-500 mt-md">{candidate.meaningGloss}</p>
      </div>
      {!unlocked && (
        <div className="absolute inset-0 grid place-items-center" style={{ background: 'color-mix(in srgb, var(--paper-100) 40%, transparent)' }}>
          <div className="flex flex-col items-center text-center px-lg">
            <Lock size={20} className="text-ink-300 mb-sm" />
            <p className="text-caption text-ink-500">{t('Unlock below to reveal', '于下方解锁以揭晓')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function UnlockGate({ result, shares, onChange, nav }: { result: GenerateResult; shares: number; onChange: () => void; nav: (p: string) => void }) {
  const t = useT()
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const pct = Math.min(100, (shares / SHARE_UNLOCK_THRESHOLD) * 100)

  const saveEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/.+@.+\..+/.test(email)) return
    const topName = `${result.candidates[0].fullHanzi} ${result.candidates[0].fullPinyin}`
    captureLead({ email, givenName: result.intake.givenName, topName, at: new Date().toISOString() })
    void subscribe(email, { givenName: result.intake.givenName, topName, list: 'name-unlock' })
    setSaved(true)
  }
  const buyListener = () => { if (startCheckout('Listener', 19) === 'demo') { onChange(); nav('/result') } }

  return (
    <Reveal>
      <div className="card-paper p-xl md:p-2xl mt-xl max-w-3xl mx-auto" style={{ borderColor: 'var(--gold-300)' }}>
        <div className="text-center mb-xl">
          <Sparkles className="mx-auto mb-md" style={{ color: 'var(--gold-500)' }} size={24} />
          <h3 className="text-heading-3">{t('Unlock all three names', '解锁全部三名')}</h3>
          <p className="text-ink-500 mt-sm">{t('Two ways — one free.', '两种方式，其一免费。')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-lg">
          {/* free — share to unlock */}
          <div className="p-lg rounded-card text-center" style={{ background: 'var(--paper-200)' }}>
            <div className="flex items-center justify-center gap-2 mb-sm"><Share2 size={16} style={{ color: 'var(--seal-500)' }} /><span className="font-display text-lg">{t('Free — share it', '免费——分享')}</span></div>
            <p className="text-ink-500 text-[0.92rem] mb-md">{t(`Share your name card with ${SHARE_UNLOCK_THRESHOLD} friends.`, `将你的名片分享给 ${SHARE_UNLOCK_THRESHOLD} 位朋友。`)}</p>
            <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--paper-400)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'var(--seal-500)' }} />
            </div>
            <p className="text-caption text-ink-300">{shares} / {SHARE_UNLOCK_THRESHOLD} {t('shared — use the card below', '已分享——用下方名片')}</p>
          </div>
          {/* paid — Listener */}
          <div className="p-lg rounded-card text-center" style={{ background: 'var(--paper-200)' }}>
            <div className="font-display text-lg mb-sm">{t('Now — $9.99', '即刻——$9.99')}</div>
            <p className="text-ink-500 text-[0.92rem] mb-md">{t('L1 Listener: three names, audio, intros, radar & card.', 'L1 闻音者：三名、音频、介绍、命盘与名片。')}</p>
            <button onClick={buyListener} className="btn-seal w-full justify-center">{t('Unlock now', '即刻解锁')} <ArrowRight size={15} /></button>
          </div>
        </div>
        {/* email save (lead) */}
        <div className="mt-lg pt-lg text-center" style={{ borderTop: '1px solid var(--line-soft)' }}>
          {saved ? (
            <p className="text-[0.9rem] text-success flex items-center justify-center gap-2"><Check size={16} /> {t('Saved — we’ll email your result.', '已保存——结果将发至你的邮箱。')}</p>
          ) : (
            <form onSubmit={saveEmail} className="flex flex-col sm:flex-row gap-md max-w-md mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('Email me my result', '把结果发到我的邮箱')}
                className="flex-1 bg-paper-200 border rounded-card px-md py-2.5 outline-none focus:border-gold-500" />
              <button type="submit" className="btn-ghost">{t('Save', '保存')}</button>
            </form>
          )}
        </div>
      </div>
    </Reveal>
  )
}

function DossierCta({ level, nav }: { level: number; nav: (p: string) => void }) {
  const t = useT()
  const owned = level >= 2
  const includes = [
    t('All three names, fully explained', '三名俱全，逐一详解'),
    t('The complete twelve-palace reckoning', '十二宫完整品鉴'),
    t('Character etymology & classical sources', '字源考据与典籍出处'),
    t('Pronunciation & tone guide + audio', '发音与声调指南，附音频'),
    t('A printable name card & certificate', '可打印名片与证书'),
    t('Usage notes for cards, WeChat & introductions', '名片、微信、介绍之用法'),
  ]
  const getDossier = () => {
    if (owned) { nav('/dossier'); return }
    if (startCheckout('Insighter', 49) === 'demo') nav('/dossier')
  }
  return (
    <section className="section" style={{ background: 'var(--ink-900)' }}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-2xl items-center">
          <div>
            <p className="eyebrow mb-md" style={{ color: 'var(--gold-500)' }}>{t('L2 · THE NAME DOSSIER · 名册', 'L2 · THE NAME DOSSIER · 名册')}</p>
            <h2 className="text-display-2" style={{ color: 'var(--paper-100)' }}>{t('Make it truly yours.', '使之真正属于你。')}</h2>
            <p className="mt-lg text-[1.05rem]" style={{ color: 'var(--paper-400)' }}>
              {t(
                'Your free names are real names. The Dossier gives you the full reckoning behind them — the etymology, the sources, the pronunciation, and a beautiful artifact you’ll be proud to share.',
                '免费所得已是真名。《名册》则予你其背后完整的品鉴——字源、出处、发音，以及一份你乐于分享的精美成品。',
              )}
            </p>
            <ul className="mt-xl space-y-3">
              {includes.map((it) => (
                <li key={it} className="flex items-start gap-3" style={{ color: 'var(--paper-200)' }}>
                  <Check size={18} className="mt-1 shrink-0" style={{ color: 'var(--gold-500)' }} />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="inline-block p-2xl rounded-modal" style={{ background: 'var(--paper-100)' }}>
              <Seal size={72} className="mx-auto mb-lg" />
              <p className="eyebrow">{t('THE NAME DOSSIER', '名册')}</p>
              <p className="font-display text-6xl text-ink-900 mt-sm">{owned ? t('Yours', '已拥有') : '$99.90'}</p>
              <p className="text-caption text-ink-300 mt-1">{t('one-time · delivered instantly', '一次性 · 即时交付')}</p>
              <button className="btn-seal w-full justify-center mt-lg" onClick={() => { track('dossier_cta_click'); getDossier() }}>
                {owned ? t('Open your Dossier', '打开你的名册') : t('Get the Dossier', '获取名册')} <ArrowRight size={16} />
              </button>
              <Link to="/pricing" className="block text-caption text-ink-500 mt-md link-brush">{t('or see all five tiers →', '或查看五级套餐 →')}</Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
