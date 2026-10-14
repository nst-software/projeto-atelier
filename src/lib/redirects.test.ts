import { describe, expect, it } from "vitest";
import catalog from "../data/catalog.json";
import { buildRedirectLines, renderRedirects } from "./redirects";

const LINE_PATTERN = /^\/\S+ \/\S+ 301$/;

describe("buildRedirectLines with the real catalog", () => {
  const lines = buildRedirectLines(catalog);

  it("emits one line per entry plus the static rule", () => {
    expect(lines).toHaveLength(catalog.length + 1);
  });

  it("maps every legacyId exactly once to its slug", () => {
    for (const entry of catalog) {
      const matches = lines.filter((line) => line.startsWith(`/catalogo/${entry.legacyId} `));
      expect(matches).toEqual([`/catalogo/${entry.legacyId} /catalogo/${entry.id} 301`]);
    }
  });

  it("includes the /quemSomos rule", () => {
    expect(lines).toContain("/quemSomos /quem-somos 301");
  });

  it("has only well-formed 301 lines without duplicates", () => {
    for (const line of lines) expect(line).toMatch(LINE_PATTERN);
    expect(new Set(lines).size).toBe(lines.length);
    expect(new Set(lines.map((line) => line.split(" ")[0])).size).toBe(lines.length);
  });
});

describe("renderRedirects", () => {
  it("joins lines with a single trailing newline and no blank lines", () => {
    const output = renderRedirects(buildRedirectLines(catalog));
    expect(output.endsWith("\n")).toBe(true);
    expect(output.slice(0, -1).split("\n").every((line) => line.trim() !== "")).toBe(true);
  });
});
