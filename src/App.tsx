import { useEffect, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Method } from './pages/Method'
import { Finder } from './pages/Finder'
import { Result } from './pages/Result'
import { Pricing } from './pages/Pricing'
import { Gallery } from './pages/Gallery'
import { About } from './pages/About'
import { FAQ } from './pages/FAQ'
import { NotFound } from './pages/NotFound'
import { Admin } from './admin/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
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
        <Admin />
      </>
    )
  }
  return (
    <>
      <ScrollToTop />
      <SiteLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/method" element={<Method />} />
          <Route path="/finder" element={<Finder />} />
          <Route path="/result" element={<Result />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SiteLayout>
    </>
  )
}
