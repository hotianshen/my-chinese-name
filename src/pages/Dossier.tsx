import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { Seal } from '../components/Seal'
import { PalaceRadar } from '../components/PalaceRadar'
import type { CharRecord, GenerateResult, NameCandidate } from '../engine/types'
import { loadResult, track } from '../lib/store'
import { toneInfo } from '../lib/pronounce'
import { birthReading, ELEMENTS, harmonyNote } from '../engine/wuxing'
import { unlockedLevel } from '../lib/tiers'
import { useLang, useT } from '../i18n'

// The Name Dossier — the paid deliverable. A rich, printable document rendered
// from the generated result. "Print / Save as PDF" uses the browser's print
// dialog (zero-dependency, server-free) styled by the @media print rules.
export function Dossier() {
  const t = useT()
  const nav = useNavigate()
  const [result, setResult] = useState<GenerateResult | null>(null)

  useEffect(() => {
    const r = loadResult()
    if (!r) { nav('/finder'); return }
    setResult(r)
    track('dossier_view', { givenName: r.intake.givenName })
  }, [nav])

  if (!result) return null
  const primary = result.candidates[0]
  const date = new Date(result.generatedAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ background: 'var(--paper-300)' }}>
      {/* toolbar — hidden when printing */}
      <div className="no-print sticky top-0 z-40 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--paper-200) 88%, transparent)', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="container-band flex items-center justify-between" style={{ height: 64 }}>
          <Link to="/result" className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-900 text-[0.95rem]"><ArrowLeft size={16} /> {t('Back to your names', '返回你的名字')}</Link>
          <button className="btn-seal !py-2.5" onClick={() => { track('dossier_print'); window.print() }}>
            <Printer size={16} /> {t('Print / Save as PDF', '打印 / 存为 PDF')}
          </button>
        </div>
      </div>

      {/* the document */}
      <div className="dossier mx-auto my-xl bg-paper-100 shadow-paper" style={{ maxWidth: 820 }}>
        <Cover result={result} primary={primary} date={date} />
        <div className="px-xl md:px-3xl pb-3xl">
          <SectionRule label={t('I · The Three Names', 'I · 三名')} />
          {result.candidates.map((c, i) => <NameBreakdown key={c.type} candidate={c} index={i} />)}

          <SectionRule label={t('II · The Twelve-Palace Reckoning', 'II · 十二宫品鉴')} />
          <Reckoning candidate={primary} />

          <SectionRule label={t('III · Pronunciation & Tones', 'III · 发音与声调')} />
          <Pronunciation candidate={primary} />

          <SectionRule label={t('IV · How to Use Your Name', 'IV · 名字的用法')} />
          <Usage candidate={primary} />

          <SectionRule label={t('V · Your Name Card', 'V · 你的名片')} />
          <NameCardPrintable candidate={primary} />

          <SectionRule label={t('VI · The Naming Note', 'VI · 取名记')} />
          <NamingNote result={result} primary={primary} />

          {/* Five Elements is a MASTER-TIER (L3/L4) cultural layer only — never in
              the free/entry funnel, so the serious methodology-first positioning
              stays intact. A quiet teaser invites L2 buyers up to the Master's tier. */}
          {result.intake.birthYear && unlockedLevel() >= 3 && (
            <>
              <SectionRule label={t('Appendix · Five Elements & Birth Harmony', '附 · 五行 · 生辰之和')} />
              <FiveElements year={result.intake.birthYear} />
            </>
          )}
          {result.intake.birthYear && unlockedLevel() < 3 && (
            <>
              <SectionRule label={t('Appendix · Five Elements & Birth Harmony', '附 · 五行 · 生辰之和')} />
              <div className="container-reading !px-0">
                <p className="text-ink-500 leading-relaxed">
                  {t(
                    'A Five-Elements & Birth-Harmony reading — how the fuller Chinese tradition would also weigh your name against your birth year, offered as a cultural lens (never fortune-telling) — is part of the Master’s Name. 命 remains one palace of twelve, and never decides the name.',
                    '「五行 · 生辰之和」——中国传统上会如何结合你的生辰再权衡此名，作为一种文化视角（绝非算命）——属《大师之名》所含。命，始终只是十二宫之一，从不决定名字。',
                  )}
                </p>
              </div>
            </>
          )}

          <footer className="mt-3xl pt-lg text-center" style={{ borderTop: '1px solid var(--line-soft)' }}>
            <Seal size={44} className="mx-auto mb-md" />
            <p className="han text-ink-500">承天 · 名以载道</p>
            <p className="text-caption text-ink-300 mt-1">{t('Crafted by the Ho Method · mychinese.name', '承何氏之法 · mychinese.name')}</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

