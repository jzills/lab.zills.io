import { useSyncExternalStore } from 'react'
import { Hero } from '@/components/Hero'
import { FilterBar } from '@/components/FilterBar'
import { Grid } from '@/components/Grid'
import { IndexView } from '@/components/IndexView'
import { Footer } from '@/components/Footer'
import { kindGroup, pieces } from '@/data/pieces'
import { getSearch, parseQuery, setQuery, subscribeSearch } from '@/lib/query'
import type { Query } from '@/lib/query'

// initialSearch is the query the page was prerendered with ('' for the real site).
export function Home({ initialSearch }: { initialSearch: string }) {
  const search = useSyncExternalStore(subscribeSearch, getSearch, () => initialSearch)
  const query = parseQuery(search)
  const shown = query.kind === 'all' ? pieces : pieces.filter((p) => kindGroup(p) === query.kind)

  const change = (q: Query) => setQuery(q)

  return (
    <div className="min-h-svh bg-bg">
      {/* No header: the hero carries the wordmark, and the filter bar the kinds. */}
      <Hero />
      <main id="work" className="scroll-mt-0">
        <FilterBar query={query} count={shown.length} onChange={change} />
        {query.view === 'grid' ? <Grid pieces={shown} /> : <IndexView pieces={shown} />}
      </main>
      <Footer />
    </div>
  )
}
