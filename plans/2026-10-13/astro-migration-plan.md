# Plan: Migration to Astro (Home first)

> Source PRD: `plans/2026-10-13/astro-migration-design.md`
> Revised after adversarial review r1 (`astro-migration-reviews/r1-report.md`).

## Architectural decisions

Durable decisions that apply across all phases:

- **Branch strategy**: one long-lived branch `feat/astro-migration` off `main`. Each phase is one or more atomic commits on that branch. No PR to `main` until Phase 8 is done and the owner approves the cutover. The React/Vite app is **not deleted in Phase 1**: it is moved whole into `legacy/` (excluded from the Astro build and from `astro check`), stays there as the migration source for copy, data and assets, and is deleted in Phase 8 after a diff against `main`.
- **Stack**: Astro 7 (current stable major, 7.3.x at plan time), static output, Tailwind CSS v4 via the Vite plugin, yarn 1 (vendored release stays), Node 22 LTS pinned in `.nvmrc`, Vitest for unit tests, `astro check` for types. No UI framework integration, no SSR adapter.
- **Production origin**: `https://ateliertecidos.com.br` (live Netlify site `ateliertecidos`, linked to this repository; `www.` already 301s to the apex). It is the `site` value for canonical URLs, sitemap, robots and Open Graph. Owner confirmation pending; recorded as the working value.
- **Validation is the build**: `yarn build` runs, in order, `astro check`, `vitest run`, and `astro build`. `netlify.toml` uses `yarn build`, so a type error, a failing test or an invalid catalog cannot deploy. Individual scripts (`yarn check`, `yarn test`, `yarn build:only`) exist for local iteration.
- **Routes**: `/`, `/catalogo`, `/catalogo/[slug]`, `/quem-somos`, `/fale-conosco`, `/404`. Legacy `/catalogo/<numeric id>` and `/quemSomos` redirect with 301. Netlify SPA fallback is removed.
- **Deploy config**: `netlify.toml` in repo (build `yarn build`, publish `dist`, Node 22). `_redirects` is generated at build, never hand-edited. Redirects are verified locally with `netlify dev` (which applies `_redirects`), never with `astro preview`.
- **Deep modules** (pure TS, UI-independent, tested):
  - `site config` — single source of business facts: brand name, site URL, WhatsApp number + `wa.me` URL, landline, e-mail, Instagram handle/URL, opening hours, and a `locations` record with `store` and `production`, each carrying label, address lines, coordinates and its own `mapsUrl`.
  - `catalog collection` — JSON content collection. Entry shape: `{ id: string (= slug), legacyId: number, name: string, cover: url, prints: [{ id: number, image: url }] }`. The Astro entry id is the slug; the legacy numeric id lives in `legacyId`. A **whole-collection validator** (runs inside the build via the content config and is also imported by tests) enforces: unique slugs, unique legacy ids, cover present, prints non-empty, no duplicate image URL within a category.
  - `redirects generator` — emits `_redirects` lines from the catalog collection (`/catalogo/<legacyId>` → `/catalogo/<slug>`) plus the static `/quemSomos → /quem-somos` rule, all `301`.
  - `SEO builder` — `buildHead({ title, description, path, image? })` → full head data (title with " | Atelier Tecidos" suffix, canonical on the production origin, OG/Twitter) and `buildLocalBusinessJsonLd(siteConfig)`.
