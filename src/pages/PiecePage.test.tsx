import { describe, expect, it } from 'vitest'
import { paths, render } from '@/entry-server'
import { pieceBySlug, piecePath, pieces } from '@/data/pieces'

describe('piece pages', () => {
  it('prerenders home and one page per piece', () => {
    expect(paths()).toHaveLength(pieces.length + 1)
    expect(paths()).toContain('/contours/')
  })

  it('shows the piece with a way back and to the next piece', () => {
    const { html } = render('/contours/')
    const i = pieces.indexOf(pieceBySlug('contours')!)
    expect(html).toContain('Contours')
    expect(html).toContain('href="/"')
    expect(html).toContain(`href="${piecePath(pieces[(i + 1) % pieces.length])}"`)
  })

  it('wraps from the last piece to the first', () => {
    expect(render(piecePath(pieces.at(-1)!)).html).toContain(`href="${piecePath(pieces[0])}"`)
  })

  it('refuses unknown paths', () => {
    expect(() => render('/nope/')).toThrow()
  })

  it('keeps the Lab. mark in the header, linking home', () => {
    const header = render('/contours/').html.match(/<header[\s\S]*?<\/header>/)![0]
    expect(header).toMatch(/<a href="\/"[^>]*>Lab<span/)
  })
})
