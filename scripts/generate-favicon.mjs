import { readFile } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const SIZE = 64;
const MAX_BYTES = 5 * 1024;

const output = new URL("public/favicon.png", root);
const { size } = await sharp(await readFile(new URL("src/assets/ATELIER-LOGO.png", root)))
  .resize({ width: SIZE, height: SIZE, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ palette: true, compressionLevel: 9 })
  .toFile(output.pathname);

if (size > MAX_BYTES) throw new Error(`favicon.png is ${size} bytes, over ${MAX_BYTES}`);
console.log(`wrote public/favicon.png (${SIZE}x${SIZE}, ${size} bytes)`);
