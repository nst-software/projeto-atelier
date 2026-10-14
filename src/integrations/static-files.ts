import { writeFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";
import catalogData from "../data/catalog.json";
import { assertValidCatalog } from "../lib/catalog";
import { buildRedirectLines, renderRedirects } from "../lib/redirects";
import { buildRobotsTxt } from "../lib/robots";

export default function staticFiles(): AstroIntegration {
  let site: string | undefined;
  return {
    name: "atelier-static-files",
    hooks: {
      "astro:config:done": ({ config }) => {
        site = config.site;
      },
      "astro:build:done": async ({ dir, logger }) => {
        assertValidCatalog(catalogData);
        const lines = buildRedirectLines(catalogData);
        await writeFile(new URL("_redirects", dir), renderRedirects(lines));
        logger.info(`wrote _redirects with ${lines.length} rules`);

        if (!site) throw new Error("`site` must be set to generate robots.txt");
        await writeFile(new URL("robots.txt", dir), buildRobotsTxt(site));
        logger.info(`wrote robots.txt for ${site}`);
      },
    },
  };
}
