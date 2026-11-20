import { describe, expect, it } from 'vitest'
import { creativeItems } from './creative'
import { heroPool, kindGroups, pieceBySlug, piecePath, pieces, sizedSlugs } from './pieces'
import type { Piece } from './pieces'
import { slug } from '@/lib/slug'

describe('pieces', () => {
  it('has one piece per creative item, with unique slugs', () => {
    expect(pieces.length).toBe(creativeItems.length)
    expect(new Set(pieces.map((p) => p.slug)).size).toBe(pieces.length)
  })

  it('slugs titles', () => {
    expect(slug('Pseudo Fractal #5')).toBe('pseudo-fractal-5')
  })

  it('only uses known tile sizes', () => {
    for (const p of pieces) expect(['big', 'wide', 'tall', undefined]).toContain(p.size)
  })

  it('has a hero pool of shaders', () => {
    expect(heroPool.length).toBeGreaterThanOrEqual(1)
    for (const p of heroPool) expect(p.kind).toBe('shader')
  })

  it('files videos with sound under both Video and Audio', () => {
    for (const s of ['driftcast', 'bloom']) expect(kindGroups(pieceBySlug(s)!), s).toEqual(['video', 'audio'])
    expect(kindGroups(pieceBySlug('contours')!)).toEqual(['images'])
  })

  it('files music under Audio', () => {
    const music = { kind: 'music', title: 'KO', slug: 'ko' } as Piece
    expect(kindGroups(music)).toEqual(['audio'])
  })

  it('leaves the Bandcamp releases to the audio site and makes Driftcast a big tile', () => {
    expect(pieces.filter((p) => p.kind === 'music')).toEqual([])
    expect(pieceBySlug('driftcast')?.size).toBe('big')
  })

  it('gives each piece a page path', () => {
    expect(piecePath(pieceBySlug('contours')!)).toBe('/contours/')
  })

  it('serves media from /media/', () => {
    const paths = JSON.stringify(creativeItems).match(/"\/[a-z]+\//g) ?? []
    for (const p of paths) expect(p).toBe('"/media/')
  })
})

describe('buildPieces', () => {
  it('fails loudly when two titles slug the same', async () => {
    const { buildPieces } = await import('./pieces')
    const a = creativeItems[0]
    expect(() => buildPieces([a, { ...a, title: a.title.toUpperCase() }])).toThrow(/both slug to/)
  })

  it('leaves out the cut images and gives Contours a big tile', () => {
    for (const cut of ['molten', 'tendrils', 'facets', 'terraces']) expect(pieceBySlug(cut)).toBeUndefined()
    expect(pieceBySlug('contours')?.size).toBe('big')
  })

  it('only sizes pieces that exist', () => {
    for (const s of sizedSlugs) expect(pieceBySlug(s), s).toBeDefined()
  })
})
