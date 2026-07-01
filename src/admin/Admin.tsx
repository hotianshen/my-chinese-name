import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3, Check, ClipboardList, Inbox, LayoutDashboard, Lock, Mail, Settings as SettingsIcon, Users,
} from 'lucide-react'
import { Seal } from '../components/Seal'
import {
  ensureDemoData, getEvents, getLeads, getOrders, updateOrderStatus, type Order,
} from '../lib/store'
import { isLive } from '../lib/checkout'
import { isEmailLive } from '../lib/email'
import { cn } from '../lib/cn'

const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE ?? 'chengtian'
type Tab = 'overview' | 'fulfilment' | 'orders' | 'leads' | 'settings'

export function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('mcn-admin') === '1')
  const [tab, setTab] = useState<Tab>('overview')
  const [tick, setTick] = useState(0)

  if (!authed) return <Gate onPass={() => setAuthed(true)} />

  ensureDemoData() // idempotent: seeds demo orders/leads once, before the reads below
  const orders = getOrders()
  const leads = getLeads()
  const events = getEvents()
  void tick

  const nav: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'fulfilment', label: 'Fulfilment', icon: ClipboardList },
    { id: 'orders', label: 'Orders', icon: Inbox },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--paper-200)' }}>
      {/* sidebar */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col border-r p-lg" style={{ borderColor: 'var(--line-soft)', background: 'var(--paper-100)' }}>
        <Link to="/" className="flex items-center gap-3 mb-2xl">
          <Seal size={32} />
          <span className="font-display text-lg">Chengtian</span>
        </Link>
        <nav className="space-y-1 flex-1">
          {nav.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className={cn('w-full flex items-center gap-3 px-md py-2.5 rounded-card text-[0.95rem] transition-colors',
                tab === n.id ? 'bg-ink-900 text-paper-100' : 'text-ink-500 hover:bg-paper-300')}>
              <n.icon size={17} /> {n.label}
            </button>
          ))}
        </nav>
        <button onClick={() => { sessionStorage.removeItem('mcn-admin'); location.reload() }} className="text-caption text-ink-300 hover:text-ink-700 text-left px-md py-2">Sign out</button>
      </aside>

      <main className="flex-1 p-lg md:p-2xl overflow-auto">
        {/* mobile tabs */}
        <div className="md:hidden flex gap-2 mb-lg overflow-x-auto">
          {nav.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} className={cn('px-md py-2 rounded-card text-sm whitespace-nowrap', tab === n.id ? 'bg-ink-900 text-paper-100' : 'bg-paper-100 text-ink-500')}>{n.label}</button>
          ))}
        </div>

        {tab === 'overview' && <Overview orders={orders} leads={leads} events={events} />}
        {tab === 'fulfilment' && <Fulfilment orders={orders} onChange={() => setTick((t) => t + 1)} />}
        {tab === 'orders' && <Orders orders={orders} />}
        {tab === 'leads' && <Leads />}
        {tab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  )
}

function Gate({ onPass }: { onPass: () => void }) {
  const [code, setCode] = useState('')
  const [err, setErr] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === ADMIN_CODE) { sessionStorage.setItem('mcn-admin', '1'); onPass() }
    else setErr(true)
  }
  return (
    <div className="min-h-screen grid place-items-center px-lg" style={{ background: 'var(--paper-200)' }}>
      <form onSubmit={submit} className="card-paper p-2xl w-full max-w-sm text-center">
        <Seal size={56} className="mx-auto mb-lg" />
        <h1 className="font-display text-2xl mb-1">Chengtian Back-Office</h1>
        <p className="text-caption text-ink-300 mb-xl flex items-center justify-center gap-1"><Lock size={12} /> Authorised access only</p>
        <input autoFocus type="password" value={code} onChange={(e) => { setCode(e.target.value); setErr(false) }} placeholder="Passcode"
          className="w-full bg-paper-200 border rounded-card px-md py-3 text-center outline-none focus:border-gold-500" />
        {err && <p className="text-error text-sm mt-sm">Incorrect passcode.</p>}
        <button type="submit" className="btn-seal w-full justify-center mt-lg">Enter</button>
        <p className="text-caption text-ink-300 mt-lg">Demo passcode: <code className="text-ink-500">chengtian</code></p>
      </form>
    </div>
  )
}

function money(n: number) { return '$' + n.toLocaleString() }

