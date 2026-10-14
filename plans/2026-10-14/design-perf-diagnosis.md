# Design and performance diagnosis — 2026-10-14

Scope: the Astro site on branch `feat/astro-migration` at `667d825`, measured on the deploy preview
`https://deploy-preview-2--ateliertecidos.netlify.app`. Every number below was measured in this pass unless marked
"from PR #2".

Method:

- Lighthouse 12.8.2 (local Chrome, `--headless=new`), mobile (default simulated throttling) and desktop preset, four
  categories, with `*app.netlify.com*` and `*/.netlify/*` blocked so the preview-only feedback drawer does not count.
  One run per route plus two extra mobile runs on `/` to see variance.
- HEAD request on all 654 catalog images (19 covers + 635 prints) for `content-length`, `content-type`,
  `cache-control`; four images downloaded for pixel dimensions.
- A puppeteer pass (Chrome, same URL blocking) at 320 / 375 / 768 / 1440 px on the five route types: horizontal
  overflow, header and logo geometry, font faces actually loaded, natural vs displayed size of the first images,
  drawer keyboard behaviour, Leaflet tiles and markers, Wistia shadow root, Elfsight container.
- Static read of every file under `src/` plus full-page screenshots at 375 and 1440 px for the design review.

## 1. Scores

Lighthouse, deploy preview, drawer blocked (production-equivalent). Mobile first.

| Route | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Bytes | Requests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 62 (reruns: 90, 78) | 100 | 96 | 69* | 5.2 s | 7.0 s | 140 ms | 0 | 7.4 MB | 53 |
| `/` with Wistia + Elfsight blocked | 95 | – | – | – | 1.5 s | 2.9 s | 0 ms | 0 | – | – |
| `/catalogo/` | 75 | 99 | 100 | 69* | 1.1 s | 29.7 s | 0 ms | 0 | 24.0 MB | 16 |
| `/catalogo/abstratas/` | 89 | 100 | 100 | 69* | 0.8 s | 3.7 s | 0 ms | 0 | 1.5 MB | 14 |
| `/quem-somos/` | 60 | 100 | 100 | 69* | 3.3 s | 7.0 s | 309 ms | 0.095 | 7.4 MB | 50 |
| `/fale-conosco/` | 96 | 100 | 96 | 69* | 1.4 s | 2.6 s | 0 ms | 0 | 0.35 MB | 21 |

Desktop:

| Route | Perf | A11y | BP | SEO | FCP | LCP | CLS | Bytes | Requests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 97 | 100 | 100 | 69* | 0.4 s | 1.3 s | 0 | 18.1 MB | 66 |
| `/catalogo/` | 75 | 99 | 100 | 69* | 0.4 s | 14.1 s | 0 | 49.1 MB | 27 |
| `/catalogo/abstratas/` | 95 | 100 | 100 | 69* | 0.2 s | 1.5 s | 0.007 | 5.3 MB | 31 |
| `/quem-somos/` | 97 | 100 | 100 | 69* | 0.2 s | 0.3 s | 0.103 | 12.5 MB | 56 |
| `/fale-conosco/` | 99 | 100 | 100 | 69* | 0.3 s | 0.9 s | 0 | 0.42 MB | 24 |

\* SEO 69 on every route is only `is-crawlable`: Netlify sends `x-robots-tag: noindex` on deploy previews. Production
will not have it; every other SEO audit passes.

The mobile Home score swings between 62 and 90 across identical runs. The only variable is how much Wistia video the
run downloads (6.5–17 MB per load), so the score is not stable until Wistia is addressed.

Raw reports: `scratchpad/lh/out-{mobile,desktop}*.json`, `home-rerun-{1,2}.json`, `home-nowistia.json` (session
scratchpad, not committed).

## 2. Findings — performance

### P1. Catalog covers are 1.9–4.1 MB each, served at full size (critical)

| | Count | Total | Min | Median | p90 | Max | Pixels |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Covers (`capas/*.jpg`) | 19 | 50.2 MB | 1.9 MB | 2.6 MB | 3.7 MB | 4.1 MB | ~1890×1920 |
| Prints | 635 | 174.7 MB | 84 KB | 269 KB | 398 KB | 600 KB | 696×1200 |

