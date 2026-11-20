import { getStats, todayStr } from './srs'

/** 进度名片:编码进链接、发给潜伴后对方可看到的一帧进度快照 */
export interface BuddyCard {
  n: string // 昵称
  s: number // 连续天数
  l: number // 已学词条
  m: number // 牢固掌握
  r: number // 累计练习
  t: string // 名片生成日期 yyyy-mm-dd
}

export interface Buddy extends BuddyCard {
  id: string
  addedAt: string
}

const KEY = 'divelingo.buddies.v1'
export const SITE_URL = 'https://ir5xdp5algb7i.ok.kimi.link/'

export function encodeCard(name: string): string {
  const st = getStats()
  const card: BuddyCard = {
    n: (name || '潜伴').slice(0, 12),
    s: st.streak,
    l: st.learned,
    m: st.mastered,
    r: st.totalReviewed,
    t: todayStr(),
  }
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(card))))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeCard(s: string): BuddyCard | null {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
    const c = JSON.parse(decodeURIComponent(escape(atob(b64))))
    if (typeof c?.n !== 'string') return null
    return { n: String(c.n).slice(0, 12), s: +c.s || 0, l: +c.l || 0, m: +c.m || 0, r: +c.r || 0, t: String(c.t || '') }
  } catch {
    return null
  }
}

export function getBuddies(): Buddy[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function addBuddy(card: BuddyCard): Buddy[] {
  const list = getBuddies().filter((b) => b.n !== card.n)
  const buddy: Buddy = { ...card, id: String(Date.now()), addedAt: todayStr() }
  list.unshift(buddy)
  const trimmed = list.slice(0, 10)
  localStorage.setItem(KEY, JSON.stringify(trimmed))
  return trimmed
}

export function removeBuddy(id: string): Buddy[] {
  const list = getBuddies().filter((b) => b.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
  return list
}

export function getSavedNick(): string {
  return localStorage.getItem('divelingo.nick') ?? ''
}

export function saveNick(nick: string) {
  localStorage.setItem('divelingo.nick', nick)
}
