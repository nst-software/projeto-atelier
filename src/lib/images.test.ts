import { describe, expect, it } from "vitest";
import catalog from "../data/catalog.json";
import { COVER_WIDTHS, PRINT_WIDTHS, buildSrcSet, netlifyImageUrl } from "./images";

const sample = catalog[0].prints[0].image;

describe("netlifyImageUrl", () => {
  it("routes the original URL through the Netlify image CDN with a width", () => {
    const url = new URL(netlifyImageUrl(sample, 480), "https://example.test");
    expect(url.pathname).toBe("/.netlify/images");
    expect(url.searchParams.get("url")).toBe(sample);
    expect(url.searchParams.get("w")).toBe("480");
    expect(url.searchParams.has("fm")).toBe(false);
  });
});

describe("buildSrcSet", () => {
  it("emits one ascending candidate per width", () => {
    const candidates = buildSrcSet(sample, PRINT_WIDTHS).split(", ");
    expect(candidates).toHaveLength(PRINT_WIDTHS.length);
    candidates.forEach((candidate, index) => {
      expect(candidate.endsWith(` ${PRINT_WIDTHS[index]}w`)).toBe(true);
      expect(candidate).toContain(encodeURIComponent(sample));
    });
  });

  it("keeps the width lists ascending and free of duplicates", () => {
    for (const widths of [COVER_WIDTHS, PRINT_WIDTHS]) {
      expect([...widths]).toEqual([...new Set(widths)].sort((a, b) => a - b));
    }
  });
});
