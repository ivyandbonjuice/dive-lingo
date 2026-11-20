import { useMemo, useState } from 'react'
import { Flame, Trash2, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { getLogs, getStats, resetAll } from '@/lib/srs'
import { CATEGORIES, VOCAB } from '@/data/vocab'

export default function Stats({ onReset }: { onReset: () => void }) {
  const [version, setVersion] = useState(0)
  const stats = useMemo(() => getStats(), [version])
  const logs = useMemo(() => getLogs(), [version])

  const days = useMemo(() => {
    const arr: Array<{ date: string; reviewed: number }> = []
    const map = new Map(logs.map((l) => [l.date, l.reviewed]))
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      arr.push({ date: key, reviewed: map.get(key) ?? 0 })
    }
    return arr
  }, [logs])
  const maxReviewed = Math.max(1, ...days.map((d) => d.reviewed))

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <h1 className="font-display text-3xl">潜水日志</h1>
        <p className="mt-1 text-sm text-muted-foreground">你的每一次 10 分钟,都记在这里</p>
      </header>

      <div className="grid grid-cols-3 gap-2.5">
        <StatCard icon={<Flame className="h-4 w-4 text-coral" />} label="连续天数" value={String(stats.streak)} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-primary" />} label="已学词条" value={`${stats.learned}`} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-success" />} label="牢固掌握" value={`${stats.mastered}`} />
      </div>

      <Card className="card-depth border-0">
        <CardContent className="p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">近 14 天</h2>
            <span className="font-mono text-xs text-muted-foreground">
              测验正确率 {stats.quizAccuracy === null ? '—' : `${Math.round(stats.quizAccuracy * 100)}%`}
            </span>
          </div>
          <div className="mt-4 flex h-24 items-end gap-1.5">
            {days.map((d, i) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date} · ${d.reviewed} 词`}>
                <div
                  className={`w-full rounded-sm transition-all ${i === days.length - 1 ? 'bg-coral' : 'bg-primary/70'}`}
                  style={{ height: `${(d.reviewed / maxReviewed) * 100}%`, minHeight: d.reviewed > 0 ? '4px' : '2px', opacity: d.reviewed ? 1 : 0.25 }}
                />
                {(i % 2 === 0 || i === days.length - 1) && (
                  <span className="font-mono text-[9px] text-muted-foreground">{d.date.slice(5)}</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="font-semibold">分类掌握度</h2>
        {CATEGORIES.map((c) => {
          const items = VOCAB.filter((v) => v.category === c.id)
          return <CategoryRow key={c.id} label={c.label} ids={items.map((i) => i.id)} />
        })}
      </section>

      <div className="pt-2 pb-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
              <Trash2 className="h-4 w-4" /> 重置全部学习进度
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确定要重置吗?</AlertDialogTitle>
              <AlertDialogDescription>所有词条的熟练度、连续天数和日志都会被清空,此操作无法撤销。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => { resetAll(); setVersion((v) => v + 1); onReset() }}
              >
                确认重置
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          学习数据保存在本浏览器 localStorage 中,清除浏览器数据会丢失进度。
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="card-depth border-0">
      <CardContent className="p-3.5 text-center">
        <div className="flex justify-center">{icon}</div>
        <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums">{value}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

import { getCardState } from '@/lib/srs'

function CategoryRow({ label, ids }: { label: string; ids: string[] }) {
  let learned = 0
  let mastered = 0
  for (const id of ids) {
    const st = getCardState(id)
    if (st && st.box >= 1) learned++
    if (st && st.box >= 4) mastered++
  }
  const pct = ids.length ? Math.round((learned / ids.length) * 100) : 0
  return (
    <Card className="card-depth border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="font-mono text-xs text-muted-foreground">{learned}/{ids.length} · 掌握 {mastered}</span>
        </div>
        <Progress value={pct} className="mt-2.5 h-1.5" />
      </CardContent>
    </Card>
  )
}
