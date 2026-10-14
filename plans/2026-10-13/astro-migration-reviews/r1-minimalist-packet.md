You are an adversarial reviewer. Your job is to find real problems, not to validate the work.

## Intent (fixed — do not challenge this)
Rebuild the site as a fully static Astro site, with Tailwind CSS for styling and zero React in the browser. The Home page is rebuilt first and sets the design language and component conventions; Catálogo, Quem Somos and Fale Conosco follow in the same project. Nothing ships to production until every page is migrated; the Astro project is developed on a long-lived feature branch that replaces the Vite/React app at the repository root, and merging that branch to `main` is the cutover.

## Your role
**Minimalist** — necessity. What can be deleted without losing the stated goal? Which abstractions exist for a single call site? Is this the simplest path, or the one that felt most thorough? In plan mode: hunt scope that is not in the request.

## Conventions this must satisfy

Note: these conventions describe the CURRENT React project. The plan replaces that project with Astro; judge whether the plan carries over the durable rules (language, business-fact centralization, git workflow, deploy discipline, no large media) and whether it says what replaces the React-specific ones.

### .claude/skills/fe-conventions/SKILL.md

---
name: fe-conventions
description: Atelier site conventions for src/ (React 18 + TypeScript + Vite 5 + MUI 5 + React Router 6, yarn). Use BEFORE editing any .ts/.tsx file under src/, before adding a page/section/component, and before deciding where new code goes.
---

# FE Conventions — Projeto-Atelier

## Layout
- Pages in `src/routes/` — thin: import sections and compose, nothing else.
- Page sections in `src/components/<Page>/` (PascalCase folder per page). Cross-page pieces at `src/components/` root.
- Static data in `src/catalogoItens/`. New data files are `.ts` with exported types, not `.js`.
- Generic helpers in `src/utils/` even with a single caller. Don't wrap trivial native APIs.
- Routes: add the slug + pt-BR label to `src/utils/enums/Routes.ts`, the route to `src/main.tsx`.
- No path aliases — relative imports.

## Patterns
- Component: `const Name: FC<NameProps> = ({ ... }) => { ... }` + `export default Name;` at the bottom. One component per file; no inline sub-components or render helpers.
- Props: `interface NameProps` right above the component. Optional with default instead of required-but-stubbed (`[]`, `{}`, no-op).
- 3+ related props → group into an object, a hook, or a sub-component.
- Styling: match the file you're editing. Files already on `makeStyles` keep `makeStyles`; new files use MUI `sx`/`styled`. Never mix both in one file.
- Colors, fonts, breakpoints come from `theme` (`src/Style/Theme.ts`) — no hex literals, no ad-hoc media queries. Need a new color? Add it to the theme, don't recolor one component.
- Navigation: `useNavigate()` with `Routes.enum` slugs — no hard-coded paths.
- Constants: `as const` + `keyof typeof`; lookup maps typed `Record<Union, …>`.
- Remote images: GCS URLs, `loading="lazy"` on grids.
- Formatting (Prettier): double quotes, semicolons, trailing commas, 2 spaces.

## Discipline (block commit)
- **Discovery before creation**: grep `src/components/` for the concept first. Reuse or extend.
- **Avoid `useEffect`**: derive values during render; react in event handlers. Only for third-party scripts/DOM APIs (Wistia, Elfsight, Leaflet) — and always return a cleanup.
- No new duplicated contact data (WhatsApp, Instagram, address) — reuse the existing source or propose centralizing it.
- No commented-out code, no narration comments, no ticket IDs in comments.
- No new `tsc` errors (compare total count before/after).

## Feedback loops before commit
```bash
npx tsc --noEmit 2>&1 | grep -c "error TS"   # must not grow vs. baseline
yarn build
```


### CLAUDE.md — Core Rules and Known debt

## Core Rules (always apply)
- Code, comments, commits, docs in **English**; user-facing UI text in **pt-BR**. Existing Portuguese identifiers (`FaleConosco`, `BalaoDeTexto1`…) stay — don't rename unless asked
- Comments: default to none. Only a non-obvious WHY, one terse line
- Ask before assuming business facts (copy, contacts, prices, categories) — don't infer them from the repo
- WhatsApp number, Instagram URL and address are duplicated across components — grep every occurrence when changing one
- Don't commit large media (`src/assets/ImagemFundo1/*.png` are ~6 MB each already). Prefer GCS URLs
- Don't open images to "verify" visuals — Victor checks visuals himself
- NEVER add co-author tags, "Generated with Claude" footers, or references to `.claude/`, skills or plan files in commits/PRs
- `use-personal` before every commit/push (the `use-personal-before-git` hook does it automatically)
- Git workflow (STRICT): feature branch off `main` (`feat/…`, `fix/…`) → atomic conventional commits → `gh pr create`. NEVER push to `main`, force-push, `--amend`, `--no-verify`, or `git add -A`/`.`. NEVER merge a PR without an explicit "merge"
- Deploy (STRICT): Netlify builds from the repo — merging into the deployed branch goes live. Always confirm with the user first

