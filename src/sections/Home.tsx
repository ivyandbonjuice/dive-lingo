import { useMemo } from 'react'
import { Flame, Play, ChevronRight, CalendarDays, Waves, Hand, Keyboard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getStats } from '@/lib/srs'
import { warmUpSpeech } from '@/lib/speech'
import { LEVEL_LABEL, type Level } from '@/data/vocab'
import type { SessionMode } from '@/sections/Session'

const TRIP_DATE = new Date('2027-02-06T00:00:00')

function daysToTrip(): number {
  const now = new Date()
  const diff = TRIP_DATE.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.max(0, Math.round(diff / 86400000))
}

export default function Home({ onStart, onGoLibrary }: { onStart: (mode: SessionMode) => void; onGoLibrary: () => void }) {
  const stats = useMemo(() => getStats(), [])
  const days = daysToTrip()
  const levels: Level[] = ['OW', 'AOW', 'PHRASE']

  const start = (m: SessionMode) => {
    warmUpSpeech()
    onStart(m)
  }

  return (
    <div className="space-y-5">
      {/* greeting */}
      <header className="flex items-end justify-between pt-2">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Dive Lingo · 潜水英语</p>
          <h1 className="font-display text-3xl mt-1">今天也下水练一练</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 card-depth">
          <Flame className="h-4 w-4 text-coral" strokeWidth={2.4} />
          <span className="font-mono text-sm font-semibold">{stats.streak}</span>
          <span className="text-xs text-muted-foreground">天连击</span>
        </div>
      </header>

      {/* trip countdown — deep sea card */}
      <section className="relative overflow-hidden rounded-2xl text-primary-foreground card-depth"
        style={{ background: 'linear-gradient(160deg, hsl(191 78% 22%) 0%, hsl(205 58% 12%) 78%)' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{ backgroundImage: 'radial-gradient(circle at 78% 20%, white 1.5px, transparent 1.5px), radial-gradient(circle at 88% 42%, white 1px, transparent 1px), radial-gradient(circle at 68% 55%, white 1.2px, transparent 1.2px), radial-gradient(circle at 92% 72%, white 1px, transparent 1px)', backgroundSize: '140px 140px' }} />
        <div className="relative p-5">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.18em] uppercase opacity-80">
            <Waves className="h-3.5 w-3.5" />
            <span>2027 春节 · 泰国 AOW</span>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-display text-6xl leading-none tabular-nums">{days}</span>
            <span className="text-sm opacity-80">天后出发</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed opacity-75 max-w-[38ch]">
            每天 10 分钟,出发前你能把 {stats.byLevel.OW.total + stats.byLevel.AOW.total} 个 OW/AOW 核心词和 {stats.byLevel.PHRASE.total} 句实用表达全部拿下。
          </p>
        </div>
      </section>

      {/* today's session CTA */}
      <Card className="card-depth border-0">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">今日 10 分钟</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                待复习 <span className="font-mono font-semibold text-foreground">{stats.dueToday}</span> 词 · 今日还可学新词{' '}
                <span className="font-mono font-semibold text-foreground">{stats.newToday}</span> 个
              </p>
            </div>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </div>
          <button
            onClick={() => start('daily')}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-4 py-3.5 font-semibold text-coral-foreground transition-transform duration-150 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-current" />
            开始今日学习
          </button>
        </CardContent>
      </Card>

      {/* special drills */}
      <section className="space-y-3">
        <h2 className="font-semibold">专项训练</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => start('signals')}
            className="rounded-2xl bg-card p-4 text-left card-depth transition-transform hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Hand className="h-5 w-5" />
            </span>
            <p className="mt-2.5 font-semibold text-sm">手势专项闪卡</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">24 个水下手势,看中文想动作,考前集中过一遍</p>
          </button>
          <button
            onClick={() => start('dictation')}
            className="rounded-2xl bg-card p-4 text-left card-depth transition-transform hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral/10 text-coral">
              <Keyboard className="h-5 w-5" />
            </span>
            <p className="mt-2.5 font-semibold text-sm">听写模式</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">听发音拼单词,拼错的词自动排进复习</p>
          </button>
        </div>
      </section>

      {/* level progress */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">学习进度</h2>
          <button
            onClick={onGoLibrary}
            className="flex items-center gap-0.5 text-xs text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded cursor-pointer"
          >
            查看词库 <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {levels.map((lv) => {
          const s = stats.byLevel[lv]
          const pct = s.total ? Math.round((s.learned / s.total) * 100) : 0
          return (
            <Card key={lv} className="card-depth border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{LEVEL_LABEL[lv]}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {s.learned}/{s.total} · 掌握 {s.mastered}
                  </span>
                </div>
                <Progress value={pct} className="mt-2.5 h-1.5" />
              </CardContent>
            </Card>
          )
        })}
      </section>
    </div>
  )
}
