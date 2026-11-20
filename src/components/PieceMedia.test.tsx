import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { PieceMedia } from './PieceMedia'
import { pieces } from '@/data/pieces'
import type { Piece } from '@/data/pieces'

// Music has left the Lab's data for the audio site; the player still renders it.
const ko = { kind: 'music', title: 'KO', description: '', tags: [], slug: 'ko', bandcamp: { album: 1163472419, track: 802633773 }, url: 'https://desmata.bandcamp.com/album/mental-floss' } as unknown as Piece
const first = (kind: string) => (kind === 'music' ? ko : pieces.find((p) => p.kind === kind)!)

describe('PieceMedia', () => {
  it('shows a shader card as its still until it runs', () => {
    const p = first('shader')
    const html = renderToString(<PieceMedia piece={p} size="card" />)
    expect(html).toContain(`src="/stills/${p.slug}-card.webp"`)
    expect(html).toContain(`alt="${p.title} — shader"`)
  })

  it('shows an image card from its card file', () => {
    const p = first('image')
    if (p.kind !== 'image') throw new Error()
    expect(renderToString(<PieceMedia piece={p} size="card" />)).toContain(`src="${p.images[0].card}"`)
  })

  it('plays a full video with controls', () => {
    const html = renderToString(<PieceMedia piece={first('video')} size="full" />)
    expect(html).toContain('<video')
    expect(html).toContain('controls')
  })

  it('embeds full music from Bandcamp in the Lab colours', () => {
    const html = renderToString(<PieceMedia piece={first('music')} size="full" />)
    expect(html).toContain('bandcamp.com/EmbeddedPlayer')
    expect(html).toContain('linkcol=a78bfa')
  })

  it('never hides media in the prerendered HTML', () => {
    for (const p of pieces) for (const size of ['card', 'full'] as const) expect(renderToString(<PieceMedia piece={p} size={size} />)).not.toMatch(/opacity:\s*0/)
  })
})