## Known debt (don't fix unless asked)
- `tsc` errors (unused imports, orphaned `src/routes/Catalogos/Abstratas.tsx`)
- `@mui/styles` `makeStyles` is deprecated but is the dominant styling pattern
- Dead files: `components/QuemSomos/oldAtividades`, `SelosDeQualidade.tsx` (returns `null`), `routes/QuemSomos copy.tsx` (live route, odd name)
- Wistia/Elfsight embeds inject scripts on every mount without cleanup

## Target

### PRD: plans/2026-10-13/astro-migration-design.md

# Atelier Tecidos — Migration to Astro (Home first)

Date: 2026-10-13
Status: Draft for review

> Decisions marked **(assumed)** were taken with the recommended default because the interview timed out. Confirm or change them before `/prd-to-plan-generic`.

## Problem Statement

The Atelier Tecidos site is a marketing site plus a fabric-print catalog. Today it is a client-rendered React SPA (Vite + React 18 + MUI 5 + React Router 6). From the visitor's and owner's perspective this causes:

- **Slow first paint and poor Lighthouse scores.** Every page ships React, MUI, Emotion and React Router before any content renders. The hero decorations are three ~6 MB PNGs served unoptimized.
- **Weak SEO and link previews.** All routes serve the same empty `index.html`; there is no per-page title, description, Open Graph data, sitemap or structured data. Sharing a catalog category on WhatsApp or Instagram shows no preview, and search engines see no content.
- **A codebase that is hard to maintain.** Styling relies on the deprecated `@mui/styles` `makeStyles` API, business facts (WhatsApp number, Instagram URL, addresses, phones) are copy-pasted across many components and already disagree with each other, and third-party embeds (Wistia, Elfsight) are injected imperatively on every mount.
- **Unfriendly catalog URLs.** Category pages are addressed by numeric id (`/catalogo/1`) even though the data already carries readable slugs.

## Solution

Rebuild the site as a fully static Astro site, with Tailwind CSS for styling and zero React in the browser. The Home page is rebuilt first and sets the design language and component conventions; Catálogo, Quem Somos and Fale Conosco follow in the same project. Nothing ships to production until every page is migrated; the Astro project is developed on a long-lived feature branch that replaces the Vite/React app at the repository root, and merging that branch to `main` is the cutover.

For visitors the result is: pages that render instantly as plain HTML, readable URLs such as `/catalogo/abstratas` and `/quem-somos`, rich link previews, discoverable catalog categories, and the same sections and content as today in a cleaner, more modern execution. For the owner the result is a smaller, dependency-light codebase where every business fact lives in one place.

## User Stories

### Visitors — Home

1. As a visitor, I want the Home page to render its content as plain HTML on first load, so that I see the brand and offer immediately on a slow mobile connection.
2. As a visitor, I want the hero logo and floral decorations to load as optimized, correctly sized images, so that the page does not download megabytes of PNG.
3. As a visitor, I want the Home page to keep its current sections in the current order (hero, highlight banner, brand statement, Quem Somos with video, O que procura, Nossas Atividades, Contato, Instagram), so that the site still feels familiar.
4. As a visitor, I want the "O que procura" shortcuts to be real links (WhatsApp, catálogo, loja, o que fazemos), so that I can open them in a new tab or copy their URL.
5. As a visitor, I want the "Saiba mais" and "Ver catálogo" actions to be anchor links, so that navigation works without JavaScript.
6. As a visitor, I want the Wistia video and the Elfsight Instagram feed to keep working, so that I can watch the brand video and browse recent posts.
7. As a visitor, I want the Instagram feed to load lazily, so that it does not block the rest of the page.
8. As a visitor, I want the WhatsApp contact button to open a chat with the correct business number, so that I can reach a representative.
9. As a visitor on a phone, I want the Home layout to reflow into a single column with readable font sizes, so that nothing overflows or becomes unreadable.

### Visitors — Navigation

10. As a visitor, I want a fixed header with the logo and the four section links, so that I can move between pages from anywhere.
11. As a visitor on a phone, I want a hamburger menu that opens a full-screen drawer with the same links, so that navigation stays usable on small screens.
12. As a visitor, I want the mobile drawer to close when I pick a link, press Escape or tap the back arrow, so that I am never stuck in the menu.
13. As a visitor using a keyboard or screen reader, I want the header, drawer and buttons to be focusable with proper labels, so that I can use the site without a mouse.
14. As a visitor, I want every page to start at the top when I navigate, so that I do not land mid-page.
15. As a visitor, I want the footer to show the store address, phone, e-mail and social links on every page, so that contact information is always one scroll away.
16. As a visitor, I want the Instagram and WhatsApp icons in the footer to be real links with accessible names, so that they work with assistive technology.

