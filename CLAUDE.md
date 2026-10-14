# Atelier Tecidos — site

Marketing site + fabric-print catalog for Atelier Tecidos. Static SPA: Vite 5 + React 18 + TypeScript + MUI 5 + React Router 6. No backend calls — content is hard-coded; catalog data lives in `src/catalogoItens/catalogo.js`, print images on the public GCS bucket `tecidosatelier_public`.

Keep this file lean. Detailed conventions live in skills (progressive disclosure).

## Commands (yarn 1, vendored in `.yarn/releases`)
- `yarn dev` | `yarn build` | `yarn preview`
- `yarn build` is `vite build` only — it does NOT typecheck
- Typecheck: `npx tsc --noEmit` — has pre-existing errors. Record the total count before editing; it must not grow
- `yarn lint` is broken (ESLint 9 + legacy `.eslintrc.json`). Don't rely on it; don't fix it unless asked
- Hosted on **Netlify** (build settings live in the Netlify UI). `yarn deploy` / `gh-pages` and `.github/workflows/main.yml` are legacy GitHub Pages leftovers — don't use them

## Project Structure
- `src/main.tsx` — router + `ThemeProvider`. Routes: `/`, `/catalogo`, `/catalogo/:category_id`, `/fale-conosco`, `/quemSomos`
- `src/App.tsx` — layout: Header + ScrollToTop + `<Outlet />` + Footer
- `src/routes/` — pages: compose sections only, no logic
- `src/components/<Page>/` — page sections (`Home/`, `QuemSomos/`, `FaleConosco/`, `Catalogo/`, `Prints/`); `Header.tsx`, `Footer.tsx` are global
- `src/Style/Theme.ts` — MUI theme: single source for colors, typography, breakpoints
- `src/utils/enums/Routes.ts` — nav slugs + pt-BR labels used by Header/Footer
- `public/_redirects` — Netlify SPA fallback (`/* /index.html 200`)

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

## Skills (progressive disclosure)
Auto-invoked by task context:
- `fe-conventions` — BEFORE editing any `.ts`/`.tsx` under `src/`

User-invoked workflow:
- `/grill-me` → `/write-a-prd` → `/prd-to-plan-generic` → `/adversarial-review plan` → `/do-work` → `/verify-before-done` → `/adversarial-review code` → `/code-review` → `/pr`
- `/adversarial-review` — Codex reviews from packets Claude writes; Claude only verifies findings and reconciles the verdict. Advisory, read-only, spends ChatGPT quota — plans and meaningful diffs only
- Bug fix or one-file change: skip the PRD, go straight to `/do-work`
- Plans/PRDs live in `plans/<YYYY-MM-DD>/` and are committed

## Known debt (don't fix unless asked)
- `tsc` errors (unused imports, orphaned `src/routes/Catalogos/Abstratas.tsx`)
- `@mui/styles` `makeStyles` is deprecated but is the dominant styling pattern
- Dead files: `components/QuemSomos/oldAtividades`, `SelosDeQualidade.tsx` (returns `null`), `routes/QuemSomos copy.tsx` (live route, odd name)
- Wistia/Elfsight embeds inject scripts on every mount without cleanup
