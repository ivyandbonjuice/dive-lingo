import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Volume2, RotateCcw, Home as HomeIcon, Timer, Stamp, Turtle, CircleHelp, Zap, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  buildSessionQueue, buildSignalQueue, buildDictationQueue, buildWeakQueue, buildReviewQueue,
  buildSprintQueue, markKnown, getSettings,
  gradeCard, recordQuiz, getStats, acceptableAnswers, normalizeAnswer, type Grade,
} from '@/lib/srs'
import { speakItem, stopSpeak } from '@/lib/speech'
import { categoryLabel, LEVEL_LABEL, VOCAB, type VocabItem, type Level } from '@/data/vocab'
import SpeechHint from '@/components/SpeechHint'

export type SessionMode = 'daily' | 'signals' | 'dictation' | 'weak' | 'sprint'

export const MODE_META: Record<SessionMode, { title: string; endTitle: string }> = {
  daily: { title: '今日训练', endTitle: '本次潜水结束' },
  signals: { title: '手势专项闪卡', endTitle: '手势训练完成' },
  dictation: { title: '听写模式', endTitle: '听写结束' },
  weak: { title: '弱词加练', endTitle: '加练完成' },
  sprint: { title: '闪电过筛', endTitle: '过筛完成' },
}

interface Quiz {
  type: 'en2cn' | 'cn2en' | 'listen' | 'spell'
  item: VocabItem
  options: string[]
  answer: string
}
type Step =
  | { kind: 'flash'; item: VocabItem }
  | { kind: 'quiz'; quiz: Quiz }
  | { kind: 'dict'; item: VocabItem }
  | { kind: 'sprint'; item: VocabItem }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeQuiz(item: VocabItem): Quiz {
  // 长句子不适合反向中译英和拼写,只出释义和听力题
  const long = item.en.length > 24
  const diff = getSettings().difficulty
  let types: Quiz['type'][]
  if (diff === 'easy') {
    types = ['en2cn']
  } else if (diff === 'hard') {
    // 硬核:短词加入"看中文写英文"拼写题
    types = long ? ['en2cn', 'cn2en', 'listen'] : ['spell', 'spell', 'cn2en', 'listen']
  } else {
    types = long ? ['en2cn', 'listen'] : ['en2cn', 'cn2en', 'listen']
  }
  const type = types[Math.floor(Math.random() * types.length)]
  if (type === 'spell') {
    return { type, item, options: [], answer: item.en }
  }
  const pool = VOCAB.filter((v) => v.id !== item.id && v.level === item.level)
  const distract = shuffle(pool).slice(0, 3)
  if (type === 'en2cn') {
    return { type, item, options: shuffle([item.cn, ...distract.map((d) => d.cn)]), answer: item.cn }
  }
  return { type, item, options: shuffle([item.en, ...distract.map((d) => d.en)]), answer: item.en }
}

function buildSteps(queue: VocabItem[], mode: SessionMode): Step[] {
  if (mode === 'dictation') return queue.map((item) => ({ kind: 'dict', item }))
  if (mode === 'sprint') return queue.map((item) => ({ kind: 'sprint', item }))
  const steps: Step[] = []
  queue.forEach((item, i) => {
    steps.push({ kind: 'flash', item })
    if ((i + 1) % 5 === 0) {
      const recent = queue.slice(Math.max(0, i - 4), i + 1)
      steps.push({ kind: 'quiz', quiz: makeQuiz(recent[Math.floor(Math.random() * recent.length)]) })
    }
  })
  return steps
}

