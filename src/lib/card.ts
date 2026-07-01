// Client-side share-card generator — the viral engine. Draws a beautiful,
// branded 1080×1080 name card on a canvas (no dependencies, system fonts so it
// works offline and everywhere). Returns a data URL (preview / download) and a
// Blob (native share). Each card is a billboard carrying the name + the URL.

export interface CardOpts {
  hanzi: string
  pinyin: string
  meaning: string
  fromName?: string
}

const PAPER = '#F5F0E6'
const INK = '#1C1B18'
const INK2 = '#57534A'
const GOLD = '#9A7B33'
const GOLD_LINE = '#D9BC7A'
const SEAL = '#C8341F'
const CREAM = '#FAF6EC'

const CJK = '"Songti SC","STSong","PingFang SC","Microsoft YaHei",serif'
const SERIF = 'Georgia,"Times New Roman",serif'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const x = cx - size / 2
  const y = cy - size / 2
  ctx.fillStyle = SEAL
  roundRect(ctx, x, y, size, size, size * 0.08)
  ctx.fill()
  // 我有嘉名 — 2×2, read right-to-left, top-to-bottom
  const chars = [['嘉', 0, 0], ['我', 1, 0], ['名', 0, 1], ['有', 1, 1]] as const
  const cell = size * 0.42
  const pad = size * 0.09
  ctx.fillStyle = CREAM
  ctx.font = `600 ${size * 0.33}px ${CJK}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const [ch, col, row] of chars) {
    ctx.fillText(ch, x + pad + cell * col + cell / 2, y + pad + cell * row + cell / 2)
  }
}

function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, ls: number) {
  // manual letter-spacing for reliability across browsers
  const chars = [...text]
  const widths = chars.map((c) => ctx.measureText(c).width + ls)
  const total = widths.reduce((a, b) => a + b, 0) - ls
  let cx = x - total / 2
  const prev = ctx.textAlign
  ctx.textAlign = 'left'
  chars.forEach((c, i) => {
    ctx.fillText(c, cx, y)
    cx += widths[i]
  })
  ctx.textAlign = prev
}

export async function makeNameCard(opts: CardOpts): Promise<{ dataUrl: string; blob: Blob | null }> {
  const S = 1080
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!

  // background + double gold frame
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, S, S)
  ctx.strokeStyle = GOLD_LINE
  ctx.lineWidth = 2
  ctx.strokeRect(44, 44, S - 88, S - 88)
  ctx.lineWidth = 1
  ctx.strokeRect(56, 56, S - 112, S - 112)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // eyebrow
  ctx.fillStyle = GOLD
  ctx.font = `600 22px ${SERIF}`
  spaced(ctx, 'THE HO METHOD · MY CHINESE NAME', S / 2, 150, 5)

  // "X's Chinese name"
  if (opts.fromName) {
    ctx.fillStyle = INK2
    ctx.font = `italic 40px ${SERIF}`
    ctx.fillText(`${opts.fromName}’s Chinese name`, S / 2, 250)
  }

  // the name (Han) — size by length
  const len = [...opts.hanzi].length
  const hSize = len <= 2 ? 260 : len === 3 ? 200 : len === 4 ? 150 : 120
  ctx.fillStyle = INK
  ctx.font = `600 ${hSize}px ${CJK}`
  ctx.textBaseline = 'middle'
  ctx.fillText(opts.hanzi, S / 2, opts.fromName ? 470 : 440)
  ctx.textBaseline = 'alphabetic'

  // pinyin
  ctx.fillStyle = INK2
  ctx.font = `54px ${SERIF}`
  ctx.fillText(opts.pinyin, S / 2, 640)

  // gold divider
  ctx.strokeStyle = GOLD_LINE
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(S / 2 - 60, 690)
  ctx.lineTo(S / 2 + 60, 690)
  ctx.stroke()

  // meaning (wrapped, up to 2 lines)
  ctx.fillStyle = INK2
  ctx.font = `italic 36px ${SERIF}`
  const words = opts.meaning.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > S - 260 && line) {
      lines.push(line)
      line = w
    } else line = test
  }
  if (line) lines.push(line)
  lines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, S / 2, 745 + i * 46))

  // seal
  drawSeal(ctx, S / 2, 890, 150)

  // footer CTA
  ctx.fillStyle = INK
  ctx.font = `600 30px ${SERIF}`
  spaced(ctx, 'GET YOUR OWN · MYCHINESE.NAME', S / 2, 1010, 3)

  const dataUrl = canvas.toDataURL('image/png')
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
  return { dataUrl, blob }
}
