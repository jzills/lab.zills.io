import { useEffect, useState } from 'react'
import type { ClipCredits, Credit } from '@/data/creative'
import type { Piece } from '@/data/pieces'
import { kindLabel, piecePath, pieces } from '@/data/pieces'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PieceMedia } from '@/components/PieceMedia'

const variantCount = (p: Piece) =>
  p.kind === 'shader' ? p.variants.length : p.kind === 'image' ? p.images.length : p.kind === 'video' ? p.clips.length : 1

function CreditList({ title, items }: { title: string; items: Credit[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h3 className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-zinc-300">
        {items.map((c) => (
          <li key={c.title + c.author}>
            {c.url ? (
              <a href={c.url} className="underline decoration-zinc-600 underline-offset-2 hover:text-fg">
                {c.title}
              </a>
            ) : (
              c.title
            )}
            {c.author && <span className="text-muted"> by {c.author}</span>}
            {c.license && <span className="text-muted"> · {c.license}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

// A piece's own page: the work full-bleed, then what it is.
export function PiecePage({ piece }: { piece: Piece }) {
  const [variant, setVariant] = useState(0)
  const [credits, setCredits] = useState<{ for: string; data: ClipCredits } | null>(null)
  const i = pieces.indexOf(piece)
  const prev = pieces[(i - 1 + pieces.length) % pieces.length]
  const next = pieces[(i + 1) % pieces.length]
  const n = variantCount(piece)
  const creditsUrl = piece.kind === 'video' ? piece.clips[variant].credits : undefined

  useEffect(() => {
    if (!creditsUrl) return
    let cancelled = false
    fetch(creditsUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ClipCredits | null) => {
        if (!cancelled && data) setCredits({ for: creditsUrl, data })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [creditsUrl])
  const shownCredits = credits && credits.for === creditsUrl ? credits.data : null
  const sound = piece.kind === 'music' || piece.kind === 'audio'

  return (
    <div className="min-h-svh bg-bg">
      <Header />
      <section aria-label={piece.title} className={`relative flex items-center justify-center bg-black ${sound ? 'h-[60svh] min-h-[360px] px-5' : 'h-svh min-h-[480px]'}`}>
        {sound ? (
          <PieceMedia piece={piece} size="full" />
        ) : (
          <PieceMedia key={variant} piece={piece} size="full" variant={variant} className={piece.kind === 'shader' ? 'absolute inset-0 h-full w-full' : 'max-h-svh'} />
        )}
      </section>

      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-7">
        <p className="font-mono text-[11px] tracking-[0.12em] text-accent uppercase">{kindLabel[piece.kind]}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] text-fg sm:text-5xl">{piece.title}</h1>
        {n > 1 && (
          <div role="group" aria-label="Variants" className="mt-5 flex flex-wrap gap-1.5">
            {Array.from({ length: n }, (_, v) => (
              <button
                key={v}
                type="button"
                aria-pressed={variant === v}
                onClick={() => setVariant(v)}
                className={`rounded-full border px-3 py-1 font-mono text-xs ${variant === v ? 'border-accent/60 bg-accent/12 text-fg' : 'border-border text-muted hover:text-fg'}`}
              >
                {v + 1}/{n}
              </button>
            ))}
          </div>
        )}
        <p className="mt-5 text-lg leading-relaxed text-zinc-300">{piece.description}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {piece.tags.map((t) => (
            <li key={t} className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-muted">
              {t}
            </li>
          ))}
        </ul>
        {shownCredits && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <CreditList title="Sounds" items={shownCredits.sounds} />
            <CreditList title="Footage" items={shownCredits.footage} />
          </div>
        )}

        <nav aria-label="More work" className="mt-12 flex items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm">
          <a href={piecePath(prev)} className="text-muted hover:text-fg">
            ← {prev.title}
          </a>
          <a href="/" className="font-mono text-xs text-accent hover:underline">
            All work
          </a>
          <a href={piecePath(next)} className="text-right text-muted hover:text-fg">
            {next.title} →
          </a>
        </nav>
      </article>
      <Footer />
    </div>
  )
}