- **Design tokens**: Tailwind theme with `brand-beige` (`#E4D2C1`, light `#F0E3D6`, dark `#C2B09D`), `brand-red` (`#ac0a0b`, light `#e34949`, dark `#7b0708`), text on red `#ffffff`, text on beige `#000000`, font Lato, breakpoints `sm 600px`, `md 900px`, `xl 1536px` (matching the MUI defaults the current layout depends on). Global CSS owns the font import, body background and scrollbar styles.
- **Business facts** (confirmed by the owner 2026-10-13 unless marked): store Av. São Paulo, 298, Setor Campinas, Goiânia - GO, 74510-030 (-16.6707, -49.2909); production Rua 11 de Janeiro, Qd 02, Lt 01 e 02, Vila Aurora Oeste, Goiânia - GO, 74425-100 (-16.6797, -49.3068); WhatsApp (62) 98442-0366; landline (62) 3294-0595; e-mail tecidosatelier@gmail.com; Instagram `atelier.tecidosoficial`; hours Mon–Fri 08:00–18:00. Each location keeps the Google Maps URL currently in its map component. **(assumed, owner to confirm)** footer and JSON-LD use the store address; today's footer shows the production address.
- **Interactivity**: only vanilla `<script>` blocks: header drawer, Leaflet init on contact page, third-party embeds (Wistia, Elfsight) as declarative script tags.
- **Drawer accessibility**: while open, page content outside the drawer is `inert`, body scroll is locked, Tab cycles inside the drawer, Escape and the close control close it, focus returns to the trigger.
- **Images**: local assets (logo SVG, round logo PNG, three florals, Quem Somos JPEG) go through Astro's image pipeline. Catalog images stay remote GCS URLs with explicit `width`/`height`, `loading="lazy"`, and an `onerror` fallback that hides the broken card image and shows the category/print name.
- **Project guidance moves in Phase 1**: `CLAUDE.md`, `fe-conventions`, `do-work` and `verify-before-done` are rewritten for Astro before any page work, so every later `/do-work` phase runs under correct instructions.
- **Tests assert invariants, not snapshots**: no fixed category count, no duplicated slug list. Legacy equivalence (19 categories, slugs equal the old `rota` segments, 20 redirect lines) is a one-time migration check script in Phase 3 that reads `legacy/`, and is deleted with `legacy/` in Phase 8.
- **Language**: code, comments, commits in English; UI copy pt-BR. Copy is migrated verbatim from `legacy/` unless the PRD says otherwise.

### Source material to migrate (reuse audit)

Nothing from the React app is imported by the Astro project. After Phase 1 these paths live under `legacy/` and are the only source of truth for data and copy; read them before the corresponding phase:

- `legacy/src/catalogoItens/catalogo.js` — 19 categories, covers, `rota` slugs, print URLs → catalog collection JSON. Known data issue: Animal Print lists the same image twice (ids 1 and 32); the collection keeps one.
- `legacy/src/Style/Theme.ts`, `legacy/src/index.css` — palette, font, scrollbar → Tailwind tokens + global CSS.
- `legacy/src/utils/enums/Routes.ts` — nav labels "Home", "Quem Somos", "Catálogo", "Fale Conosco".
- `legacy/src/components/Home/*.tsx` — Home copy (banner phrases, brand statement, Quem Somos teaser, four activity texts, contact CTA, Instagram heading), Wistia media id `k82pzy208k`, Elfsight app id `fa3cce2c-0b62-4540-8006-243f19d63006`.
- `legacy/src/components/QuemSomos/ImagemTexto.tsx`, `Atividades.tsx` — company story paragraphs and three mission texts.
- `legacy/src/components/FaleConosco/*.tsx` — contact copy, map coordinates, the two Google Maps URLs.
- `legacy/src/components/Footer.tsx` — footer layout and copyright line.
- `legacy/src/assets/*` — logo SVG, round logo, florals, Quem Somos photo.
- `legacy/src/components/Catalogo/CatalogoCompleto.tsx` — "ACESSE CATÁLOGO COMPLETO" CTA.

---

## Phase 1: Astro skeleton, guidance, shell and Home hero

**User stories**: 1, 2, 10, 11, 12, 13, 14, 15, 16, 34, 35, 38, 39, 40

### What to build

Create the branch. Move the entire current project (`src/`, `index.html`, `vite.config.ts`, `public/_redirects`, old `package.json`, eslint/tsconfig files, `.github/workflows/main.yml`) into `legacy/`, then scaffold Astro 7 + Tailwind v4 at the repo root with `legacy/` excluded from `tsconfig`, `astro check` and Vitest. Rewrite `CLAUDE.md` (commands, structure, rules), `fe-conventions`, `do-work` and `verify-before-done` for the Astro project so subsequent phases run under correct guidance. Deliver a complete vertical slice: base layout (lang pt-BR, head from the SEO builder, Header, Footer, global styles), the `site config` module with both locations, the Tailwind tokens, and the Home page containing only the hero (logo + optimized florals). Header has the four nav links and an accessible vanilla drawer. Footer shows the store address, phones, e-mail, Instagram and WhatsApp links from site config. `yarn build` chains check, test and build; `netlify.toml` and `.nvmrc` committed. First unit tests for the SEO builder.

