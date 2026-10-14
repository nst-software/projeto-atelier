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
