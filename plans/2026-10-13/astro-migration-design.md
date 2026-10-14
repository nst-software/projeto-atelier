# Atelier Tecidos — Migration to Astro (Home first)

Date: 2026-10-13
Status: Draft for review

> Decisions marked **(assumed)** were taken with the recommended default because the interview timed out. Revised after adversarial review r1 (`astro-migration-reviews/r1-report.md`). Still pending owner confirmation: production origin and footer address.

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
- Work happens on a single long-lived feature branch that replaces the root project (package manifest, source tree, public assets). The React/Vite app is moved whole into a `legacy/` folder, excluded from the build, and kept as the read-only source for copy, data and assets until the last phase, when it is diffed against `main` and deleted. MUI, Emotion, React Router, react-leaflet and gh-pages are not dependencies of the new project. Merging to `main` is the production cutover and requires explicit approval; the branch is rebased on `main` first and any content change that landed during the migration is ported.
- Project guidance (`CLAUDE.md` and the project skills) is rewritten for Astro in the first phase, before any page work, so later phases never run under React-specific instructions.
- Visual direction: same sections and order as today, cleaner modern execution. No pixel parity with the current `makeStyles` rules is required.

### Framework and tooling **(assumed)**

- Astro 7 (current stable major), fully static output (no SSR adapter).
- Production origin `https://ateliertecidos.com.br` (the live Netlify site linked to this repository). Used for canonical URLs, sitemap, Open Graph and JSON-LD. **(pending owner confirmation)**
- Tailwind CSS v4 via the Vite plugin. Brand tokens (beige `#E4D2C1` family, red `#ac0a0b` family, Lato font, existing `sm`/`md`/`xl` breakpoints) are declared as theme tokens; one global stylesheet holds the font import, body background and scrollbar styling.
- Node 22 LTS pinned via `.nvmrc`; yarn 1 stays as package manager.
- Build settings committed in `netlify.toml` (build command, publish directory, Node version). The SPA fallback redirect is removed because every route is a real HTML file.
- Validation is the build: the single build command runs `astro check`, the Vitest suite and `astro build` in sequence, and Netlify runs that command. A type error, failing test or invalid catalog therefore cannot deploy. The pre-existing `tsc` error debt is retired because the old source is removed.
- Redirects are verified locally with the Netlify CLI dev server, which applies `_redirects`; Astro's preview server does not.

### Interactivity

- No UI framework in the browser. The only client-side scripts are:
  - Header drawer toggle (open/close, Escape, close on link click, `aria-expanded`). While open, page content outside the drawer is inert, body scroll is locked, Tab cycles inside the drawer, and focus returns to the trigger on close.
  - Leaflet initialization on the contact page.
  - Third-party embeds (Wistia player, Elfsight widget) declared as script tags in the markup of the pages that use them.
- Navigation uses plain anchors; full page loads reset scroll naturally. Astro view transitions are out of scope.

### Deep modules (pure TypeScript, UI-independent)