function Overview({ orders, leads, events }: { orders: Order[]; leads: unknown[]; events: unknown[] }) {
  const revenue = orders.reduce((a, o) => a + o.amount, 0)
  const aov = orders.length ? Math.round(revenue / orders.length) : 0
  const kpis = [
    { label: 'Revenue', value: money(revenue), icon: BarChart3 },
    { label: 'Orders', value: String(orders.length), icon: Inbox },
    { label: 'Avg. order value', value: money(aov), icon: BarChart3 },
    { label: 'Email leads', value: String(leads.length), icon: Mail },
  ]
  const funnel = [
    { stage: 'Visitors', n: Math.max(1240, leads.length * 7), pct: 100 },
    { stage: 'Used the Finder', n: Math.max(420, leads.length * 4), pct: 34 },
    { stage: 'Email captured', n: leads.length || 3, pct: 18 },
    { stage: 'Purchased', n: orders.length, pct: Math.round((orders.length / Math.max(1, (leads.length || 3) * 4)) * 100) },
  ]
  return (
    <div>
      <Header title="Overview" subtitle="Your business at a glance. 95% of this runs itself." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md mb-2xl">
        {kpis.map((k) => (
          <div key={k.label} className="card-paper p-lg">
            <k.icon size={18} className="text-gold-600 mb-md" />
            <p className="font-display text-3xl text-ink-900">{k.value}</p>
            <p className="text-caption text-ink-300 mt-1">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-lg">
        <div className="card-paper p-xl">
          <h3 className="font-display text-lg mb-lg">Conversion funnel</h3>
          {funnel.map((f) => (
            <div key={f.stage} className="mb-md">
              <div className="flex justify-between text-sm mb-1"><span className="text-ink-700">{f.stage}</span><span className="text-ink-400 text-ink-500">{f.n.toLocaleString()}</span></div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--paper-300)' }}>
                <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: 'var(--seal-500)' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card-paper p-xl">
          <h3 className="font-display text-lg mb-lg">To do — your 5%</h3>
          <ul className="space-y-3 text-[0.95rem]">
            <ToDo n={orders.filter((o) => o.tier !== 'Dossier' && o.status !== 'delivered').length} label="Master’s / Brand names to craft" />
            <ToDo n={0} label="Support tickets the FAQ couldn’t deflect" />
            <ToDo n={1} label="Content batch to approve (SEO + cards)" />
          </ul>
          <p className="text-caption text-ink-300 mt-lg">Everything else — the free tool, dossiers, payments, tax, email, delivery — is automated.</p>
          <p className="text-caption text-ink-300 mt-sm">{events.length} analytics events recorded.</p>
        </div>
      </div>
    </div>
  )
}

function ToDo({ n, label }: { n: number; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className={cn('grid place-items-center w-6 h-6 rounded-full text-xs font-body', n > 0 ? 'text-paper-100' : 'text-ink-300')} style={{ background: n > 0 ? 'var(--seal-500)' : 'var(--paper-300)' }}>{n}</span>
      <span className="text-ink-700">{label}</span>
    </li>
  )
}

function Fulfilment({ orders, onChange }: { orders: Order[]; onChange: () => void }) {
  const queue = orders.filter((o) => o.status !== 'delivered')
  return (
    <div>
      <Header title="Fulfilment queue" subtitle="The human-in-the-loop tiers. Craft, then mark delivered." />
      {queue.length === 0 ? (
        <div className="card-paper p-2xl text-center text-ink-300"><Check className="mx-auto mb-md" /> All caught up.</div>
      ) : (
        <div className="space-y-md">
          {queue.map((o) => (
            <div key={o.id} className="card-paper p-lg flex flex-wrap items-center gap-lg justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg">{o.id}</span>
                  <TierBadge tier={o.tier} />
                </div>
                <p className="text-caption text-ink-300 mt-1">{o.email} · {o.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={o.status} />
                {o.status === 'paid' && o.tier !== 'Dossier' && (
                  <button onClick={() => { updateOrderStatus(o.id, 'in-fulfilment'); onChange() }} className="btn-ghost !py-2 !px-4 !text-sm">Start</button>
                )}
                <button onClick={() => { updateOrderStatus(o.id, 'delivered'); onChange() }} className="btn-seal !py-2 !px-4 !text-sm">Mark delivered</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Orders({ orders }: { orders: Order[] }) {
  return (
    <div>
      <Header title="Orders" subtitle={`${orders.length} total`} />
      <div className="card-paper overflow-hidden">
        <table className="w-full text-[0.92rem]">
          <thead>
            <tr className="text-left text-ink-300 text-caption" style={{ borderBottom: '1px solid var(--line-soft)' }}>
              <th className="p-md font-body font-normal">Order</th><th className="p-md font-body font-normal">Tier</th>
              <th className="p-md font-body font-normal">Name</th><th className="p-md font-body font-normal">Amount</th>
              <th className="p-md font-body font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                <td className="p-md font-display">{o.id}</td>
                <td className="p-md"><TierBadge tier={o.tier} /></td>
                <td className="p-md han text-ink-700">{o.name}</td>
                <td className="p-md font-display">{money(o.amount)}</td>
                <td className="p-md"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Leads() {
  const leads = getLeads()
  return (
    <div>
      <Header title="Email leads" subtitle={`${leads.length} captured · the nurture list`} />
      <div className="card-paper overflow-hidden">
        <table className="w-full text-[0.92rem]">
          <thead><tr className="text-left text-ink-300 text-caption" style={{ borderBottom: '1px solid var(--line-soft)' }}>
            <th className="p-md font-body font-normal">Email</th><th className="p-md font-body font-normal">From name</th><th className="p-md font-body font-normal">Top name</th>
          </tr></thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                <td className="p-md">{l.email}</td><td className="p-md">{l.givenName}</td><td className="p-md han text-ink-700">{l.topName}</td>
              </tr>
            ))}
            {leads.length === 0 && <tr><td className="p-xl text-ink-300" colSpan={3}>No leads yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SettingsPanel() {
  const rows = [
    { label: 'Dossier checkout ($39)', live: isLive('Dossier'), env: 'VITE_CHECKOUT_DOSSIER' },
    { label: 'Master’s checkout ($149)', live: isLive("Master's Name"), env: 'VITE_CHECKOUT_MASTERS' },
    { label: 'Brand checkout', live: isLive('Brand & Bearer'), env: 'VITE_CHECKOUT_BRAND' },
  ]
  return (
    <div>
      <Header title="Settings" subtitle="Go live by adding your payment & email keys." />
      <div className="card-paper p-xl max-w-2xl">
        <h3 className="font-display text-lg mb-lg">Checkout links</h3>
        {rows.map((r) => (
          <div key={r.env} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--line-soft)' }}>
            <div>
              <p className="text-ink-700">{r.label}</p>
              <code className="text-caption text-ink-300">{r.env}</code>
            </div>
            <span className={cn('text-sm px-3 py-1 rounded-full', r.live ? 'text-success' : 'text-ink-300')} style={{ background: r.live ? 'color-mix(in srgb, var(--success) 14%, transparent)' : 'var(--paper-300)' }}>
              {r.live ? 'Live' : 'Demo mode'}
            </span>
          </div>
        ))}
        <p className="text-caption text-ink-300 mt-lg">
          Set these to your Lemon Squeezy (recommended — Merchant of Record, automatic VAT/tax) or Stripe Payment Link URLs in a <code>.env</code> file, then redeploy. Until then, checkout runs in demo mode and records orders here.
        </p>
      </div>

      <div className="card-paper p-xl max-w-2xl mt-lg">
        <h3 className="font-display text-lg mb-lg">Email automation</h3>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-ink-700">Lead → ESP webhook</p>
            <code className="text-caption text-ink-300">VITE_EMAIL_WEBHOOK</code>
          </div>
          <span className={cn('text-sm px-3 py-1 rounded-full', isEmailLive() ? 'text-success' : 'text-ink-300')} style={{ background: isEmailLive() ? 'color-mix(in srgb, var(--success) 14%, transparent)' : 'var(--paper-300)' }}>
            {isEmailLive() ? 'Live' : 'Local only'}
          </span>
        </div>
        <p className="text-caption text-ink-300 mt-lg">
          Point this at a Zapier / Make catch-hook or a small serverless endpoint that adds the subscriber to MailerLite / ConvertKit. Captured emails always appear under <strong>Leads</strong>; when live, they’re also forwarded to your list.
        </p>
      </div>
    </div>
  )
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-xl">
      <h1 className="font-display text-3xl text-ink-900">{title}</h1>
      <p className="text-ink-300 text-[0.95rem] mt-1">{subtitle}</p>
    </div>
  )
}
function TierBadge({ tier }: { tier: Order['tier'] }) {
  const c = tier === 'Dossier' ? 'var(--gold-600)' : tier === "Master's Name" ? 'var(--seal-500)' : 'var(--info)'
  return <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: c, background: `color-mix(in srgb, ${c} 12%, transparent)` }}>{tier}</span>
}
function StatusBadge({ status }: { status: Order['status'] }) {
  const map = { paid: ['Paid', 'var(--gold-600)'], 'in-fulfilment': ['In fulfilment', 'var(--info)'], delivered: ['Delivered', 'var(--success)'] } as const
  const [label, c] = map[status]
  return <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: c, background: `color-mix(in srgb, ${c} 12%, transparent)` }}>{label}</span>
}
