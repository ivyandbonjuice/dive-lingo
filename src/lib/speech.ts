let cachedVoice: SpeechSynthesisVoice | null = null

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice
  if (!isSpeechSupported()) return null
  const voices = speechSynthesis.getVoices()
  if (!voices.length) return null
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  cachedVoice =
    en.find((v) => /natural|neural|aria|samantha|google us english/i.test(v.name)) ??
    en.find((v) => v.lang === 'en-US') ??
    en[0] ??
    null
  return cachedVoice
}

if (isSpeechSupported()) {
  // 部分手机浏览器语音列表异步加载,先触发一次,变化后重新挑选
  speechSynthesis.getVoices()
  speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null
    pickVoice()
  }
}

/**
 * 在真实用户手势(点击)里调用一次,预热移动端语音引擎。
 * iOS Safari / 安卓 Chrome 都要求首次发声必须挂在手势调用链上。
 */
export function warmUpSpeech() {
  if (!isSpeechSupported()) return
  try {
    speechSynthesis.getVoices()
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    speechSynthesis.speak(u)
    speechSynthesis.cancel()
  } catch {
    /* ignore */
  }
}

export function speak(text: string, rate = 0.88) {
  if (!isSpeechSupported()) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  u.pitch = 1
  u.volume = 1
  const v = pickVoice()
  if (v) u.voice = v
  speechSynthesis.speak(u)
}

export function stopSpeak() {
  if (!isSpeechSupported()) return
  speechSynthesis.cancel()
}
