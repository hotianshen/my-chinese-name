import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'zh'
interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
}
const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en'
    // English is the default (phase-1 audience); a saved choice overrides it.
    const saved = localStorage.getItem('mcn-lang') as Lang | null
    return saved ?? 'en'
  })
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('mcn-lang', l)
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en'
  }, [])
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)

/**
 * Translation hook. Copy lives next to its usage:
 *   const t = useT(); t('Hello', '你好')
 * — which guarantees no missing keys and keeps bilingual copy in sync.
 */
export function useT() {
  const { lang } = useLang()
  return useCallback((en: string, zh: string) => (lang === 'zh' ? zh : en), [lang])
}