Covers render at 256–328 px square on every breakpoint. `/catalogo/` transfers 24 MB on mobile and 49 MB on desktop
for images displayed at 1/36 of their pixel count; LCP there is 30 s mobile / 14 s desktop and the lazy-loaded first
cover is the LCP element. A category page transfers 1.5 MB (mobile, lazy, only the first screen) to 5–9 MB (whole
page; per-category print weight is 5.9–13.7 MB). Lighthouse estimates 38–48 MB savings on `/catalogo/` from resizing
plus modern formats, and 0.6–4.3 MB on a category page. GCS also sends `cache-control: public, max-age=3600`, so
nothing is cached beyond an hour.

The bucket layout is out of scope (PRD), so the fix is a transformation layer in front of the same URLs. Options
evaluated:

| Option | Build cost | Output | Notes |
| --- | --- | --- | --- |
| **Netlify Image CDN** (`/.netlify/images?url=…&w=…&fm=avif`) — recommended | none | on-demand, edge-cached, any width | Verified on the preview: local URLs already work (`/og-default.png` → 200 `image/webp`); remote GCS URLs return 400 until `[images] remote_images` lists the bucket in `netlify.toml`. Included in all Netlify plans. `astro dev` cannot resolve these URLs, so the component needs a raw-URL fallback in dev (`netlify dev` proxies them). |
| Astro `<Image>` with `image.remotePatterns` | downloads 225 MB and encodes 654 × N variants on every cold build | static files in `dist` | Netlify caches `node_modules/.astro` between builds, but a cold build is several minutes and `dist` grows by tens of MB. Simpler mental model, worse build. |
| `srcset` only | none | – | Pointless: there is only one source per image. |

Plan: allow the bucket in `netlify.toml`, teach `CatalogImage` to emit `src`/`srcset` through the Netlify CDN
(widths 320/480/640 for covers, 320/480/640/960 for prints; `fm=avif` with a webp or jpeg fallback via `<picture>`
or let the CDN negotiate via `Accept`), keep the `onerror` text fallback. Expected: `/catalogo/` from 24–49 MB to
well under 1 MB; category page from 5–9 MB to roughly 1–1.5 MB; LCP on `/catalogo/` from 30 s to ~2 s.

### P2. The LCP image on every catalog page is `loading="lazy"` (high, trivial)

`lcp-lazy-loaded` fails on `/catalogo/` and `/catalogo/<slug>/` on both form factors. The first row (first 2–6
images depending on the grid) should be `loading="eager"` with `fetchpriority="high"` on the first one; the rest stay
lazy. Also add `<link rel="preconnect">` to the image origin on catalog pages (`uses-rel-preconnect`, ~300 ms mobile).

### P3. Category pages are a single column on phones (high, design + perf)

At 375 px `/catalogo/abstratas/` is 18,303 px tall (38 prints, one 3:4 image per screen); `/catalogo/` is 8,311 px.
A two-column grid under `sm` halves page height and halves the pixel size each image needs (≈160 px wide), which
compounds with P1. See D6.

### P4. Wistia autoplay downloads 6.5–17 MB per visit and blocks the main thread (high, needs Victor)

Measured per load: 6.5 MB (mobile `/`), 7.2 MB (mobile `/quem-somos/`), 12.4 MB (desktop `/quem-somos/`), 17.2 MB
(desktop `/`). Third-party main-thread blocking 410–480 ms on mobile; `unused-javascript` ~200 KB. On desktop
`/quem-somos/` the player chrome causes CLS 0.103 (`#wistia_chrome_*`, "media element lacking an explicit size").
Blocking Wistia + Elfsight takes mobile Home from 62–90 to 95 with LCP 2.9 s.

This is the product decision already listed in PR #2 (dashboard autoplay off, or a click-to-load facade that shows a
poster and only injects `player.js` on click). Not touched until Victor decides. If a facade is chosen, it also
removes `player.js` (175 KB) and Sentry (25 KB) from the initial load.

### P5. Every internal link costs a 301 (medium, low effort)

Netlify pretty URLs redirect `/catalogo` → `/catalogo/` (verified: 301). `src/config/routes.ts`, the Home shortcut
cards, the category cards and the generated `_redirects` all target the slash-less form, so each navigation is
HTML-redirect-then-HTML, and a legacy URL does two hops (`/catalogo/1` → `/catalogo/abstratas` → `/catalogo/abstratas/`).
Fix: `trailingSlash: "always"` in `astro.config.mjs`, slash-form paths in `routes.ts` and the link helpers, and
slash-form targets in `src/lib/redirects.ts`; update `links.test.ts`, `redirects.test.ts`, the head audit and the
`aria-current` comparison in `Header.astro`.

