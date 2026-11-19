// Writes every page as static HTML: dist/index.html and dist/<slug>/index.html, each
// with its own <head> tags, plus dist/sitemap.xml. Runs after the client build and
// the SSR build of src/entry-server.tsx.
//
//   node scripts/prerender.ts

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)
const ssr = new URL('../dist-ssr/', import.meta.url)
const { paths, render } = await import(new URL('entry-server.js', ssr).href)

const template = await readFile(new URL('index.html', dist), 'utf8')
for (const marker of ['<!--head-->', '<div id="root"></div>']) {
  if (!template.includes(marker)) throw new Error(`prerender: no ${marker} in dist/index.html`)
}

const all = paths() as string[]
for (const path of all) {
  const { html, head } = render(path) as { html: string; head: string }
  const page = template.replace('<!--head-->', head).replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  const dir = new URL(`.${path}`, dist)
  await mkdir(dir, { recursive: true })
  await writeFile(new URL('index.html', dir), page)
}

const urls = all.map((p) => `  <url><loc>https://lab.zills.io${p}</loc></url>`).join('\n')
await writeFile(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
console.log(`prerender: ${all.length} pages`)
await rm(ssr, { recursive: true, force: true })
