import { writeFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";
import catalogData from "../data/catalog.json";
import { assertValidCatalog } from "../lib/catalog";
import { buildRedirectLines, renderRedirects } from "../lib/redirects";

export default function redirects(): AstroIntegration {
  return {
    name: "atelier-redirects",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        assertValidCatalog(catalogData);
        const lines = buildRedirectLines(catalogData);
        await writeFile(new URL("_redirects", dir), renderRedirects(lines));
        logger.info(`wrote _redirects with ${lines.length} rules`);
      },
    },
  };
}