### P6. Fonts: two weights loaded, four requested; no preload (medium, low effort)

Only Lato 400 and 700 are loaded (verified with `document.fonts`). Markup uses `font-light` (300) in five places and
`font-semibold` (600) in two, so the browser silently renders 400 and 700. Either load 300 (+~20 KB) or change the
classes to what is actually rendered (no visual change, honest markup). The two woff2 files are not preloaded; on
mobile Home the LCP render delay is 3.6 s while the image itself loads in 1.5 s, so adding `<link rel="preload">` for
both files is cheap insurance (`font-display: swap` is already set by fontsource).

### P7. Hero florals: one is distorted, all three are eager (medium)

- `image-aspect-ratio` fails on mobile Home: floral 3 is forced to `h-[33%] w-[70%]` and renders 224×158 against a
  224×167 natural box (squashed). Fix with `object-contain` or by dropping the explicit height. Visual bug.
- All three florals are `loading="eager"`, floral 1 also `fetchpriority="high"` (correct, it is the LCP element). Florals
  2 and 3 compete with it; `uses-responsive-images` reports ~100 KB oversupply from the `sizes` values. Keep eager, drop
  `fetchpriority` on 2 and 3, tighten `sizes`.
- Source PNGs are 5.5–6.7 MB each (2593×2284 and similar); the build already emits AVIF/WebP at 480/800/1200, so this
  only costs build time.

### P8. Quem Somos: photo renders at 230 px on desktop and CLS 0.095 on mobile (medium)

- `Story.astro` puts `md:w-2/5` on the `<img>`, but Astro `<Picture>` wraps it in a `<picture>` flex child with no
  width, so at 1440 px the photo is 230×153 while `sizes` promises 40 vw (and the 576 px source is fetched). Wrap the
  picture in a sized container or move the width classes to `pictureAttributes`. Visual bug, visible in the screenshot.
- Mobile CLS 0.095 comes from the first paragraph of the story (`p.text-base`), flagged as "media element lacking an
  explicit size". The culprit is not yet confirmed (candidates: the eager picture in the column, the `wistia-player`
  custom element before its script upgrades it). Needs a DevTools layout-shift trace once P4 is decided.

### P9. Cache headers for hashed assets (low)

`/_astro/*` is served with `cache-control: public,max-age=0,must-revalidate` (Netlify default). Hashed filenames can be
`max-age=31536000, immutable` via a `[[headers]]` block in `netlify.toml`. Lighthouse does not flag it yet, but every
navigation revalidates CSS and fonts.

### P10. Fale Conosco: map tiles are the LCP (low)

LCP element is an OpenStreetMap tile (2.6 s mobile); Leaflet JS is 156 KB raw / 46 KB transfer, 27 KB unused; the
page CSS is render-blocking for 152 ms. Preconnect to `tile.openstreetmap.org` buys ~300 ms. Initialising the maps on
intersection instead of at parse time would move both tile fetches off the critical path. Low value: the page is
already 96/99.

### P11. `image-redundant-alt` on `/catalogo/` (low, a11y 99)

Each category card is one link containing `<img alt="Abstratas">` and `<h2>Abstratas</h2>`, so screen readers hear
the name twice. Give the cover `alt=""` (the heading carries the name). Note the covers already have the category name
painted into the JPEG in a white serif, which the site cannot change.

### Verified OK (no action)

- No horizontal overflow on any of the five routes at 320 / 375 / 768 / 1440 px (`scrollWidth === clientWidth`).
- Drawer at 375 px: open sets `aria-expanded`, focuses the close control, makes `#page` inert and locks body scroll;
  Tab wraps after the last link; Shift+Tab wraps to the last link; Escape and the close button close and return focus
  to the hamburger.
- Both maps render tiles (6 and 4 at first paint) and one marker each. Wistia upgrades to a shadow-root player on Home
  and Quem Somos. Elfsight container is present and empty until scrolled into view (lazy flag works).
- CLS is 0 on `/`, `/catalogo/`, `/fale-conosco/`; first-party CSS is 19.7 KB; favicon 2 KB; logo SVG 11 KB.
- All 654 catalog URLs return 200 (`image/jpeg`).

## 3. Findings — design

