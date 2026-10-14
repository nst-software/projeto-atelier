import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

/** @typedef {{ path: string, message: string }} Violation */
/** @typedef {{ path: string, html: string }} Page */
/** @typedef {Record<string, string>} Attributes */

const REQUIRED_LANG = "pt-BR";
const SITEMAP_EXCLUDED = ["/404"];

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'", "#x27": "'" };

/** @param {string} text */
function decode(text) {
  return text.replace(/&(amp|lt|gt|quot|apos|#39|#x27);/g, (_, name) => ENTITIES[name]);
}

/** @param {string} source */
function parseAttributes(source) {
  /** @type {Attributes} */
  const attributes = {};
  for (const match of source.matchAll(/([^\s=/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attributes[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}

/** @param {string} html */
export function parseHead(html) {
  const lang = parseAttributes(html.match(/<html\b([^>]*)>/i)?.[1] ?? "").lang;
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((m) =>
    decode(m[1].trim()),
  );
  const metas = [...head.matchAll(/<meta\b([^>]*)>/gi)].map((m) => parseAttributes(m[1]));
  const links = [...head.matchAll(/<link\b([^>]*)>/gi)].map((m) => parseAttributes(m[1]));
  return { lang, titles, metas, links };
}

/**
 * @param {string} url
 * @param {string} origin
 */
function isOnOrigin(url, origin) {
  const base = origin.replace(/\/+$/, "");
  return url === base || url.startsWith(`${base}/`);
}

/**
 * @param {Page[]} pages
 * @param {string} origin
 * @returns {Violation[]}
 */
export function auditPages(pages, origin) {
  /** @type {Violation[]} */
  const violations = [];
  /** @type {Map<string, string[]>} */
  const titleRoutes = new Map();
  /** @type {Map<string, string[]>} */
  const descriptionRoutes = new Map();

  for (const { path, html } of pages) {
    const fail = (/** @type {string} */ message) => violations.push({ path, message });
    const head = parseHead(html);

    if (head.lang !== REQUIRED_LANG) {
      fail(`expected <html lang="${REQUIRED_LANG}">, found "${head.lang ?? ""}"`);
    }

    /** @type {[string, string[]][]} */
    const required = [
      ["<title>", head.titles],
      ["meta[name=description]", head.metas.filter((m) => m.name === "description").map((m) => m.content ?? "")],
      ...["og:title", "og:description", "og:image", "og:url"].map(
        (property) => /** @type {[string, string[]]} */ ([
          `meta[property=${property}]`,
          head.metas.filter((m) => m.property === property).map((m) => m.content ?? ""),
        ]),
      ),
      ["meta[name=twitter:card]", head.metas.filter((m) => m.name === "twitter:card").map((m) => m.content ?? "")],
      ["link[rel=canonical]", head.links.filter((l) => l.rel === "canonical").map((l) => l.href ?? "")],
    ];

    /** @type {Record<string, string>} */
    const values = {};
    for (const [label, found] of required) {
      if (found.length !== 1) {
        fail(`expected exactly one ${label}, found ${found.length}`);
      } else if (!found[0].trim()) {
        fail(`${label} is empty`);
      } else {
        values[label] = found[0];
      }
    }

    const canonical = values["link[rel=canonical]"];
    const ogUrl = values["meta[property=og:url]"];
    const ogImage = values["meta[property=og:image]"];
    const card = values["meta[name=twitter:card]"];
    if (canonical && !isOnOrigin(canonical, origin)) {
      fail(`canonical "${canonical}" is not on ${origin}`);
    }
    if (ogUrl && !isOnOrigin(ogUrl, origin)) fail(`og:url "${ogUrl}" is not on ${origin}`);
    if (ogImage && !/^https:\/\//.test(ogImage)) {
      fail(`og:image "${ogImage}" is not an absolute https URL`);
    }
    if (card && card !== "summary_large_image") {
      fail(`twitter:card is "${card}", expected "summary_large_image"`);
    }

    const title = values["<title>"];
    const description = values["meta[name=description]"];
    if (title) titleRoutes.set(title, [...(titleRoutes.get(title) ?? []), path]);
    if (description) {
      descriptionRoutes.set(description, [...(descriptionRoutes.get(description) ?? []), path]);
    }
  }

  for (const [kind, routesByValue] of /** @type {const} */ ([
    ["title", titleRoutes],
    ["description", descriptionRoutes],
  ])) {
    for (const [value, routes] of routesByValue) {
      if (routes.length > 1) {
        violations.push({
          path: routes.join(", "),
          message: `duplicate ${kind} "${value}" on ${routes.join(", ")}`,
        });
      }
    }
  }

  return violations;
}

/** @param {string} file path relative to the build directory, with forward slashes */
export function routeFromFile(file) {
  if (file === "index.html") return "/";
  if (file.endsWith("/index.html")) return `/${file.slice(0, -"index.html".length)}`;
  return `/${file.replace(/\.html$/, "")}`;
}

/** @param {string} xml */
export function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => decode(m[1]));
}

/**
 * @param {string[]} routes
 * @param {string[]} locs
 * @param {string} origin
 * @param {string[]} excluded
 * @returns {Violation[]}
 */
export function auditSitemap(routes, locs, origin, excluded) {
  /** @type {Violation[]} */
  const violations = [];
  const listed = new Set();
  for (const loc of locs) {
    if (!isOnOrigin(loc, origin)) {
      violations.push({ path: "sitemap", message: `${loc} is not on ${origin}` });
      continue;
    }
    listed.add(new URL(loc).pathname);
  }
  const expected = routes.filter((route) => !excluded.includes(route));
  for (const path of listed) {
    if (!expected.includes(path)) {
      violations.push({ path: "sitemap", message: `${path} has no built page` });
    }
  }
  for (const route of expected) {
    if (!listed.has(route)) {
      violations.push({ path: route, message: `${route} is missing from the sitemap` });
    }
  }
  return violations;
}

/**
 * @param {string} text
 * @param {string} origin
 * @returns {Violation[]}
 */
export function auditRobots(text, origin) {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const sitemapUrl = new URL("sitemap-index.xml", origin).href;
  /** @type {Violation[]} */
  const violations = [];
  if (!lines.includes("User-agent: *") || !lines.includes("Allow: /") || lines.includes("Disallow: /")) {
    violations.push({ path: "robots.txt", message: "does not allow all crawlers" });
  }
  if (!lines.includes(`Sitemap: ${sitemapUrl}`)) {
    violations.push({ path: "robots.txt", message: `does not reference ${sitemapUrl}` });
  }
  return violations;
}

/** @param {string} dir */
async function htmlFiles(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
}

/** @param {string} distDir */
async function main(distDir) {
  const { siteConfig } = await import("../src/config/site.ts");
  const origin = siteConfig.site;

  /** @type {Page[]} */
  const pages = [];
  for (const file of await htmlFiles(distDir)) {
    const path = routeFromFile(relative(distDir, file).split(sep).join("/"));
    pages.push({ path, html: await readFile(file, "utf-8") });
  }
  if (pages.length === 0) throw new Error(`no HTML files found in ${distDir}`);

  const indexLocs = sitemapLocs(await readFile(join(distDir, "sitemap-index.xml"), "utf-8"));
  const locs = [];
  for (const sitemap of indexLocs) {
    locs.push(...sitemapLocs(await readFile(join(distDir, new URL(sitemap).pathname), "utf-8")));
  }

  const violations = [
    ...auditPages(pages, origin),
    ...auditSitemap(pages.map((page) => page.path), locs, origin, SITEMAP_EXCLUDED),
    ...auditRobots(await readFile(join(distDir, "robots.txt"), "utf-8"), origin),
  ];

  console.table(
    pages.map(({ path, html }) => {
      const head = parseHead(html);
      const description = head.metas.find((m) => m.name === "description")?.content ?? "";
      return {
        route: path,
        title: head.titles[0],
        description: description.length > 60 ? `${description.slice(0, 57)}...` : description,
      };
    }),
  );
  console.log(`excluded from sitemap check: ${SITEMAP_EXCLUDED.join(", ")}`);
  console.log(`${pages.length} pages audited, ${locs.length} sitemap URLs, origin ${origin}`);

  if (violations.length > 0) {
    for (const { path, message } of violations) console.error(`FAIL ${path}: ${message}`);
    console.error(`${violations.length} head audit violation(s)`);
    process.exitCode = 1;
    return;
  }
  console.log("head audit passed");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main(resolve(process.argv[2] ?? "dist"));
}
