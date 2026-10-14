import { describe, expect, it } from "vitest";
import {
  auditPages,
  auditRobots,
  auditSitemap,
  parseHead,
  routeFromFile,
  sitemapLocs,
} from "../../scripts/audit-head.mjs";

const ORIGIN = "https://example.test";

interface PageOptions {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  lang?: string;
  canonical?: string | null;
  extraHead?: string;
}

function page({
  title = "Home | Brand",
  description = "Home description.",
  url = `${ORIGIN}/`,
  image = `${ORIGIN}/og-default.jpg`,
  lang = "pt-BR",
  canonical = url,
  extraHead = "",
}: PageOptions = {}): string {
  return [
    `<!DOCTYPE html><html lang="${lang}"><head>`,
    `<meta charset="utf-8">`,
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    canonical === null ? "" : `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    extraHead,
    `</head><body><svg><title>Icon</title></svg></body></html>`,
  ].join("");
}

const valid = [
  { path: "/", html: page() },
  {
    path: "/catalogo/",
    html: page({
      title: "Catálogo | Brand",
      description: "Catalog description.",
      url: `${ORIGIN}/catalogo/`,
    }),
  },
];

describe("parseHead", () => {
  it("reads lang, head-only titles, metas and links, decoding entities", () => {
    const head = parseHead(page({ title: "A &amp; B" }));
    expect(head.lang).toBe("pt-BR");
    expect(head.titles).toEqual(["A & B"]);
    expect(head.metas.find((meta) => meta.property === "og:title")?.content).toBe("A & B");
    expect(head.links.filter((link) => link.rel === "canonical")).toHaveLength(1);
  });
});

describe("auditPages", () => {
  it("accepts pages with complete, unique heads on the origin", () => {
    expect(auditPages(valid, ORIGIN)).toEqual([]);
  });

  it("flags a description shared by two routes", () => {
    const pages = [
      valid[0],
      {
        path: "/catalogo/",
        html: page({ title: "Catálogo | Brand", url: `${ORIGIN}/catalogo/` }),
      },
    ];
    const violations = auditPages(pages, ORIGIN);
    expect(violations).toHaveLength(1);
    expect(violations[0].message).toMatch(/duplicate description/);
    expect(violations[0].message).toContain("/catalogo/");
  });

  it("flags a duplicate title", () => {
    const pages = [
      valid[0],
      { path: "/x/", html: page({ description: "Other.", url: `${ORIGIN}/x/` }) },
    ];
    expect(auditPages(pages, ORIGIN).map((v) => v.message)).toEqual([
      expect.stringMatching(/duplicate title/),
    ]);
  });

  it("flags a missing canonical", () => {
    const violations = auditPages([{ path: "/", html: page({ canonical: null }) }], ORIGIN);
    expect(violations).toEqual([
      { path: "/", message: 'expected exactly one link[rel=canonical], found 0' },
    ]);
  });

  it("flags canonical and og:url outside the production origin", () => {
    const html = page({ url: "https://other.test/" });
    const messages = auditPages([{ path: "/", html }], ORIGIN).map((v) => v.message);
    expect(messages).toEqual([
      expect.stringMatching(/^canonical .* is not on https:\/\/example\.test/),
      expect.stringMatching(/^og:url .* is not on https:\/\/example\.test/),
    ]);
  });

  it("flags a relative og:image, a wrong lang and a duplicated tag", () => {
    const html = page({
      image: "/og-default.jpg",
      lang: "en",
      extraHead: `<meta name="description" content="Again.">`,
    });
    const messages = auditPages([{ path: "/", html }], ORIGIN).map((v) => v.message);
    expect(messages).toContain('expected <html lang="pt-BR">, found "en"');
    expect(messages).toContain("expected exactly one meta[name=description], found 2");
    expect(messages).toContain('og:image "/og-default.jpg" is not an absolute https URL');
  });
});

describe("routeFromFile", () => {
  it("maps built files to routes", () => {
    expect(routeFromFile("index.html")).toBe("/");
    expect(routeFromFile("catalogo/index.html")).toBe("/catalogo/");
    expect(routeFromFile("catalogo/xadrez/index.html")).toBe("/catalogo/xadrez/");
    expect(routeFromFile("404.html")).toBe("/404");
  });
});

describe("auditSitemap", () => {
  const xml =
    `<urlset><url><loc>${ORIGIN}/</loc></url>` + `<url><loc>${ORIGIN}/catalogo/</loc></url></urlset>`;

  it("extracts loc entries", () => {
    expect(sitemapLocs(xml)).toEqual([`${ORIGIN}/`, `${ORIGIN}/catalogo/`]);
  });

  it("accepts a sitemap listing every route except the excluded ones", () => {
    expect(auditSitemap(["/", "/catalogo/", "/404"], sitemapLocs(xml), ORIGIN, ["/404"])).toEqual(
      [],
    );
  });

  it("flags missing routes, unknown entries and foreign origins", () => {
    const locs = [`${ORIGIN}/`, `${ORIGIN}/gone/`, "https://other.test/catalogo/"];
    const messages = auditSitemap(["/", "/catalogo/"], locs, ORIGIN, []).map((v) => v.message);
    expect(messages).toEqual([
      expect.stringMatching(/is not on https:\/\/example\.test/),
      expect.stringMatching(/\/gone\/ has no built page/),
      expect.stringMatching(/\/catalogo\/ is missing from the sitemap/),
    ]);
  });
});

describe("auditRobots", () => {
  it("accepts allow-all with the sitemap index on the origin", () => {
    const text = `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap-index.xml\n`;
    expect(auditRobots(text, ORIGIN)).toEqual([]);
  });

  it("flags a disallow-all file without a sitemap", () => {
    expect(auditRobots("User-agent: *\nDisallow: /\n", ORIGIN)).toHaveLength(2);
  });
});
