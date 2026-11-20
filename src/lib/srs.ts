import { VOCAB, type VocabItem } from '@/data/vocab'

// ---------- date helpers (local time) ----------
export function todayStr(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return todayStr(d)
}

// ---------- types ----------
export interface CardState {
  box: number // 0 new/unlearned … 5 mastered
  due: string // yyyy-mm-dd
  seen: number
  right: number
  wrong: number
}

export interface DayLog {
  date: string
  reviewed: number
  quizRight: number
  quizTotal: number
  newLearned: number
}

interface Store {
  cards: Record<string, CardState>
  streak: number
  lastStudyDay: string | null
  logs: DayLog[]
}

const KEY = 'divelingo.v1'
// Leitner intervals in days, indexed by box
const INTERVALS = [0, 1, 2, 4, 8, 15]
const DAILY_NEW = 10

function blank(): Store {
  return { cards: {}, streak: 0, lastStudyDay: null, logs: [] }
}

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return blank()
    const parsed = JSON.parse(raw) as Store
    return { ...blank(), ...parsed, cards: parsed.cards ?? {}, logs: parsed.logs ?? [] }
  } catch {
    return blank()
  }
}

function saveStore(s: Store) {
  localStorage.setItem(KEY, JSON.stringify(s))
}

// ---------- derived stats ----------
export interface Stats {
  dueToday: number
  newToday: number
  learned: number // box >= 1
  mastered: number // box >= 4
  streak: number
  totalReviewed: number
  quizAccuracy: number | null
  byLevel: Record<string, { total: number; learned: number; mastered: number; due: number }>
}

export function getStats(): Stats {
  const s = loadStore()
  const today = todayStr()
  let due = 0
  let learned = 0
  let mastered = 0
  const byLevel: Stats['byLevel'] = {
    OW: { total: 0, learned: 0, mastered: 0, due: 0 },
    AOW: { total: 0, learned: 0, mastered: 0, due: 0 },
    PHRASE: { total: 0, learned: 0, mastered: 0, due: 0 },
    PLUS: { total: 0, learned: 0, mastered: 0, due: 0 },
  }
  for (const v of VOCAB) {
    const st = s.cards[v.id]
    const L = byLevel[v.level]
    L.total++
    if (st) {
      if (st.box >= 1) {
        learned++
        L.learned++
      }
      if (st.box >= 4) {
        mastered++
        L.mastered++
      }
      if (st.due <= today) {
        due++
        L.due++
      }
    }
  }
  let totalReviewed = 0
  let qr = 0
  let qt = 0
  for (const l of s.logs) {
    totalReviewed += l.reviewed
    qr += l.quizRight
    qt += l.quizTotal
  }
  // new quota remaining today: count cards whose first review happened today
  let newToday = 0
  const todayLog = s.logs.find((l) => l.date === today)
  const usedNew = todayLog?.newLearned ?? 0
  newToday = Math.max(0, DAILY_NEW - usedNew)
  return {
    dueToday: due,
    newToday,
    learned,
    mastered,
    streak: computeStreak(s),
    totalReviewed,
    quizAccuracy: qt > 0 ? qr / qt : null,
    byLevel,
  }
}

function computeStreak(s: Store): number {
  if (!s.lastStudyDay) return 0
  const today = todayStr()
  const yesterday = addDays(today, -1)
  if (s.lastStudyDay === today || s.lastStudyDay === yesterday) return s.streak
  return 0
}

// ---------- session building ----------
export type Grade = 'again' | 'fuzzy' | 'good'

export function buildSessionQueue(limit = 26): VocabItem[] {
  const s = loadStore()
  const today = todayStr()
  const due: { v: VocabItem; st: CardState }[] = []
  const fresh: VocabItem[] = []
  for (const v of VOCAB) {
    const st = s.cards[v.id]
    if (st) {
      if (st.due <= today) due.push({ v, st })
    } else {
      fresh.push(v)
    }
  }
  // reviews first: lowest box, then most overdue
  due.sort((a, b) => a.st.box - b.st.box || a.st.due.localeCompare(b.st.due))
  // interleave levels for variety
  const newQuota = getStats().newToday
  const picks: VocabItem[] = []
  const byLevel: Record<string, VocabItem[]> = {}
  for (const f of fresh) {
    ;(byLevel[f.level] ??= []).push(f)
  }
  const order: VocabItem[] = []
  const levels = ['OW', 'AOW', 'PHRASE', 'PLUS']
  let guard = 0
  while (order.length < fresh.length && guard++ < 1000) {
    for (const lv of levels) {
      const arr = byLevel[lv]
      if (arr && arr.length) order.push(arr.shift()!)
      if (order.length >= fresh.length) break
    }
  }
  picks.push(...due.map((d) => d.v))
  picks.push(...order.slice(0, newQuota))
  return picks.slice(0, limit)
}

