import { useState } from 'react'
import { VolumeX, X } from 'lucide-react'
import { isSpeechSupported } from '@/lib/speech'

/** 浏览器不支持语音合成时的提示条(典型场景:微信内置浏览器) */
export default function SpeechHint() {
  const [dismissed, setDismissed] = useState(false)
  if (isSpeechSupported() || dismissed) return null
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-left">
      <VolumeX className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <p className="flex-1 text-xs leading-relaxed text-foreground">
        当前浏览器无法播放发音(微信内置浏览器不支持)。
        请复制链接,改用 <span className="font-semibold">Safari(iPhone)</span> 或{' '}
        <span className="font-semibold">Chrome(安卓)</span> 打开,学习不受影响。
      </p>
      <button onClick={() => setDismissed(true)} aria-label="关闭提示"
        className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
