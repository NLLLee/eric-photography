#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Batch photo processor.
//
//   1. Reads raw originals from  _incoming/  (or --input <dir>)
//   2. Auto-orients them (bakes in EXIF rotation)
//   3. STRIPS all EXIF / GPS metadata (sharp drops metadata unless asked to keep)
//   4. Writes a downscaled "large" master  ->  src/photos/<name>.jpg
//   5. Writes a "thumb"                     ->  src/photos/thumbs/<name>.jpg
//
// Astro then turns these into responsive WebP/AVIF at build time.
//
// Usage:
//   npm run photos                 # process everything in _incoming/
//   npm run photos -- --force      # re-process even if outputs are up to date
//   npm run photos -- --input ~/raw --large 2400 --thumb 900 --quality 82
//
// After it runs, copy the printed JSON snippets into src/data/photos.json and
// fill in the title / category / subtag / alt fields.
// ─────────────────────────────────────────────────────────────────────────────

import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error(
    '\n  ✗ 缺少依赖 "sharp"。请先安装依赖：\n    npm install\n',
  );
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// ── options ──────────────────────────────────────────────────────────────────
function getFlag(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const val = process.argv[i + 1];
  return val && !val.startsWith('--') ? val : true;
}

const INPUT_DIR = path.resolve(root, String(getFlag('input', '_incoming')));
const LARGE_DIR = path.resolve(root, 'src/photos');
const THUMB_DIR = path.resolve(root, 'src/photos/thumbs');
const LARGE_EDGE = Number(getFlag('large', 2048)); // px, long edge
const THUMB_EDGE = Number(getFlag('thumb', 800)); // px, long edge
const QUALITY = Number(getFlag('quality', 82));
const THUMB_QUALITY = Number(getFlag('thumb-quality', 72));
const FORCE = Boolean(getFlag('force', false));

const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);

function slugifyName(filename) {
  const base = path.basename(filename, path.extname(filename));
  const clean = base
    .normalize('NFKD')
    .replace(/[^\w一-龥-]+/g, '-') // keep word chars + CJK + dash
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `${clean || 'photo'}.jpg`;
}

async function isUpToDate(srcPath, outPath) {
  if (FORCE) return false;
  try {
    const [a, b] = await Promise.all([stat(srcPath), stat(outPath)]);
    return b.mtimeMs >= a.mtimeMs;
  } catch {
    return false;
  }
}

async function processOne(file) {
  const srcPath = path.join(INPUT_DIR, file);
  const outName = slugifyName(file);
  const largePath = path.join(LARGE_DIR, outName);
  const thumbPath = path.join(THUMB_DIR, outName);

  if (await isUpToDate(srcPath, largePath)) {
    return { outName, skipped: true };
  }

  // .rotate() auto-orients from EXIF; outputting without .withMetadata()
  // drops EXIF/GPS. We resize from the rotated pipeline twice.
  const base = sharp(srcPath, { failOn: 'none' }).rotate();
  const meta = await base.metadata();

  await base
    .clone()
    .resize({
      width: LARGE_EDGE,
      height: LARGE_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(largePath);

  await base
    .clone()
    .resize({
      width: THUMB_EDGE,
      height: THUMB_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true, progressive: true })
    .toFile(thumbPath);

  return {
    outName,
    skipped: false,
    width: meta.width,
    height: meta.height,
  };
}

async function main() {
  await mkdir(LARGE_DIR, { recursive: true });
  await mkdir(THUMB_DIR, { recursive: true });

  let entries;
  try {
    entries = await readdir(INPUT_DIR);
  } catch {
    console.error(`\n  ✗ 找不到输入目录：${INPUT_DIR}\n`);
    process.exit(1);
  }

  const files = entries.filter((f) =>
    EXTENSIONS.has(path.extname(f).toLowerCase()),
  );

  if (files.length === 0) {
    console.log(
      `\n  没有可处理的图片。请把原图放进：\n    ${INPUT_DIR}\n  支持：${[...EXTENSIONS].join(', ')}\n`,
    );
    return;
  }

  console.log(`\n  处理 ${files.length} 张图片  →  src/photos/ (+ thumbs/)\n`);

  const created = [];
  let skipped = 0;

  for (const file of files) {
    try {
      const r = await processOne(file);
      if (r.skipped) {
        skipped++;
        console.log(`  ·  跳过(已最新)  ${r.outName}`);
      } else {
        created.push(r);
        console.log(`  ✓  ${file}  →  ${r.outName}  (${r.width}×${r.height})`);
      }
    } catch (err) {
      console.error(`  ✗  处理失败 ${file}: ${err.message}`);
    }
  }

  console.log(
    `\n  完成：新生成 ${created.length} 张，跳过 ${skipped} 张。EXIF 已去除。\n`,
  );

  if (created.length > 0) {
    console.log(
      '  把下面的条目加进 src/data/photos.json，并补全 title / category / subtag / alt：\n',
    );
    const snippet = created.map((r) => ({
      file: r.outName,
      title: '',
      alt: '请填写：照片内容的简短描述',
      category: 'portraits',
      subtag: '',
      featured: false,
    }));
    console.log(JSON.stringify(snippet, null, 2));
    console.log('');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