### Visitors — Catálogo

17. As a visitor, I want `/catalogo` to list every category with its cover image and name, so that I can browse the collection.
18. As a visitor, I want each category to have a readable URL such as `/catalogo/abstratas`, so that links are meaningful and shareable.
19. As a visitor, I want an old link such as `/catalogo/1` to redirect permanently to the new slug URL, so that bookmarks and shared links keep working.
20. As a visitor, I want a category page to show every print in that category as a responsive image grid, so that I can see the designs.
21. As a visitor, I want catalog images to lazy-load with reserved space, so that the grid does not jump while loading.
22. As a visitor, I want an "Acesse catálogo completo" call to action that opens WhatsApp, so that I can request the full catalog.
23. As a visitor, I want an unknown category URL to return a proper 404 page, so that I understand the page does not exist.

### Visitors — Quem Somos

24. As a visitor, I want `/quem-somos` to present the company story, the video and the mission cards, so that I learn who Atelier is.
25. As a visitor, I want the old `/quemSomos` URL to redirect permanently to `/quem-somos`, so that existing links keep working.

### Visitors — Fale Conosco

26. As a visitor, I want `/fale-conosco` to show e-mail, phones and a WhatsApp button, so that I can choose how to reach the business.
27. As a visitor, I want to see the store (Nossa Loja) and the production site (Nossa Produção) each with its address and an interactive map, so that I can find them.
28. As a visitor, I want each map to offer an "Abrir no Google Maps" link, so that I can get directions on my phone.
29. As a visitor, I want the map library to load only on the contact page, so that other pages stay light.

### Visitors — SEO and sharing

30. As a visitor sharing a page on WhatsApp or Instagram, I want a title, description and image preview, so that the link looks trustworthy.
31. As a search engine, I want every route to have a unique title and meta description in pt-BR, so that results are meaningful.
32. As a search engine, I want a sitemap and robots.txt, so that all pages, including each category, are discoverable.
33. As a search engine, I want LocalBusiness structured data with name, address, phone, opening hours and social profiles, so that the business can appear in local results.
34. As a visitor, I want the page language declared as pt-BR, so that browsers and screen readers behave correctly.

### Owner / Maintainer

35. As the owner, I want every business fact (WhatsApp number, landline, e-mail, Instagram URL, store and production addresses, coordinates, opening hours) defined once, so that changing it updates the whole site.
36. As the owner, I want catalog categories and prints defined as validated data, so that a missing cover or duplicated slug fails the build instead of breaking the site silently.
37. As the owner, I want to add a category by adding a data entry and uploading images to the GCS bucket, so that no component code changes are needed.
38. As the maintainer, I want brand colors, fonts and breakpoints defined as design tokens in the Tailwind theme, so that styling is consistent and MUI is no longer needed.
39. As the maintainer, I want typecheck and unit tests to run in one command and pass with zero errors, so that the pre-existing tsc debt is gone.
40. As the maintainer, I want the Netlify build configuration committed to the repository, so that deploys are reproducible.
41. As the maintainer, I want the dead files, duplicated `oldAtividades`, `SelosDeQualidade` and the oddly named `QuemSomos copy` route to disappear with the migration, so that the codebase is clean.
42. As the maintainer, I want third-party scripts (Wistia, Elfsight, Leaflet) included declaratively in the page markup, so that there is no imperative script injection or cleanup logic.
43. As the owner, I want the cutover to happen in one merge after I approve, so that production never runs a half-migrated site.

## Implementation Decisions

### Scope and sequencing

- The whole site moves to Astro in one project. Home is built first and establishes layout, tokens and component conventions; Catálogo, Quem Somos and Fale Conosco follow.
- Work happens on a single long-lived feature branch that replaces the root project (package manifest, source tree, public assets). The React/Vite app, MUI, Emotion, React Router, react-leaflet and gh-pages dependencies are removed. Merging to `main` is the production cutover and requires explicit approval.
- Visual direction: same sections and order as today, cleaner modern execution. No pixel parity with the current `makeStyles` rules is required.

### Framework and tooling **(assumed)**

- Astro 5, fully static output (no SSR adapter).
- Tailwind CSS v4 via the Vite plugin. Brand tokens (beige `#E4D2C1` family, red `#ac0a0b` family, Lato font, existing `sm`/`md`/`xl` breakpoints) are declared as theme tokens; one global stylesheet holds the font import, body background and scrollbar styling.
- Node 22 LTS pinned via `.nvmrc`; yarn 1 stays as package manager.
- Build settings committed in `netlify.toml` (build command, publish directory, Node version). The SPA fallback redirect is removed because every route is a real HTML file.
- Quality gates: `astro check` (zero errors), `astro build`, and Vitest unit tests. The current pre-existing `tsc` error debt is retired because the old source is removed.

