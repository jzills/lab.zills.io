import type { KindFilter, Query, View } from '@/lib/query'
import { KINDS } from '@/lib/query'

const labels: Record<KindFilter, string> = { all: 'All', shaders: 'Shaders', video: 'Video', images: 'Images', audio: 'Audio' }

export function FilterBar({ query, count, onChange }: { query: Query; count: number; onChange: (q: Query) => void }) {
  const chip = (on: boolean) =>
    `shrink-0 rounded-full border px-2.5 py-1.5 sm:px-3 transition-colors ${on ? 'border-accent/60 bg-accent/12 text-fg' : 'border-transparent text-muted hover:text-fg'}`
  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-zinc-900 bg-bg/85 px-3 py-3 text-[13px] backdrop-blur sm:px-6">
      {/* Only the kinds scroll sideways on narrow screens; the view toggle stays put. */}
      <div className="no-scrollbar flex min-w-0 gap-1 overflow-x-auto">
      {KINDS.map((k) => (
        <button key={k} type="button" aria-pressed={query.kind === k} onClick={() => onChange({ ...query, kind: k })} className={chip(query.kind === k)}>
          {labels[k]}
        </button>
      ))}
      </div>
      <span className="ml-auto flex shrink-0 items-center gap-3 pl-3">
        <span className="hidden font-mono text-[11px] text-muted sm:inline">{count} pieces</span>
        <span role="group" aria-label="View" className="flex rounded-full border border-border p-0.5">
          {(['grid', 'index'] as View[]).map((v) => (
            <button key={v} type="button" aria-pressed={query.view === v} onClick={() => onChange({ ...query, view: v })} className={`rounded-full px-3 py-1 capitalize ${query.view === v ? 'bg-fg/10 text-fg' : 'text-muted hover:text-fg'}`}>
              {v}
            </button>
          ))}
        </span>
      </span>
    </div>
  )
}
