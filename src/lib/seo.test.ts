import { describe, expect, it } from "vitest";
import { siteConfig } from "../config/site";
import { buildHead, buildLocalBusinessJsonLd, DEFAULT_OG_IMAGE } from "./seo";

const input = {
  title: "Catálogo",
  description: "Estampas exclusivas para tecidos.",
  path: "/catalogo",
};

describe("buildHead", () => {
  it("suffixes the title with the brand name", () => {
    expect(buildHead(input).title).toBe(`Catálogo | ${siteConfig.name}`);
  });

  it("uses the bare brand name when the page title is the brand", () => {
    const head = buildHead({ ...input, title: siteConfig.name, path: "/" });
    expect(head.title).toBe(siteConfig.name);
    expect(head.og.title).toBe(siteConfig.name);
  });

  it("builds the canonical URL on the production origin", () => {
    const head = buildHead(input);
    expect(head.canonical).toBe(`${siteConfig.site}/catalogo`);
    expect(new URL(head.canonical).origin).toBe(new URL(siteConfig.site).origin);
    expect(buildHead({ ...input, path: "/" }).canonical).toBe(`${siteConfig.site}/`);
  });

  it("falls back to the default share image and mirrors title and description", () => {
    const head = buildHead(input);
    expect(head.og.image).toBe(new URL(DEFAULT_OG_IMAGE, siteConfig.site).href);
    expect(head.twitter.image).toBe(head.og.image);
    expect(head.og.title).toBe(head.title);
    expect(head.og.description).toBe(input.description);
    expect(head.og.url).toBe(head.canonical);
    expect(head.og.locale).toBe("pt_BR");
    expect(head.og.siteName).toBe(siteConfig.name);
    expect(head.twitter.card).toBe("summary_large_image");
  });

  it("uses a custom image, resolving relative paths and keeping absolute URLs", () => {
    expect(buildHead({ ...input, image: "/cover.png" }).og.image).toBe(
      `${siteConfig.site}/cover.png`,
    );
    const remote = "https://storage.googleapis.com/bucket/cover.png";
    expect(buildHead({ ...input, image: remote }).og.image).toBe(remote);
  });
});

describe("buildLocalBusinessJsonLd", () => {
  it("serializes the store address, phone, hours and Instagram from site config", () => {
    const parsed = JSON.parse(JSON.stringify(buildLocalBusinessJsonLd()));
    const store = siteConfig.locations.store;
    expect(parsed["@type"]).toBe("LocalBusiness");
    expect(parsed.address.streetAddress).toBe(store.street);
    expect(parsed.address.postalCode).toBe(store.postalCode);
    expect(parsed.telephone).toBe(siteConfig.landline.tel);
    expect(parsed.openingHoursSpecification[0].opens).toBe(siteConfig.openingHours.opens);
    expect(parsed.openingHoursSpecification[0].closes).toBe(siteConfig.openingHours.closes);
    expect(parsed.sameAs).toContain(siteConfig.instagram.url);
  });
});
