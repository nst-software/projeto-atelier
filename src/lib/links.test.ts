import { describe, expect, it } from "vitest";
import { navRoutes } from "../config/routes";
import { siteConfig } from "../config/site";
import { isExternal, linkAttrs } from "./links";

describe("linkAttrs", () => {
  it("opens absolute http(s) URLs in a new tab without opener", () => {
    expect(isExternal(siteConfig.whatsapp.url)).toBe(true);
    expect(linkAttrs(siteConfig.instagram.url)).toEqual({
      href: siteConfig.instagram.url,
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it("keeps internal paths in the same tab", () => {
    expect(isExternal("/catalogo/")).toBe(false);
    expect(linkAttrs("/quem-somos/")).toEqual({ href: "/quem-somos/" });
  });
});

describe("navRoutes", () => {
  it("uses the trailing-slash form so navigation never hits the Netlify 301", () => {
    for (const { href } of navRoutes) expect(href.endsWith("/")).toBe(true);
  });
});
