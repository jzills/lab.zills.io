// When a shader card plays: on hover or keyboard focus with a mouse (for the lab
// grid), in the middle band of the screen on touch screens, otherwise in the grid
// row most on screen. Shared by both ways of running shaders (see useShaderRunner).
import { animateInRow } from '@/lib/animateRow'

// Whether shaders run the phone way: a WebGL context per tile, animating in a band
// through the middle of the screen. Browsers drop the oldest context past about 16, so
// this is only for touch screens showing the narrow two-column mosaic. A touchscreen
// laptop reports a touch pointer too, but its four columns would need more contexts
// than Chrome allows, and tiles whose context was dropped went blank as it scrolled.
export function usesPhoneShaders({ coarse, wide }: { coarse: boolean; wide: boolean }) {
  return coarse && !wide
}

// Decided once per page load. Guarded for prerendering, which has no window.
const matches = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches
// --breakpoint-wide in index.css: four mosaic columns from here up.
export const phoneShaders = usesPhoneShaders({ coarse: matches('(pointer: coarse)'), wide: matches('(min-width: 56.25rem)') })

// On touch devices only the middle band of the screen animates, so a page of
// shaders runs about one at a time; on desktop it's the grid row most on screen.
// Phones animate only shaders crossing this band through the middle of the screen. Narrower
// than on j.zills.io because the Lab's mosaic puts two tiles side by side.
const animateBand = '-42% 0px -42% 0px'

// Whether the visitor last moved focus with the keyboard. Escape doesn't count: it
// closes things, and closing the lightbox hands focus back to the card that opened it,
// which shouldn't set that card playing for someone using a mouse.
let keyboardFocus = false
let trackingInput = false
function trackInput() {
  if (trackingInput) return
  trackingInput = true
  document.addEventListener('keydown', (e) => { if (e.key !== 'Escape') keyboardFocus = true }, { capture: true })
  document.addEventListener('pointerdown', () => { keyboardFocus = false }, { capture: true })
}

// With a mouse, a shader given a hover target plays only while the pointer is over
// it or keyboard focus is inside it, so a grid of them runs one at a time.
function watchHover(target: HTMLElement, onChange: (on: boolean) => void) {
  trackInput()
  let hovered = false
  let focused = false
  const update = () => onChange(hovered || focused)
  const enter = () => { hovered = true; update() }
  const leave = () => { hovered = false; update() }
  const focusIn = () => { focused = keyboardFocus; update() }
  const focusOut = (e: FocusEvent) => {
    if (target.contains(e.relatedTarget as Node | null)) return
    focused = false
    update()
  }
  target.addEventListener('pointerenter', enter)
  target.addEventListener('pointerleave', leave)
  target.addEventListener('focusin', focusIn)
  target.addEventListener('focusout', focusOut)
  // The pointer may already be over the card when the canvas mounts.
  hovered = target.matches(':hover')
  focused = keyboardFocus && target.contains(document.activeElement)
  update()
  return () => {
    target.removeEventListener('pointerenter', enter)
    target.removeEventListener('pointerleave', leave)
    target.removeEventListener('focusin', focusIn)
    target.removeEventListener('focusout', focusOut)
  }
}

export function watchAnimate(el: HTMLElement, onChange: (on: boolean) => void, hoverTarget?: HTMLElement | null) {
  if (!phoneShaders && hoverTarget) return watchHover(hoverTarget, onChange)
  if (!phoneShaders) return animateInRow(el, onChange)
  const observer = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), { rootMargin: animateBand })
  observer.observe(el)
  return () => observer.disconnect()
}
