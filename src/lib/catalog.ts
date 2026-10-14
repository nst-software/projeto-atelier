export interface CatalogPrint {
  id: number;
  image: string;
}

export interface CatalogEntry {
  id: string;
  legacyId: number;
  name: string;
  cover: string;
  prints: CatalogPrint[];
}

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

type CatalogEntryInput = Partial<Omit<CatalogEntry, "prints">> & {
  prints?: Partial<CatalogPrint>[];
};

function duplicates<T>(values: T[]): T[] {
  const seen = new Set<T>();
  const repeated = new Set<T>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

export function validateCatalog(entries: CatalogEntryInput[]): string[] {
  const errors: string[] = [];

  for (const slug of duplicates(entries.map((entry) => entry.id))) {
    errors.push(`duplicate slug "${slug}"`);
  }
  for (const legacyId of duplicates(entries.map((entry) => entry.legacyId))) {
    errors.push(`duplicate legacyId ${legacyId}`);
  }

  for (const entry of entries) {
    const label = `"${entry.id}"`;
    if (typeof entry.id !== "string" || !SLUG_PATTERN.test(entry.id)) {
      errors.push(`${label}: slug is not URL-safe`);
    }
    if (typeof entry.cover !== "string" || entry.cover.trim() === "") {
      errors.push(`${label}: missing cover`);
    }
    const prints = entry.prints ?? [];
    if (prints.length === 0) {
      errors.push(`${label}: no prints`);
    }
    for (const image of duplicates(prints.map((print) => print.image))) {
      errors.push(`${label}: duplicate print image ${image}`);
    }
  }

  return errors;
}

export function assertValidCatalog(entries: CatalogEntryInput[]): void {
  const errors = validateCatalog(entries);
  if (errors.length > 0) {
    throw new Error(`Invalid catalog:\n- ${errors.join("\n- ")}`);
  }
}

export function sortCatalog<T extends { data: Pick<CatalogEntry, "legacyId"> }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.data.legacyId - b.data.legacyId);
}
