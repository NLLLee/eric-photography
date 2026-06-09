// ─────────────────────────────────────────────────────────────────────────────
// Resolves a photo *filename* (as stored in photos.json) to an Astro
// ImageMetadata object so the <Image> component can optimize it. This is what
// lets the site be "data driven": you reference files by name in JSON and we
// look up the actual imported asset here.
//
//   - Large masters live in   src/photos/<name>.jpg
//   - Thumbnails live in       src/photos/thumbs/<name>.jpg   (optional)
//
// If a thumbnail is missing we transparently fall back to the large master.
// ─────────────────────────────────────────────────────────────────────────────

import type { ImageMetadata } from 'astro';

const GLOB = '*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}';

// `*` does not cross `/`, so the first glob excludes the thumbs/ subfolder.
const largeModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);
const thumbModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/photos/thumbs/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

function indexByFilename(
  modules: Record<string, { default: ImageMetadata }>,
): Map<string, ImageMetadata> {
  const map = new Map<string, ImageMetadata>();
  for (const [path, mod] of Object.entries(modules)) {
    const filename = path.split('/').pop();
    if (filename) map.set(filename, mod.default);
  }
  return map;
}

const largeMap = indexByFilename(largeModules);
const thumbMap = indexByFilename(thumbModules);

/** Full-size master for the lightbox. `undefined` if the file isn't present. */
export function resolveLarge(file: string): ImageMetadata | undefined {
  return largeMap.get(file);
}

/** Thumbnail for the grid; falls back to the large master when absent. */
export function resolveThumb(file: string): ImageMetadata | undefined {
  return thumbMap.get(file) ?? largeMap.get(file);
}

export function hasImage(file: string): boolean {
  return largeMap.has(file);
}

/** Number of large masters currently present — useful for empty states. */
export function imageCount(): number {
  return largeMap.size;
}
