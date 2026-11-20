import { describe, expect, it } from 'vitest'
import favicon from '../../public/favicon.svg?raw'
import { renderToString } from 'react-dom/server'
import { Footer } from './Footer'

describe('Footer', () => {
  const html = renderToString(<Footer />)
  const text = html.replace(/<[^>]+>/g, '')

  it('carries the Z/LLS mark with the copyright under it', () => {
    expect(text).toContain('z//s')
    expect(text).not.toContain('©')
  })

  it('links back to the hub right beside the mark, above the copyright', () => {
    expect(html).toContain('href="https://zills.io/"')
    expect(text.replace(/<!-- -->/g, '')).toMatch(/^z\/\/szills\.io ↗$/)
  })

  it('links the Z/LLS mark to zills.io', () => {
    expect(html).toMatch(/<a[^>]*href="https:\/\/zills\.io\/"[^>]*>z<span[^>]*><\/span><span[^>]*>\/\/<\/span>s<\/a>/)
    expect(html).toMatch(/<span[^>]*class="[^"]*bg-accent[^"]*"[^>]*><\/span><span[^>]*>\/\/<\/span>/)
  })
})

describe('favicon', () => {
  // The family favicon: a bold z drawn as a shape (favicons can't load web fonts) and the site's dot.
  it('is the z. symbol with this site\'s dot', () => {
    expect(favicon).toMatch(/<path[^>]*d="[^"]+"/)
    expect(favicon).not.toContain('<text')
    expect(favicon).toMatch(/<circle[^>]*fill="#a78bfa"/)
  })
})
