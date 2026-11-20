import { VOCAB, type VocabItem, type Level } from '@/data/vocab'

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

// ---------- settings ----------
export type Difficulty = 'easy' | 'standard' | 'hard'
export interface Settings {
  dailyNew: number // 每日新词量
  sessionMinutes: number // 每次训练时长(分钟)
  difficulty: Difficulty
}
const SETTINGS_KEY = 'divelingo.settings'
const DEFAULT_SETTINGS: Settings = { dailyNew: 10, sessionMinutes: 10, difficulty: 'standard' }

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}

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
  newToday = Math.max(0, getSettings().dailyNew - usedNew)
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

// 闪电过筛:某范围内所有未掌握(box<4)的词,供有基础的用户快速跳过已会内容
export function buildSprintQueue(level: Level | 'ALL'): VocabItem[] {
  const s = loadStore()
  return VOCAB.filter((v) => (level === 'ALL' || v.level === level) && (s.cards[v.id]?.box ?? 0) < 4)
}

// 标记已会:直接送进 box 4(掌握),不占用每日新词配额
export function markKnown(id: string) {
  const s = loadStore()
  const today = todayStr()
  const prev = s.cards[id]
  s.cards[id] = {
    box: 4,
    due: addDays(today, INTERVALS[4]),
    seen: (prev?.seen ?? 0) + 1,
    right: (prev?.right ?? 0) + 1,
    wrong: prev?.wrong ?? 0,
  }
  touchLog(s, { reviewed: 1 })
  saveStore(s)
}

// 弱词加练:错得多、掌握度低的已学词优先;不引入新词
export function buildWeakQueue(limit = 15): VocabItem[] {
  const s = loadStore()
  return VOCAB.filter((v) => s.cards[v.id] && s.cards[v.id].box < 5)
    .sort((a, b) => {
      const sa = s.cards[a.id]
      const sb = s.cards[b.id]
      return sb.wrong - sa.wrong || sa.box - sb.box || sa.due.localeCompare(sb.due)
    })
    .slice(0, limit)
}

// 自由复习(学完加练):只从已学词里抽,不消耗新词配额
export function buildReviewQueue(limit = 20): VocabItem[] {
  const s = loadStore()
  return VOCAB.filter((v) => s.cards[v.id] && s.cards[v.id].box < 5)
    .sort((a, b) => {
      const sa = s.cards[a.id]
      const sb = s.cards[b.id]
      return sa.due.localeCompare(sb.due) || sa.box - sb.box
    })
    .slice(0, limit)
}

// 最常错的词(记录页榜单)
export function getWeakest(limit = 5): { item: VocabItem; wrong: number }[] {
  const s = loadStore()
  return VOCAB.filter((v) => (s.cards[v.id]?.wrong ?? 0) > 0)
    .sort((a, b) => s.cards[b.id].wrong - s.cards[a.id].wrong)
    .slice(0, limit)
    .map((v) => ({ item: v, wrong: s.cards[v.id].wrong }))
}

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