Constraint: same sections, same order, same copy. Everything below is spacing, type, hierarchy, component polish,
responsiveness and states.

### D1. Heading scale is inconsistent across pages (high)

| Page | h1 | Section h2 |
| --- | --- | --- |
| Home | sr-only | `SectionTitle` 24 px regular uppercase; Contato block h2 30–48 px bold |
| Catálogo | sr-only | card names 20 px regular |
| Categoria | 30 px regular uppercase, `mt-8` | – |
| Quem Somos | 30 / 48 px **bold**, no margin-top | `SectionTitle` 24 px regular |
| Fale Conosco | 30 px regular, sentence case | 30 px regular |

Proposal: one page-title style (e.g. `text-3xl sm:text-4xl font-bold uppercase tracking-wide` with a shared top
margin) used by Categoria, Quem Somos and Fale Conosco; `SectionTitle` gets `text-2xl sm:text-3xl` plus letter
spacing and a consistent bottom margin, replacing the ad-hoc `mt-8` on each grid.

### D2. Six container widths and five corner radii (medium)

Widths in use: `max-w-screen-xl` ×7, `max-w-screen-lg` ×4, `max-w-6xl` ×2, `max-w-5xl`, `max-w-4xl`, `max-w-full`.
Radii: `rounded-lg`, `xl`, `2xl`, `3xl`, `[45px]`. Pick two widths (page `screen-xl`, prose `screen-lg`) and two radii
(cards `2xl`, buttons pill or `xl`), expressed as tokens in `global.css` where Tailwind lacks one.

### D3. Buttons: no focus/active states, legacy pill not reproduced (medium)

`Button.astro` has hover only. The old MUI look was a pill (40 px radius, 3 px beige border); the catalog CTA is
listed in PR #2 as not reproduced. Proposal: `rounded-full`, `border-brand-beige-light`, `focus-visible:outline-2
outline-offset-2 outline-brand-red-dark`, `active:scale-[0.98]`, consistent `px/py` and icon gap, and a secondary
variant for use on red backgrounds (the Instagram and Contato buttons sit on red today with a white border).

### D4. No visible focus style anywhere except browser defaults (medium, a11y)

`grep focus src` finds only the drawer script. Links in the header, footer and contact blocks, the shortcut cards and
the catalog cards rely on the default outline, which Tailwind v4 preflight keeps but which is invisible on the red
cards. Add a shared `focus-visible` ring on `Button`, `Card` links, nav links and the icon links.

### D5. Catalog grid and cards (high, pairs with P3)

- Prints: one column under 600 px (see P3); go `grid-cols-2` from the base and `3` at `md`, with `gap-3` on phones.
- Category cards: `hover:scale-105` on a 3-column grid overlaps neighbours; prefer `hover:-translate-y-1` plus a
  stronger shadow and an image zoom inside the clipped box. The name `h2` is 20 px regular on red; make it `font-bold`
  with tracking so it reads as a label.
- Print tiles are `li` with `p-4` red frames around a 3:4 image; on phones the frame should shrink (`p-2`) and the
  radius should match the card token.
- The "ACESSE CATÁLOGO COMPLETO" CTA floats between header and grid with `py-8`; align it with the page title block
  (title + CTA in one header band with consistent spacing).

### D6. Home sections (medium)

- `HighlightBanner`: three texts at the same size (24 / 24 / 20 px) with no hierarchy; `min-h-[22vh]` makes it
  viewport-dependent. Give the first line a label style, the second the heading weight, the third body size, and a
  fixed vertical padding.
- `NossasAtividades`: four tall red cards with `text-sm` body on phones (very dense in the 375 px screenshot); use
  `text-base`, more horizontal padding, `sm:grid-cols-2` before `lg:grid-cols-4`, and cap the card width on desktop so
  line length stays readable.
- `OQueProcura`: shortcut cards are plain bordered boxes; add hover/focus (background `brand-beige-light`, border
  `brand-red`) and align their radius with the card token.
- `QuemSomos` block: `mx-[5%] max-w-[90%] sm:mx-[10%] sm:max-w-[70%]` is percentage-based; use the page gutter and a
  `max-w-prose`. "QUEM SOMOS" eyebrow is `font-light` (renders 400, see P6).
- `Contato`: the red panel has `aspect-16/10` on phones, which forces a fixed-ratio box around three lines of text and a
  button; replace with padding so it wraps naturally. The florals panel reuses the hero assets; `sm:rounded-[45px]`
  becomes the card token.
- `BrandStatement`: `min-h-[20vh]` → padding.

### D7. Header and drawer (medium)

- The logo link is 150 px tall (180 px from `sm`) inside a 110 px header with `mt-5`, so the logo hangs 30–45 px below
  the bar (verified: `logoBottom` 140–155 vs header 110) and overlaps the hero. This matches the legacy look on Home
  (white hero) but on beige pages it just makes the logo float. Decide: keep the overlap as a brand gesture (then clip
  nothing and pad `#page` accordingly) or fit the logo into the bar. Needs Victor's preference.
