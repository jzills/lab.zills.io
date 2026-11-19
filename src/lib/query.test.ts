import { describe, expect, it } from 'vitest'
import { parseQuery, toQuery } from './query'

describe('query', () => {
  it('reads kind and view', () => {
    expect(parseQuery('?kind=video&view=index')).toEqual({ kind: 'video', view: 'index' })
  })
  it('falls back to all and grid', () => {
    expect(parseQuery('?kind=bogus')).toEqual({ kind: 'all', view: 'grid' })
    expect(parseQuery('')).toEqual({ kind: 'all', view: 'grid' })
  })
  it('omits defaults when writing', () => {
    expect(toQuery({ kind: 'all', view: 'grid' })).toBe('')
    expect(toQuery({ kind: 'shaders', view: 'index' })).toBe('?kind=shaders&view=index')
  })
})
