import { describe, expect, it } from "vitest";
import { siteConfig } from "../config/site";
import { buildRobotsTxt, SITEMAP_INDEX } from "./robots";

describe("buildRobotsTxt", () => {
  it("allows every crawler and points to the sitemap index on the given origin", () => {
    expect(buildRobotsTxt(siteConfig.site).split("\n")).toEqual([
      "User-agent: *",
      "Allow: /",
      "",
      `Sitemap: ${siteConfig.site}/${SITEMAP_INDEX}`,
      "",
    ]);
  });

  it("does not double the slash when the origin has a trailing slash", () => {
    expect(buildRobotsTxt("https://example.test/")).toContain(
      "Sitemap: https://example.test/sitemap-index.xml\n",
    );
  });
});
