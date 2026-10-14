import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/config/site.ts";
import redirects from "./src/integrations/redirects.ts";

export default defineConfig({
  site: siteConfig.site,
  output: "static",
  integrations: [redirects()],
  vite: {
    plugins: [tailwindcss()],
  },
});
