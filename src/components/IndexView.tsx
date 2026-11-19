import { useState } from 'react'
import type { Piece } from '@/data/pieces'
import { kindLabel, piecePath, stillCard } from '@/data/pieces'
import { PieceMedia } from '@/components/PieceMedia'

// The editorial view: a numbered list; hovering or focusing a row previews it.
export function IndexView({ pieces }: { pieces: Piece[] }) {
  const [active, setActive] = useState(0)
  const shown = pieces[Math.min(active, pieces.length - 1)]
  return (
    <div className="relative px-5 pt-4 pb-16 sm:px-7 wide:flex wide:gap-10">
      <ol className="wide:w-[58%]">
        {pieces.map((p, i) => {
          const thumb = stillCard(p)
          return (
            <li key={p.slug}>
              <a
                href={piecePath(p)}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group grid grid-cols-[44px_1fr_72px] items-center gap-x-2 border-b border-zinc-900 py-3 outline-none wide:grid-cols-[58px_1fr_auto] wide:items-baseline ${i === active ? 'is-active' : ''}`}
              >
                <span className="font-mono text-[11px] text-zinc-500 group-[.is-active]:text-accent">{String(i + 1).padStart(3, '0')}</span>
                <span className="text-xl font-semibold tracking-[-0.025em] text-zinc-400 transition-colors group-hover:text-fg group-focus-visible:text-fg group-focus-visible:underline group-[.is-active]:text-fg wide:text-3xl">{p.title}</span>
                <span className="hidden font-mono text-[10px] tracking-[0.1em] text-zinc-500 uppercase wide:inline">{kindLabel[p.kind]}</span>
                {thumb ? (
                  <img src={thumb} alt="" loading="lazy" className="h-[54px] w-[72px] object-cover wide:hidden" />
                ) : (
                  <span aria-hidden="true" className="h-[54px] w-[72px] bg-accent/15 wide:hidden" />
                )}
              </a>
            </li>
          )
        })}
      </ol>
      <div aria-hidden="true" className="hidden wide:block wide:flex-1">
        <div className="cut-corner sticky top-20 aspect-[4/3] overflow-hidden">
          <PieceMedia key={shown.slug} piece={shown} size="card" className="absolute inset-0 h-full w-full" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3.5 pt-8 pb-3 font-mono text-[10px] tracking-[0.1em] text-zinc-200 uppercase">
            {String(Math.min(active, pieces.length - 1) + 1).padStart(3, '0')} · {shown.title}
          </span>
        </div>
      </div>
    </div>
  )
}
