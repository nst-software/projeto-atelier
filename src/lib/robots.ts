export const SITEMAP_INDEX = "sitemap-index.xml";

export function buildRobotsTxt(origin: string): string {
  const sitemapUrl = new URL(SITEMAP_INDEX, origin).href;
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapUrl}`, ""].join("\n");
}
