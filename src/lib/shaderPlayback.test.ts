import { describe, expect, it } from 'vitest'
import { usesPhoneShaders } from './shaderPlayback'

// Phone shaders give each tile its own WebGL context, and browsers drop the oldest past
// about 16. Only the narrow two-column layout keeps few enough tiles on screen for that.
describe('usesPhoneShaders', () => {
  it('uses them on a touch phone, where the mosaic is two tiles wide', () => {
    expect(usesPhoneShaders({ coarse: true, wide: false })).toBe(true)
  })

  it('never uses them on a wide screen, even one that reports a touch pointer', () => {
    // A touchscreen laptop: four columns of tiles would need more contexts than Chrome allows.
    expect(usesPhoneShaders({ coarse: true, wide: true })).toBe(false)
  })

  it('never uses them with a mouse', () => {
    expect(usesPhoneShaders({ coarse: false, wide: false })).toBe(false)
    expect(usesPhoneShaders({ coarse: false, wide: true })).toBe(false)
  })
})