// ---------- grading ----------
export function gradeCard(id: string, grade: Grade) {
  const s = loadStore()
  const today = todayStr()
  const prev = s.cards[id]
  const isNew = !prev
  let box = prev?.box ?? 0
  if (grade === 'good') box = Math.min(5, box + 1)
  else if (grade === 'fuzzy') box = Math.max(0, box)
  else box = 0
  s.cards[id] = {
    box,
    due: addDays(today, INTERVALS[box]),
    seen: (prev?.seen ?? 0) + 1,
    right: (prev?.right ?? 0) + (grade === 'good' ? 1 : 0),
    wrong: (prev?.wrong ?? 0) + (grade === 'again' ? 1 : 0),
  }
  touchLog(s, { reviewed: 1, newLearned: isNew ? 1 : 0 })
  saveStore(s)
}

export function recordQuiz(correct: boolean) {
  const s = loadStore()
  touchLog(s, { quizRight: correct ? 1 : 0, quizTotal: 1 })
  saveStore(s)
}

function touchLog(
  s: Store,
  delta: { reviewed?: number; quizRight?: number; quizTotal?: number; newLearned?: number },
) {
  const today = todayStr()
  let log = s.logs.find((l) => l.date === today)
  if (!log) {
    log = { date: today, reviewed: 0, quizRight: 0, quizTotal: 0, newLearned: 0 }
    s.logs.push(log)
    if (s.logs.length > 90) s.logs = s.logs.slice(-90)
  }
  log.reviewed += delta.reviewed ?? 0
  log.quizRight += delta.quizRight ?? 0
  log.quizTotal += delta.quizTotal ?? 0
  log.newLearned += delta.newLearned ?? 0
  // streak: studying (>=1 review) bumps streak
  if ((delta.reviewed ?? 0) > 0) {
    const yesterday = addDays(today, -1)
    if (s.lastStudyDay === today) {
      // unchanged
    } else if (s.lastStudyDay === yesterday) {
      s.streak += 1
      s.lastStudyDay = today
    } else {
      s.streak = 1
      s.lastStudyDay = today
    }
  }
}

// ---------- misc ----------

// 手势专项:全部手势卡,最不熟练的排前面
export function buildSignalQueue(limit = 24): VocabItem[] {
  const s = loadStore()
  return VOCAB.filter((v) => v.category === 'ow-signals')
    .sort((a, b) => {
      const sa = s.cards[a.id]
      const sb = s.cards[b.id]
      return (sa?.box ?? -1) - (sb?.box ?? -1) || (sa?.due ?? '0000').localeCompare(sb?.due ?? '0000')
    })
    .slice(0, limit)
}

// 听写模式:优先到期复习,其次新词,只选适合拼写的短词
export function buildDictationQueue(limit = 15): VocabItem[] {
  const s = loadStore()
  const today = todayStr()
  const eligible = VOCAB.filter((v) => v.level !== 'PHRASE' && v.en.length <= 18)
  const due = eligible.filter((v) => s.cards[v.id] && s.cards[v.id].due <= today)
  const fresh = eligible.filter((v) => !s.cards[v.id])
  const rest = eligible.filter((v) => s.cards[v.id] && s.cards[v.id].due > today)
    .sort((a, b) => s.cards[a.id].box - s.cards[b.id].box)
  return [...due, ...fresh, ...rest].slice(0, limit)
}

// 听写判分:忽略大小写、标点和括号注释;"a / b" 任答其一即可
export function normalizeAnswer(t: string): string {
  return t
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function acceptableAnswers(en: string): string[] {
  const out = new Set<string>()
  const full = normalizeAnswer(en)
  if (full) out.add(full)
  for (const part of en.split('/')) {
    const n = normalizeAnswer(part)
    if (n) out.add(n)
  }
  return [...out]
}

export function getCardState(id: string): CardState | undefined {
  return loadStore().cards[id]
}

export function getLogs(): DayLog[] {
  return loadStore().logs
}

export function resetAll() {
  localStorage.removeItem(KEY)
}
