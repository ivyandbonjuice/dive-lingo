import { useMemo, useState } from 'react'
import { Search, Volume2, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { VOCAB, CATEGORIES, LEVEL_LABEL, type Level } from '@/data/vocab'
import { getCardState } from '@/lib/srs'
import { speakItem } from '@/lib/speech'
import SpeechHint from '@/components/SpeechHint'

const LEVEL_FILTERS: Array<{ id: Level | 'ALL'; label: string }> = [
  { id: 'ALL', label: '全部' },
  { id: 'OW', label: 'OW 复习' },
  { id: 'AOW', label: 'AOW 预习' },
  { id: 'PHRASE', label: '实用表达' },
  { id: 'PLUS', label: '拓展包' },
]

export default function Library() {
  const [q, setQ] = useState('')
  const [level, setLevel] = useState<Level | 'ALL'>('ALL')
  const [cat, setCat] = useState<string>('ALL')
  const [openId, setOpenId] = useState<string | null>(null)

  const cats = useMemo(() => CATEGORIES.filter((c) => level === 'ALL' || c.level === level), [level])
  const list = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return VOCAB.filter((v) => {
      if (level !== 'ALL' && v.level !== level) return false
      if (cat !== 'ALL' && v.category !== cat) return false
      if (kw && !v.en.toLowerCase().includes(kw) && !v.cn.includes(kw)) return false
      return true
    })
  }, [q, level, cat])

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="font-display text-3xl">词库</h1>
        <p className="mt-1 text-sm text-muted-foreground">共 {VOCAB.length} 条 · OW 复习 + AOW 预习 + 泰国实用表达 + 高氧/自由潜/船宿拓展</p>
      </header>

      <SpeechHint />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索英文或中文…" className="pl-9 h-11 rounded-xl bg-card border-0 card-depth" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {LEVEL_FILTERS.map((f) => (
          <Chip key={f.id} active={level === f.id} onClick={() => { setLevel(f.id); setCat('ALL') }}>{f.label}</Chip>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <Chip active={cat === 'ALL'} onClick={() => setCat('ALL')}>全部分类</Chip>
        {cats.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</Chip>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{list.length} 条结果</p>

      <ul className="space-y-2">
        {list.map((v) => {
          const st = getCardState(v.id)
          const box = st?.box ?? 0
          const open = openId === v.id
          return (
            <li key={v.id} className="rounded-xl bg-card card-depth overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : v.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{v.en}</p>
                  <p className="truncate text-xs text-muted-foreground">{v.cn}</p>
                </div>
                <Dots box={box} />
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <div className="border-t border-border/60 px-4 py-3 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground">{LEVEL_LABEL[v.level]}</span>
                    <button onClick={() => speakItem(v)} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-primary hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                      <Volume2 className="h-3.5 w-3.5" /> 发音
                    </button>
                  </div>
                  {v.phonetic && <p className="font-mono text-xs text-muted-foreground">{v.phonetic}</p>}
                  {v.note && <p className="text-xs text-muted-foreground leading-relaxed">{v.note}</p>}
                  {v.example && (
                    <div className="rounded-lg bg-secondary/50 px-3 py-2">
                      <p className="text-sm">{v.example}</p>
                      {v.exampleCn && <p className="mt-0.5 text-xs text-muted-foreground">{v.exampleCn}</p>}
                    </div>
                  )}
                  {st && (
                    <p className="text-[11px] text-muted-foreground">
                      见过 {st.seen} 次 · 记住 {st.right} 次 · 不熟 {st.wrong} 次 · 下次复习 {st.due}
                    </p>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {list.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">没有找到相关词条,换个关键词试试</p>
      )}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
        active ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground card-depth'
      }`}
    >
      {children}
    </button>
  )
}

function Dots({ box }: { box: number }) {
  return (
    <span className="flex shrink-0 gap-1" aria-label={`熟练度 ${box}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= box ? (i >= 4 ? 'bg-success' : 'bg-primary') : 'bg-border'}`} />
      ))}
    </span>
  )
}
