import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Seal } from './components/Seal'
import { Home } from './pages/Home'

// Code-split everything past the landing page — the naming engine + knowledge
// base load only when the visitor opens the tool, and the admin only for the owner.
const Method = lazy(() => import('./pages/Method').then((m) => ({ default: m.Method })))
const Finder = lazy(() => import('./pages/Finder').then((m) => ({ default: m.Finder })))
const Result = lazy(() => import('./pages/Result').then((m) => ({ default: m.Result })))
const Dossier = lazy(() => import('./pages/Dossier').then((m) => ({ default: m.Dossier })))
const Shared = lazy(() => import('./pages/Shared').then((m) => ({ default: m.Shared })))
const Pricing = lazy(() => import('./pages/Pricing').then((m) => ({ default: m.Pricing })))
const Gallery = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.Gallery })))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Masters = lazy(() => import('./pages/Masters').then((m) => ({ default: m.Masters })))
const NameDirectory = lazy(() => import('./pages/NameDirectory').then((m) => ({ default: m.NameDirectory })))
const NameLanding = lazy(() => import('./pages/NameLanding').then((m) => ({ default: m.NameLanding })))
const FAQ = lazy(() => import('./pages/FAQ').then((m) => ({ default: m.FAQ })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })))
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })))
const Refunds = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Refunds })))
const Admin = lazy(() => import('./admin/Admin').then((m) => ({ default: m.Admin })))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function PageLoading() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="animate-breathe opacity-60"><Seal size={56} /></div>
    </div>
  )
}

function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  // The admin back-office stands alone (no marketing chrome).
  if (pathname.startsWith('/admin')) {
    return (
      <>
        <ScrollToTop />
        <Suspense fallback={<PageLoading />}>
          <Admin />
        </Suspense>
      </>
    )
  }
  return (
    <>
      <ScrollToTop />
      <SiteLayout>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/method" element={<Method />} />
            <Route path="/finder" element={<Finder />} />
            <Route path="/result" element={<Result />} />
            <Route path="/dossier" element={<Dossier />} />
            <Route path="/shared" element={<Shared />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/masters" element={<Masters />} />
            <Route path="/chinese-names" element={<NameDirectory />} />
            <Route path="/chinese-name-for/:name" element={<NameLanding />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </SiteLayout>
    </>
  )
}