- Desktop nav: active state is weight-only; add an underline or colour on `aria-current` and a visible hover
  underline. Link hit area is `px-2 py-1.5` with `mx-4`; move the spacing into padding so the whole gap is clickable.
- Drawer: a full-screen beige sheet with centred links; add larger spacing between links, the logo at the top and the
  contact icons at the bottom for parity with the footer. Keyboard behaviour is already correct.

### D8. Footer (low)

Nav is hidden on phones (`hidden sm:block`); show it as a row. The three columns use `w-[30%]` with the logo at 60 %
of its column; align the columns to the page gutter. "© 2024" is a literal: ask Victor whether it should track the
build year.

### D9. Quem Somos page (medium)

Photo width bug (P8) makes the layout look unbalanced on desktop. Text column could use `max-w-prose`, `leading-relaxed`
and a consistent paragraph gap; the mission cards reuse the activities card style (good) but their text is `font-light`
(renders regular).

### D10. Fale Conosco (low)

Address column is vertically centred beside a 300 px map, leaving dead space above and below; align to the top and let
the map height follow the column (`aspect-video` on phones, fixed height on `sm`). The "Contato" button and the two
"Abrir no Google Maps" buttons would pick up the pill style from D3. Section titles share D1.

## 4. Prioritised list

Impact is on the user-visible result (load time, visual quality); effort is implementation + verification.

| # | Item | Impact | Effort | Depends on |
| --- | --- | --- | --- | --- |
| 1 | P1 Netlify Image CDN for covers and prints (`netlify.toml` + `CatalogImage`) | very high | medium | – |
| 2 | P2 eager first row + `fetchpriority` + preconnect on catalog pages | high | low | 1 |
| 3 | P3/D5 two-column catalog grids on phones, card polish | high | low | – |
| 4 | P5 trailing-slash links and redirect targets | medium | low | – |
| 5 | P6 font preload + align weight classes | medium | low | – |
| 6 | P7 hero floral distortion + priorities + `sizes` | medium | low | – |
| 7 | P8 Quem Somos photo width | medium | low | – |
| 8 | D1/D2 heading scale, container widths, radius tokens | high (visual) | medium | – |
| 9 | D3/D4 button pill + focus states everywhere | high (visual, a11y) | low | 8 |
| 10 | D6 Home section polish | medium | medium | 8, 9 |
| 11 | D7 header/nav/drawer polish | medium | low | Victor: logo overlap |
| 12 | D9/D10 Quem Somos + Fale Conosco polish | medium | low | 8, 9 |
| 13 | P11 cover `alt=""` | low | trivial | – |
| 14 | P9 immutable cache headers for `/_astro/*` | low | trivial | – |
| 15 | P10 map preconnect / lazy init | low | low | – |
| 16 | D8 footer nav on phones | low | low | – |
| 17 | P4 Wistia facade or dashboard autoplay off | very high | low–medium | **Victor** |
| 18 | P8 mobile CLS on Quem Somos | low | investigation | 17 |

Decisions needed from Victor before implementation:

1. Wistia (P4): dashboard autoplay off, click-to-load facade, or leave as is.
2. Header logo overlap (D7): keep the overhang or fit the logo in the bar.
3. Footer year (D8): keep "© 2024" or derive from the build date.
4. Font weight 300 (P6): load Lato 300 to make `font-light` real, or drop the class.
5. Netlify Image CDN (P1): OK to rely on it (bandwidth counted on the Netlify plan) rather than build-time
   optimisation.

Suggested order of PRs on `feat/design-polish` (off `feat/astro-migration`): perf items 1–7 first (each with a
Lighthouse before/after appended to this file), then design items 8–12 as `style:` commits, then the low items.
