import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { Home } from '@/pages/Home'
import { PiecePage } from '@/pages/PiecePage'
import { pieceBySlug, piecePath, pieces } from '@/data/pieces'
import { headFor, slugOf } from '@/head'

export const paths = () => ['/', ...pieces.map(piecePath)]

export function render(path: string): { html: string; head: string } {
  const piece = path === '/' ? undefined : pieceBySlug(slugOf(path))
  if (path !== '/' && !piece) throw new Error(`render: unknown path ${path}`)
  const html = renderToString(<StrictMode>{piece ? <PiecePage piece={piece} /> : <Home initialSearch="" />}</StrictMode>)
  return { html, head: headFor(path) }
}
