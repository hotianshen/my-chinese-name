// Pronunciation helpers for the Dossier's tone & sound guide.
export interface ToneInfo { mark: string; nameEn: string; nameZh: string; contourEn: string; contourZh: string }

const TONES: Record<number, ToneInfo> = {
  1: { mark: 'ˉ', nameEn: 'First tone', nameZh: '阴平', contourEn: 'high and level — held steady, like singing one note', contourZh: '高而平，如持一音' },
  2: { mark: 'ˊ', nameEn: 'Second tone', nameZh: '阳平', contourEn: 'rising — lifts upward, as if asking a question', contourZh: '由中而升，如发问' },
  3: { mark: 'ˇ', nameEn: 'Third tone', nameZh: '上声', contourEn: 'dipping — falls low, then rises again', contourZh: '先降后升，低回而起' },
  4: { mark: 'ˋ', nameEn: 'Fourth tone', nameZh: '去声', contourEn: 'falling — drops sharply, like a firm command', contourZh: '由高骤降，斩截有力' },
  0: { mark: '·', nameEn: 'Neutral tone', nameZh: '轻声', contourEn: 'light and short — said quickly, without stress', contourZh: '轻短无重音' },
}
export function toneInfo(tone: number): ToneInfo {
  return TONES[tone] ?? TONES[0]
}
