// The home page's filter and view, kept in the URL so they can be shared and
// survive going back from a piece's page: ?kind=video&view=index.
export type View = 'grid' | 'index'
export type KindFilter = 'all' | 'shaders' | 'video' | 'images' | 'audio'
export type Query = { kind: KindFilter; view: View }

export const KINDS: KindFilter[] = ['all', 'shaders', 'video', 'images', 'audio']

export function parseQuery(search: string): Query {
  const q = new URLSearchParams(search)
  const kind = q.get('kind') as KindFilter
  return { kind: KINDS.includes(kind) ? kind : 'all', view: q.get('view') === 'index' ? 'index' : 'grid' }
}

export function toQuery({ kind, view }: Query): string {
  const q = new URLSearchParams()
  if (kind !== 'all') q.set('kind', kind)
  if (view !== 'grid') q.set('view', view)
  const s = q.toString()
  return s ? `?${s}` : ''
}

// The live URL as a store, for useSyncExternalStore: hydration renders with the
// prerendered (server) query first, then the real one, without a mismatch.
const listeners = new Set<() => void>()
export function subscribeSearch(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}
export const getSearch = () => location.search

export function setQuery(q: Query) {
  history.replaceState(history.state, '', `${location.pathname}${toQuery(q)}${location.hash}`)
  listeners.forEach((l) => l())
}
