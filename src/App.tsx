import { useState } from 'react'
import { Compass, BookOpen, MessagesSquare, BarChart3 } from 'lucide-react'
import Home from '@/sections/Home'
import Session, { type SessionMode } from '@/sections/Session'
import Library from '@/sections/Library'
import Phrases from '@/sections/Phrases'
import Stats from '@/sections/Stats'

type Tab = 'home' | 'library' | 'phrases' | 'stats'

const TABS: Array<{ id: Tab; label: string; icon: typeof Compass }> = [
  { id: 'home', label: '今日', icon: Compass },
  { id: 'library', label: '词库', icon: BookOpen },
  { id: 'phrases', label: '表达', icon: MessagesSquare },
  { id: 'stats', label: '记录', icon: BarChart3 },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [sessionMode, setSessionMode] = useState<SessionMode | null>(null)
  const [homeKey, setHomeKey] = useState(0)

  if (sessionMode) {
    return (
      <div className="min-h-dvh px-4 py-4 md:px-6">
        <Session
          mode={sessionMode}
          onExit={() => {
            setSessionMode(null)
            setHomeKey((k) => k + 1)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-dvh">
      <main className="mx-auto w-full max-w-md px-4 pb-28 md:max-w-2xl md:px-6">
        {tab === 'home' && (
          <Home key={homeKey} onStart={(m) => setSessionMode(m)} onGoLibrary={() => setTab('library')} />
        )}
        {tab === 'library' && <Library />}
        {tab === 'phrases' && <Phrases />}
        {tab === 'stats' && <Stats onReset={() => setHomeKey((k) => k + 1)} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 px-4">
        <div className="mx-auto flex max-w-md items-center justify-around rounded-2xl bg-card/95 px-2 py-2 card-depth backdrop-blur border border-border/60">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-w-[64px] flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>{t.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
