#!/usr/bin/env node
/**
 * Resizes and recompresses everything in public/images to the size it's
 * actually rendered at, in place. Run after adding or replacing any image.
 *
 * Usage: node scripts/optimize-images.mjs
 *
 * Originals are backed up to public/images/.originals/ the first time a file
 * is processed, so nothing is destroyed if a rule turns out wrong.
 */
import { readdir, mkdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGES_DIR = path.resolve("public/images");
const BACKUP_DIR = path.join(IMAGES_DIR, ".originals");

/**
 * Match by filename prefix. maxWidth is 2x the largest on-screen size the
 * image is ever rendered at, which covers retina displays without shipping
 * pixels nobody sees. Order matters — first match wins.
 */
const RULES = [
  // 56px thumbnails scaled up 2x, plus headroom in case the design grows.
  { test: /^service-.*\.(jpg|jpeg)$/i, maxWidth: 300, quality: 72 },
  // Full-bleed square cards, rendered up to ~440px on desktop.
  { test: /^service-(?!.*-icon).*-full\.(jpg|jpeg)$/i, maxWidth: 900, quality: 75 },
  { test: /^(case-.*|hero|reception)\.(jpg|jpeg)$/i, maxWidth: 1400, quality: 76 },
  { test: /\.(jpg|jpeg)$/i, maxWidth: 1000, quality: 75 }, // catch-all for jpg/jpeg
  { test: /^hmo-.*\.png$/i, maxWidth: 400, png: true },
  { test: /^logo\.png$/i, maxWidth: 500, png: true },
  { test: /\.png$/i, maxWidth: 1000, png: true }, // catch-all for png
];

function pickRule(filename) {
  return RULES.find((rule) => rule.test.test(filename));
}

async function processFile(filename) {
  const rule = pickRule(filename);
  if (!rule) {
    console.log(`skip   ${filename} (no matching rule)`);
    return;
  }

  const filePath = path.join(IMAGES_DIR, filename);
  const backupPath = path.join(BACKUP_DIR, filename);

  // Keep a pristine copy so re-runs always work from the original quality,
  // not from a file that has already been recompressed once.
  if (!existsSync(backupPath)) {
    await copyFile(filePath, backupPath);
  }

  const source = sharp(backupPath);
  const meta = await source.metadata();
  const before = (await stat(filePath)).size;

  let pipeline = source.resize({
    width: rule.maxWidth,
    withoutEnlargement: true,
  });

  pipeline = rule.png
    ? pipeline.png({ quality: 85, compressionLevel: 9 })
    : pipeline.jpeg({ quality: rule.quality, mozjpeg: true });

  const buffer = await pipeline.toBuffer();
  await sharp(buffer).toFile(filePath);

  const after = buffer.length;
  const pct = Math.round((1 - after / before) * 100);
  console.log(
    `done   ${filename.padEnd(34)} ${meta.width}x${meta.height} -> max ${rule.maxWidth}w  ` +
      `${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${pct}%)`,
  );
}

async function main() {
  if (!existsSync(IMAGES_DIR)) {
    console.error(`No such directory: ${IMAGES_DIR}`);
    process.exit(1);
  }
  await mkdir(BACKUP_DIR, { recursive: true });

  const files = (await readdir(IMAGES_DIR)).filter(
    (f) => !f.startsWith(".") && /\.(jpg|jpeg|png)$/i.test(f),
  );

  if (files.length === 0) {
    console.log("No jpg/png files found in public/images.");
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const before = (await stat(path.join(IMAGES_DIR, file))).size;
    await processFile(file);
    const after = (await stat(path.join(IMAGES_DIR, file))).size;
    totalBefore += before;
    totalAfter += after;
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ` +
      `${(totalAfter / 1024 / 1024).toFixed(2)}MB`,
  );
}

main();
