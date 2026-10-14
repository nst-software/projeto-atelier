---
name: fe-conventions
description: Atelier site conventions for src/ (Astro 7 static + Tailwind CSS v4 + TypeScript + Vitest, yarn). Use BEFORE editing any .astro/.ts/.css/data file under src/, before adding a page/section/component, and before deciding where new code goes.
---

# FE Conventions — Projeto-Atelier

## Layout
- Routes in `src/pages/` (file-based). Thin: wrap in `BaseLayout` with `title` (no suffix — the SEO builder adds " | Atelier Tecidos") and a unique pt-BR `description`, compose sections, nothing else.
- Page sections in `src/components/<Page>/` (PascalCase folder per page). Cross-page pieces (Header, Footer, buttons, section titles) at `src/components/` root.
- Pure logic in `src/lib/` as plain TS with a colocated `*.test.ts`. If it can be a function of data, it goes here, not in a `.astro` frontmatter.
- Nav entries live in `src/config/routes.ts` (label + path). Header and Footer map over it.
- `legacy/` is read-only reference: copy text/data/assets out of it, never import from it.
- Relative imports, no path aliases.

## Business facts — site config
- Every phone, e-mail, URL, address, coordinate, opening hour comes from `siteConfig` (`src/config/site.ts`). Derived values (`wa.me` URL, `tel:` href) are derived there or at the call site from config fields — never retyped.
- Missing a fact? Ask; don't copy one from `legacy/` that the plan doesn't confirm.
- Check: `grep -rnE "98442|3294|tecidosatelier@|instagram\.com|wa\.me|Av\. São Paulo|11 de Janeiro" src --exclude-dir=config` must print nothing.

## Catalog data
- Catalog lives in an Astro JSON content collection (entry id = slug, `legacyId`, `name`, `cover`, `prints[{ id, image }]`), schema in the content config.
- A whole-collection validator in `src/lib/` (unique slugs/legacy ids, cover present, prints non-empty, no duplicate image within a category) runs in the build and is imported by tests. Adding a category is a data-only change.
- Tests assert invariants, never fixed counts or copied slug lists.
- Catalog images stay remote GCS URLs with explicit `width`/`height`, `loading="lazy"` and a name fallback on error.

## Styling — Tailwind tokens
- Tailwind utility classes in markup. Tokens are defined once in `@theme` in `src/styles/global.css`: `brand-beige(-light|-dark)`, `brand-red(-light|-dark)`, `on-red`, `on-beige`, `font-sans` (Lato), breakpoints `sm 600` / `md 900` / `lg 1200` / `xl 1536`.
- No hex literals or ad-hoc media queries in components. Need a new color/size? Add a token to `@theme`.
- Mobile-first: base classes are the phone layout, `sm:`/`md:` add the larger layouts.
- Component-scoped `<style>` only for what utilities can't express.

## Components and scripts
- `.astro` components: `interface Props` in the frontmatter, destructure `Astro.props`. One component per file.
- No UI framework. Client JS only as a vanilla `<script>` in the component that needs it (drawer, Leaflet, embeds). Third-party embeds are declarative script tags, no imperative injection.
- Links are `<a href>`; buttons only for in-page actions. Icon-only controls get `aria-label`; decorative images `alt=""`.
- Local images: `astro:assets` `<Image>`/`<Picture>` with `widths` + `sizes`; formats AVIF/WebP, no file in `dist` over 500 KB.
- Formatting (Prettier config at root): double quotes, semicolons, trailing commas, 2 spaces.

## Discipline (block commit)
- **Discovery before creation**: grep `src/components/` and `src/lib/` for the concept first. Reuse or extend.
- No business literal outside `src/config/site.ts`; no token literal outside `global.css`.
- No commented-out code, no narration comments, no ticket IDs in comments.
- `yarn build` passes (zero `astro check` errors, all tests green).

## Feedback loops before commit
```bash
yarn build          # astro check → vitest run → astro build; must exit 0
find dist -type f -size +500k   # must print nothing
```
