import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { Home } from '@/pages/Home'

export const paths = ['/']

export function render() {
  return renderToString(
    <StrictMode>
      <Home initialSearch="" />
    </StrictMode>,
  )
}
