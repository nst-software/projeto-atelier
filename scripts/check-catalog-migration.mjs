import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const { default: legacy } = await import(new URL("legacy/src/catalogoItens/catalogo.js", root));
const catalog = JSON.parse(await readFile(new URL("src/data/catalog.json", root), "utf-8"));

const EXPECTED_ENTRIES = 19;
const REMOVED_DUPLICATES = { "animal-print": [32] };

const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${message}`);
  if (!ok) failures.push(message);
};

check(legacy.length === EXPECTED_ENTRIES, `legacy has ${legacy.length} entries (expected ${EXPECTED_ENTRIES})`);
check(catalog.length === EXPECTED_ENTRIES, `collection has ${catalog.length} entries (expected ${EXPECTED_ENTRIES})`);

for (const [index, old] of legacy.entries()) {
  const entry = catalog[index];
  const slug = old.rota.replace(/^\/catalogo\//, "");
  const removed = REMOVED_DUPLICATES[slug] ?? [];
  const expectedPrints = old.prints.filter((print) => !removed.includes(print.id));
  const samePrints =
    entry?.prints.length === expectedPrints.length &&
    expectedPrints.every((print, i) => entry.prints[i].id === print.id && entry.prints[i].image === print.image);

  check(entry?.id === slug, `${slug}: slug equals legacy rota segment`);
  check(entry?.legacyId === old.category_id, `${slug}: legacyId ${entry?.legacyId} equals category_id ${old.category_id}`);
  check(entry?.name === old.name && entry?.cover === old.capa, `${slug}: name and cover match`);
  check(
    samePrints,
    `${slug}: ${entry?.prints.length} prints = legacy ${old.prints.length} - ${removed.length} removed duplicate(s)`,
  );
}

console.log(failures.length === 0 ? "\nmigration check passed" : `\n${failures.length} check(s) failed`);
process.exit(failures.length === 0 ? 0 : 1);