**Reuse:**
- `legacy/src/Style/Theme.ts`, `legacy/src/index.css` → tokens and global CSS.
- `legacy/src/utils/enums/Routes.ts` → nav labels.
- `legacy/src/assets/LogoEscrita.svg`, `ATELIER-LOGO.png`, `ImagemFundo1/*.png` → copied to the Astro assets folder.
- `legacy/src/components/Header.tsx`, `Footer.tsx`, `Home/ImagemLogo.tsx` → layout reference only.
- Existing `.claude/skills/*` and `CLAUDE.md` → keep format, rewrite content.
- Reuse: none for drawer script, SEO builder, site config — new.

### Acceptance criteria

- [ ] `legacy/` contains the complete former project; root `package.json` has no `react`, `@mui/*`, `@emotion/*`, `react-router-dom`, `react-leaflet`, `gh-pages`; `yarn build` ignores `legacy/`.
- [ ] `yarn build` runs `astro check` (zero errors), `vitest run` (pass) and `astro build` in that order and fails if any step fails (verified by temporarily breaking a test).
- [ ] `dist/index.html` renders the hero as HTML; florals are emitted as resized WebP/AVIF; no file in `dist` exceeds 500 KB.
- [ ] `CLAUDE.md`, `fe-conventions`, `do-work`, `verify-before-done` describe Astro: commands (`yarn dev`, `yarn build`, `yarn check`, `yarn test`), folder layout, Tailwind token rule, site-config rule, catalog-data rule, `legacy/` is read-only reference. No mention of `tsc` baselines, MUI or React Router remains in them.
- [ ] Header: logo links to `/`; desktop shows four links; below `md` a hamburger with `aria-expanded` opens a full-screen drawer. While open: page content is `inert`, body scroll locked, Tab cycles within the drawer, Escape, the close control and any link close it, focus returns to the trigger.
- [ ] Footer renders the store address, landline, WhatsApp, e-mail and Instagram from site config; icons are `<a>` elements with `aria-label`; `wa.me` URL uses 5562984420366.
- [ ] Site config holds `site: "https://ateliertecidos.com.br"` and two locations each with its own `mapsUrl`; no business literal (phone, URL, address) appears outside it (grep-verified, excluding `legacy/`).
- [ ] `netlify.toml` (build `yarn build`, publish `dist`, Node 22) and `.nvmrc` committed; `yarn dev` runs.
- [ ] SEO builder tests: title suffix, canonical built on the production origin, OG defaults.

---

## Phase 2: Home page complete

**User stories**: 3, 4, 5, 6, 7, 8, 9, 42

### What to build

Add the remaining Home sections in order: highlight banner (three phrases), brand statement, Quem Somos teaser with Wistia player and "Saiba mais" link, "O que procura" with four link cards, "Nossas Atividades" four cards with icons, Contato block with WhatsApp CTA and Instagram card over florals, and the Elfsight Instagram feed under a "NOSSO INSTAGRAM" heading. Wistia and Elfsight are declarative script tags; Elfsight lazy. Icons are inline SVGs (Material icon paths) rather than an icon package. Home gets its final title and description.

**Reuse:**
- `legacy/src/components/Home/*.tsx` — all copy, migrated verbatim.
- Shared primitives from Phase 1 (layout, CTA button). Create `SectionTitle` and `Card` primitives here if two sections need them; otherwise none.

### Acceptance criteria

- [ ] All nine sections render in the PRD order; `SelosDeQualidade` is not recreated.
- [ ] Every CTA is an `<a>`: WhatsApp → `wa.me`, Instagram → profile, "Ver catálogo" → `/catalogo`, "Nossa loja" → `/fale-conosco`, "O que fazemos" and "Saiba mais" → `/quem-somos`. External links open in a new tab with `rel="noopener noreferrer"`.
- [ ] Wistia player `k82pzy208k` and Elfsight widget `fa3cce2c-0b62-4540-8006-243f19d63006` are present in the built HTML; each script tag appears exactly once.
- [ ] At 375 px width no horizontal scroll; `h1` for the page title and `h2` per section.
- [ ] `yarn build` ships no client JS other than the drawer script and third-party embeds.

