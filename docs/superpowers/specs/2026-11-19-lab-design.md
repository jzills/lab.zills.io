# lab.zills.io: design

## Intent

The Lab is moving out of the resume site (j.zills.io/lab) onto its own subdomain, as part of the zills.io family. A gallery page is not enough to justify its own site, so it needs **impact**: the work itself should be the first thing a visitor sees, running live, in the first second. Visitors are clients and peers checking the creative side of Z/LLS. Success means someone lands, is struck by a full-screen piece, and keeps browsing.

## Goals

- First screen: one live shader, full-bleed, behind a huge **Lab.** wordmark (Direction A, approved).
- Below it, every piece in an edge-to-edge mosaic with no card frames: the work is the interface.
- A second **Index** view: an editorial numbered list where hovering a title runs it in a large preview (Direction B, approved as the second view).
- Every piece has its own shareable, prerendered page.
- It belongs to the family: dark only, Inter and JetBrains Mono, the Lab accent violet `#a78bfa`, a header with only the site name and a dot, and a footer linking back to zills.io.

## Non-goals

- No CMS, comments, analytics or light theme.
- No site search or portfolio assistant (those belong to j.zills.io).
- No new artwork. Content is the existing ~69 pieces, ported as-is.
- No changes to j.zills.io in this project. Its follow-up (redirect `/lab`, repoint links, delete the old Lab) is a separate project after this one ships.

## Anti-goals

- Gimmicks: easter eggs, effects that perform instead of the work. Motion comes from the pieces themselves; the UI's own motion stays to one entrance and hover states.
- A page that stutters or overheats phones because too many shaders run at once.
- Content hidden until JavaScript runs.

## Approaches considered

1. **Port the existing Lab into its own repo and rebuild the page as Direction A.** Same stack as the family (Vite, React, TypeScript, Tailwind v4, prerendered, GitHub Pages). Media stays in the repo. *Chosen:* it reuses working code (the shader runner and pool, lazy mounting, the lightbox fixes) and needs no new accounts.
2. **As 1, with videos in external storage** (Cloudflare R2 or Vimeo). A lighter repo, but it needs an account and setup. Kept as a later option if the repo gets heavy.
3. **Restyle the Lab where it is.** Ruled out: one Pages repo can't serve two custom domains.

## The page

Mockups: `docs/superpowers/specs/mockups/` (`immersive-hero-*`, `mosaic-desktop`, `index-*`). The hero mockup uses the "Molten" still as a stand-in for the live shader.

### Header

**Lab.** (violet dot) at left. At right on desktop: Shaders, Video, Images, Audio, which set the filter and scroll to the work. Phone: just the wordmark. The header floats over the hero; nothing in it links to other sites.

### Hero

- Full viewport on desktop, about 86% of it on phones, so the mosaic peeks in.
- One live shader from a **hero pool** (pieces marked `hero: true` in the data), chosen at random per visit.
- The prerendered HTML shows the first pool piece's still. The client swaps to a random pool piece after hydration, so the server and client markup match.
- Bottom left: a giant **Lab.** and the line "Shaders, generative video, images and sound. Most of it runs live, right here in your browser."
- Bottom right, small mono: `FEATURED`, then the piece's title and kind, then `69 PIECES` (computed). The title links to the piece's page.
- A dark gradient at the top and bottom keeps the text readable on any shader.
- It pauses when scrolled out of view.
- Under `prefers-reduced-motion`, it shows the still and doesn't animate.

### Filter bar

Sticky under the hero: All · Shaders · Video · Images · Audio (audio includes the Bandcamp music items), plus a **Grid | Index** toggle and a piece count at right. The filter and view live in the URL query (`?kind=shaders&view=index`), so they're shareable and survive back navigation. Tag filters (Ray Marching, Noise…) are dropped from the bar; tags appear on piece pages. *(Claude's call: fewer controls, more impact.)*

### Grid view (default)

