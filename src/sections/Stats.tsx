import { useMemo, useState } from 'react'
import { Flame, Trash2, TrendingUp, Volume2, AlertTriangle, ArrowLeftRight, Copy, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { getLogs, getStats, getWeakest, resetAll, exportProgress, importProgress, loadStore } from '@/lib/srs'
import { speakItem } from '@/lib/speech'
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

      {/* 最常错的词 */}
      {(() => {
        const weakest = getWeakest(5)
        if (weakest.length === 0) return null
        return (
          <section className="space-y-3">
            <h2 className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-coral" /> 最常错的词
            </h2>
            <Card className="card-depth border-0">
              <CardContent className="p-2">
                <ul className="divide-y divide-border/60">
                  {weakest.map(({ item, wrong }) => (
                    <li key={item.id} className="flex items-center gap-3 px-2.5 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{item.en}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{item.cn}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] text-coral">错 {wrong} 次</span>
                      <button onClick={() => speakItem(item)} aria-label={`播放 ${item.en} 发音`}
                        className="shrink-0 rounded-full p-2 text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="px-2.5 pb-2 pt-1 text-[11px] text-muted-foreground">去首页「弱词加练」可以集中攻克它们。</p>
              </CardContent>
            </Card>
          </section>
        )
      })()}

      {/* 备份与迁移 */}
      <BackupSection onImported={() => { setVersion((v) => v + 1); onReset() }} />

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


// ---------------- 备份与迁移 ----------------
function BackupSection({ onImported }: { onImported: () => void }) {
  const [copied, setCopied] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  async function doExport() {
    const text = exportProgress()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // 剪贴板不可用(部分浏览器需用户手势):退为展示文本手动复制
      setShowImport(false)
      window.prompt('手动复制以下迁移码:', text)
    }
  }

  function doImport() {
    const err = importProgress(code)
    if (err) { setError(err); setConfirming(false); return }
    setShowImport(false)
    setCode('')
    setError(null)
    setConfirming(false)
    onImported()
  }

  return (
    <section className="space-y-3">
      <h2 className="font-semibold flex items-center gap-1.5">
        <ArrowLeftRight className="h-4 w-4 text-primary" /> 备份与迁移
      </h2>
      <Card className="card-depth border-0">
        <CardContent className="p-4 space-y-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            进度只保存在本设备浏览器里,手机和电脑互不共享。换设备时:在这里导出迁移码 → 微信「文件传输助手」发给自己 → 另一台设备打开本站粘贴导入。
          </p>
          <div className="rounded-lg bg-secondary/50 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            本机进度:<span className="font-mono text-foreground">{Object.keys(loadStore().cards).length}</span> 个词条 · 最近学习 <span className="font-mono text-foreground">{loadStore().lastStudyDay ?? '—'}</span>
            <br />如果这个数字每次打开都回到同一天,说明你可能在重复使用旧的迁移链接进入,或浏览器(如微信内置浏览器)清除了本地数据——请改用系统浏览器打开本站并添加到主屏幕。
          </div>
          <div className="flex gap-2.5">
            <button onClick={doExport}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? '迁移码已复制' : '导出迁移码'}
            </button>
            <button onClick={() => { setShowImport((s) => !s); setError(null) }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
              导入迁移码
            </button>
          </div>
          {showImport && (
            <div className="space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <Textarea
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(null) }}
                placeholder="粘贴另一台设备导出的迁移码…"
                className="min-h-[90px] rounded-xl text-xs font-mono"
              />
              {error && <p className="text-xs text-coral">{error}</p>}
              <AlertDialog open={confirming} onOpenChange={setConfirming}>
                <AlertDialogTrigger asChild>
                  <button disabled={!code.trim()}
                    className="w-full rounded-xl bg-coral px-4 py-2.5 text-sm font-semibold text-coral-foreground transition-transform hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                    导入并覆盖本机进度
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>覆盖本机进度?</AlertDialogTitle>
                    <AlertDialogDescription>
                      导入后,本设备现有的学习记录会被迁移码里的进度完全替换,此操作无法撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={doImport}>
                      确认覆盖导入
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