---

## Phase 3: Catalog collection and catalog pages

**User stories**: 17, 18, 20, 21, 22, 23, 36, 37

### What to build

Convert `legacy/src/catalogoItens/catalogo.js` into a JSON content collection with the schema from the header (slug as entry id, `legacyId` for the number), dropping the duplicated Animal Print image. Implement the whole-collection validator and wire it into the content config so `astro build` fails on violations. Build `/catalogo` (grid of category cards with cover and name linking to `/catalogo/<slug>`), `/catalogo/[slug]` via `getStaticPaths` (print grid, lazy images with reserved aspect ratio and `onerror` fallback), the "ACESSE CATÁLOGO COMPLETO" WhatsApp CTA on both, and a 404 page. Unit tests for the validator. A one-time migration check script compares the collection with `legacy/` data.

**Reuse:**
- `legacy/src/catalogoItens/catalogo.js` — data source (stays in `legacy/` until Phase 8).
- `legacy/src/components/Catalogo/*.tsx`, `Prints/PrintsCard.tsx` — layout reference.
- Card primitive from Phase 2 if present.

### Acceptance criteria

- [ ] `dist/catalogo/index.html` lists every category in the collection; `dist/catalogo/<slug>/index.html` exists for every entry.
- [ ] `astro build` fails when a fixture introduces a duplicate slug, duplicate `legacyId`, missing cover, empty prints, or duplicate image within a category (verified by running the build against a broken fixture once).
- [ ] Vitest (invariants, no fixed counts): slugs unique and URL-safe, legacy ids unique, every entry has a cover and at least one print, no duplicate image URL per category.
- [ ] One-time migration script (reads `legacy/`): 19 entries, each slug equals the legacy `rota` segment, each `legacyId` equals the legacy `category_id`, print count per category equals legacy minus the one removed duplicate. Output pasted into the phase commit message.
- [ ] Print images have `loading="lazy"`, `decoding="async"`, `width`/`height` or an aspect-ratio box, and an `onerror` handler that swaps to the text fallback.
- [ ] `/catalogo/nao-existe` serves the 404 page (Netlify serves `dist/404.html`).
- [ ] Category pages have title "<Category name> | Atelier Tecidos", a category-specific description, and the cover as OG image.

---

## Phase 4: Legacy redirects

**User stories**: 19, 25

### What to build

A build-time redirects generator (Astro integration hook) that reads the catalog collection and writes `dist/_redirects` with one 301 per `legacyId` → `/catalogo/<slug>`, plus `/quemSomos → /quem-somos`. Unit tests for the generated lines. Verification with `netlify dev`.

**Reuse:**
- Catalog collection and validator from Phase 3.
- Reuse: none — new module.

### Acceptance criteria

- [ ] After `yarn build`, `dist/_redirects` has exactly `collection.length + 1` lines, all `301`, no duplicates, no SPA fallback.
- [ ] Vitest: every entry's `legacyId` appears exactly once and maps to its slug; the `/quemSomos` rule is present; no blank or malformed lines.
- [ ] `netlify dev` returns `301` with `Location: /catalogo/abstratas` for `/catalogo/1` and `Location: /quem-somos` for `/quemSomos` (curl output pasted in the commit message).

---

## Phase 5: Quem Somos page

**User stories**: 24, 25

### What to build

`/quem-somos` with the company story (heading + four paragraphs + optimized photo), the Wistia video block, and the three mission cards with icons. Page-specific title and description.

**Reuse:**
- `legacy/src/components/QuemSomos/ImagemTexto.tsx`, `Atividades.tsx`, `Video.tsx` — copy and media id. The missing local `.mp4` import is dropped.
- `legacy/src/assets/QuemSomos.jpeg` → Astro assets.
- Card/SectionTitle primitives from Phase 2.

### Acceptance criteria

- [ ] `dist/quem-somos/index.html` exists with `h1` "Atelier Tecidos", four story paragraphs verbatim, Wistia player, three mission cards.
- [ ] Photo emitted via the image pipeline with `alt` text.
- [ ] Header and footer links point to `/quem-somos`; no `/quemSomos` string in pages, layouts or components (the redirects module and its tests are excluded from this grep).

---

## Phase 6: Fale Conosco page with maps and JSON-LD