function Cover({ result, primary, date }: { result: GenerateResult; primary: NameCandidate; date: string }) {
  const t = useT()
  return (
    <div className="px-xl md:px-3xl pt-3xl pb-xl text-center" style={{ borderBottom: '1px solid var(--gold-300)' }}>
      <p className="eyebrow mb-lg">THE NAME DOSSIER · 名册</p>
      <p className="text-ink-500">{t('Prepared for', '谨呈')}</p>
      <p className="font-display text-3xl text-ink-900 mt-1 italic">{result.intake.givenName} {result.intake.surname ?? ''}</p>
      <div className="my-xl flex items-center justify-center gap-xl">
        <div>
          <p className="han text-ink-900 leading-none" style={{ fontSize: 'clamp(3.5rem,10vw,6rem)' }}>{primary.fullHanzi}</p>
          <p className="font-display text-2xl text-ink-700 mt-md">{primary.fullPinyin}</p>
        </div>
        <Seal size={72} />
      </div>
      <p className="text-ink-500 italic">{primary.meaningGloss}</p>
      <p className="text-caption text-ink-300 mt-lg">{date}</p>
    </div>
  )
}

function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-lg mt-3xl mb-xl break-before">
      <span className="eyebrow whitespace-nowrap">{label}</span>
      <span className="hairline flex-1" style={{ transform: 'none' }} />
    </div>
  )
}

const TYPE_LABEL: Record<string, { en: string; zh: string; glyph: string }> = {
  Safe: { en: 'The Safe Name — recommended', zh: '稳妥之名 · 推荐', glyph: '稳' },
  Cultural: { en: 'The Cultural Name', zh: '文蕴之名', glyph: '雅' },
  Distinctive: { en: 'The Distinctive Name', zh: '卓然之名', glyph: '奇' },
}

function NameBreakdown({ candidate, index }: { candidate: NameCandidate; index: number }) {
  const t = useT()
  const lab = TYPE_LABEL[candidate.type]
  const chars: CharRecord[] = candidate.given
  return (
    <div className="mb-2xl" style={index > 0 ? { borderTop: '1px solid var(--line-soft)', paddingTop: '1.5rem' } : {}}>
      <div className="flex items-center gap-md mb-lg">
        <span className="grid place-items-center w-9 h-9 rounded-full han text-base" style={{ border: '1px solid var(--gold-300)', color: 'var(--gold-600)' }}>{lab.glyph}</span>
        <span className="eyebrow">{t(lab.en, lab.zh)}</span>
        <span className="ml-auto text-caption text-ink-300">{t('Score', '总评')} <strong className="font-display text-seal-600">{candidate.totalScore}</strong>/100</span>
      </div>
      <div className="flex items-baseline gap-lg flex-wrap">
        <span className="han text-5xl text-ink-900">{candidate.fullHanzi}</span>
        <span className="font-display text-2xl text-ink-700">{candidate.fullPinyin}</span>
      </div>

      {/* per-character grid */}
      <div className="grid sm:grid-cols-2 gap-md mt-lg">
        {candidate.surname && <CharCell c={candidate.surname.hanzi} py={candidate.surname.toned} meaning={t('Surname — your roots in the world of the characters.', '姓——你在汉字世界中的根脉。') + (candidate.surname.register || '')} isSurname />}
        {chars.map((c) => <CharCell key={c.hanzi} c={c.hanzi} py={c.toned} meaning={c.meaning} />)}
      </div>

      <p className="text-ink-500 text-[0.95rem] mt-lg leading-relaxed">{candidate.rationale}</p>
      {candidate.classicalSource && (
        <p className="text-ink-500 text-[0.92rem] mt-sm italic" style={{ borderLeft: '2px solid var(--gold-400)', paddingLeft: '0.75rem' }}>{candidate.classicalSource}</p>
      )}
    </div>
  )
}

function CharCell({ c, py, meaning, isSurname }: { c: string; py: string; meaning: string; isSurname?: boolean }) {
  return (
    <div className="flex gap-md p-md rounded-card" style={{ background: 'var(--paper-200)' }}>
      <div className="text-center shrink-0">
        <span className="han text-4xl text-ink-900">{c}</span>
        <p className="font-display text-sm text-ink-500">{py}</p>
      </div>
      <p className="text-ink-500 text-[0.88rem] leading-snug self-center">
        {isSurname && <span className="text-gold-600 font-medium">{meaning.split('—')[0]}—</span>}
        {isSurname ? meaning.split('—').slice(1).join('—') : meaning}
      </p>
    </div>
  )
}

