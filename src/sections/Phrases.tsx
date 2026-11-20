import { Volume2, MessageCircle, Ship, Siren } from 'lucide-react'
import { VOCAB } from '@/data/vocab'
import { speak } from '@/lib/speech'
import SpeechHint from '@/components/SpeechHint'

const GROUPS = [
  { id: 'phrase-course', title: '课程沟通', blurb: '报到、租装备、确认计划——开口第一句', icon: MessageCircle },
  { id: 'phrase-boat', title: '船上日常', blurb: '出海当天高频对话', icon: Ship },
  { id: 'phrase-emergency', title: '紧急状况', blurb: '关键时刻必须脱口而出', icon: Siren },
]

export default function Phrases() {
  return (
    <div className="space-y-6">
      <header className="pt-2">
        <h1 className="font-display text-3xl">实用表达</h1>
        <p className="mt-1 text-sm text-muted-foreground">点喇叭跟读,练到不看中文也能脱口而出</p>
      </header>

      <SpeechHint />

      {GROUPS.map((g) => {
        const items = VOCAB.filter((v) => v.category === g.id)
        const Icon = g.icon
        return (
          <section key={g.id} className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${g.id === 'phrase-emergency' ? 'bg-coral/10 text-coral' : 'bg-primary/10 text-primary'}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-semibold leading-tight">{g.title}</h2>
                <p className="text-[11px] text-muted-foreground">{g.blurb}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {items.map((v, i) => (
                <li key={v.id} className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 card-depth">
                  <span className="font-mono text-[10px] text-muted-foreground w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{v.en}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{v.cn}</p>
                    {v.note && <p className="mt-1 text-[11px] text-primary/80">{v.note}</p>}
                  </div>
                  <button onClick={() => speak(v.en)} aria-label={`朗读:${v.en}`}
                    className="shrink-0 rounded-full bg-secondary p-2.5 text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                    <Volume2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
