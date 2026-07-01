import { useEffect, useState } from 'react'
import { Check, Copy, Download, Gift, Share2 } from 'lucide-react'
import { makeNameCard } from '../lib/card'
import type { NameCandidate } from '../engine/types'
import { track } from '../lib/store'
import { useT } from '../i18n'

// The viral engine's front end: a beautiful, shareable name card. Every share
// is a billboard; the link lands on a personalised "get yours" page.
export function ShareCard({ candidate, fromName }: { candidate: NameCandidate; fromName?: string }) {
  const t = useT()
  const [dataUrl, setDataUrl] = useState('')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [copied, setCopied] = useState(false)

  const meaning = candidate.meaningGloss
  useEffect(() => {
    let alive = true
    makeNameCard({ hanzi: candidate.fullHanzi, pinyin: candidate.fullPinyin, meaning, fromName }).then((r) => {
      if (alive) { setDataUrl(r.dataUrl); setBlob(r.blob) }
    })
    return () => { alive = false }
  }, [candidate.fullHanzi, candidate.fullPinyin, meaning, fromName])

  const shareUrl = (() => {
    const base = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '')
    const q = new URLSearchParams({ n: candidate.fullHanzi, p: candidate.fullPinyin, m: meaning, ref: 'card' })
    if (fromName) q.set('from', fromName)
    return `${base}/shared?${q.toString()}`
  })()
  const shareText = t(
    `My Chinese name is ${candidate.fullHanzi} (${candidate.fullPinyin}) — ${meaning}. Find yours, free:`,
    `我的中文名是 ${candidate.fullHanzi}（${candidate.fullPinyin}）——${meaning}。免费测测你的：`,
  )

  const nativeShare = async () => {
    track('share_native', { name: candidate.fullHanzi })
    const file = blob ? new File([blob], 'my-chinese-name.png', { type: 'image/png' }) : null
    try {
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My Chinese Name', text: shareText, url: shareUrl })
        return
      }
      if (navigator.share) { await navigator.share({ title: 'My Chinese Name', text: shareText, url: shareUrl }); return }
    } catch { /* user cancelled */ }
    download()
  }

  const download = () => {
    track('share_download', { name: candidate.fullHanzi })
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `my-chinese-name-${candidate.fullHanzi}.png`
    a.click()
  }

  const copyLink = async () => {
    track('share_copylink')
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* ignore */ }
  }

  const socials: { label: string; href: string }[] = [
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` },
  ]

  return (
    <div className="card-paper p-xl md:p-2xl">
      <div className="grid md:grid-cols-[1fr_1.1fr] gap-xl items-center">
        <div className="mx-auto w-full max-w-[300px]">
          {dataUrl ? (
            <img src={dataUrl} alt={t('Your name card', '你的名片')} className="w-full rounded-card shadow-paper" style={{ border: '1px solid var(--line-soft)' }} />
          ) : (
            <div className="aspect-square rounded-card animate-breathe grid place-items-center" style={{ background: 'var(--paper-300)' }}>
              <span className="han text-4xl text-ink-300">名</span>
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow mb-sm">{t('SHARE YOUR NAME · 晒出你的名字', 'SHARE YOUR NAME · 晒出你的名字')}</p>
          <h3 className="text-heading-3 mb-md">{t('Give your friends the gift of a name', '把「名字」这份礼物送给朋友')}</h3>
          <p className="text-ink-500 text-[0.95rem] mb-lg">
            {t('Post your card, and challenge a friend to find their true Chinese name too.', '晒出你的名片，也邀一位朋友来寻得他的中文本名。')}
          </p>

          <div className="flex flex-wrap gap-md">
            <button className="btn-seal" onClick={nativeShare}><Share2 size={16} /> {t('Share', '分享')}</button>
            <button className="btn-ghost" onClick={download}><Download size={16} /> {t('Save card', '保存名片')}</button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-lg">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" onClick={() => track('share_social', { via: s.label })}
                className="px-3 py-1.5 rounded-chip text-sm text-ink-700 transition-colors hover:border-ink-900" style={{ border: '1px solid var(--line-mid)' }}>
                {s.label}
              </a>
            ))}
            <button onClick={copyLink} className="px-3 py-1.5 rounded-chip text-sm text-ink-700 inline-flex items-center gap-1.5 transition-colors hover:border-ink-900" style={{ border: '1px solid var(--line-mid)' }}>
              {copied ? <><Check size={14} style={{ color: 'var(--success)' }} /> {t('Copied', '已复制')}</> : <><Copy size={14} /> {t('Copy link', '复制链接')}</>}
            </button>
          </div>

          <p className="text-caption text-ink-300 mt-lg inline-flex items-center gap-1.5">
            <Gift size={13} /> {t('Every friend who joins through you earns you both a reward at launch.', '每位经你而来的朋友，上线后你们都将获得奖励。')}
          </p>
        </div>
      </div>
    </div>
  )
}
