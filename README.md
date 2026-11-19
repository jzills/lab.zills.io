# lab.zills.io

The Z/LLS Lab: shaders, generative video, images and sound. A prerendered React, TypeScript, Vite and Tailwind v4 site on GitHub Pages, with a page per piece.

## Setup

```sh
npm ci
npm run dev        # http://localhost:5173
```

Node 24 (as in CI).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload. |
| `npm run build` | Type-checks, builds the client and SSR bundles, then prerenders `/` and every `/<slug>/` into `dist/`, plus `sitemap.xml`. |
| `npm run preview` | Serves `dist/` locally. |
| `npm test` | Unit tests (Vitest). |
| `npm run lint` | ESLint. |

## Adding a piece

1. Add it to `src/data/creative.ts` (the data model is documented there). Media goes in `public/media/`; a shader goes in `src/data/shaders/glsl/<name>.glsl`.
2. For a shader, capture its still: `node scripts/capture-stills.ts <slug>`. It needs `chrome-headless-shell` (set `CHROME`, default is the Playwright cache) and `ffmpeg`. The tests fail if a shader has no still.
3. Optional: give it a tile size (`big`, `wide`, `tall`) in `src/data/pieces.ts`. Featured shaders form the hero pool.

The slug, and so the page URL, comes from the title: `Pseudo Fractal #5` becomes `/pseudo-fractal-5/`. Renaming a piece changes its URL.

## How shaders run

`src/lib/useShaderRunner.ts` (ported from j.zills.io) draws shaders through one shared WebGL context on desktop and one context per tile on phones. Only the grid row most on screen animates on desktop, and only a narrow band through the middle of the screen on phones (`src/lib/shaderPlayback.ts`). Everywhere else, and under reduced motion or without WebGL, the still from `public/stills/` shows.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: install, test, build, then publish `dist/` to GitHub Pages. `public/CNAME` serves it at `lab.zills.io`.

Design and plan: `docs/superpowers/`.
