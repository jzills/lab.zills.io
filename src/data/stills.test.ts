import { describe, expect, it } from 'vitest'
import { pieces, stillCard, stillSrc } from './pieces'
import type { Piece } from './pieces'

const files = new Set(Object.keys(import.meta.glob('/public/stills/*.webp', { query: '?url' })).map((p) => p.replace('/public', '')))

describe('stills', () => {
  it('has a still and a card still for every shader', () => {
    for (const p of pieces.filter((p) => p.kind === 'shader')) {
      expect(files, p.slug).toContain(stillSrc(p))
      expect(files, p.slug).toContain(stillCard(p))
    }
  })

  it('uses existing artwork for images and videos, and nothing for sound', () => {
    const image = pieces.find((p) => p.kind === 'image')!
    expect(stillCard(image)).toMatch(/^\/media\/.+-card\.webp$/)
    const video = pieces.find((p) => p.kind === 'video')!
    expect(stillSrc(video)).toMatch(/poster/)
    expect(stillSrc({ kind: 'music', title: 'KO', slug: 'ko' } as Piece)).toBeUndefined()
  })
})