export default function Session({ mode, onExit }: { mode: SessionMode; onExit: () => void }) {
  const [runId, setRunId] = useState(0)
  const [extra, setExtra] = useState(false) // daily 学完后的加练:只复习不扣新词配额
  const [sprintScope, setSprintScope] = useState<Level | 'ALL' | null>(null)
  const sessionSeconds = getSettings().sessionMinutes * 60
  const queue = useMemo(() => {
    if (mode === 'signals') return buildSignalQueue()
    if (mode === 'dictation') return buildDictationQueue()
    if (mode === 'weak') return buildWeakQueue()
    if (mode === 'sprint') return sprintScope ? buildSprintQueue(sprintScope) : []
    return extra ? buildReviewQueue() : buildSessionQueue()
  }, [mode, runId, extra, sprintScope])
  const steps = useMemo(() => buildSteps(queue, mode), [queue, mode])
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)
  const [reviewed, setReviewed] = useState(0)
  const [rightCount, setRightCount] = useState(0)
  const advanceTimer = useRef<number | null>(null)
  const spokenStep = useRef(-1)

  const step = steps[idx]
  const timeUp = elapsed >= sessionSeconds
  const progress = steps.length ? (idx + (done ? 1 : 0)) / steps.length : 0
  const depth = Math.round(progress * 30)

  // timer
  useEffect(() => {
    if (done) return
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => window.clearInterval(t)
  }, [done])

  // speak on new steps
  useEffect(() => {
    if (!step || done) return
    if (spokenStep.current === idx) return
    spokenStep.current = idx
    if (step.kind === 'flash') speakItem(step.item)
    else if (step.kind === 'quiz' && step.quiz.type === 'listen') speakItem(step.quiz.item)
    else if (step.kind === 'dict') speakItem(step.item)
    else if (step.kind === 'sprint') speakItem(step.item)
  }, [idx, step, done])

  useEffect(() => () => {
    stopSpeak()
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
  }, [])

  function next() {
    setPicked(null)
    setRevealed(false)
    if (timeUp || idx + 1 >= steps.length) {
      stopSpeak()
      setDone(true)
    } else {
      setIdx((i) => i + 1)
    }
  }

  function grade(g: Grade) {
    if (!step || step.kind !== 'flash') return
    gradeCard(step.item.id, g)
    setReviewed((r) => r + 1)
    next()
  }

  function choose(opt: string) {
    if (!step || step.kind !== 'quiz' || picked) return
    const correct = opt === step.quiz.answer
    setPicked(opt)
    setReviewed((r) => r + 1)
    if (correct) setRightCount((r) => r + 1)
    recordQuiz(correct)
    if (!correct) speakItem(step.quiz.item)
    advanceTimer.current = window.setTimeout(next, correct ? 800 : 1600)
  }

  function finishDict(correct: boolean) {
    if (!step || step.kind !== 'dict') return
    gradeCard(step.item.id, correct ? 'good' : 'again')
    recordQuiz(correct)
    setReviewed((r) => r + 1)
    if (correct) setRightCount((r) => r + 1)
    next()
  }

  function restart(continueExtra = false) {
    setIdx(0)
    setRevealed(false)
    setPicked(null)
    setElapsed(0)
    setDone(false)
    setReviewed(0)
    setRightCount(0)
    spokenStep.current = -1
    if (mode === 'daily' && continueExtra) setExtra(true)
    if (mode === 'sprint') setSprintScope(null)
    setRunId((r) => r + 1)
  }

  function sprintMark(known: boolean) {
    if (!step || step.kind !== 'sprint') return
    if (known) markKnown(step.item.id)
    else gradeCard(step.item.id, 'fuzzy') // 排进近期复习
    setReviewed((r) => r + 1)
    next()
  }

  const remain = Math.max(0, sessionSeconds - elapsed)
  const mm = String(Math.floor(remain / 60)).padStart(2, '0')
  const ss = String(remain % 60).padStart(2, '0')

  // ---------------- sprint scope picker ----------------
  if (mode === 'sprint' && sprintScope === null) {
    const masteredCount = getStats().mastered
    const scopes: Array<{ id: Level | 'ALL'; label: string }> = [
      { id: 'ALL', label: '全部词库' },
      { id: 'OW', label: LEVEL_LABEL.OW },
      { id: 'AOW', label: LEVEL_LABEL.AOW },
      { id: 'PHRASE', label: LEVEL_LABEL.PHRASE },
      { id: 'PLUS', label: LEVEL_LABEL.PLUS },
    ]
    return (
      <div className="mx-auto max-w-md space-y-5 pt-6">
        <div className="rounded-2xl bg-card p-6 card-depth">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl">闪电过筛</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            有英文基础?选一个范围快速过一遍:已经会的词直接标为掌握跳过,不熟的词一键排进明天复习,不用跟着新词排队慢慢学。
          </p>
          <div className="mt-5 space-y-2.5">
            {scopes.map((sc) => {
              const n = buildSprintQueue(sc.id).length
              return (
                <button key={sc.id} onClick={() => setSprintScope(sc.id)} disabled={n === 0}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-secondary/50 disabled:opacity-40 disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                  <span>{sc.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{n === 0 ? '已全部掌握 🎉' : `待过筛 ${n} 词`}</span>
                </button>
              )
            })}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">共 {VOCAB.length} 词 · 已掌握 {masteredCount} 词</p>
        </div>
        <button onClick={onExit} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
          <HomeIcon className="h-4 w-4" /> 返回首页
        </button>
      </div>
    )
  }

  // ---------------- summary ----------------
  if (done || steps.length === 0) {
    const stats = getStats()
    const acc = reviewed ? Math.round((rightCount / reviewed) * 100) : null
    const emptyMsg = mode === 'weak'
      ? '还没有弱词记录,先去完成一次今日学习吧。'
      : mode === 'sprint'
        ? '这个范围的词都掌握啦,换个范围试试。'
        : '去首页开始今日学习,或去词库自由浏览。'
    return (
      <div className="mx-auto max-w-md space-y-5 pt-6">
        <div className="relative rounded-2xl bg-card p-6 card-depth overflow-hidden">
          <div className="stamp absolute right-4 top-4 rotate-[-10deg] rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-coral/80 flex items-center gap-1">
            <Stamp className="h-3 w-3" /> logged
          </div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">dive log · {new Date().toLocaleDateString('zh-CN')}</p>
          <h2 className="font-display text-3xl mt-2">{steps.length === 0 ? '暂无训练内容' : extra && mode === 'daily' ? '加练完成' : MODE_META[mode].endTitle}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {steps.length === 0 ? emptyMsg : '浮出水面,看看这一潜的收获。'}
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-secondary/60 py-3">
              <dt className="text-[11px] text-muted-foreground">{mode === 'dictation' ? '听写词数' : mode === 'sprint' ? '过筛词数' : '练习次数'}</dt>
              <dd className="font-mono text-2xl font-semibold mt-0.5">{reviewed}</dd>
            </div>
            <div className="rounded-xl bg-secondary/60 py-3">
              <dt className="text-[11px] text-muted-foreground">测验正确率</dt>
              <dd className="font-mono text-2xl font-semibold mt-0.5">{acc === null ? '—' : `${acc}%`}</dd>
            </div>
            <div className="rounded-xl bg-secondary/60 py-3">
              <dt className="text-[11px] text-muted-foreground">连续天数</dt>
              <dd className="font-mono text-2xl font-semibold mt-0.5">{stats.streak}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            用时 {Math.floor(elapsed / 60)} 分 {elapsed % 60} 秒 · 词库已掌握 {stats.mastered}/{VOCAB.length}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onExit} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
            <HomeIcon className="h-4 w-4" /> 返回首页
          </button>
          {steps.length > 0 && (
            <button onClick={() => restart(mode === 'daily')} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-coral px-4 py-3 font-semibold text-coral-foreground transition-transform hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
              <RotateCcw className="h-4 w-4" /> {mode === 'daily' ? (extra ? '再来一组' : '继续加练(不占新词)') : '再练一组'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ---------------- running ----------------
  return (
    <div className="mx-auto max-w-md">
      {/* top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 card-depth">
          <Timer className={`h-4 w-4 ${remain <= 60 ? 'text-coral' : 'text-primary'}`} />
          <span className="font-mono text-sm font-semibold tabular-nums">{mm}:{ss}</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">{MODE_META[mode].title} · {depth}m</span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button aria-label="结束本次学习" className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>提前结束这一潜?</AlertDialogTitle>
              <AlertDialogDescription>已完成的练习会保留进度,未练的词会留到明天。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>继续学习</AlertDialogCancel>
              <AlertDialogAction onClick={() => { stopSpeak(); setDone(true) }}>结束</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-4 space-y-4">
        <SpeechHint />
        <div>
          <div className="depth-strip relative h-2.5 rounded-full bg-secondary overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-300" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>0m</span><span>15m</span><span>30m</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        {step.kind === 'flash' && (
          <FlashCard item={step.item} revealed={revealed} onReveal={() => setRevealed(true)} onGrade={grade} isSignal={mode === 'signals'} />
        )}
        {step.kind === 'quiz' && step.quiz.type !== 'spell' && <QuizCard quiz={step.quiz} picked={picked} onPick={choose} />}
        {step.kind === 'quiz' && step.quiz.type === 'spell' && (
          <SpellCard key={step.quiz.item.id} item={step.quiz.item} onDone={(ok) => {
            setReviewed((r) => r + 1)
            if (ok) setRightCount((r) => r + 1)
            recordQuiz(ok)
            if (!ok) speakItem(step.quiz.item)
            next()
          }} />
        )}
        {step.kind === 'dict' && <DictCard key={step.item.id} item={step.item} onDone={finishDict} />}
        {step.kind === 'sprint' && <SprintCard item={step.item} onMark={sprintMark} />}
      </div>
    </div>
  )
}

// ---------------- flash card ----------------
function FlashCard({ item, revealed, onReveal, onGrade, isSignal }: { item: VocabItem; revealed: boolean; onReveal: () => void; onGrade: (g: Grade) => void; isSignal?: boolean }) {
  // 手势专项:盖住手势描述,先考"这个手势怎么做/什么意思"
  const prompt = isSignal ? item.cn.replace(/[(（]?手势[)）]?/g, '') : item.en
  const answer = isSignal ? item.en : item.cn
  return (
    <div className="space-y-4">
      <Card className="card-depth border-0 min-h-[300px] flex">
        <CardContent className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-normal">{categoryLabel(item.category)}</Badge>
            <button onClick={() => speakItem(item)} aria-label="播放发音" className="rounded-full p-2 text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center text-center py-6">
            <p className="font-display text-3xl leading-snug md:text-4xl">{prompt}</p>
            {!isSignal && item.phonetic && <p className="mt-2 font-mono text-sm text-muted-foreground">{item.phonetic}</p>}
            {revealed ? (
              <div className="mt-5 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <p className="text-lg font-semibold text-primary">{answer}</p>
                {item.note && (
                  <div className={`mt-1 rounded-xl px-4 py-3 ${isSignal ? 'bg-primary/10' : 'bg-transparent'}`}>
                    <p className={`${isSignal ? 'text-sm font-medium' : 'text-xs text-muted-foreground'} max-w-[34ch] mx-auto leading-relaxed`}>{item.note}</p>
                  </div>
                )}
                {item.example && (
                  <div className="mt-1 rounded-xl bg-secondary/50 px-4 py-3 text-left">
                    <p className="text-sm">{item.example}</p>
                    {item.exampleCn && <p className="mt-1 text-xs text-muted-foreground">{item.exampleCn}</p>}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-6 text-xs text-muted-foreground">{isSignal ? '想一想:这个手势在水里怎么做?' : '听一听,想一想它的意思'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {revealed ? (
        <div className="grid grid-cols-3 gap-2.5">
          <GradeBtn label="还不熟" hint="明天再见" className="border-coral/50 text-coral hover:bg-coral/10" onClick={() => onGrade('again')} />
          <GradeBtn label="有点印象" hint="稍后复习" className="border-gold/60 text-gold hover:bg-gold/10" onClick={() => onGrade('fuzzy')} />
          <GradeBtn label="记住了" hint="加深间隔" className="border-success/50 text-success hover:bg-success/10" onClick={() => onGrade('good')} />
        </div>
      ) : (
        <button onClick={onReveal} className="w-full rounded-xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground transition-transform hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
          {isSignal ? '看手势做法' : '显示释义'}
        </button>
      )}
    </div>
  )
}

function GradeBtn({ label, hint, className, onClick }: { label: string; hint: string; className: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-xl border bg-card px-2 py-3 text-center transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${className}`}>
      <span className="block text-sm font-semibold">{label}</span>
      <span className="mt-0.5 block text-[10px] opacity-70">{hint}</span>
    </button>
  )
}

// ---------------- quiz card ----------------
function QuizCard({ quiz, picked, onPick }: { quiz: Quiz; picked: string | null; onPick: (o: string) => void }) {
  const prompt =
    quiz.type === 'en2cn' ? quiz.item.en
    : quiz.type === 'cn2en' ? quiz.item.cn
    : '听发音,选出你听到的词'
  const label = quiz.type === 'en2cn' ? '选出正确释义' : quiz.type === 'cn2en' ? '选出对应的英文' : '听力小测'
  return (
    <div className="space-y-4">
      <Card className="card-depth border-0">
        <CardContent className="p-6 text-center">
          <Badge variant="secondary" className="font-normal">{label}</Badge>
          <div className="mt-4 flex items-center justify-center gap-2">
            <p className={`font-display ${quiz.type === 'cn2en' ? 'text-2xl' : 'text-3xl'} leading-snug`}>{prompt}</p>
            {quiz.type === 'listen' && (
              <button onClick={() => speakItem(quiz.item)} aria-label="再听一遍" className="rounded-full p-2 text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                <Volume2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-2.5">
        {quiz.options.map((opt) => {
          const isAnswer = opt === quiz.answer
          const isPicked = opt === picked
          let cls = 'border-border bg-card hover:border-primary/50 hover:bg-secondary/50'
          if (picked) {
            if (isAnswer) cls = 'border-success bg-success/10 text-success'
            else if (isPicked) cls = 'border-coral bg-coral/10 text-coral'
            else cls = 'border-border bg-card opacity-50'
          }
          return (
            <button key={opt} onClick={() => onPick(opt)} disabled={!!picked}
              className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default cursor-pointer ${cls}`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------- dictation card ----------------
function DictCard({ item, onDone }: { item: VocabItem; onDone: (correct: boolean) => void }) {
  const [value, setValue] = useState('')
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle')
  const timer = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    return () => { if (timer.current) window.clearTimeout(timer.current) }
  }, [])

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (state !== 'idle' || !value.trim()) return
    const ok = acceptableAnswers(item.en).includes(normalizeAnswer(value))
    setState(ok ? 'right' : 'wrong')
    if (ok) timer.current = window.setTimeout(() => onDone(true), 1000)
  }

  function giveUp() {
    if (state !== 'idle') return
    setState('wrong')
  }

  const borderCls =
    state === 'right' ? 'border-success bg-success/10'
    : state === 'wrong' ? 'border-coral bg-coral/5'
    : 'border-input bg-card'

  return (
    <div className="space-y-4">
      <Card className="card-depth border-0">
        <CardContent className="p-6 text-center">
          <Badge variant="secondary" className="font-normal">{categoryLabel(item.category)} · 听写</Badge>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button onClick={() => speakItem(item)} aria-label="播放发音"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
              <Volume2 className="h-6 w-6" />
            </button>
            <button onClick={() => speakItem(item, { slow: true })} aria-label="慢速播放"
              className="flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-xs font-medium text-primary hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
              <Turtle className="h-4 w-4" /> 慢速
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">提示:{item.cn}</p>
        </CardContent>
      </Card>

      <form onSubmit={submit} className="space-y-3">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={state !== 'idle'}
          placeholder="输入你听到的英文…"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className={`h-13 rounded-xl px-4 py-3.5 text-base font-mono border-2 transition-colors ${borderCls}`}
        />
        {state === 'idle' ? (
          <div className="flex gap-2.5">
            <button type="button" onClick={giveUp}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
              <CircleHelp className="h-4 w-4" /> 不会
            </button>
            <button type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-transform hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
              检查拼写
            </button>
          </div>
        ) : (
          <div className={`rounded-xl px-4 py-3.5 text-center animate-in fade-in slide-in-from-bottom-2 duration-200 ${state === 'right' ? 'bg-success/10' : 'bg-coral/10'}`}>
            {state === 'right' ? (
              <p className="font-semibold text-success">拼写正确 · {item.en}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">正确拼写</p>
                <p className="mt-0.5 font-mono text-lg font-semibold text-coral">{item.en}</p>
                <button type="button" onClick={() => onDone(false)}
                  className="mt-3 w-full rounded-xl bg-coral px-4 py-3 font-semibold text-coral-foreground transition-transform hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
                  记住了,下一个
                </button>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  )
}


// ---------------- sprint card (闪电过筛) ----------------
function SprintCard({ item, onMark }: { item: VocabItem; onMark: (known: boolean) => void }) {
  return (
    <div className="space-y-4">
      <Card className="card-depth border-0 min-h-[280px] flex">
        <CardContent className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-normal">{categoryLabel(item.category)}</Badge>
            <button onClick={() => speakItem(item)} aria-label="播放发音" className="rounded-full p-2 text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center text-center py-5">
            <p className="font-display text-3xl leading-snug md:text-4xl">{item.en}</p>
            {item.phonetic && <p className="mt-2 font-mono text-sm text-muted-foreground">{item.phonetic}</p>}
            <p className="mt-3 text-lg font-semibold text-primary">{item.cn}</p>
            {item.note && <p className="mt-2 text-xs text-muted-foreground max-w-[34ch] leading-relaxed">{item.note}</p>}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-2.5">
        <button onClick={() => onMark(false)}
          className="rounded-xl border border-gold/60 bg-card px-4 py-3.5 text-center transition-all hover:bg-gold/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
          <span className="block text-sm font-semibold text-gold">还不熟</span>
          <span className="mt-0.5 block text-[10px] text-muted-foreground">排进近期复习</span>
        </button>
        <button onClick={() => onMark(true)}
          className="rounded-xl border border-success/50 bg-card px-4 py-3.5 text-center transition-all hover:bg-success/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
          <span className="flex items-center justify-center gap-1 text-sm font-semibold text-success"><Check className="h-4 w-4" /> 已会,跳过</span>
          <span className="mt-0.5 block text-[10px] text-muted-foreground">直接标为掌握</span>
        </button>
      </div>
    </div>
  )
}

// ---------------- spell quiz card (硬核:看中文写英文) ----------------
function SpellCard({ item, onDone }: { item: VocabItem; onDone: (correct: boolean) => void }) {
  const [value, setValue] = useState('')
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle')
  const timer = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    return () => { if (timer.current) window.clearTimeout(timer.current) }
  }, [])

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (state !== 'idle' || !value.trim()) return
    const ok = acceptableAnswers(item.en).includes(normalizeAnswer(value))
    setState(ok ? 'right' : 'wrong')
    if (ok) timer.current = window.setTimeout(() => onDone(true), 900)
  }

  const borderCls =
    state === 'right' ? 'border-success bg-success/10'
    : state === 'wrong' ? 'border-coral bg-coral/5'
    : 'border-input bg-card'

  return (
    <div className="space-y-4">
      <Card className="card-depth border-0">
        <CardContent className="p-6 text-center">
          <Badge variant="secondary" className="font-normal">拼写挑战 · {categoryLabel(item.category)}</Badge>
          <p className="mt-4 font-display text-2xl leading-snug">{item.cn}</p>
          <p className="mt-2 text-xs text-muted-foreground">写出对应的英文(忽略大小写和标点)</p>
        </CardContent>
      </Card>
      <form onSubmit={submit} className="space-y-3">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={state !== 'idle'}
          placeholder="type the English…"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className={`h-13 rounded-xl px-4 py-3.5 text-base font-mono border-2 transition-colors ${borderCls}`}
        />
        {state === 'idle' ? (
          <div className="flex gap-2.5">
            <button type="button" onClick={() => setState('wrong')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
              <CircleHelp className="h-4 w-4" /> 不会
            </button>
            <button type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-transform hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
              检查拼写
            </button>
          </div>
        ) : (
          <div className={`rounded-xl px-4 py-3.5 text-center animate-in fade-in slide-in-from-bottom-2 duration-200 ${state === 'right' ? 'bg-success/10' : 'bg-coral/10'}`}>
            {state === 'right' ? (
              <p className="font-semibold text-success">拼写正确 · {item.en}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">正确写法</p>
                <p className="mt-0.5 font-mono text-lg font-semibold text-coral">{item.en}</p>
                <button type="button" onClick={() => onDone(false)}
                  className="mt-3 w-full rounded-xl bg-coral px-4 py-3 font-semibold text-coral-foreground transition-transform hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
                  记住了,下一个
                </button>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
