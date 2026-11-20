import { useEffect, useState } from 'react'
import { VolumeX, X } from 'lucide-react'

/** 音频加载失败且浏览器又不支持语音合成时出现的提示条 */
export default function SpeechHint() {
  const [failed, setFailed] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onFail = () => setFailed(true)
    window.addEventListener('divelingo:audio-failed', onFail)
    return () => window.removeEventListener('divelingo:audio-failed', onFail)
  }, [])

  if (!failed || dismissed) return null
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-left">
      <VolumeX className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <p className="flex-1 text-xs leading-relaxed text-foreground">
        发音没有加载成功。请检查网络后刷新页面;学习功能不受影响,只是暂时听不到发音。
      </p>
      <button onClick={() => setDismissed(true)} aria-label="关闭提示"
        className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
