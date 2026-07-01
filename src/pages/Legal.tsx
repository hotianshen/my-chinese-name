import type { ReactNode } from 'react'
import { Container, Eyebrow } from '../components/ui'
import { useT } from '../i18n'

const UPDATED = 'July 2026'

function LegalLayout({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  const t = useT()
  return (
    <section className="section">
      <Container reading>
        <Eyebrow className="mb-md">{eyebrow}</Eyebrow>
        <h1 className="text-display-1 mb-sm">{title}</h1>
        <p className="text-caption text-ink-300 mb-2xl">{t('Last updated', '最后更新')}: {UPDATED}</p>
        <div className="space-y-xl">{children}</div>
        <p className="text-caption text-ink-300 mt-3xl pt-lg" style={{ borderTop: '1px solid var(--line-soft)' }}>
          {t(
            'This is a good-faith general template and not legal advice. Have it reviewed by a qualified professional before you rely on it.',
            '此为善意通用范本，不构成法律意见。正式采用前，请交由专业人士审阅。',
          )}
        </p>
      </Container>
    </section>
  )
}

function Clause({ h, children }: { h: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-heading-3 mb-sm">{h}</h2>
      <div className="text-ink-500 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

export function Terms() {
  const t = useT()
  return (
    <LegalLayout eyebrow="TERMS OF SERVICE · 服务条款" title={t('Terms of Service', '服务条款')}>
      <Clause h={t('1. The service', '一、服务内容')}>
        <p>{t('My Chinese Name offers Chinese-name suggestions and related digital products, built on the Ho Method. Names are cultural and advisory. They are your everyday and professional name — they are not a substitute for the official transliteration required on government identity documents, which follow your local authority’s rules.', '「我有嘉名」依何氏之法，提供中文名字建议及相关数字产品。所取之名属文化与建议性质，为你的日常与职业用名；并非官方身份证件所需之法定音译（后者须遵循当地规定）。')}</p>
      </Clause>
      <Clause h={t('2. Free tool & paid products', '二、免费工具与付费产品')}>
        <p>{t('The Name Finder is free. Paid products (the Name Dossier, the Master’s Name, Brand & Bearer) are delivered digitally after payment through our payment provider. Prices are shown in USD; applicable taxes are handled at checkout.', '「寻名」工具免费。付费产品（名册、大师之名、商名）经支付后以数字方式交付。价格以美元计，相关税费于结账时处理。')}</p>
      </Clause>
      <Clause h={t('3. Intellectual property', '三、知识产权')}>
        <p>{t('The Ho Method, the site’s text, design, and software are ours. The Chinese name we craft for you is yours to use freely, personally and commercially. You may not resell or redistribute our tool, content, or methodology as your own.', '何氏之法及本站文字、设计与软件之权利归我们所有。我们为你所取之中文名，你可自由使用于个人及商业用途。你不得将我们的工具、内容或方法据为己有而转售或再分发。')}</p>
      </Clause>
      <Clause h={t('4. Disclaimers', '四、免责声明')}>
        <p>{t('Names are thoughtful suggestions, not guarantees. We cannot warrant that a name is unique, unregistered as a trademark, or free of every possible association across all Chinese dialects and contexts. For business or brand use, seek professional trademark clearance.', '所取之名为用心的建议，而非保证。我们无法确保某一名字独一无二、未被注册为商标，或在所有汉语方言与语境中皆无任何联想。用于商业或品牌者，请另行专业商标检索。')}</p>
      </Clause>
      <Clause h={t('5. Limitation of liability', '五、责任限制')}>
        <p>{t('To the extent permitted by law, our liability for any claim relating to the service is limited to the amount you paid us for it. We are not liable for indirect or consequential losses.', '在法律允许的范围内，我们就与本服务相关之任何主张所负责任，以你就该服务向我们支付之金额为限。我们不对间接或后果性损失负责。')}</p>
      </Clause>
      <Clause h={t('6. Contact', '六、联系')}>
        <p>{t('Questions about these terms: hello@mychinese.name.', '关于本条款的疑问：hello@mychinese.name。')}</p>
      </Clause>
    </LegalLayout>
  )
}

export function Privacy() {
  const t = useT()
  return (
    <LegalLayout eyebrow="PRIVACY POLICY · 隐私政策" title={t('Privacy Policy', '隐私政策')}>
      <Clause h={t('What we collect', '我们收集什么')}>
        <p>{t('The name and preferences you enter into the tool; your email address, if you choose to give it; and basic, privacy-respecting analytics about how the site is used. Your generated result and settings are stored locally in your own browser.', '你在工具中输入的名字与偏好；你若选择提供的电子邮箱；以及关于网站使用情况的、尊重隐私的基础分析。你所生成的结果与设置，存储于你自己的浏览器本地。')}</p>
      </Clause>
      <Clause h={t('How we use it', '我们如何使用')}>
        <p>{t('To deliver your names and any product you purchase; to send emails you have opted into (which you can leave at any time); and to improve the service. We do not sell your personal data.', '用于交付你的名字及你所购买的产品；发送你已订阅的邮件（你可随时退订）；并改进服务。我们不出售你的个人数据。')}</p>
      </Clause>
      <Clause h={t('Who we share it with', '我们与谁共享')}>
        <p>{t('Only the processors that run the service — our payment provider (for purchases) and our email provider (for messages you opted into). They handle your data under their own privacy terms.', '仅限于运行本服务的处理方——支付服务商（用于购买）与邮件服务商（用于你已订阅的信息）。其依各自的隐私条款处理你的数据。')}</p>
      </Clause>
      <Clause h={t('Your rights', '你的权利')}>
        <p>{t('You may request access to, correction of, or deletion of your personal data, and you may unsubscribe from emails at any time. Write to hello@mychinese.name.', '你可请求访问、更正或删除你的个人数据，并可随时退订邮件。请致函 hello@mychinese.name。')}</p>
      </Clause>
      <Clause h={t('Cookies & local storage', 'Cookie 与本地存储')}>
        <p>{t('We use your browser’s local storage to remember your language, theme, and your generated result. These stay on your device; clearing your browser data removes them.', '我们使用浏览器的本地存储来记住你的语言、主题与生成结果。这些留存于你的设备；清除浏览器数据即可移除。')}</p>
      </Clause>
    </LegalLayout>
  )
}

export function Refunds() {
  const t = useT()
  return (
    <LegalLayout eyebrow="REFUND POLICY · 退款政策" title={t('Refund Policy', '退款政策')}>
      <Clause h={t('Our promise', '我们的承诺')}>
        <p>{t('Love your name, or your money back — within 14 days of purchase. If a digital product hasn’t landed right for you, tell us and we’ll make it right or refund you.', '心悦此名，否则自购买之日起十四日内全额退款。若某一数字产品未能令你满意，请告知我们，我们必设法弥补或为你退款。')}</p>
      </Clause>
      <Clause h={t('Crafted tiers', '亲制各档')}>
        <p>{t('For the Master’s Name and Brand & Bearer, we would rather revise the name until it is right — revisions are included. Refunds remain available within the 14-day window.', '至于大师之名与商名，我们更愿为你修订至满意——修订已含在内。十四日内仍可申请退款。')}</p>
      </Clause>
      <Clause h={t('Physical keepsakes', '实物纪念品')}>
        <p>{t('Made-to-order physical items (prints, seals) are produced individually; if one arrives damaged or flawed, we’ll replace it. Because they are personalised, they can’t be resold, so change-of-mind returns on physical goods aren’t always possible.', '定制实物（挂画、印章）皆按单单独制作；若到货破损或有瑕疵，我们予以更换。因其为个性化定制、无法转售，实物商品的「改变主意」退货未必总能受理。')}</p>
      </Clause>
      <Clause h={t('How to ask', '如何申请')}>
        <p>{t('Just write to hello@mychinese.name with your order details. We reply quickly and kindly.', '仅需致函 hello@mychinese.name 并附订单信息。我们必迅速而诚恳地回复。')}</p>
      </Clause>
    </LegalLayout>
  )
}
