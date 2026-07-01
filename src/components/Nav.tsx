import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { Seal } from './Seal'
import { useT, useLang } from '../i18n'
import { useTheme } from '../lib/theme'
import { cn } from '../lib/cn'

export function Nav() {
  const t = useT()
  const { lang, setLang } = useLang()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  const links = [
    { to: '/method', label: t('The Method', '取名之道') },
    { to: '/gallery', label: t('Fine Names', '佳名集') },
    { to: '/masters', label: t('Masters', '取名师') },
    { to: '/pricing', label: t('Pricing', '价格') },
    { to: '/about', label: t('The Tradition', '何氏渊源') },
    { to: '/faq', label: t('FAQ', '常见问题') },
  ]

  return (
    <header className="no-print sticky top-0 z-50 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--paper-200) 86%, transparent)', borderBottom: '1px solid var(--line-soft)' }}>
      <nav className="container-band flex items-center justify-between" style={{ height: 72 }}>
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <Seal size={36} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.15rem] tracking-tight text-ink-900">My Chinese Name</span>
            <span className="eyebrow text-[0.6rem] mt-1">承天 · CHENGTIAN</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn('text-[0.95rem] font-body transition-colors link-brush', isActive ? 'text-seal-500' : 'text-ink-700 hover:text-ink-900')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center rounded-chip overflow-hidden" style={{ border: '1px solid var(--line-mid)' }}>
            <button onClick={() => setLang('en')} className={cn('px-2.5 py-1 text-xs font-body transition-colors', lang === 'en' ? 'bg-ink-900 text-paper-100' : 'text-ink-500')}>EN</button>
            <button onClick={() => setLang('zh')} className={cn('px-2.5 py-1 text-xs font-body transition-colors', lang === 'zh' ? 'bg-ink-900 text-paper-100' : 'text-ink-500')}>中</button>
          </div>
          <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-chip text-ink-500 hover:text-ink-900 transition-colors">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link to="/finder" className="btn-seal hidden sm:inline-flex !py-2.5 !px-5 !text-[0.9rem]">
            {t('Find Your Name', '寻得佳名')}
          </Link>
          <button onClick={() => setOpen((o) => !o)} className="lg:hidden p-2 text-ink-900" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t" style={{ borderColor: 'var(--line-soft)', background: 'var(--paper-100)' }}>
          <div className="container-band py-lg flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-3 text-ink-700 text-lg font-display border-b" style={{ borderColor: 'var(--line-soft)' }}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/finder" onClick={() => setOpen(false)} className="btn-seal mt-lg justify-center">
              {t('Find Your Name', '寻得佳名')}
            </Link>
          </div>
        </div>
      )}

      {/* hide the loud route flash by keying nav state to location */}
      <span hidden>{loc.pathname}</span>
    </header>
  )
}
