import { Link } from 'react-router-dom'
import { Seal } from '../components/Seal'
import { useT } from '../i18n'

export function NotFound() {
  const t = useT()
  return (
    <div className="section container-reading text-center">
      <div className="flex justify-center mb-xl">
        <Seal size={72} />
      </div>
      <h1 className="text-display-1">404</h1>
      <p className="text-lede text-ink-500 mt-md">{t('This page has wandered off the path.', '此页已偏离正道。')}</p>
      <Link to="/" className="btn-seal mt-2xl">{t('Return home', '返回首页')}</Link>
    </div>
  )
}