- An edge-to-edge mosaic with a 3px gap: 4 columns on desktop, 2 on phones, dense packing.
- Tile size comes from an optional `size` field in the data (`big` = 2×2, `wide` = 2×1, `tall` = 1×2, default 1×1). Chosen by hand, so the mosaic has rhythm.
- **Shaders** run live while on screen, through the existing pool, which caps how many run at once. Off-screen they show their still.
- **Images** show their card image.
- **Videos** show their poster and play muted while hovered on desktop.
- **Audio and music** show artwork, or for pieces without artwork a violet-tinted panel with a waveform glyph.
- Titles and kind appear on hover and focus with pointers. On touch devices a small caption is always visible.
- The whole tile is a link to the piece's page. Focus shows a 2px violet inset outline.

### Index view

- A numbered list (`001`, `002`…) of titles in large type, with the kind in small mono at right.
- Desktop: hovering or focusing a row shows that piece in a large preview with a cut corner at right (running live for shaders, poster or still otherwise). The preview sticks while the list scrolls.
- Phones: each row has a small thumbnail and no preview pane.
- Rows link to piece pages.

### Piece pages (`/<slug>/`)

- One per piece, prerendered, with its own title, description and OG image.
- The media is full-bleed:
  - shaders run live, with a variant switcher if the piece has variants;
  - images show at full size, with a variant switcher;
  - videos play with controls;
  - music shows the Bandcamp embed in violet and dark colours;
  - audio plays in a plain player.
- Under the media: title, description, tags and credits (for videos with credits).
- Previous and next pieces, plus "← All work" back to the Lab.
- The slug comes from the title, using the existing `slug()` rule (`Molten` → `/molten/`). This replaces the lightbox. *(Claude's call: real URLs make single works shareable.)*

### Footer

A small Z/LLS mark and a `zills.io ↗` link back to the hub, per the family rule.

## Stills for shaders

Shaders have no images today, but stills are needed for: the prerendered hero, off-screen tiles, reduced motion, Index thumbnails and OG images. A script (`scripts/capture-stills`) renders each shader's first variant headlessly at a fixed time and writes `public/stills/<slug>.webp` (1600px wide), plus a ~600px card version. The stills are committed. Re-run the script when a shader is added.

## Motion and performance

- UI motion: tiles fade in once on load (CSS, from the prerendered HTML), plus hover states. Nothing in the UI loops.
- The shader pool caps concurrent live shaders. The builder tunes the cap so a mid-range phone stays smooth.
- Shaders only run while on screen and the tab is visible.
- Reduced motion: every shader shows its still, and videos don't autoplay.

## Accessibility and SEO

- Tiles and rows are real links in DOM order. Every tile and still has alt text: the title plus the kind.
- Text over the hero stays AA readable thanks to the gradient.
- Each page has a title, description, canonical URL, OG image, and a sitemap of all piece pages.

## Build and deploy

- Vite, React 19, TypeScript and Tailwind v4, mirroring `~/src/repos/zills.io`. No framer-motion.
- Prerender `/` and every `/<slug>/`.
- Ported from j.zills.io: `src/data/creative.ts` (plus the new `hero` and `size` fields), `src/data/shaders/glsl/*`, the shader runner and pool, the GLSL helpers and their tests, and `public/lab/` media, moved to `public/media/`.
- GitHub Actions deploys to Pages with `CNAME` = `lab.zills.io`. The repo visibility and DNS are the user's.
- Tests (Vitest), for example:
  - the data is valid: unique slugs, every shader has a still, `size` values are allowed, at least one hero piece;
  - every piece gets a prerendered page;
  - the filter query parses;
  - the prerendered home page shows the hero still and all tiles without JavaScript.

## Left to the builder

- Exact type sizes and spacing.
- Which pieces are in the hero pool and which tiles get `size`. Start with the three currently `featured` shaders as the pool, and adjust after seeing them.
- The shader pool cap.
- The waveform glyph and the Index preview's sticky behaviour.
