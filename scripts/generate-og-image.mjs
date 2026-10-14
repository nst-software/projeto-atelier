import { readFile } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_BOX = { width: 720, height: 420 };
const MAX_BYTES = 150 * 1024;

const css = await readFile(new URL("src/styles/global.css", root), "utf-8");
const background = css.match(/--color-brand-beige:\s*(#[0-9a-fA-F]{6})\s*;/)?.[1];
if (!background) throw new Error("--color-brand-beige not found in global.css");

const logo = await sharp(await readFile(new URL("src/assets/LogoEscrita.svg", root)), { density: 300 })
  .resize({ ...LOGO_BOX, fit: "inside" })
  .png()
  .toBuffer();

const output = new URL("public/og-default.png", root);
const { size } = await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 3, background },
})
  .composite([{ input: logo, gravity: "center" }])
  .png({ palette: true, compressionLevel: 9 })
  .toFile(output.pathname);

if (size > MAX_BYTES) throw new Error(`og-default.png is ${size} bytes, over ${MAX_BYTES}`);
console.log(`wrote public/og-default.png (${WIDTH}x${HEIGHT}, ${size} bytes, background ${background})`);
