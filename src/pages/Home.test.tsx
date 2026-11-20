import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Home } from './Home'
import { heroPool, piecePath, pieces, stillSrc } from '@/data/pieces'

const home = (search = '') => renderToString(<Home initialSearch={search} />)

describe('Home', () => {
  const html = home()

  it('links every piece', () => {
    expect(html).toContain('Lab')
    for (const p of pieces) expect(html).toContain(`href="${piecePath(p)}"`)
  })

  it("prerenders the first hero piece's still", () => {
    expect(html).toContain(`src="${stillSrc(heroPool[0])}"`)
  })

  it('filters by kind from the query', () => {
    const images = home('?kind=images')
    for (const p of pieces) {
      const linked = images.includes(`href="${piecePath(p)}"`)
      // The hero's title links to its page whatever the filter.
      if (p !== heroPool[0]) expect(linked, p.slug).toBe(p.kind === 'image')
    }
  })

  it('lists videos with sound under Audio too', () => {
    const audio = home('?kind=audio')
    for (const s of ['driftcast', 'bloom']) expect(audio).toContain(`href="/${s}/"`)
  })

  it('shows the index view as an ordered list', () => {
    expect(home('?view=index')).toContain('<ol')
  })

  it('never hides content in the prerendered HTML', () => {
    expect(html).not.toMatch(/opacity:\s*0|visibility:\s*hidden/)
  })

  it('links back to zills.io', () => {
    expect(html).toContain('href="https://zills.io/"')
  })

  it('has no header: the hero carries the wordmark and the filter bar the kinds', () => {
    expect(home()).not.toContain('<header')
  })
})
