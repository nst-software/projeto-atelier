import { readFile } from "node:fs/promises";

const CONCURRENCY = 10;
const file = process.argv[2] ?? "src/data/catalog.json";

const catalog = JSON.parse(await readFile(file, "utf8"));
const urls = [
  ...new Set(
    catalog.flatMap((entry) => [
      entry.cover,
      ...entry.prints.map((print) => print.image),
    ]),
  ),
];

async function head(url, retries = 1) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "manual" });
    return String(response.status);
  } catch (error) {
    if (retries > 0) return head(url, retries - 1);
    return `network error: ${error.cause?.code ?? error.message}`;
  }
}

const failures = [];
let next = 0;
async function worker() {
  while (next < urls.length) {
    const url = urls[next++];
    const status = await head(url);
    if (status !== "200") failures.push({ url, status });
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`ok ${urls.length - failures.length}/${urls.length}`);
for (const { url, status } of failures) console.log(`${status} ${url}`);
if (failures.length > 0) process.exitCode = 1;
