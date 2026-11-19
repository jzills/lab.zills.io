import { creativeItems } from './creative'
import type { CreativeItem } from './creative'
import { slug } from '@/lib/slug'

export type TileSize = 'big' | 'wide' | 'tall'
export type Piece = CreativeItem & { slug: string; size?: TileSize; hero?: boolean }
export type KindGroup = 'shaders' | 'video' | 'images' | 'audio'

// Layout choices kept here, so creative.ts stays a clean copy of the resume site's data.
const sizes: Record<string, TileSize> = {
  'spiral-tunnel': 'big',
  molten: 'wide',
  interference: 'wide',
  driftcast: 'wide',
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

const bySlug = new Map(pieces.map((p) => [p.slug, p]))
export const pieceBySlug = (s: string) => bySlug.get(s)
export const piecePath = (p: Piece) => `/${p.slug}/`
export const heroPool = pieces.filter((p) => p.hero)

export function kindGroup(p: Piece): KindGroup {
  switch (p.kind) {
    case 'shader':
      return 'shaders'
    case 'video':
      return 'video'
    case 'image':
      return 'images'
    default:
      return 'audio'
  }
}
