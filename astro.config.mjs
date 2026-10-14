import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/config/site.ts";

export default defineConfig({
  site: siteConfig.site,
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});