1. **Site config** — a single module exporting business facts: brand name, production origin, WhatsApp number and derived `wa.me` URL, landline, e-mail, Instagram handle and URL, opening hours, and two locations (store, production) each with address, coordinates and its own Google Maps URL. Every component imports from it; no literals elsewhere.
2. **Catalog content collection** — the current `catalogo.js` data converted to a JSON content collection. The entry identifier is the slug (derived from today's `rota` field); the old numeric id is kept as `legacyId`; each entry has `name`, `cover` URL and `prints[]` with `id` and image URL. The collection is the only data source for `/catalogo`, `getStaticPaths` of `/catalogo/[slug]`, the sitemap and the redirects. A whole-collection validator runs inside the build and rejects duplicate slugs, duplicate legacy ids, missing covers, empty print lists and duplicate image URLs within a category. The one duplicated Animal Print image in today's data is dropped during conversion.
3. **Redirects generator** — a build-time integration that emits the Netlify `_redirects` file from data: one 301 per `legacyId` to its slug URL, plus `/quemSomos` → `/quem-somos`. Hand-maintained redirect lines are not allowed.
4. **SEO builder** — pure functions producing per-page `<head>` data (title with site suffix, description, canonical URL, Open Graph and Twitter tags with a default share image) and the LocalBusiness JSON-LD from site config. The base layout consumes its output; pages pass only their specific fields.

### UI structure

- One base layout owning `<html lang="pt-BR">`, head metadata from the SEO builder, Header, Footer, global styles and the JSON-LD block.
- Components grouped per page (Home, Catálogo, Quem Somos, Fale Conosco) plus shared Header, Footer, Button/CTA and section-title primitives. Components are thin: markup plus Tailwind classes, data from the deep modules.
- Local images (logo SVG, round logo, florals, Quem Somos photo) go through Astro's image pipeline for resizing and modern formats. Catalog images remain remote GCS URLs rendered with explicit dimensions, lazy loading and an error fallback that shows the item name if the image fails. A URL-health check over every catalog image runs before cutover.
- Catalog pages are prerendered for every category; unknown slugs serve Astro's 404 page.
- Maps use vanilla Leaflet with OpenStreetMap tiles, loaded only on the contact page, with a marker per location and a link to that location's Google Maps URL. The Google Maps embed the owner supplied is kept as a fallback option but is not the primary implementation.

### URLs

- `/`, `/catalogo`, `/catalogo/<slug>`, `/quem-somos`, `/fale-conosco`.
- Legacy `/catalogo/<numeric id>` and `/quemSomos` redirect with 301.

### Business facts (confirmed by the owner on 2026-10-13)

- Store (Nossa Loja): Av. São Paulo, 298, Setor Campinas, Goiânia - GO, CEP 74510-030. Coordinates approx. -16.6707, -49.2909.
- Production (Nossa Produção): Rua 11 de Janeiro, Qd 02, Lt 01 e 02, Vila Aurora Oeste, Goiânia - GO, CEP 74425-100. Coordinates approx. -16.6797, -49.3068.
- WhatsApp: (62) 98442-0366. Landline: (62) 3294-0595. E-mail: tecidosatelier@gmail.com. Instagram: @atelier.tecidosoficial.
- Opening hours: Monday to Friday 08:00–18:00; closed Saturday and Sunday.
- Each location keeps the Google Maps URL currently hard-coded in its map component (they differ).
- **(assumed, pending owner confirmation)** The footer and JSON-LD use the store address; the production address appears only on Fale Conosco. Today's footer shows the production address.
- Known inconsistency to fix during migration: the contact page currently shows "(62) 98482-0366", which differs from the WhatsApp number everywhere else. The site-config value wins.

### Cleanup

- Removed with the migration: `oldAtividades`, `SelosDeQualidade` (renders nothing), orphaned `Abstratas` route, `QuemSomos copy` route, gh-pages deploy script and GitHub Pages workflow, `_redirects` SPA fallback.
- `CLAUDE.md` and the `fe-conventions`, `do-work` and `verify-before-done` skills are rewritten for the Astro project (commands, structure, styling rules, validation) in the first phase and polished in the last.

## Testing Decisions

A good test exercises a module through its public interface with realistic inputs and asserts on observable output. It does not inspect internal variables, mock the module under test, or depend on rendering details of `.astro` components.

Prior art: none in this repository. Vitest is introduced with this migration; tests live next to the modules they cover.

Tests assert invariants of the current data, never fixed counts or a duplicated copy of the catalog, so adding a category stays a data-only change.

Modules under test **(assumed: the three below; site config is covered indirectly)**:

- **Catalog collection validator** — slugs are unique and URL-safe; legacy ids are unique; every category has a cover and at least one print; no image URL repeats within a category.
- **Redirects generator** — one line per entry mapping its legacy id to its slug; `/quemSomos` maps to `/quem-somos`; all redirects are 301; output has no duplicates and uses valid Netlify syntax.
- **SEO builder** — each route yields a title with the site suffix, a non-empty pt-BR description and a canonical URL on the production origin; Open Graph fields fall back to defaults; the JSON-LD contains the store address, phone, hours and Instagram URL from site config and is valid JSON.
- **Built-output audit** (runs with the test suite after a build) — every page has exactly one title, one description, canonical, OG and Twitter tags; titles and descriptions are unique across routes.

One-time migration check (a script, not a permanent test, deleted with `legacy/`): the collection has 19 entries, each slug equals the legacy `rota` segment, each legacy id equals the legacy `category_id`, and print counts match legacy minus the removed duplicate.

Build-level gates: the single build command fails on any `astro check` error, any failing test, or any collection validation error; `astro build` produces an HTML file for every route including every category page; sitemap present.

No browser/end-to-end tests in this PRD. Browser-only behavior (drawer keyboard paths, embeds, maps, 320/375 px layouts, blocked third-party scripts) is covered by a manual QA matrix recorded in the cutover PR.

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
- Today's Animal Print category lists the same image twice (print ids 1 and 32); all other 654 catalog image URLs are unique and returned 200 on 2026-10-13.
- Decisions marked **(assumed)**: netlify.toml in repo, Node 22, which modules get tests. Pending owner confirmation: production origin `https://ateliertecidos.com.br`, footer using the store address.
