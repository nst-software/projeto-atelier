## Adversarial review: astro-migration (plan mode, round 1)

**Intent:** Rebuild the site as a fully static Astro + Tailwind site with zero React in the browser, Home first, all pages migrated on one long-lived branch, cutover on merge to `main`.
**Reviewers:** codex/gpt-5.6-sol@high (skeptic, architect, minimalist) — all three `status=ok`, all three `VERDICT: REJECT`.
**Target:** `plans/2026-10-13/astro-migration-design.md` + `plans/2026-10-13/astro-migration-plan.md`
**Verification:** every finding below was checked against the current repo, npm registry, Netlify CLI, or live HTTP before it was counted. Codex lenses are one model; three agreeing is corroboration, not consensus.

### Reproduced

1. `astro-migration-plan.md:9,59` vs `:26,77,99,143,164` — Phase 1 deletes the React source, but Phases 2, 3, 5 and 6 name those files as the only source for copy, catalog data and map URLs. · An implementer following phase order has to dig copy out of git history and cannot migrate "verbatim". · **Fix:** in Phase 1 move the old app to a `legacy/` folder excluded from the Astro build (not deleted); each phase migrates from it; Phase 8 deletes `legacy/`. · raised by skeptic, architect, minimalist · [high]
2. `astro-migration-plan.md:12,58,211` and `:15,106` — Netlify runs only `yarn build`; `astro check`, Vitest and the cross-entry slug-uniqueness check are separate commands, and a per-entry schema cannot see duplicates across entries. · A failing test, a TypeScript error or two categories sharing a slug can pass the Netlify build and go live. · **Fix:** `yarn build` becomes `astro check && vitest run && astro build`, used by `netlify.toml`; add a whole-collection validator that runs inside the build (shared by pages, redirects and tests). · raised by skeptic, architect, minimalist · [high]
3. `astro-migration-plan.md:14,17,19,182` — Canonical URLs, sitemap, robots and OG need the production origin; it is not in the confirmed facts and CLAUDE.md forbids assuming business facts. · Verified via `netlify sites:list`: site `ateliertecidos` serves `https://ateliertecidos.com.br` (200, Netlify Edge); `www.` 301s to the apex. The Netlify site is linked to `nst-software/projeto-atelier`, which is this same repository (GitHub id 816371532; the local remote still uses the pre-transfer path `ArthurAndrad3/Projeto-Atelier`, a redirect). Merging `main` here deploys. · **Fix:** add `https://ateliertecidos.com.br` to the architectural decisions (Victor confirms). · raised by skeptic, architect, minimalist · [high]
4. `astro-migration-plan.md:202`, `.claude/skills/fe-conventions/SKILL.md:3,11,13,17,20`, `.claude/skills/do-work/SKILL.md:14,18`, `.claude/skills/verify-before-done/SKILL.md:10` — Project guidance stays React-specific until Phase 8, and `do-work`/`verify-before-done` are never updated at all. · `/do-work` on Phase 2 will record a `tsc` baseline that no longer exists, invoke `fe-conventions` telling it to use MUI `sx` and `useNavigate`, and validate with `npx tsc`. · **Fix:** Phase 1 rewrites `CLAUDE.md` commands/structure, `fe-conventions`, `do-work` and `verify-before-done` for Astro; Phase 8 only polishes. · raised by architect, minimalist · [high]
5. `astro-migration-plan.md:9,202` — The branch lives through eight phases with no rebase/merge from `main` and no diff of legacy data before cutover. · A copy or catalog fix landed on `main` during the migration is silently reverted at cutover. · **Fix:** Phase 8 adds "rebase on `main`, diff `legacy/` against `main` for data and copy changes, port them" before opening the PR. · raised by skeptic · [high]
6. `astro-migration-design.md:155`, `astro-migration-plan.md:105,107,128` — Tests hard-code 19 categories, 20 redirect lines and equality with the legacy `rota` list, while the PRD promises data-only category additions. · Adding category 20 breaks the suite or forces a duplicated slug fixture. · **Fix:** permanent tests assert invariants derived from the collection (unique slugs, cover present, prints non-empty, one redirect per entry); the "19 and legacy mapping" check is a one-time migration script in Phase 3, deleted with `legacy/`. · raised by skeptic, architect, minimalist · [medium]
7. `astro-migration-plan.md:120` vs `:151` — Phase 4 requires the `/quemSomos` literal in the redirects generator; Phase 5 requires that no `/quemSomos` string remain in source. · Cannot satisfy both. · **Fix:** scope the Phase 5 grep to pages, layouts and components. · raised by skeptic, minimalist · [medium]
8. `astro-migration-plan.md:130` — `yarn preview` only serves `dist` and ignores `_redirects`. · The 301 "passes" locally while never being exercised. · **Fix:** verify redirects with `netlify dev` (or a deploy preview) asserting status and `Location`. · raised by skeptic, architect · [medium]
9. `astro-migration-plan.md:14` vs `src/components/FaleConosco/MapaLoja.tsx:24`, `MapaProducao.tsx:22` — Site config models one Google Maps link; the two locations have different place URLs today (verified). · One block opens the wrong destination or a literal leaks outside site config. · **Fix:** `mapsUrl` inside each location object. · raised by skeptic, architect · [medium]
10. `astro-migration-plan.md:10` — "Astro 5" is pinned as durable; `npm view astro version` returns 7.3.8 (Tailwind 4.3.3, @astrojs/sitemap 3.7.4). · Starting a greenfield project two majors behind creates an immediate upgrade task. · **Fix:** pin the current stable major (7.x) in the decisions; Victor confirms. · raised by minimalist · [medium]
11. `astro-migration-plan.md:19` vs `astro-migration-design.md:139` — The plan lists the store address in the footer under "confirmed", but the PRD marks it assumed and today's footer shows the production address (`Footer.tsx`). · Customer-facing location changes without the owner deciding. · **Fix:** mark it assumed in the plan; Victor confirms before Phase 1. · raised by architect · [medium]
12. `astro-migration-plan.md:60` — Drawer criteria cover focus on open/close only. · With a full-screen overlay, Tab leaves the drawer into covered page content; screen readers read the background. · **Fix:** add `inert` on the page content (or a focus trap), body scroll lock, and a keyboard-cycle criterion. · raised by architect · [medium]
13. `astro-migration-plan.md:191` vs `astro-migration-design.md:72` — Script checks description presence and title uniqueness only. · 19 category pages can share one generic description and pass. · **Fix:** assert description uniqueness too. · raised by skeptic · [medium]
14. `src/catalogoItens/catalogo.js:209,364` — Animal Print contains the same image URL twice (ids 1 and 32); it is the only duplicate among 655 URLs (verified). Pre-existing. · Verbatim migration ships a duplicate card. · **Fix:** ask Victor whether to drop one; optionally add a "no duplicate image per category" invariant. · raised by skeptic · [low]