### Interactivity

- No UI framework in the browser. The only client-side scripts are:
  - Header drawer toggle (open/close, Escape, click outside, close on link click, `aria-expanded`).
  - Leaflet initialization on the contact page.
  - Third-party embeds (Wistia player, Elfsight widget) declared as script tags in the markup of the pages that use them.
- Navigation uses plain anchors; full page loads reset scroll naturally. Astro view transitions are out of scope.

### Deep modules (pure TypeScript, UI-independent)

1. **Site config** — a single module exporting business facts: brand name, WhatsApp number and derived `wa.me` URL, landline, e-mail, Instagram handle and URL, store and production addresses with coordinates, opening hours, Google Maps place link. Every component imports from it; no literals elsewhere.
2. **Catalog content collection** — the current `catalogo.js` data converted to a JSON content collection with a schema: `id`, `name`, `slug` (derived from today's `rota` field), `cover` URL, `prints[]` with `id` and image URL. The collection is the only data source for `/catalogo`, `getStaticPaths` of `/catalogo/[slug]`, the sitemap and the redirects. Schema validation rejects duplicate slugs, missing covers and empty print lists.
3. **Redirects generator** — a build-time integration or script that emits the Netlify `_redirects` file from data: one 301 per legacy numeric category id to its slug URL, plus `/quemSomos` → `/quem-somos`. Hand-maintained redirect lines are not allowed.
4. **SEO builder** — pure functions producing per-page `<head>` data (title with site suffix, description, canonical URL, Open Graph and Twitter tags with a default share image) and the LocalBusiness JSON-LD from site config. The base layout consumes its output; pages pass only their specific fields.

### UI structure

- One base layout owning `<html lang="pt-BR">`, head metadata from the SEO builder, Header, Footer, global styles and the JSON-LD block.
- Components grouped per page (Home, Catálogo, Quem Somos, Fale Conosco) plus shared Header, Footer, Button/CTA and section-title primitives. Components are thin: markup plus Tailwind classes, data from the deep modules.
- Local images (logo SVG, round logo, florals, Quem Somos photo) go through Astro's image pipeline for resizing and modern formats. Catalog images remain remote GCS URLs rendered with explicit dimensions and lazy loading.
- Catalog pages are prerendered for every category; unknown slugs serve Astro's 404 page.
- Maps use vanilla Leaflet with OpenStreetMap tiles, loaded only on the contact page, with a marker per location and a link to Google Maps. The Google Maps embed the owner supplied is kept as a fallback option but is not the primary implementation.

### URLs

- `/`, `/catalogo`, `/catalogo/<slug>`, `/quem-somos`, `/fale-conosco`.
- Legacy `/catalogo/<numeric id>` and `/quemSomos` redirect with 301.

### Business facts (confirmed by the owner on 2026-10-13)

- Store (Nossa Loja): Av. São Paulo, 298, Setor Campinas, Goiânia - GO, CEP 74510-030. Coordinates approx. -16.6707, -49.2909.
- Production (Nossa Produção): Rua 11 de Janeiro, Qd 02, Lt 01 e 02, Vila Aurora Oeste, Goiânia - GO, CEP 74425-100. Coordinates approx. -16.6797, -49.3068.
- WhatsApp: (62) 98442-0366. Landline: (62) 3294-0595. E-mail: tecidosatelier@gmail.com. Instagram: @atelier.tecidosoficial.
- Opening hours: Monday to Friday 08:00–18:00; closed Saturday and Sunday.
- **(assumed)** The footer and JSON-LD use the store address; the production address appears only on Fale Conosco. Today's footer shows the production address.
- Known inconsistency to fix during migration: the contact page currently shows "(62) 98482-0366", which differs from the WhatsApp number everywhere else. The site-config value wins.

### Cleanup

- Removed with the migration: `oldAtividades`, `SelosDeQualidade` (renders nothing), orphaned `Abstratas` route, `QuemSomos copy` route, gh-pages deploy script and GitHub Pages workflow, `_redirects` SPA fallback.
- The `CLAUDE.md`, `fe-conventions` skill and hooks must be updated to describe the Astro project (commands, structure, styling rules) as part of the final phase.

## Testing Decisions

A good test exercises a module through its public interface with realistic inputs and asserts on observable output. It does not inspect internal variables, mock the module under test, or depend on rendering details of `.astro` components.

Prior art: none in this repository. Vitest is introduced with this migration; tests live next to the modules they cover.

Modules under test **(assumed: the three below; site config is covered indirectly)**:

- **Catalog collection** — every category has a unique, URL-safe slug; every category has a cover and at least one print; slugs match the legacy `rota` values; the number of categories matches the legacy data (19).
- **Redirects generator** — one line per legacy numeric id mapping to the matching slug; `/quemSomos` maps to `/quem-somos`; all redirects are 301; output has no duplicates and uses valid Netlify syntax.
- **SEO builder** — each route yields a title with the site suffix, a non-empty pt-BR description and a canonical URL; Open Graph fields fall back to defaults; the JSON-LD contains the store address, phone, hours and Instagram URL from site config and is valid JSON.

Build-level gates (not unit tests): `astro check` with zero errors, `astro build` producing an HTML file for every route including all 19 category pages, sitemap present.

No browser/end-to-end tests in this PRD.

## Out of Scope

- Any transitional state in production: the React app keeps deploying unchanged until the single cutover merge.
- Redesigning the section list of any page (merging, dropping or adding sections). Visual refinement within the existing sections is in scope; information architecture changes are not.
- Astro view transitions or any SPA-like navigation.
- A CMS, backend, forms or server-side rendering. Content stays in the repository.
- Replacing Wistia or Elfsight with self-hosted alternatives.
- Moving local assets to GCS or changing the catalog bucket layout.
- Browser end-to-end tests (Playwright).
- Fixing ESLint configuration; linting setup for the Astro project is decided in the plan phase.
- Analytics, cookie consent, i18n.

## Further Notes

- Elfsight loads the Instagram feed from a third-party script; Lighthouse scores on Home will be bounded by it regardless of the migration. Lazy-loading it below the fold is the mitigation.
- The Quem Somos video component currently imports an `.mp4` file that is not in the repository; the Wistia embed is the real implementation and the local video import is dropped.
- Open Graph share image: a static image under the public folder (brand logo on beige) unless the owner provides a dedicated one; category pages may use their cover image.
- Decisions marked **(assumed)**: framework/tooling versions, netlify.toml in repo, Node 22, footer using the store address, which modules get tests. Review these before planning.


### Plan: plans/2026-10-13/astro-migration-plan.md

# Plan: Migration to Astro (Home first)

> Source PRD: `plans/2026-10-13/astro-migration-design.md`

## Architectural decisions

Durable decisions that apply across all phases:

- **Branch strategy**: one long-lived branch `feat/astro-migration` off `main`. Each phase is one or more atomic commits on that branch. No PR to `main` until Phase 8 is done and the owner approves the cutover. The React/Vite app is deleted in Phase 1; nothing from `src/` survives except data and copy that are migrated on purpose.
- **Stack**: Astro 5, static output, Tailwind CSS v4 via the Vite plugin, yarn 1 (vendored release stays), Node 22 LTS pinned in `.nvmrc`, Vitest for unit tests, `astro check` for types. No UI framework integration, no SSR adapter.
- **Routes**: `/`, `/catalogo`, `/catalogo/[slug]`, `/quem-somos`, `/fale-conosco`, `/404`. Legacy `/catalogo/<numeric id>` and `/quemSomos` redirect with 301. Netlify SPA fallback is removed.
- **Deploy config**: `netlify.toml` in repo (build `yarn build`, publish `dist`, Node 22). `_redirects` is generated at build, never hand-edited.
- **Deep modules** (pure TS, UI-independent, tested):
  - `site config` — single source of business facts: brand name, WhatsApp number + `wa.me` URL, landline, e-mail, Instagram handle/URL, store and production addresses + coordinates, opening hours, Google Maps place link, site URL.
  - `catalog collection` — JSON content collection. Entry shape: `{ id: number, name: string, slug: string, cover: url, prints: [{ id: number, image: url }] }`. Slug derived from the legacy `rota` field. Schema rejects duplicate slugs, missing cover, empty prints.
  - `redirects generator` — emits `_redirects` lines from the catalog collection (numeric id → slug) plus the static `/quemSomos → /quem-somos` rule, all `301`.
  - `SEO builder` — `buildHead({ title, description, path, image? })` → full head data (title with " | Atelier Tecidos" suffix, canonical, OG/Twitter) and `buildLocalBusinessJsonLd(siteConfig)`.
- **Design tokens**: Tailwind theme with `brand-beige` (`#E4D2C1`, light `#F0E3D6`, dark `#C2B09D`), `brand-red` (`#ac0a0b`, light `#e34949`, dark `#7b0708`), text on red `#ffffff`, text on beige `#000000`, font Lato, breakpoints `sm 600px`, `md 900px`, `xl 1536px` (matching MUI defaults the current layout depends on). Global CSS owns the font import, body background and scrollbar styles.
- **Business facts** (confirmed 2026-10-13): store Av. São Paulo, 298, Setor Campinas, Goiânia - GO, 74510-030 (-16.6707, -49.2909); production Rua 11 de Janeiro, Qd 02, Lt 01 e 02, Vila Aurora Oeste, Goiânia - GO, 74425-100 (-16.6797, -49.3068); WhatsApp (62) 98442-0366; landline (62) 3294-0595; e-mail tecidosatelier@gmail.com; Instagram `atelier.tecidosoficial`; hours Mon–Fri 08:00–18:00. Footer and JSON-LD use the store address.
- **Interactivity**: only vanilla `<script>` blocks: header drawer, Leaflet init on contact page, third-party embeds (Wistia, Elfsight) as declarative script tags.
- **Images**: local assets (logo SVG, round logo PNG, three florals, Quem Somos JPEG) go through Astro's image pipeline. Catalog images stay remote GCS URLs with explicit `width`/`height` and `loading="lazy"`.
- **Language**: code, comments, commits in English; UI copy pt-BR. Copy is migrated verbatim from the current components unless the PRD says otherwise.

### Source material to migrate (reuse audit)

Nothing from the React app is imported by the Astro project, but these files are the only source of truth for data and copy and must be read before the corresponding phase:

- `src/catalogoItens/catalogo.js` — 19 categories, covers, `rota` slugs, print URLs → catalog collection JSON.
- `src/Style/Theme.ts`, `src/index.css` — palette, font, scrollbar → Tailwind tokens + global CSS.
- `src/utils/enums/Routes.ts` — nav labels "Home", "Quem Somos", "Catálogo", "Fale Conosco".
- `src/components/Home/*.tsx` — Home copy (banner phrases, brand statement, Quem Somos teaser, four activity texts, contact CTA, Instagram heading) and Wistia media id `k82pzy208k`, Elfsight app id `fa3cce2c-0b62-4540-8006-243f19d63006`.
- `src/components/QuemSomos/ImagemTexto.tsx`, `Atividades.tsx` — company story paragraphs and three mission texts.
- `src/components/FaleConosco/*.tsx` — contact copy, map coordinates, Google Maps URLs.
- `src/components/Footer.tsx` — footer layout and copyright line.
- `src/assets/*` — logo SVG, round logo, florals, Quem Somos photo.
- `src/components/Catalogo/CatalogoCompleto.tsx` — "ACESSE CATÁLOGO COMPLETO" CTA.

---

## Phase 1: Astro skeleton, shell and Home hero

**User stories**: 1, 2, 10, 11, 12, 13, 14, 15, 16, 34, 35, 38, 39, 40

### What to build

Create the branch and replace the Vite/React project with an Astro 5 + Tailwind v4 project at the repo root. Deliver a complete vertical slice: base layout (lang pt-BR, head from the SEO builder, Header, Footer, global styles), the `site config` module, the Tailwind tokens, and the Home page containing only the hero (logo + optimized florals). Header has the four nav links and a working vanilla mobile drawer. Footer shows the store address, phones, e-mail, Instagram and WhatsApp links from site config. Wire `astro check`, `astro build`, Vitest and `netlify.toml`. Add the first unit tests for the SEO builder.

**Reuse:**
- `src/Style/Theme.ts`, `src/index.css` → tokens and global CSS (then delete).
- `src/utils/enums/Routes.ts` → nav labels (then delete).
- `src/assets/LogoEscrita.svg`, `ATELIER-LOGO.png`, `ImagemFundo1/*.png` → moved to the Astro assets folder.
- `src/components/Header.tsx`, `Footer.tsx`, `Home/ImagemLogo.tsx` → layout reference only.
- Reuse: none for drawer script, SEO builder, site config — new.

### Acceptance criteria

- [ ] `yarn build` produces `dist/index.html` with the hero rendered as HTML and florals emitted as resized WebP/AVIF (no file over 500 KB in `dist`).
- [ ] `yarn check` (astro check) reports zero errors; `yarn test` runs Vitest and passes.
- [ ] No `react`, `@mui/*`, `@emotion/*`, `react-router-dom`, `react-leaflet`, `gh-pages` in `package.json`; old `src/` React files, `index.html`, `vite.config.ts`, `.github/workflows/main.yml`, `public/_redirects` are deleted.
- [ ] Header: logo links to `/`; desktop shows four links; below `md` a hamburger with `aria-expanded` opens a full-screen drawer; drawer closes on link click, Escape, and the back-arrow button; focus is managed (first link focused on open, trigger refocused on close).
- [ ] Footer renders the store address, landline, WhatsApp, e-mail and Instagram from site config; icons are `<a>` elements with `aria-label`; `wa.me` URL uses 5562984420366.
- [ ] No business literal (phone, URL, address) appears outside the site config module (grep-verified).
- [ ] `netlify.toml` and `.nvmrc` committed; `yarn dev` runs.
- [ ] SEO builder tests: title suffix, canonical from path, OG defaults.

---

## Phase 2: Home page complete

**User stories**: 3, 4, 5, 6, 7, 8, 9, 42

### What to build

Add the remaining Home sections in order: highlight banner (three phrases), brand statement, Quem Somos teaser with Wistia player and "Saiba mais" link, "O que procura" with four link cards, "Nossas Atividades" four cards with icons, Contato block with WhatsApp CTA and Instagram card over florals, and the Elfsight Instagram feed under a "NOSSO INSTAGRAM" heading. Wistia and Elfsight are declarative script tags; Elfsight lazy. Icons are inline SVGs (Material icon paths) rather than an icon package. Home gets its final title and description.

**Reuse:**
- `src/components/Home/*.tsx` — all copy, migrated verbatim.
- Shared primitives created in Phase 1 (layout, CTA button). Create a `SectionTitle` and `Card` primitive here if two sections need them; otherwise none.

### Acceptance criteria

- [ ] All nine sections render in the PRD order; `SelosDeQualidade` is not recreated.
- [ ] Every CTA is an `<a>`: WhatsApp → `wa.me`, Instagram → profile, "Ver catálogo" → `/catalogo`, "Nossa loja" → `/fale-conosco`, "O que fazemos" and "Saiba mais" → `/quem-somos`. External links open in a new tab with `rel="noopener noreferrer"`.
- [ ] Wistia player `k82pzy208k` and Elfsight widget `fa3cce2c-0b62-4540-8006-243f19d63006` render on the built page; scripts appear exactly once in the HTML.
- [ ] At 375 px width no horizontal scroll; headings use `h1` for the page title and `h2` per section.
- [ ] `yarn build` ships no client JS other than the drawer script and third-party embeds.

---

## Phase 3: Catalog collection and catalog pages

**User stories**: 17, 18, 20, 21, 22, 23, 36, 37

### What to build

Convert `catalogo.js` into a JSON content collection with the schema from the header. Build `/catalogo` (grid of 19 category cards with cover and name linking to `/catalogo/<slug>`), `/catalogo/[slug]` via `getStaticPaths` (print grid, lazy images with reserved aspect ratio), the "ACESSE CATÁLOGO COMPLETO" WhatsApp CTA on both, and a 404 page. Unit tests for the collection invariants.

**Reuse:**
- `src/catalogoItens/catalogo.js` — data source; delete after conversion.
- `src/components/Catalogo/*.tsx`, `Prints/PrintsCard.tsx` — layout reference.
- Card primitive from Phase 2 if present.

### Acceptance criteria

- [ ] `dist/catalogo/index.html` lists 19 categories; `dist/catalogo/<slug>/index.html` exists for every slug in the data (e.g. `abstratas`, `animal-print`, `barrados`).
- [ ] Build fails if a category has a duplicate slug, missing cover, or zero prints (verified by a Vitest test against the schema).
- [ ] Vitest: slug count equals category count, slugs are unique and URL-safe, every slug equals the legacy `rota` path segment.
- [ ] Print images have `loading="lazy"`, `decoding="async"`, and `width`/`height` or an aspect-ratio box.
- [ ] `/catalogo/nao-existe` serves the 404 page (Netlify serves `dist/404.html`).
- [ ] Category pages have title "<Category name> | Atelier Tecidos" and the cover as OG image.

---

## Phase 4: Legacy redirects

**User stories**: 19, 25

### What to build

A build-time redirects generator (Astro integration hook or a script in the build command) that reads the catalog collection and writes `dist/_redirects` with one 301 per legacy numeric id → `/catalogo/<slug>`, plus `/quemSomos → /quem-somos`. Unit tests for the generated lines.

**Reuse:**
- Catalog collection from Phase 3.
- Reuse: none — new module.

### Acceptance criteria

- [ ] After `yarn build`, `dist/_redirects` contains 20 lines: 19 category rules and the quemSomos rule, all `301`, no duplicates, no SPA fallback.
- [ ] Vitest: every category id appears exactly once and maps to its slug; the static rule is present; output has no blank or malformed lines.
- [ ] `yarn preview` or Netlify deploy preview resolves `/catalogo/1` to `/catalogo/abstratas`.

---

## Phase 5: Quem Somos page

**User stories**: 24, 25

### What to build

`/quem-somos` with the company story (heading + four paragraphs + optimized photo), the Wistia video block, and the three mission cards with icons. Page-specific title and description.

**Reuse:**
- `src/components/QuemSomos/ImagemTexto.tsx`, `Atividades.tsx`, `Video.tsx` — copy and media id. The missing local `.mp4` import is dropped.
- `src/assets/QuemSomos.jpeg` → Astro assets.
- Card/SectionTitle primitives from Phase 2.

### Acceptance criteria

- [ ] `dist/quem-somos/index.html` exists with `h1` "Atelier Tecidos", four story paragraphs verbatim, Wistia player, three mission cards.
- [ ] Photo emitted via the image pipeline with `alt` text.
- [ ] Header and footer links point to `/quem-somos`; no `/quemSomos` string remains in source.

---

## Phase 6: Fale Conosco page with maps and JSON-LD

**User stories**: 26, 27, 28, 29, 33

### What to build

`/fale-conosco` with the contact block (e-mail, landline, WhatsApp CTA), "Nossa Loja" and "Nossa Produção" blocks each with address, phones and an interactive vanilla Leaflet map (OSM tiles, single marker, "Abrir no Google Maps" link). Leaflet CSS/JS loaded only on this page. Add the LocalBusiness JSON-LD (from the SEO builder and site config) to the base layout so every page carries it, with the opening hours. Unit tests for the JSON-LD builder.

**Reuse:**
- `src/components/FaleConosco/*.tsx` — copy, coordinates, Maps URLs. Phone "(62) 98482-0366" is replaced by the site-config WhatsApp number.
- Site config and SEO builder from Phase 1.

### Acceptance criteria

- [ ] `dist/fale-conosco/index.html` exists with both location blocks and two map containers; Leaflet assets are referenced only from this page.
- [ ] Each map renders a marker at the configured coordinates and the Google Maps link opens the correct place in a new tab.
- [ ] Every built page contains one `<script type="application/ld+json">` with `@type: LocalBusiness`, store address, telephone, `openingHoursSpecification` Mon–Fri 08:00–18:00, `sameAs` Instagram URL.
- [ ] Vitest: JSON-LD parses, fields equal site config values, hours shape is correct.

---

## Phase 7: SEO completion

**User stories**: 30, 31, 32, 34

### What to build

Add `@astrojs/sitemap` with the site URL, a `robots.txt` pointing to the sitemap, a default Open Graph share image (brand logo on beige) in the public folder, and audit every route for unique pt-BR title and description. Category pages already use covers as OG image (Phase 3).

**Reuse:**
- SEO builder from Phase 1; extend, do not duplicate.

### Acceptance criteria

- [ ] `dist/sitemap-index.xml` (or `sitemap-0.xml`) lists `/`, `/catalogo`, all 19 category URLs, `/quem-somos`, `/fale-conosco`.
- [ ] `dist/robots.txt` allows all and references the sitemap URL.
- [ ] Every HTML file in `dist` has exactly one `<title>`, one `meta[name=description]`, `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`; titles are unique across routes (script-verified).
- [ ] `<html lang="pt-BR">` on every page.

---

## Phase 8: Cleanup, docs and cutover readiness

**User stories**: 41, 43

### What to build

Remove any remaining dead files, update `CLAUDE.md`, the `fe-conventions` skill and hooks to describe the Astro project (commands, structure, Tailwind rules, site config rule, catalog data rule), update `.gitignore`, and write the cutover checklist in the PR description: Netlify build settings, deploy preview URL verification of redirects and all routes, owner visual approval. Open the PR to `main`; do not merge without explicit approval.

**Reuse:**
- Existing `CLAUDE.md` structure and `.claude/skills/fe-conventions` — rewrite content, keep format.

### Acceptance criteria

- [ ] `git ls-files` shows no React/MUI/Vite leftovers, no `oldAtividades`, `SelosDeQualidade`, `Abstratas.tsx`, `QuemSomos copy.tsx`, `catalogo.js`.
- [ ] `CLAUDE.md` commands section lists `yarn dev`, `yarn build`, `yarn preview`, `yarn check`, `yarn test`; "Known debt" section no longer mentions tsc errors or `@mui/styles`.
- [ ] `yarn check && yarn test && yarn build` pass from a clean install on Node 22.
- [ ] Netlify deploy preview of the PR: every route 200, `/catalogo/1` and `/quemSomos` 301, Lighthouse mobile performance on `/` at or above 85 (Elfsight excluded if it dominates).
- [ ] PR opened with the checklist; merge awaits the owner's explicit "merge".

## Rules
- Cite file:line and a concrete failure scenario for every finding. For plan mode, cite the PRD/plan section or phase and, where relevant, the current repo file.
- Rate each finding: high (blocks ship) / medium (should fix) / low (worth noting).
- Say explicitly when you could not verify a claim against real code, a test, or command output.
- Flag pre-existing problems separately from problems this change introduces. Items under
  "Known debt" in the conventions are pre-existing by definition.
- Skip anything `npx tsc --noEmit` already reports. `yarn lint` is broken, so lint-class
  bugs (e.g. a missing hook dependency) ARE in scope.
- Prose nits and wording preferences are not findings. A finding must name a scenario
  in which an agent or a human does the wrong thing. pt-BR UI copy is a business decision,
  not a finding.
- Write findings as a numbered markdown list.
- The LAST line of your output must be exactly `VERDICT: PASS`, `VERDICT: CONTESTED`,
  or `VERDICT: REJECT`. Write nothing after it — the helper checks that final line and
  reports `status=noverdict` if anything else is there.
