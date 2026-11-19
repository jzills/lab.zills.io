import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { Piece } from '@/data/pieces'
import { stillCard, stillSrc } from '@/data/pieces'
import type { ShaderItem } from '@/data/creative'
import { LazyMount } from '@/components/LazyMount'
import { sharedShaderContext, useShaderRunner } from '@/lib/useShaderRunner'

type Props = { piece: ShaderItem & Piece; variant?: number; size: 'card' | 'full'; className?: string }

// Whether this browser should run shaders at all: not under reduced motion, not
// without WebGL, and not with ?nogl (a switch for checking the fallback).
let cached: boolean | undefined
function canRun() {
  cached ??= detect()
  return cached
}
function detect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (new URLSearchParams(location.search).has('nogl')) return false
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    // Give the probe's context back at once: phones cap how many can exist.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}

const noop = () => () => {}

function Live({ piece, variant }: { piece: ShaderItem & Piece; variant: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [source, setSource] = useState('')
  const v = piece.variants[Math.min(variant, piece.variants.length - 1)]

  useEffect(() => {
    let cancelled = false
    v.load().then((src) => {
      if (!cancelled) setSource(src)
    })
    return () => {
      cancelled = true
    }
  }, [v])

  useShaderRunner(canvasRef, source, true, v.still)
  // Hidden until the source has loaded and a frame has had a chance to draw, so the
  // still underneath never flashes to black.
  const [shownFor, setShownFor] = useState('')
  useEffect(() => {
    if (!source) return
    const f = requestAnimationFrame(() => requestAnimationFrame(() => setShownFor(source)))
    return () => cancelAnimationFrame(f)
  }, [source])
  const shown = source !== '' && shownFor === source

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${shown ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}

// A shader: its still image, with the live shader drawn over it once it can run.
// The still is what the prerendered page, reduced motion and no-WebGL browsers show.
export function ShaderCanvas({ piece, variant = 0, size, className = '' }: Props) {
  // False while prerendering and hydrating, so the first client render matches the HTML.
  const run = useSyncExternalStore(noop, canRun, () => false)
  const src = size === 'card' ? stillCard(piece) : stillSrc(piece)

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <img src={src} alt={`${piece.title} — shader`} className="absolute inset-0 h-full w-full object-cover" loading={size === 'card' ? 'lazy' : 'eager'} />
      {run && (
        <LazyMount className="absolute inset-0" keep={sharedShaderContext} rootMargin={sharedShaderContext ? '200px 0px' : '50px 0px'}>
          <Live key={variant} piece={piece} variant={variant} />
        </LazyMount>
      )}
    </div>
  )
}
