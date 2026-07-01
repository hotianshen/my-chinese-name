import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { Container, Eyebrow } from '../components/ui'
import { Seal } from '../components/Seal'
import { THEMES, PROFESSIONS, NATIVE_LANGUAGES } from '../engine/data'
import { generateNames } from '../engine/generate'
import type { Gender, Intake } from '../engine/types'
import { saveResult, track } from '../lib/store'
import { useT } from '../i18n'
import { cn } from '../lib/cn'

const STEP_META = [
  { stepZh: '定其道', stepEn: 'Set the Way' },
  { stepZh: '知其人', stepEn: 'Know the Person' },
  { stepZh: '明其愿', stepEn: 'Clarify Wishes' },
  { stepZh: '铸其根', stepEn: 'Forge the Roots' },
]

export function Finder() {
  const t = useT()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)

  const [form, setForm] = useState<Intake>({
    givenName: '', surname: '', middleName: '', gender: 'neutral',
    themes: [], qualities: '', profession: '', takeSurname: true,
    surnameStrategy: 'sound', nativeLanguage: 'English', avoid: '',
    nameLength: 'auto', personality: [], useContext: 'daily',
    cultureAffinity: '', soundCloseness: 'moderate',
  })
  const set = (patch: Partial<Intake>) => setForm((f) => ({ ...f, ...patch }))

  const canNext = useMemo(() => {
    if (step === 0) return form.givenName.trim().length >= 1
    if (step === 2) return form.themes.length >= 1
    return true
  }, [step, form])

  const toggleTheme = (key: string) => {
    setForm((f) => {
      const has = f.themes.includes(key)
      if (has) return { ...f, themes: f.themes.filter((x) => x !== key) }
      if (f.themes.length >= 3) return f
      return { ...f, themes: [...f.themes, key] }
    })
  }
  const togglePersonality = (key: string) => {
    setForm((f) => {
      const list = f.personality || []
      const has = list.includes(key)
      if (has) return { ...f, personality: list.filter((x) => x !== key) }
      if (list.length >= 3) return f
      return { ...f, personality: [...list, key] }
    })
  }

  const finish = () => {
    setBusy(true)
    track('finder_submit', { givenName: form.givenName, themes: form.themes })
    // a brief, dignified pause — the seal "settling"
    setTimeout(() => {
      const result = generateNames(form)
      saveResult(result)
      nav('/result')
    }, 1100)
  }

  return (
    <section className="section min-h-[80vh]">
      <Container reading>
        {/* progress */}
        <div className="flex items-center justify-center gap-2 mb-2xl">
          {STEP_META.map((_, i) => (
            <div key={i} className="h-1 rounded-full transition-all duration-500"
              style={{ width: i === step ? 40 : 20, background: i <= step ? 'var(--seal-500)' : 'var(--line-mid)' }} />
          ))}
        </div>

        <div className="text-center mb-2xl">
          <Eyebrow>{t(`STEP ${step + 1} · ${STEP_META[step].stepEn}`, `第${'一二三四'[step]}步 · ${STEP_META[step].stepZh}`)}</Eyebrow>
        </div>

        {busy ? (
          <div className="text-center py-3xl">
            <div className="flex justify-center mb-xl animate-breathe"><Seal size={88} /></div>
            <div className="flex items-center justify-center gap-3 text-ink-500">
              <Loader2 className="animate-spin" size={18} />
              <span className="font-display text-xl">{t('Weaving your name…', '正在为你织名……')}</span>
            </div>
            <p className="text-caption text-ink-300 mt-md">{t('Reading sound, meaning, form, and roots across twelve palaces.', '于十二宫间，审其声、义、形、脉。')}</p>
          </div>
        ) : (
          <div className="min-h-[320px]">
            {step === 0 && <StepName form={form} set={set} />}
            {step === 1 && <StepPerson form={form} set={set} />}
            {step === 2 && <StepWishes form={form} toggleTheme={toggleTheme} togglePersonality={togglePersonality} set={set} />}
            {step === 3 && <StepRoots form={form} set={set} />}
          </div>
        )}

        {!busy && (
          <div className="flex items-center justify-between mt-2xl">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={cn('btn-ghost', step === 0 && 'invisible')}
            >
              <ArrowLeft size={16} /> {t('Back', '上一步')}
            </button>
            {step < 3 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="btn-seal">
                {t('Continue', '继续')} <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={finish} disabled={!canNext} className="btn-seal">
                {t('Reveal my names', '揭晓我的名字')} <Check size={16} />
              </button>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}

// —————————————————————————————————————————————— steps

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block mb-xl">
      <span className="block font-display text-lg text-ink-900 mb-1">{label}</span>
      {hint && <span className="block text-caption text-ink-300 mb-md">{hint}</span>}
      {children}
    </label>
  )
}

const inputCls = 'w-full bg-paper-100 border rounded-card px-md py-3 text-ink-900 text-[1.05rem] outline-none transition-colors focus:border-gold-500'

function StepName({ form, set }: { form: Intake; set: (p: Partial<Intake>) => void }) {
  const t = useT()
  return (
    <div>
      <h1 className="text-display-2 text-center mb-2xl text-balance">{t('What name do you carry now?', '你如今承用何名？')}</h1>
      <Field label={t('First / given name', '名（first name）')} hint={t('The name you most go by. This anchors the sound.', '你最常用的名字。此为声音之锚。')}>
        <input className={inputCls} value={form.givenName} onChange={(e) => set({ givenName: e.target.value })} placeholder="Sophia" autoFocus />
      </Field>
      <div className="grid sm:grid-cols-2 gap-lg">
        <Field label={t('Surname', '姓（surname）')} hint={t('Optional — used to choose a Chinese surname.', '可选——用以择取中文姓氏。')}>
          <input className={inputCls} value={form.surname} onChange={(e) => set({ surname: e.target.value })} placeholder="Anderson" />
        </Field>
        <Field label={t('Middle name', '中间名')} hint={t('Optional.', '可选。')}>
          <input className={inputCls} value={form.middleName} onChange={(e) => set({ middleName: e.target.value })} placeholder="—" />
        </Field>
      </div>
    </div>
  )
}

function StepPerson({ form, set }: { form: Intake; set: (p: Partial<Intake>) => void }) {
  const t = useT()
  const genders: { v: Gender; en: string; zh: string }[] = [
    { v: 'masc', en: 'Masculine', zh: '偏阳刚' },
    { v: 'fem', en: 'Feminine', zh: '偏阴柔' },
    { v: 'neutral', en: 'Neutral', zh: '中性' },
  ]
  return (
    <div>
      <h1 className="text-display-2 text-center mb-2xl text-balance">{t('How should the name read?', '名字应作何气韵？')}</h1>
      <Field label={t('Gender register', '气韵偏向')} hint={t('Chinese characters carry a subtle gender colour. This guides the choice.', '汉字自有微妙的性别色彩，此项引导取舍。')}>
        <div className="grid grid-cols-3 gap-md">
          {genders.map((g) => (
            <button key={g.v} onClick={() => set({ gender: g.v })}
              className={cn('py-4 rounded-card border transition-all text-center', form.gender === g.v ? 'border-seal-500 bg-seal-100' : 'border-[var(--line-mid)] hover:border-ink-300')}>
              <span className="block font-display text-lg text-ink-900">{t(g.en, g.zh)}</span>
            </button>
          ))}
        </div>
      </Field>
      <Field label={t('Your native language', '你的母语')} hint={t('We tune the sounds so the name is easy for you to say, too.', '我们会调适声音，使此名于你也易于诵读。')}>
        <select className={inputCls} value={form.nativeLanguage} onChange={(e) => set({ nativeLanguage: e.target.value })}>
          {NATIVE_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </Field>
      <Field label={t('Where will you use the name?', '你将在何处使用此名？')} hint={t('This shapes its register and bearing.', '此项塑造名字的气度与格调。')}>
        <select className={inputCls} value={form.useContext} onChange={(e) => set({ useContext: e.target.value })}>
          <option value="daily">{t('Daily life & friends', '日常与朋友')}</option>
          <option value="business">{t('Business & professional', '商务与职场')}</option>
          <option value="academic">{t('Academic & study', '学术与求学')}</option>
          <option value="social">{t('Social media & creating', '社媒与创作')}</option>
          <option value="longterm">{t('A long-term life in China', '在华长居')}</option>
        </select>
      </Field>
    </div>
  )
}

const TRAITS: { key: string; en: string; zh: string }[] = [
  { key: 'Outgoing', en: 'Outgoing', zh: '开朗' }, { key: 'Calm', en: 'Calm', zh: '沉静' },
  { key: 'Creative', en: 'Creative', zh: '富创造' }, { key: 'Kind', en: 'Kind', zh: '仁厚' },
  { key: 'Ambitious', en: 'Ambitious', zh: '有抱负' }, { key: 'Elegant', en: 'Elegant', zh: '优雅' },
  { key: 'Brave', en: 'Brave', zh: '勇敢' }, { key: 'Intellectual', en: 'Intellectual', zh: '好学思' },
  { key: 'Gentle', en: 'Gentle', zh: '温和' }, { key: 'Humorous', en: 'Humorous', zh: '幽默' },
]

function StepWishes({ form, toggleTheme, togglePersonality, set }: { form: Intake; toggleTheme: (k: string) => void; togglePersonality: (k: string) => void; set: (p: Partial<Intake>) => void }) {
  const t = useT()
  return (
    <div>
      <h1 className="text-display-2 text-center mb-md text-balance">{t('What should the name carry?', '名中应承何意？')}</h1>
      <p className="text-center text-ink-500 mb-2xl">{t('Choose up to three. The meaning is the soul of the name.', '至多择其三。意，乃名之魂。')}</p>
      <div className="grid sm:grid-cols-3 gap-md mb-xl">
        {THEMES.map((th) => {
          const on = form.themes.includes(th.key)
          const disabled = !on && form.themes.length >= 3
          return (
            <button key={th.key} onClick={() => toggleTheme(th.key)} disabled={disabled}
              className={cn('p-lg rounded-card border text-left transition-all', on ? 'border-seal-500 bg-seal-100' : 'border-[var(--line-mid)] hover:border-ink-300', disabled && 'opacity-40')}>
              <div className="flex items-center justify-between mb-1">
                <span className="han text-2xl text-ink-900">{th.hanzi}</span>
                {on && <Check size={16} style={{ color: 'var(--seal-500)' }} />}
              </div>
              <span className="block font-display text-[1.05rem] text-ink-900">{t(th.label, th.label)}</span>
              <span className="block text-caption text-ink-300 mt-0.5">{th.blurb}</span>
            </button>
          )
        })}
      </div>
      <Field label={t('A few words for who you are', '几个词，描述你自己')} hint={t('Optional — choose up to three traits.', '可选——至多择其三。')}>
        <div className="flex flex-wrap gap-2">
          {TRAITS.map((tr) => {
            const on = (form.personality || []).includes(tr.key)
            return (
              <button key={tr.key} type="button" onClick={() => togglePersonality(tr.key)}
                className={cn('px-3.5 py-1.5 rounded-chip text-[0.92rem] border transition-all', on ? 'border-seal-500 bg-seal-100 text-seal-600' : 'border-[var(--line-mid)] text-ink-500 hover:border-ink-300')}>
                {t(tr.en, tr.zh)}
              </button>
            )
          })}
        </div>
      </Field>
      <Field label={t('Your field of work', '你的领域')} hint={t('Optional — some characters favour certain professions.', '可选——某些字更宜于特定行业。')}>
        <select className={inputCls} value={form.profession} onChange={(e) => set({ profession: e.target.value })}>
          {PROFESSIONS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
        </select>
      </Field>
    </div>
  )
}

function StepRoots({ form, set }: { form: Intake; set: (p: Partial<Intake>) => void }) {
  const t = useT()
  return (
    <div>
      <h1 className="text-display-2 text-center mb-2xl text-balance">{t('Roots and red lines', '根脉与红线')}</h1>
      <Field label={t('Take a Chinese surname?', '可要中文姓氏？')} hint={t('A surname gives you a place in the world of the characters.', '姓氏予你立身于汉字世界之地。')}>
        <div className="grid grid-cols-2 gap-md">
          {[{ v: true, en: 'Yes — give me roots', zh: '要——予我根脉' }, { v: false, en: 'No — given name only', zh: '不要——仅取名' }].map((o) => (
            <button key={String(o.v)} onClick={() => set({ takeSurname: o.v })}
              className={cn('py-4 rounded-card border transition-all', form.takeSurname === o.v ? 'border-seal-500 bg-seal-100' : 'border-[var(--line-mid)] hover:border-ink-300')}>
              <span className="font-display text-[1.05rem] text-ink-900">{t(o.en, o.zh)}</span>
            </button>
          ))}
        </div>
      </Field>
      {form.takeSurname && (
        <Field label={t('How should the surname be chosen?', '姓氏当如何择取？')}>
          <div className="grid grid-cols-2 gap-md">
            {[{ v: 'sound', en: 'By sound', zh: '依其声' }, { v: 'meaning', en: 'By meaning', zh: '依其义' }].map((o) => (
              <button key={o.v} onClick={() => set({ surnameStrategy: o.v as 'sound' | 'meaning' })}
                className={cn('py-3 rounded-card border transition-all', form.surnameStrategy === o.v ? 'border-seal-500 bg-seal-100' : 'border-[var(--line-mid)] hover:border-ink-300')}>
                <span className="font-display text-ink-900">{t(o.en, o.zh)}</span>
              </button>
            ))}
          </div>
        </Field>
      )}
      <Field label={t('Name length', '名字长度')} hint={t('Three characters (surname + two) is the classic Chinese form.', '三字（姓 + 二名）是最经典的中文名形式。')}>
        <select className={inputCls} value={form.nameLength} onChange={(e) => set({ nameLength: e.target.value as Intake['nameLength'] })}>
          <option value="auto">{t('Three characters (recommended)', '三字（推荐）')}</option>
          <option value="surname_plus_1">{t('Two characters (surname + one)', '两字（姓 + 一名）')}</option>
          <option value="surname_plus_2">{t('Three characters (surname + two)', '三字（姓 + 二名）')}</option>
        </select>
      </Field>
      <Field label={t('A word about yourself', '关于你自己')} hint={t('Optional — a quality you reach for, in your own words.', '可选——以你自己的话，写下你所追求的一种品质。')}>
        <input className={inputCls} value={form.qualities} onChange={(e) => set({ qualities: e.target.value })} placeholder={t('e.g. calm, far-seeing, kind', '例如：沉静、远见、仁厚')} />
      </Field>
      <Field label={t('Cultural leanings', '文化偏好')} hint={t('Optional — poetry, mountains, jade, modern business…', '可选——诗词、山水、美玉、现代商业……')}>
        <input className={inputCls} value={form.cultureAffinity} onChange={(e) => set({ cultureAffinity: e.target.value })} placeholder={t('e.g. classical poetry, rivers, quiet strength', '例如：古典诗词、江河、静水流深')} />
      </Field>
      <Field label={t('Birth year', '出生年份')} hint={t('Optional — unlocks a Five-Elements cultural note in your dossier. A cultural lens, not fortune-telling.', '可选——解锁名册中的五行文化注记。文化视角，非算命。')}>
        <input type="number" className={inputCls} value={form.birthYear ?? ''} min={1900} max={2100}
          onChange={(e) => set({ birthYear: e.target.value ? parseInt(e.target.value, 10) : undefined })} placeholder="1990" />
      </Field>
      <Field label={t('Anything to avoid?', '有何须回避？')} hint={t('Optional — characters or sounds you’d rather not have.', '可选——你不愿用的字或音。')}>
        <input className={inputCls} value={form.avoid} onChange={(e) => set({ avoid: e.target.value })} placeholder="—" />
      </Field>
    </div>
  )
}
