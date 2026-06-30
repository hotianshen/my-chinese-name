// Pronounce a Chinese name using the browser's speech synthesis. Falls back
// silently where no Mandarin voice is installed (the Dossier ships real audio).
export function speakChinese(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 0.8
  const voices = window.speechSynthesis.getVoices()
  const zh = voices.find((v) => v.lang.toLowerCase().startsWith('zh'))
  if (zh) u.voice = zh
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
  return true
}
