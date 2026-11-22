import { useEffect, useState } from 'react'
import { Compass, BookOpen, MessagesSquare, BarChart3 } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Home from '@/sections/Home'
import Session, { type SessionMode } from '@/sections/Session'
import Library from '@/sections/Library'
import Phrases from '@/sections/Phrases'
import Stats from '@/sections/Stats'
import { decodeCard, addBuddy, isOwnCard, type BuddyCard } from '@/lib/buddy'
import { importProgress, inspectProgress, loadStore } from '@/lib/srs'

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
  const [pendingBuddy, setPendingBuddy] = useState<BuddyCard | null>(null)
  const [pendingImport, setPendingImport] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importDone, setImportDone] = useState(false)

  // 打开潜伴名片链接(#buddy=...):解析出进度名片,询问是否添加
  // 打开迁移链接(#import=...):解析迁移码,询问是否导入
  useEffect(() => {
    const hash = window.location.hash
    const bm = hash.match(/buddy=([A-Za-z0-9_-]+)/)
    const im = hash.match(/import=([A-Za-z0-9_-]+)/)
    if (!bm && !im) return
    // 无论是否有效都清掉 hash,避免刷新反复弹窗
    history.replaceState(null, '', window.location.pathname)
    if (bm) {
      const card = decodeCard(bm[1])
      if (card) setPendingBuddy(card)
    } else if (im) {
      setPendingImport(im[1])
    }
  }, [])

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

      {/* 潜伴名片确认弹窗 */}
      <AlertDialog open={!!pendingBuddy} onOpenChange={(open) => { if (!open) setPendingBuddy(null) }}>
        <AlertDialogContent>
          {pendingBuddy && isOwnCard(pendingBuddy) ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>这是你自己的名片</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2">
                    <span className="block font-mono text-sm text-foreground">
                      连击 {pendingBuddy.s} 天 · 已学 {pendingBuddy.l} 词 · 牢固掌握 {pendingBuddy.m} 词
                    </span>
                    <span className="block">这张名片就是这台设备生成的,不用加自己为潜伴。把它发给潜伴,由对方打开并添加才有意义。</span>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setPendingBuddy(null)}>知道了</AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{pendingBuddy?.n} 的进度名片</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2">
                    <span className="block font-mono text-sm text-foreground">
                      连击 {pendingBuddy?.s} 天 · 已学 {pendingBuddy?.l} 词 · 牢固掌握 {pendingBuddy?.m} 词
                    </span>
                    <span className="block">名片生成于 {pendingBuddy?.t}。添加为潜伴后,这张进度快照会显示在你的首页;想看到对方最新进度,让对方重新发一张名片即可。</span>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>不了,谢谢</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (pendingBuddy) addBuddy(pendingBuddy)
                    setPendingBuddy(null)
                    setHomeKey((k) => k + 1)
                  }}
                >
                  添加为潜伴
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      {/* 迁移码导入确认弹窗(#import= 链接打开时) */}
      <AlertDialog open={!!pendingImport} onOpenChange={(open) => { if (!open) { setPendingImport(null); setImportError(null) } }}>
        <AlertDialogContent>
          {(() => {
            const info = pendingImport ? inspectProgress(pendingImport) : null
            const local = loadStore()
            const localCards = Object.keys(local.cards).length
            // 快照比本机旧:本机学过且(快照最近学习日更早 或 快照词条更少)
            const localNewer =
              !!info && localCards > 0 &&
              ((info.lastStudyDay ?? '9999') < (local.lastStudyDay ?? '0000') || info.cards < localCards)
            return (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>导入学习进度?</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-2">
                      {info && (
                        <span className="block font-mono text-sm text-foreground">
                          快照内容:{info.cards} 个词条 · 最近学习 {info.lastStudyDay ?? '—'} · 导出于 {info.exportedAt || '—'}
                        </span>
                      )}
                      <span className="block">导入后会用这份快照覆盖本设备现有的学习记录。</span>
                      {localNewer && (
                        <span className="block rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                          ⚠️ 注意:这台设备上已有更新的进度({localCards} 个词条 · 最近学习 {local.lastStudyDay}),导入这份旧快照会把它覆盖掉。如果这是你用过的迁移链接,请直接点「取消」,以后从首页正常进入学习即可。
                        </span>
                      )}
                      {importError && <span className="block text-xs font-medium text-destructive">{importError}</span>}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{localNewer ? '取消(保住本机进度)' : '取消'}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      if (!pendingImport) return
                      const err = importProgress(pendingImport)
                      if (err) {
                        e.preventDefault() // 导入失败不关弹窗,展示错误
                        setImportError(err)
                        return
                      }
                      setPendingImport(null)
                      setImportError(null)
                      setImportDone(true)
                      setHomeKey((k) => k + 1)
                    }}
                  >
                    导入并覆盖
                  </AlertDialogAction>
                </AlertDialogFooter>
              </>
            )
          })()}
        </AlertDialogContent>
      </AlertDialog>

      {/* 导入成功提示 */}
      <AlertDialog open={importDone} onOpenChange={(open) => { if (!open) setImportDone(false) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>导入完成 ✓</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <span className="block">进度已经搬到这台设备上了。</span>
                <span className="block font-medium">以后请直接打开本站首页学习(可以把页面添加到主屏幕),不要再点迁移链接或扫迁移二维码进入——每次打开它都会用旧快照覆盖你新学的进度。</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setImportDone(false)}>知道了</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
