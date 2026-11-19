import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { IndexView } from './IndexView'
import { pieces } from '@/data/pieces'

describe('IndexView', () => {
  it('sets row numbers and kinds in a colour that meets AA contrast (zinc-500 is 4.1:1)', () => {
    const html = renderToString(<IndexView pieces={pieces} />)
    expect(html).toContain('001')
    expect(html).not.toContain('text-zinc-500')
  })
})