### Plausible (needs your call)

1. `astro-migration-plan.md:15` — Astro's content layer uses a string `id` as the entry identifier; a numeric `id` field in the JSON may be coerced or consumed as metadata. · raised by skeptic · Could not run Astro here. The remedy is harmless either way: use the slug as the entry `id` and keep the number as `legacyId`. · [medium]
2. `astro-migration-plan.md:60,84,169`, `astro-migration-design.md:161` — Drawer, embeds, Leaflet and phone layout have no executable check because E2E is out of scope. · raised by skeptic · Victor excluded Playwright deliberately. Recommended middle ground: a manual browser QA matrix (keyboard paths, 320/375 px, both maps, both embeds) in the Phase 8 checklist. · [medium]
3. `astro-migration-plan.md:21,108` — No fallback when a GCS image 404s. · raised by skeptic · I probed all 654 unique URLs with HEAD: all return 200 today. Low urgency; a URL-health script before cutover would cover it. · [low]

### Rejected

- none — every finding survived verification.

### What went well

- No lens challenged the module split (site config, catalog collection, redirects generator, SEO builder) or the vertical-slice ordering of pages.
- Business facts, phone inconsistency and the missing mp4 import were already caught in the PRD; reviewers found no further data errors beyond the duplicate image.
- Catalog data is healthy: 654 unique image URLs, all reachable.

### Verdict

REJECT — five Reproduced high-severity findings (1–5). No reviewer failures.
