import type { CSSProperties } from 'react'
import type { Piece } from '@/data/pieces'
import { kindLabel, piecePath } from '@/data/pieces'
import { PieceMedia } from '@/components/PieceMedia'

const span = { big: 'col-span-2 row-span-2', wide: 'col-span-2', tall: 'row-span-2' } as const

// The mosaic: edge to edge, no card chrome. The work is the interface.
export function Grid({ pieces }: { pieces: Piece[] }) {
  return (
    <ul className="mosaic grid grid-flow-dense grid-cols-2 gap-[3px] p-[3px] wide:grid-cols-4">
      {pieces.map((p, i) => (
        <li key={p.slug} className={`tile-in ${p.size ? span[p.size] : ''}`} style={{ '--i': Math.min(i, 12) } as CSSProperties}>
          <a href={piecePath(p)} className="tile group relative block h-full w-full overflow-hidden bg-surface outline-none">
            <PieceMedia piece={p} size="card" className="absolute inset-0 h-full w-full" />
            <span className="tile-caption pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent px-3.5 pt-10 pb-3">
              <span className="text-sm font-semibold text-fg">{p.title}</span>
              <span className="hidden shrink-0 font-mono text-[10px] tracking-[0.1em] text-zinc-300 uppercase wide:inline">{kindLabel[p.kind]}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
