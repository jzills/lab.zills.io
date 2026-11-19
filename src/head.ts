import { pieceBySlug, pieces, stillSrc } from '@/data/pieces'

const SITE = 'https://lab.zills.io'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const slugOf = (path: string) => path.replace(/^\/|\/$/g, '')

// The <head> tags for a prerendered path: title, description, canonical and link previews.
export function headFor(path: string): string {
  const piece = path === '/' ? undefined : pieceBySlug(slugOf(path))
  if (path !== '/' && !piece) throw new Error(`headFor: unknown path ${path}`)
  const title = piece ? `${piece.title} — Lab` : 'Lab — Z/LLS'
  const description = piece
    ? piece.description
    : `Shaders, generative video, images and sound by Z/LLS: ${pieces.length} pieces, most of them running live in your browser.`
  const image = SITE + (stillSrc(piece ?? pieces.find((p) => p.hero)!) ?? '/og-image.webp')
  const url = SITE + path
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="Lab — Z/LLS" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ')
}
