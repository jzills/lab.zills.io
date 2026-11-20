import { creativeItems } from './creative'
import type { CreativeItem } from './creative'
import { slug } from '@/lib/slug'

export type TileSize = 'big' | 'wide' | 'tall'
export type Piece = CreativeItem & { slug: string; size?: TileSize; hero?: boolean }
export type KindGroup = 'shaders' | 'video' | 'images' | 'audio'

// Layout choices kept here, so creative.ts stays a clean copy of the resume site's data.
const sizes: Record<string, TileSize> = {
  'spiral-tunnel': 'big',
  contours: 'big',
  interference: 'wide',
  driftcast: 'big',
  symmetry: 'tall',
}

export function buildPieces(items: CreativeItem[]): Piece[] {
  const seen = new Map<string, string>()
  return items.map((item) => {
    const s = slug(item.title)
    const other = seen.get(s)
    if (other) throw new Error(`pieces: "${item.title}" and "${other}" both slug to "${s}"`)
    seen.set(s, item.title)
    // The hero pool starts as the featured shaders.
    return { ...item, slug: s, size: sizes[s], hero: item.kind === 'shader' && item.featured === true }
  })
}

export const pieces: Piece[] = buildPieces(creativeItems)

// Every slug given a tile size, so a renamed or removed piece can't leave a stale entry.
export const sizedSlugs = Object.keys(sizes)

const bySlug = new Map(pieces.map((p) => [p.slug, p]))
export const pieceBySlug = (s: string) => bySlug.get(s)
export const piecePath = (p: Piece) => `/${p.slug}/`
export const heroPool = pieces.filter((p) => p.hero)

// The filters a piece shows under. A video with a soundtrack is sound work as much as
// moving image, so it counts as Audio too.
export function kindGroups(p: Piece): KindGroup[] {
  switch (p.kind) {
    case 'shader':
      return ['shaders']
    case 'video':
      return p.sound ? ['video', 'audio'] : ['video']
    case 'image':
      return ['images']
    default:
      return ['audio']
  }
}

// The still image that stands in for a piece wherever it isn't running live: the
// prerendered page, off-screen tiles, reduced motion, thumbnails and link previews.
// Shaders use captures from scripts/capture-stills.ts; sound has no picture.
export function stillSrc(p: Piece): string | undefined {
  switch (p.kind) {
    case 'shader':
      return `/stills/${p.slug}.webp`
    case 'image':
      return p.images[0].src
    case 'video':
      return p.clips[0].poster
    default:
      return undefined
  }
}

export function stillCard(p: Piece): string | undefined {
  switch (p.kind) {
    case 'shader':
      return `/stills/${p.slug}-card.webp`
    case 'image':
      return p.images[0].card
    default:
      return stillSrc(p)
  }
}

// A piece's kind as shown in captions and labels.
export const kindLabel = { shader: 'Shader', image: 'Image', video: 'Video', music: 'Music', audio: 'Audio' } as const
