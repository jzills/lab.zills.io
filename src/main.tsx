import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import { Home } from '@/pages/Home'
import { PiecePage } from '@/pages/PiecePage'
import { pieceBySlug } from '@/data/pieces'

// Each page was prerendered (scripts/prerender.ts); attach to whichever this is.
const slug = location.pathname.replace(/^\/|\/$/g, '')
const piece = slug ? pieceBySlug(slug) : undefined

hydrateRoot(document.getElementById('root')!, <StrictMode>{piece ? <PiecePage piece={piece} /> : <Home initialSearch="" />}</StrictMode>)
