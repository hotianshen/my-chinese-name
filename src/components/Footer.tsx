import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Seal } from './Seal'
import { subscribe } from '../lib/email'
import { captureLead } from '../lib/store'
import { useT } from '../i18n'

export function Footer() {
  const t = useT()
  return (
    <footer className="no-print mt-auto border-t" style={{ borderColor: 'var(--line-soft)', background: 'var(--paper-300)' }}>
      <div className="container-band py-3xl">
        <div className="grid gap-2xl md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-lg">
              <Seal size={40} />
              <span className="font-display text-xl text-ink-900">My Chinese Name</span>
            </div>
            <p className="text-ink-500 text-[0.95rem] leading-relaxed mb-lg">
              {t(
                'More than a translation — a bridge between the name you carry and the culture you meet. Built on the Ho Method, a naming tradition more than 1,600 years old.',
                '不止于翻译，而是一座桥——连接你所承载的名字，与你所相遇的文明。承自何氏取名之法，传习一千六百余年。',
              )}
            </p>
            <Newsletter />
          </div>

          <FooterCol title={t('Explore', '探索')} links={[
            { to: '/method', label: t('The Method', '取名之道') },
            { to: '/finder', label: t('Find Your Name', '寻得佳名') },
            { to: '/gallery', label: t('Fine Names', '佳名集') },
            { to: '/chinese-names', label: t('Name Directory', '名字目录') },
            { to: '/pricing', label: t('Pricing', '价格') },
          ]} />
          <FooterCol title={t('The Tradition', '渊源')} links={[
            { to: '/about', label: t('The Ho Method', '何氏之法') },
            { to: '/faq', label: t('FAQ', '常见问题') },
          ]} />
          <FooterCol title={t('More', '更多')} links={[
            { to: 'https://www.amazon.com/My-Chinese-Name-Choosing-Truly-ebook/dp/B0H6WDSNF7', label: t('Read on Amazon', '亚马逊阅读'), ext: true },
            { to: '/terms', label: t('Terms', '服务条款') },
            { to: '/privacy', label: t('Privacy', '隐私政策') },
            { to: '/refunds', label: t('Refunds', '退款政策') },
          ]} />
        </div>

        <div className="mt-3xl pt-lg flex flex-col sm:flex-row items-center justify-between gap-md text-caption text-ink-300" style={{ borderTop: '1px solid var(--line-soft)' }}>
          <p>© {new Date().getFullYear()} My Chinese Name · {t('The Ho Method', '何氏取名法')}. {t('All rights reserved.', '版权所有。')}</p>
          <p className="han text-ink-500">承天 · 名以载道</p>
        </div>
      </div>
    </footer>
  )
}

function Newsletter() {
  const t = useT()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/.+@.+\..+/.test(email)) return
    captureLead({ email, givenName: '(newsletter)', topName: '—', at: new Date().toISOString() })
    void subscribe(email, { list: 'newsletter' })
    setDone(true)
  }
  if (done) {
    return <p className="text-[0.9rem] text-success flex items-center gap-2"><Check size={16} /> {t('Thank you — you’re on the list.', '谢谢——已为你订阅。')}</p>
  }
  return (
    <form onSubmit={submit}>
      <p className="eyebrow mb-sm">{t('THE THREAD · 名讯', 'THE THREAD · 名讯')}</p>
      <div className="flex gap-2">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('Your email', '你的邮箱')}
          className="flex-1 min-w-0 bg-paper-100 border rounded-chip px-3 py-2 text-[0.9rem] outline-none focus:border-gold-500" />
        <button type="submit" className="btn-seal !py-2 !px-4 !text-sm shrink-0">{t('Join', '订阅')}</button>
      </div>
      <p className="text-caption text-ink-300 mt-2">{t('Occasional notes on names & Chinese culture.', '偶尔一封关于名字与中华文化的短信。')}</p>
    </form>
  )
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string; ext?: boolean }[] }) {
  return (
    <div>
      <p className="eyebrow mb-lg">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.to}>
            {l.ext ? (
              <a href={l.to} target="_blank" rel="noreferrer" className="text-ink-700 text-[0.95rem] link-brush">{l.label}</a>
            ) : (
              <Link to={l.to} className="text-ink-700 text-[0.95rem] link-brush">{l.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
