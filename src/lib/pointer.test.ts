import { describe, expect, it } from 'vitest'
import { previewsOnHover } from './pointer'

describe('previewsOnHover', () => {
  it('previews for a mouse, whatever the browser reports about hover', () => {
    expect(previewsOnHover('mouse', false)).toBe(true)
  })
  it('never previews for touch or pen, so taps do not start playback', () => {
    expect(previewsOnHover('touch', false)).toBe(false)
    expect(previewsOnHover('pen', false)).toBe(false)
  })
  it('never previews under reduced motion', () => {
    expect(previewsOnHover('mouse', true)).toBe(false)
  })
})
