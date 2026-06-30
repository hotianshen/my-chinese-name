import { Link } from 'react-router-dom'
import { Seal } from './Seal'
import { useT } from '../i18n'

export function Footer() {
  const t = useT()
  return (
    <footer className="mt-auto border-t" style={{ borderColor: 'var(--line-soft)', background: 'var(--paper-300)' }}>
      <div className="container-band py-3xl">
        <div className="grid gap-2xl md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-lg">
              <Seal size={40} />
              <span className="font-display text-xl text-ink-900">My Chinese Name</span>
            </div>
            <p className="text-ink-500 text-[0.95rem] leading-relaxed">
              {t(
                'More than a translation — a bridge between the name you carry and the culture you meet. Built on the Ho Method, a naming tradition more than 1,600 years old.',
                '不止于翻译，而是一座桥——连接你所承载的名字，与你所相遇的文明。承自何氏取名之法，传习一千六百余年。',
              )}
            </p>
          </div>

          <FooterCol title={t('Explore', '探索')} links={[
            { to: '/method', label: t('The Method', '取名之道') },
            { to: '/finder', label: t('Find Your Name', '寻得佳名') },
            { to: '/gallery', label: t('Fine Names', '佳名集') },
            { to: '/pricing', label: t('Pricing', '价格') },
          ]} />
          <FooterCol title={t('The Tradition', '渊源')} links={[
            { to: '/about', label: t('The Ho Method', '何氏之法') },
            { to: '/faq', label: t('FAQ', '常见问题') },
          ]} />
          <FooterCol title={t('The Book', '书')} links={[
            { to: 'https://www.amazon.com/My-Chinese-Name-Choosing-Truly-ebook/dp/B0H6WDSNF7', label: t('Read on Amazon', '亚马逊阅读'), ext: true },
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
