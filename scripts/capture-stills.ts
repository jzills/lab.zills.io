// Renders a still of every shader piece into public/stills/<slug>.webp (1600 wide)
// and <slug>-card.webp (600 wide). Re-run after adding or changing a shader:
//
//   node scripts/capture-stills.ts            # all shaders
//   node scripts/capture-stills.ts molten     # just these slugs
//
// Needs chrome-headless-shell (CHROME, default: the Playwright cache) and ffmpeg.

import { createServer } from 'node:http'
import { readFile, mkdir, rm } from 'node:fs/promises'
import { execFile, execFileSync } from 'node:child_process'
import { promisify } from 'node:util'
import { homedir, tmpdir } from 'node:os'
import { join, extname } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const chrome = process.env.CHROME ?? join(homedir(), '.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell')
const only = new Set(process.argv.slice(2))

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Each shader item in creative.ts, with the file of its first variant.
const data = await readFile(join(root, 'src/data/creative.ts'), 'utf8')
const shaders = data
  .split(/\n {2}\{\n/)
  .filter((block) => block.trimStart().startsWith("kind: 'shader'"))
  .map((block) => ({ slug: slug(block.match(/title: '((?:[^'\\]|\\.)*)'/)![1].replace(/\\'/g, "'")), file: block.match(/shader\('([^']+)'/)![1] }))
  .filter((s) => only.size === 0 || only.has(s.slug))

const types: Record<string, string> = { '.html': 'text/html', '.glsl': 'text/plain' }
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url!, 'http://x').pathname)
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' })
    res.end(await readFile(join(root, path)))
  } catch {
    res.writeHead(404).end()
  }
}).listen(0)
const port = (server.address() as { port: number }).port

const run = promisify(execFile)
const out = join(root, 'public/stills')
await mkdir(out, { recursive: true })
const tmp = join(tmpdir(), `stills-${process.pid}.png`)

for (const s of shaders) {
  const url = `http://localhost:${port}/scripts/capture-stills.html?src=/src/data/shaders/glsl/${s.file}.glsl`
  // Async: the page fetches the shader from this script's own server, which a blocking call would starve.
  await run(chrome, ['--no-sandbox', '--hide-scrollbars', '--enable-unsafe-swiftshader', '--virtual-time-budget=8000', '--window-size=1600,1000', `--screenshot=${tmp}`, url], { timeout: 60_000 })
  for (const [name, width] of [[`${s.slug}.webp`, 1600], [`${s.slug}-card.webp`, 600]] as const) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-vf', `scale=${width}:-2`, '-quality', '82', join(out, name)])
  }
  console.log(`still: ${s.slug}`)
}

await rm(tmp, { force: true })
server.close()