function Reckoning({ candidate }: { candidate: NameCandidate }) {
  const t = useT()
  return (
    <div className="grid md:grid-cols-[1fr_auto] gap-xl items-start">
      <table className="w-full text-[0.9rem]">
        <tbody>
          {candidate.scorecard.map((p) => (
            <tr key={p.key} style={{ borderBottom: '1px solid var(--line-soft)' }}>
              <td className="py-2.5 pr-md align-top">
                <span className="font-display text-ink-900">{p.palace}</span>
                <span className="block text-caption text-ink-300">{p.note}</span>
              </td>
              <td className="py-2.5 align-top text-right whitespace-nowrap">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className="inline-block w-2 h-2 rounded-full ml-1" style={{ background: n <= p.score ? 'var(--seal-500)' : 'var(--paper-400)' }} />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full md:w-[300px] mx-auto">
        <PalaceRadar scores={candidate.scorecard} size={300} />
        <p className="text-caption text-ink-300 text-center mt-sm">{t('The命盘 — your name across twelve palaces.', '命盘——你的名字，遍历十二宫。')}</p>
      </div>
    </div>
  )
}

function Pronunciation({ candidate }: { candidate: NameCandidate }) {
  const t = useT()
  const all: CharRecord[] = [
    ...(candidate.surname ? [{ ...(candidate.surname as unknown as CharRecord) }] : []),
    ...candidate.given,
  ]
  return (
    <div>
      <p className="text-ink-500 text-[0.95rem] mb-lg">{t('Say each syllable with its tone. Read slowly three times — by the third, it will feel like yours.', '逐字依调而诵。缓读三遍——至第三遍，便如己出。')}</p>
      <div className="space-y-md">
        {all.map((c, i) => {
          const ti = toneInfo(c.tone)
          return (
            <div key={i} className="flex items-center gap-lg p-md rounded-card" style={{ background: 'var(--paper-200)' }}>
              <span className="han text-4xl text-ink-900 w-12 text-center">{c.hanzi}</span>
              <div className="flex-1">
                <p className="font-display text-xl text-ink-900">{c.toned} <span className="text-ink-300 text-base">{ti.mark}</span></p>
                <p className="text-ink-500 text-[0.9rem]">{t(ti.nameEn, ti.nameZh)} — {t(ti.contourEn, ti.contourZh)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Usage({ candidate }: { candidate: NameCandidate }) {
  const t = useT()
  const items = [
    { h: t('On a business card', '名片之上'), b: t(`Print your name as 「${candidate.fullHanzi}」 with the pinyin “${candidate.fullPinyin}” beneath. Surname first, in the Chinese order.`, `将「${candidate.fullHanzi}」印于名片，下注拼音“${candidate.fullPinyin}”，依中文姓在前之序。`) },
    { h: t('On WeChat & online', '微信与网络'), b: t(`Use 「${candidate.fullHanzi}」 as your display name. Chinese contacts will read it as a real name, not a transliteration.`, `以「${candidate.fullHanzi}」为昵称。中国友人读来即真名，而非音译。`) },
  ]
  return (
    <div className="space-y-lg">
      {/* nicknames */}
      <div>
        <h4 className="font-display text-lg text-ink-900">{t('What friends will call you', '朋友会怎么称呼你')}</h4>
        <div className="flex flex-wrap gap-2 mt-sm">
          {candidate.nicknames.map((n) => (
            <span key={n} className="han px-3 py-1 rounded-chip text-ink-700" style={{ background: 'var(--paper-200)', border: '1px solid var(--line-soft)' }}>{n}</span>
          ))}
        </div>
      </div>
      {/* self-introduction, both languages */}
      <div>
        <h4 className="font-display text-lg text-ink-900">{t('Introducing yourself', '自我介绍')}</h4>
        <p className="han text-ink-700 text-[1.02rem] mt-sm leading-relaxed" style={{ borderLeft: '2px solid var(--gold-400)', paddingLeft: '0.9rem' }}>{candidate.introZh}</p>
        <p className="text-ink-500 text-[0.95rem] mt-sm italic" style={{ paddingLeft: '0.9rem' }}>{candidate.introEn}</p>
      </div>
      {items.map((it) => (
        <div key={it.h}>
          <h4 className="font-display text-lg text-ink-900">{it.h}</h4>
          <p className="text-ink-500 text-[0.95rem] mt-1 leading-relaxed">{it.b}</p>
        </div>
      ))}
    </div>
  )
}

function NameCardPrintable({ candidate }: { candidate: NameCandidate }) {
  return (
    <div className="flex justify-center">
      <div className="relative p-xl text-center" style={{ width: 360, border: '1px solid var(--gold-300)', borderRadius: 6, background: 'var(--paper-100)' }}>
        <div className="absolute top-3 right-3"><Seal size={36} /></div>
        <p className="han text-6xl text-ink-900 mt-md">{candidate.fullHanzi}</p>
        <p className="font-display text-xl text-ink-700 mt-sm">{candidate.fullPinyin}</p>
        <div className="hairline mx-auto my-md" style={{ width: 60, transform: 'none' }} />
        <p className="text-ink-500 text-[0.9rem]">{candidate.meaningGloss}</p>
        <p className="eyebrow mt-lg">我有嘉名 · I HAVE A FINE NAME</p>
      </div>
    </div>
  )
}

function NamingNote({ result, primary }: { result: GenerateResult; primary: NameCandidate }) {
  const t = useT()
  return (
    <div className="container-reading !px-0">
      <p className="text-ink-700 leading-relaxed" style={{ fontFamily: 'Fraunces, serif', fontSize: '1.12rem', lineHeight: 1.8 }}>
        {t(
          `${result.intake.givenName}, your name ${primary.fullHanzi} (${primary.fullPinyin}) was not assembled from parts. We took the sound “${result.anchor.syllable}” as a thread back to the name you already carry, then let meaning lead — ${primary.meaningGloss.toLowerCase()}. It was weighed across all twelve palaces, screened for every hidden snag, and tuned until it breathes. Say it often. A name becomes yours not the day it is made, but the day you wear it without thinking. May you, too, have a fine name.`,
          `${result.intake.givenName}，你的名字${primary.fullHanzi}（${primary.fullPinyin}）并非由零件拼凑。我们取「${result.anchor.syllable}」之音，为通往你本名之线，而后以义领之——${primary.meaningGloss}。它经十二宫逐一权衡，过尽每一处暗礁，调至呼吸自如。愿你常诵之。名字成为你的，不在它被造出之日，而在你不假思索便能承用之时。愿你，也有一个嘉名。`,
        )}
      </p>
      {result.referenceSeed && (
        <p className="text-caption text-ink-300 mt-xl">
          {t('From the book’s reference table:', '书中范例：')} {result.intake.givenName} → {result.referenceSeed.hanzi} ({result.referenceSeed.pinyin}) — {result.referenceSeed.sense}
        </p>
      )}
    </div>
  )
}

function FiveElements({ year }: { year: number }) {
  const t = useT()
  const { lang } = useLang()
  const r = birthReading(year)
  if (!r) return null
  const m = ELEMENTS[r.element]
  const s = ELEMENTS[r.supports]
  return (
    <div className="container-reading !px-0">
      <div className="flex items-center gap-lg mb-lg">
        <span className="han text-6xl leading-none" style={{ color: 'var(--seal-500)' }}>{m.glyph}</span>
        <div>
          <p className="font-display text-xl text-ink-900">{t(`${m.el} · born ${r.year}, year of the ${r.zodiac}`, `${m.zh}命 · ${r.year}年生，属${r.zodiacZh}`)}</p>
          <p className="text-caption text-ink-300">{t(`Heavenly stem ${r.stemZh} · nourished by ${s.el}`, `天干${r.stemZh} · ${s.zh}生之`)}</p>
        </div>
      </div>
      <p className="text-ink-700 leading-relaxed" style={{ fontFamily: 'Fraunces, serif', fontSize: '1.08rem', lineHeight: 1.8 }}>{harmonyNote(r, lang)}</p>
      <p className="text-caption text-ink-300 mt-lg" style={{ borderTop: '1px solid var(--line-soft)', paddingTop: '0.75rem' }}>
        {t('A cultural interpretation offered for completeness — not fortune-telling, and no promise about luck or fate. 命 (destiny) is one palace of twelve, and never decides the name. The full four-pillar reading is part of the Master’s service.', '此为求完整而附的文化诠释——非算命，不承诺吉凶祸福。命，只是十二宫之一，从不决定名字。完整四柱解读属《大师之名》之服务。')}
      </p>
    </div>
  )
}
