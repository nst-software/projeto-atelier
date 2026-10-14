import { describe, expect, it } from "vitest";
import catalog from "../data/catalog.json";
import { SLUG_PATTERN, assertValidCatalog, sortCatalog, validateCatalog, type CatalogEntry } from "./catalog";

const entry = (overrides: Partial<CatalogEntry> = {}): CatalogEntry => ({
  id: "abstratas",
  legacyId: 1,
  name: "Abstratas",
  cover: "https://example.com/cover.jpg",
  prints: [
    { id: 1, image: "https://example.com/1.jpg" },
    { id: 2, image: "https://example.com/2.jpg" },
  ],
  ...overrides,
});

describe("catalog data", () => {
  const entries = catalog as CatalogEntry[];

  it("passes the whole-collection validator", () => {
    expect(validateCatalog(entries)).toEqual([]);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = entries.map((e) => e.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(SLUG_PATTERN);
  });

  it("has unique legacy ids", () => {
    const ids = entries.map((e) => e.legacyId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every entry a cover and at least one print", () => {
    for (const e of entries) {
      expect(e.cover).not.toBe("");
      expect(e.prints.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate image URL within a category", () => {
    for (const e of entries) {
      const images = e.prints.map((p) => p.image);
      expect(new Set(images).size).toBe(images.length);
    }
  });
});

describe("validateCatalog", () => {
  it("accepts a valid catalog", () => {
    expect(validateCatalog([entry(), entry({ id: "barrados", legacyId: 2 })])).toEqual([]);
  });

  it("rejects duplicate slugs", () => {
    expect(validateCatalog([entry(), entry({ legacyId: 2 })])).toContain('duplicate slug "abstratas"');
  });

  it("rejects duplicate legacy ids", () => {
    expect(validateCatalog([entry(), entry({ id: "barrados" })])).toContain("duplicate legacyId 1");
  });

  it("rejects slugs that are not URL-safe", () => {
    for (const id of ["Abstratas", "animal print", "étnicas", "-a", "a--b", ""]) {
      expect(validateCatalog([entry({ id })])).toContain(`"${id}": slug is not URL-safe`);
    }
  });

  it("rejects a missing cover", () => {
    expect(validateCatalog([entry({ cover: "" })])).toContain('"abstratas": missing cover');
    const { cover: _cover, ...noCover } = entry();
    expect(validateCatalog([noCover])).toContain('"abstratas": missing cover');
  });

  it("rejects empty prints", () => {
    expect(validateCatalog([entry({ prints: [] })])).toContain('"abstratas": no prints');
  });

  it("rejects a duplicate image within a category", () => {
    const image = "https://example.com/same.jpg";
    const errors = validateCatalog([
      entry({ prints: [{ id: 1, image }, { id: 2, image }] }),
    ]);
    expect(errors).toContain(`"abstratas": duplicate print image ${image}`);
  });

  it("allows the same image in different categories", () => {
    const prints = [{ id: 1, image: "https://example.com/same.jpg" }];
    expect(validateCatalog([entry({ prints }), entry({ id: "barrados", legacyId: 2, prints })])).toEqual([]);
  });

  it("throws with every violation listed", () => {
    expect(() => assertValidCatalog([entry({ prints: [] }), entry({ cover: "" })])).toThrow(
      /duplicate slug "abstratas"[\s\S]*no prints[\s\S]*missing cover/,
    );
  });
});

describe("sortCatalog", () => {
  it("orders entries by legacy id without mutating the input", () => {
    const input = [3, 1, 2].map((legacyId) => ({ data: entry({ legacyId }) }));
    expect(sortCatalog(input).map((e) => e.data.legacyId)).toEqual([1, 2, 3]);
    expect(input.map((e) => e.data.legacyId)).toEqual([3, 1, 2]);
  });
});
