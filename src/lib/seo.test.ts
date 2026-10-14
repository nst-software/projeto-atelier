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

describe("buildLocalBusinessJsonLd shape", () => {
  const parsed = JSON.parse(JSON.stringify(buildLocalBusinessJsonLd(siteConfig)));

  it("points to the production origin and the store location", () => {
    const store = siteConfig.locations.store;
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed.url).toBe(siteConfig.site);
    expect(parsed.name).toBe(siteConfig.name);
    expect(parsed.email).toBe(siteConfig.email);
    expect(parsed.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: store.street,
      addressLocality: store.city,
      addressRegion: store.state,
      postalCode: store.postalCode,
      addressCountry: "BR",
    });
    expect(parsed.geo.latitude).toBe(store.coordinates.lat);
    expect(parsed.geo.longitude).toBe(store.coordinates.lng);
    expect(parsed.hasMap).toBe(store.mapsUrl);
    expect(parsed.telephone).toMatch(/^\+55\d{10,11}$/);
  });

  it("declares one weekday opening hours specification", () => {
    expect(parsed.openingHoursSpecification).toHaveLength(1);
    const [hours] = parsed.openingHoursSpecification;
    expect(hours["@type"]).toBe("OpeningHoursSpecification");
    expect(hours.dayOfWeek).toEqual(
      siteConfig.openingHours.days.map((day) => `https://schema.org/${day}`),
    );
    expect(hours.dayOfWeek).toHaveLength(siteConfig.openingHours.days.length);
    expect(hours.opens).toMatch(/^\d{2}:\d{2}$/);
    expect(hours.closes).toMatch(/^\d{2}:\d{2}$/);
  });

  it("derives every field from the given config", () => {
    const custom = {
      ...siteConfig,
      site: "https://example.test",
      instagram: { handle: "x", url: "https://example.test/ig" },
    };
    const result = buildLocalBusinessJsonLd(custom);
    expect(result.url).toBe(custom.site);
    expect(result.sameAs).toEqual([custom.instagram.url]);
  });
});
