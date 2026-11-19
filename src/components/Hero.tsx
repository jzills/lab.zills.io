import { useSyncExternalStore } from 'react'
import { heroPool, kindLabel, piecePath, pieces } from '@/data/pieces'
import { PieceMedia } from '@/components/PieceMedia'

// A random pool piece per visit, picked once. The prerendered page (and hydration)
// show the first, then the client swaps in its pick.
let pick: number | undefined
const clientPick = () => (pick ??= Math.floor(Math.random() * heroPool.length))
const serverPick = () => 0
const noop = () => () => {}

export function Hero() {
  const piece = heroPool[useSyncExternalStore(noop, clientPick, serverPick)]
  return (
    <section aria-label="Featured piece" className="relative h-[86svh] min-h-[540px] overflow-hidden sm:h-svh">
      <PieceMedia key={piece.slug} piece={piece} size="full" className="absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="hero-shade pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-5 bottom-7 z-10 sm:inset-x-7 sm:bottom-10">
        <h1 className="text-[7rem] leading-[0.8] font-black tracking-[-0.06em] text-fg sm:text-[12.5rem]">
          Lab<span className="text-accent">.</span>
        </h1>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[32rem] text-[15px] leading-relaxed text-zinc-200 sm:text-lg">
            Shaders, generative video, images and sound. Most of it runs live, right here in your browser.
          </p>
          <p className="font-mono text-[11px] leading-[1.7] tracking-[0.08em] text-zinc-300 uppercase sm:text-right">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Featured
            </span>
            <br />
            <a href={piecePath(piece)} className="text-accent hover:underline">
              {piece.title}
            </a>{' '}
            · {kindLabel[piece.kind]}
            <br />
            {pieces.length} pieces
          </p>
        </div>
      </div>
    </section>
  )
}
