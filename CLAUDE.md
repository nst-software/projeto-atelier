# Atelier Tecidos — site

Marketing site + fabric-print catalog for Atelier Tecidos. Fully static Astro 7 site, Tailwind CSS v4 (Vite plugin), TypeScript, no UI framework, no SSR adapter. Content is in the repo; catalog print images live on the public GCS bucket `tecidosatelier_public`.

Keep this file lean. Detailed conventions live in skills (progressive disclosure).

## Commands (Node 22 via `.nvmrc`; yarn 1, vendored in `.yarn/releases`)
- `yarn dev` | `yarn preview`
- `yarn build` — THE gate: `astro check && vitest run && astro build`. Netlify runs exactly this, so a type error, failing test or invalid data cannot deploy
- `yarn run check` (`astro check`) | `yarn test` (`vitest run`) | `yarn build:only` (`astro build`) — for local iteration. Plain `yarn check` is yarn 1's built-in lockfile check, not the script
- No linter configured. Don't add ESLint unless asked
- Hosted on **Netlify**; build config in `netlify.toml` (`yarn build`, publish `dist`, Node 22). `_redirects` is generated at build (never hand-edited); verify redirects with `netlify dev`, not `astro preview`

## Project Structure
- `src/pages/` — routes (file-based). Pages compose sections and pass `title`/`description` to the layout, no logic
- `src/layouts/BaseLayout.astro` — `<html lang="pt-BR">`, head from the SEO builder, Header, `#page` (main + Footer), global CSS
- `src/components/` — `Header.astro`, `Footer.astro` (global) + one folder per page (`Home/`, …)
- `src/config/site.ts` — every business fact (`siteConfig`); `src/config/routes.ts` — nav labels + paths
- `src/lib/` — pure TS modules (SEO builder, later validators/generators), each with a colocated `*.test.ts`
- `src/styles/global.css` — Tailwind import + `@theme` tokens (colors, font, breakpoints), body + scrollbar
- `src/assets/` — local images, always rendered through `astro:assets`
- `legacy/` — the old React/Vite app, **read-only** migration source for copy, data and assets. Excluded from tsconfig, `astro check` and Vitest; never import from it. Deleted at the end of the migration

## Core Rules (always apply)
- Code, comments, commits, docs in **English**; user-facing UI text in **pt-BR**, migrated verbatim from `legacy/` unless the plan says otherwise
- Comments: default to none. Only a non-obvious WHY, one terse line
- Ask before assuming business facts (copy, contacts, prices, categories) — don't infer them from the repo
- No business literal (phone, e-mail, URL, address, coordinates, hours) outside `src/config/site.ts`
- Don't commit large media; prefer GCS URLs. Local images go through `astro:assets`; nothing in `dist` over 500 KB
- Don't open images to "verify" visuals — Victor checks visuals himself
- NEVER add co-author tags, "Generated with Claude" footers, or references to `.claude/`, skills or plan files in commits/PRs
- `use-personal` before every commit/push (the `use-personal-before-git` hook does it automatically)
- Git workflow (STRICT): feature branch off `main` (`feat/…`, `fix/…`) → atomic conventional commits → `gh pr create`. NEVER push to `main`, force-push, `--amend`, `--no-verify`, or `git add -A`/`.`. NEVER merge a PR without an explicit "merge"
- Deploy (STRICT): Netlify builds from the repo — merging into the deployed branch goes live. Always confirm with the user first

## Skills (progressive disclosure)
Auto-invoked by task context:
- `fe-conventions` — BEFORE editing anything under `src/` (`.astro`, `.ts`, `.css`, data)

User-invoked workflow:
- `/grill-me` → `/write-a-prd` → `/prd-to-plan-generic` → `/adversarial-review plan` → `/do-work` → `/verify-before-done` → `/adversarial-review code` → `/code-review` → `/pr`
- `/adversarial-review` — Codex reviews from packets Claude writes; Claude only verifies findings and reconciles the verdict. Advisory, read-only, spends ChatGPT quota — plans and meaningful diffs only
- Bug fix or one-file change: skip the PRD, go straight to `/do-work`
- Plans/PRDs live in `plans/<YYYY-MM-DD>/` and are committed

## Known debt (don't fix unless asked)
- Open Graph default image `/og-default.png` is referenced by the SEO builder but not added yet
- Owner still to confirm: production origin `https://ateliertecidos.com.br` and footer using the store address
- `scripts/check-catalog-migration.mjs` is a one-time check of the catalog collection against `legacy/`; delete it together with `legacy/`
