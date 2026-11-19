import { describe, expect, it } from 'vitest'
import { headFor } from './head'

describe('headFor', () => {
  it('titles and previews a piece page', () => {
    const head = headFor('/molten/')
    expect(head).toContain('<title>Molten — Lab</title>')
    expect(head).toContain('<link rel="canonical" href="https://lab.zills.io/molten/" />')
    expect(head).toMatch(/<meta property="og:image" content="https:\/\/lab\.zills\.io\/media\/[^"]+" \/>/)
  })

  it('titles the home page', () => {
    expect(headFor('/')).toContain('<title>Lab — Z/LLS</title>')
  })

  it('escapes quotes and ampersands from the data', () => {
    expect(headFor('/')).not.toMatch(/content="[^"]*&(?!amp;|quot;|lt;|gt;)/)
  })
})