**User stories**: 26, 27, 28, 29, 33

### What to build

`/fale-conosco` with the contact block (e-mail, landline, WhatsApp CTA), "Nossa Loja" and "Nossa Produção" blocks each with address, phones and an interactive vanilla Leaflet map (OSM tiles, single marker, "Abrir no Google Maps" link from that location's `mapsUrl`). Leaflet CSS/JS loaded only on this page. Add the LocalBusiness JSON-LD (from the SEO builder and site config) to the base layout so every page carries it, with the opening hours. Unit tests for the JSON-LD builder.

**Reuse:**
- `legacy/src/components/FaleConosco/*.tsx` — copy, coordinates, the two Maps URLs. Phone "(62) 98482-0366" is replaced by the site-config WhatsApp number.
- Site config and SEO builder from Phase 1.

### Acceptance criteria

- [ ] `dist/fale-conosco/index.html` exists with both location blocks and two map containers; Leaflet assets are referenced only from this page.
- [ ] Each map renders a marker at its location's coordinates; each "Abrir no Google Maps" link equals that location's `mapsUrl` and opens in a new tab (the two hrefs differ).
- [ ] Every built page contains one `<script type="application/ld+json">` with `@type: LocalBusiness`, store address, telephone, `openingHoursSpecification` Mon–Fri 08:00–18:00, `sameAs` Instagram URL, `url` equal to the production origin.
- [ ] Vitest: JSON-LD parses, fields equal site config values, hours shape is correct.

---

## Phase 7: SEO completion

**User stories**: 30, 31, 32, 34

### What to build

Add `@astrojs/sitemap` with the production origin, a `robots.txt` pointing to the sitemap, a default Open Graph share image (brand logo on beige) in the public folder, and a verification script that audits every built page's head.

**Reuse:**
- SEO builder from Phase 1; extend, do not duplicate.

### Acceptance criteria

- [ ] Sitemap lists `/`, `/catalogo`, every category URL, `/quem-somos`, `/fale-conosco`, all on `https://ateliertecidos.com.br`.
- [ ] `dist/robots.txt` allows all and references the sitemap URL.
- [ ] Verification script (run as part of `yarn test`): every HTML file in `dist` has exactly one `<title>`, one `meta[name=description]`, `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `link[rel=canonical]`; titles **and descriptions** are unique across routes; canonical and `og:url` start with the production origin.
- [ ] `<html lang="pt-BR">` on every page.

---

## Phase 8: Reconcile, clean up and cutover PR

**User stories**: 41, 43

### What to build

Rebase `feat/astro-migration` on current `main`. Diff `legacy/` against `main` for any copy, contact or catalog change that landed during the migration and port it. Run a GCS URL-health script over every catalog image (HEAD must be 200). Delete `legacy/` and the one-time migration script, finalize `CLAUDE.md` and skills, update `.gitignore`. Open the PR to `main` with the cutover checklist; do not merge without explicit approval.

**Reuse:**
- `CLAUDE.md` and skills rewritten in Phase 1 — final polish only.

### Acceptance criteria

- [ ] Branch is rebased on `main`; `git diff main -- legacy/` (before deletion) shows no unported data or copy change.
- [ ] URL-health script output: every catalog image URL returns 200 (pasted in the PR).
- [ ] `git ls-files` shows no `legacy/`, no React/MUI/Vite leftovers, no `oldAtividades`, `SelosDeQualidade`, `Abstratas.tsx`, `QuemSomos copy.tsx`, `catalogo.js`.
- [ ] `yarn build` passes from a clean install on Node 22.
- [ ] Netlify deploy preview of the PR: every route 200; `/catalogo/1` and `/quemSomos` 301 with correct `Location`; Lighthouse mobile performance on `/` at or above 85 (Elfsight excluded if it dominates).
- [ ] Manual browser QA matrix completed and recorded in the PR: drawer (open, Tab cycle, Escape, close control, link close, focus return) on desktop and 375 px; 320 px and 375 px layouts of all five routes with no horizontal scroll; Wistia and Elfsight render; both maps render with markers and open the correct Google Maps place; a blocked third-party script does not break the page.
- [ ] PR opened with the checklist and the owner's pending confirmations resolved (production origin, footer address); merge awaits the owner's explicit "merge".
