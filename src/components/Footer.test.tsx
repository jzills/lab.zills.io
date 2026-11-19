import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Footer } from './Footer'

describe('Footer', () => {
  const html = renderToString(<Footer />)
  const text = html.replace(/<[^>]+>/g, '')

  it('carries the Z/LLS mark with the copyright under it', () => {
    expect(text).toContain('Z/LLS')
    expect(text).toContain(`© ${new Date().getFullYear()} Joshua Zillwood`)
  })

  it('links back to the hub', () => {
    expect(html).toContain('href="https://zills.io/"')
  })
})
