# Atelier Tecidos

Marketing site and fabric-print catalog for Atelier Tecidos. A fully static [Astro](https://astro.build) site with Tailwind CSS v4 and TypeScript. Catalog data lives in `src/data/catalog.json`; print images are served from a public Google Cloud Storage bucket.

## Requirements

- Node 22 (see `.nvmrc`)
- Yarn 1 (vendored in `.yarn/releases`, picked up automatically via `.yarnrc`)

## Commands

| Command | What it does |
| --- | --- |
| `yarn install --frozen-lockfile` | Install dependencies |
| `yarn dev` | Local dev server |
| `yarn build` | Full gate: `astro check`, `vitest run`, `astro build`, then the `dist` head/sitemap/robots audit |
| `yarn preview` | Serve the built `dist` (does not apply redirects) |
| `yarn run check` / `yarn test` | Type check / unit tests only |
| `yarn check:urls` | Check that every catalog image URL returns 200 |

Redirects (`dist/_redirects`), `robots.txt` and the sitemap are generated during the build. To test redirects locally, serve `dist` with the Netlify CLI: `netlify dev --dir dist --framework '#static' --offline`.

## Deploy

The site is hosted on Netlify. `netlify.toml` sets the build command (`yarn build`), the publish directory (`dist`) and Node 22. Netlify builds the `main` branch, so every merge into `main` goes live.
