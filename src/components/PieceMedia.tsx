import { useRef, type PointerEvent } from 'react'
import { AudioLines } from 'lucide-react'
import { previewsOnHover } from '@/lib/pointer'
import type { Piece } from '@/data/pieces'
import { ShaderCanvas } from '@/components/ShaderCanvas'

type Props = { piece: Piece; size: 'card' | 'full'; variant?: number; className?: string }

// Bandcamp's player takes its colours in the URL: the Lab's surface and violet.
const bandcamp = (album: number | undefined, track: number) =>
  'https://bandcamp.com/EmbeddedPlayer/' +
  (album ? `album=${album}/` : '') +
  `size=large/bgcol=111113/linkcol=a78bfa/tracklist=false/artwork=small/track=${track}/transparent=true/`

// Sound with no picture: a violet-tinted panel with a waveform glyph.
function SoundPanel({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgb(167_139_250/0.28),#111113_70%)] ${className}`}>
      <AudioLines aria-hidden="true" size={44} className="text-accent" strokeWidth={1.5} />
    </div>
  )
}

function HoverVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  // Muted preview while hovered with a mouse; never under reduced motion.
  const play = (e: PointerEvent<HTMLVideoElement>) => {
    const v = ref.current
    if (!v || !previewsOnHover(e.pointerType, matchMedia('(prefers-reduced-motion: reduce)').matches)) return
    v.play().catch(() => {})
  }
  const stop = () => ref.current?.pause()
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
      onPointerEnter={play}
      onPointerLeave={stop}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

// A piece's media at card size (tiles, previews) or full size (its own page).
export function PieceMedia({ piece, size, variant = 0, className = '' }: Props) {
  const box = `relative overflow-hidden ${className}`
  switch (piece.kind) {
    case 'shader':
      return <ShaderCanvas piece={piece} variant={variant} size={size} className={className} />
    case 'image': {
      const img = piece.images[Math.min(variant, piece.images.length - 1)]
      return size === 'card' ? (
        <div className={box}>
          <img src={img.card} alt={piece.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      ) : (
        <img src={img.src} alt={piece.alt} width={img.width} height={img.height} className={`mx-auto max-h-full max-w-full object-contain ${className}`} />
      )
    }
    case 'video': {
      const clip = piece.clips[Math.min(variant, piece.clips.length - 1)]
      return size === 'card' ? (
        <div className={box}>
          <HoverVideo src={clip.src} poster={clip.poster} alt={piece.alt} />
        </div>
      ) : (
        <video key={clip.src} src={clip.src} poster={clip.poster} controls playsInline preload="metadata" aria-label={piece.alt} className={`mx-auto max-h-full max-w-full ${className}`} />
      )
    }
    case 'music':
      return size === 'card' ? (
        <SoundPanel className={box} />
      ) : (
        <iframe title={`${piece.title} on Bandcamp`} src={bandcamp(piece.bandcamp.album, piece.bandcamp.track)} loading="lazy" className={`block h-[120px] w-full max-w-xl border-0 ${className}`} />
      )
    case 'audio':
      return size === 'card' ? <SoundPanel className={box} /> : <audio src={piece.audioSrc} controls preload="metadata" className={`w-full max-w-xl ${className}`} />
  }
}
