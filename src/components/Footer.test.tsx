import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Footer } from './Footer'

describe('Footer', () => {
  const html = renderToString(<Footer />)
  const text = html.replace(/<[^>]+>/g, '')

  it('carries the Z/LLS mark with the copyright under it', () => {
    expect(text).toContain('Z/LLS')
    expect(text).not.toContain('©')
  })

  it('links back to the hub right beside the mark, above the copyright', () => {
    expect(html).toContain('href="https://zills.io/"')
    expect(text.replace(/<!-- -->/g, '')).toMatch(/^Z\/LLSzills\.io ↗$/)
  })

  it('links the Z/LLS mark to zills.io', () => {
    expect(html).toMatch(/<a[^>]*href="https:\/\/zills\.io\/"[^>]*>Z<span[^>]*>\/<\/span>LLS<\/a>/)
  })
})
