#!/usr/bin/env node
/**
 * Square home-screen / favicon set from public/logo.png (MA monogram).
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logo = join(root, "public/logo.png");
const publicDir = join(root, "public");
const appDir = join(root, "app");
const white = { r: 255, g: 255, b: 255 };

async function squarePng(size, dest, paddingRatio = 0.2) {
  const inner = Math.max(1, Math.round(size * (1 - paddingRatio * 2)));
  const mark = await sharp(logo)
    .resize(inner, inner, { fit: "contain", background: { ...white, alpha: 1 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 3, background: white },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(dest);
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  await mkdir(appDir, { recursive: true });
  await squarePng(180, join(publicDir, "apple-touch-icon.png"));
  await squarePng(32, join(publicDir, "favicon-32x32.png"), 0.16);
  await squarePng(192, join(publicDir, "icon-192.png"));
  await squarePng(512, join(publicDir, "icon-512.png"));
  await squarePng(48, join(publicDir, "favicon.ico"), 0.16);
  await squarePng(512, join(appDir, "icon.png"));
  await squarePng(180, join(appDir, "apple-icon.png"));
  console.log("wrote MA icon set from public/logo.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
