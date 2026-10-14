import { defineCollection } from "astro:content";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import catalogData from "./data/catalog.json";
import { assertValidCatalog } from "./lib/catalog";

const catalogLoader: Loader = {
  name: "catalog-loader",
  load: async ({ store, parseData, generateDigest }) => {
    assertValidCatalog(catalogData);

    store.clear();
    for (const raw of catalogData) {
      const data = await parseData({ id: raw.id, data: raw });
      store.set({ id: raw.id, data, digest: generateDigest(raw) });
    }
  },
};

const catalog = defineCollection({
  loader: catalogLoader,
  schema: z.object({
    id: z.string(),
    legacyId: z.number().int().positive(),
    name: z.string().min(1),
    cover: z.url(),
    prints: z.array(z.object({ id: z.number().int().positive(), image: z.url() })).min(1),
  }),
});

export const collections = { catalog };
