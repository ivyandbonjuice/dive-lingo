import { useMemo, useState } from 'react'
import { Flame, Play, ChevronRight, CalendarDays, Waves, Hand, Keyboard, Share2, Users, Copy, Check, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { getStats } from '@/lib/srs'
import { warmUpSpeech } from '@/lib/speech'
import { encodeCard, getBuddies, removeBuddy, getSavedNick, saveNick, SITE_URL, type Buddy } from '@/lib/buddy'
import { LEVEL_LABEL, type Level } from '@/data/vocab'
import type { SessionMode } from '@/sections/Session'

const TRIP_DATE = new Date('2027-02-06T00:00:00')

function daysToTrip(): number {
  const now = new Date()
  const diff = TRIP_DATE.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.max(0, Math.round(diff / 86400000))
}

const SHARE_TEXT = `我在用「潜水英语」备战泰国 AOW,每天 10 分钟记潜水英语,一起来练:${SITE_URL}(iPhone 用 Safari、安卓用 Chrome 打开,可以听到发音)`

async function shareOrCopy(text: string): Promise<'shared' | 'copied'> {
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch {
      /* 用户取消,落到复制 */
    }
  }
  await navigator.clipboard.writeText(text)
  return 'copied'
}

export default function Home({ onStart, onGoLibrary }: { onStart: (mode: SessionMode) => void; onGoLibrary: () => void }) {
  const stats = useMemo(() => getStats(), [])
  const days = daysToTrip()
  const levels: Level[] = ['OW', 'AOW', 'PHRASE', 'PLUS']

  const [nick, setNick] = useState(getSavedNick())
  const [copied, setCopied] = useState<'page' | 'card' | null>(null)
  const [buddies, setBuddies] = useState<Buddy[]>(getBuddies())

  const start = (m: SessionMode) => {
    warmUpSpeech()
    onStart(m)
  }

  async function sharePage() {
    const r = await shareOrCopy(SHARE_TEXT)
    if (r === 'copied') {
      setCopied('page')
      setTimeout(() => setCopied(null), 2000)
    }
  }

  async function shareCard() {
    saveNick(nick)
    const url = `${SITE_URL}#buddy=${encodeCard(nick)}`
    const text = `我是${nick || '你的潜伴'},这是我的潜水英语进度名片,点开后选「添加为潜伴」,我们就能看到彼此的进度了:${url}`
    const r = await shareOrCopy(text)
    if (r === 'copied') {
      setCopied('card')
      setTimeout(() => setCopied(null), 2000)
    }
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
            每天 10 分钟,出发前你能把 {stats.byLevel.OW.total + stats.byLevel.AOW.total} 个 OW/AOW 核心词和 {stats.byLevel.PHRASE.total} 句实用表达全部拿下,还有 {stats.byLevel.PLUS.total} 个高氧/自由潜/船宿拓展词。
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

      {/* share & buddies */}
      <section className="space-y-3">
        <h2 className="font-semibold">和潜伴一起练</h2>
        <Card className="card-depth border-0">
          <CardContent className="p-4 space-y-3">
            <button
              onClick={sharePage}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
            >
              {copied === 'page' ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied === 'page' ? '链接已复制,去粘贴给潜伴' : '分享给潜伴(不含我的进度)'}
            </button>

            <div className="rounded-xl bg-secondary/50 p-3.5 space-y-2.5">
              <p className="text-xs font-medium flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                想互相监督?发一张「进度名片」
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                名片只包含昵称和进度数字(连击天数、已学词数),不含学习明细;对方点开后主动选择「添加为潜伴」才能看到。
              </p>
              <div className="flex gap-2">
                <Input
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  placeholder="你的昵称"
                  maxLength={12}
                  className="h-10 rounded-lg bg-card border-0 text-sm"
                />
                <button
                  onClick={shareCard}
                  className="shrink-0 flex items-center gap-1.5 rounded-lg bg-card px-3.5 text-xs font-semibold text-primary hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  {copied === 'card' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === 'card' ? '已复制' : '生成名片'}
                </button>
              </div>
            </div>

            {buddies.length > 0 && (
              <ul className="space-y-2 pt-1">
                {buddies.map((b) => (
                  <li key={b.id} className="flex items-center gap-3 rounded-xl bg-secondary/40 px-3.5 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-display text-sm">
                      {b.n.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{b.n}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        连击 {b.s} 天 · 已学 {b.l} · 掌握 {b.m} · 名片 {b.t.slice(5)}
                      </p>
                    </div>
                    <button
                      onClick={() => setBuddies(removeBuddy(b.id))}
                      aria-label={`移除潜伴 ${b.n}`}
                      className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
