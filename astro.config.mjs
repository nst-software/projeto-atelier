import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/config/site.ts";
import staticFiles from "./src/integrations/static-files.ts";

export default defineConfig({
  site: siteConfig.site,
  output: "static",
  integrations: [
    sitemap({ filter: (page) => !/^\/404\/?$/.test(new URL(page).pathname) }),
    staticFiles(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
