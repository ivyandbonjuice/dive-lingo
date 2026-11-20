// 音频优先:词条与例句的发音是打包进站点的预生成 m4a,任何手机浏览器都能播;
// 语音合成(speechSynthesis)仅作为音频缺失时的兜底。

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'
}

let cachedVoice: SpeechSynthesisVoice | null = null

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
  speechSynthesis.getVoices()
  speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null
    pickVoice()
  }
}

function speakFallback(text: string, rate: number) {
  if (!isSpeechSupported()) {
    window.dispatchEvent(new Event('divelingo:audio-failed'))
    return
  }
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

let currentAudio: HTMLAudioElement | null = null

/** 播放词条音频;预生成音频无变速版本,慢速用 playbackRate 实现 */
export function speakItem(item: { id: string; en: string; example?: string }, opts?: { slow?: boolean; example?: boolean }) {
  const useExample = !!opts?.example && !!item.example
  const src = `audio/${item.id}${useExample ? '_ex' : ''}.m4a`
  const fallbackText = useExample && item.example ? item.example : item.en
  playAudio(src, opts?.slow ? 0.6 : 1, () => speakFallback(fallbackText, opts?.slow ? 0.55 : 0.85))
}

function playAudio(src: string, rate: number, onError: () => void) {
  try {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }
    if (isSpeechSupported()) speechSynthesis.cancel()
    const a = new Audio(src)
    a.playbackRate = rate
    currentAudio = a
    const p = a.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => onError())
    }
    a.onerror = () => onError()
  } catch {
    onError()
  }
}

/** 兼容旧调用:纯文本合成 */
export function speak(text: string, rate = 0.85) {
  speakFallback(text, rate)
}

/** 在真实用户手势里预热(合成兜底路径需要) */
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

export function stopSpeak() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if (isSpeechSupported()) speechSynthesis.cancel()
}
