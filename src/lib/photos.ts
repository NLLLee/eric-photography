// ─────────────────────────────────────────────────────────────────────────────
// Loads photo records from src/data/photos.json and joins them with the actual
// image assets. Entries whose image file is not present yet are skipped (so the
// site always builds, even before you've added photos).
// ─────────────────────────────────────────────────────────────────────────────

import type { ImageMetadata } from 'astro';
import photosData from '../data/photos.json';
import { resolveLarge, resolveThumb } from './images';

export interface PhotoEntry {
  /** Filename in src/photos/, e.g. "grad-01.jpg". */
  file: string;
  /** Caption shown in the lightbox. Optional. */
  title?: string;
  /** Accessible alt text. REQUIRED for every photo. */
  alt: string;
  /** Category slug — must match a slug in categories.ts. */
  category: string;
  /** Sub-tag slug (portraits only): graduation | marriage | creative. */
  subtag?: string;
  /** Show on the homepage "featured" grid. */
  featured?: boolean;
  /** Lower numbers sort first. Defaults to 0. */
  order?: number;
}

export interface RenderablePhoto extends PhotoEntry {
  large: ImageMetadata;
  thumb: ImageMetadata;
}

export const photos = photosData as PhotoEntry[];

function byOrder(a: PhotoEntry, b: PhotoEntry): number {
  return (a.order ?? 0) - (b.order ?? 0);
}

/** Joins entries with their image assets, dropping any with missing files. */
export function toRenderable(list: PhotoEntry[]): RenderablePhoto[] {
  const out: RenderablePhoto[] = [];
  for (const p of list) {
    const large = resolveLarge(p.file);
    const thumb = resolveThumb(p.file);
    if (large && thumb) out.push({ ...p, large, thumb });
  }
  return out;
}

export function photosByCategory(slug: string): RenderablePhoto[] {
  return toRenderable(photos.filter((p) => p.category === slug).sort(byOrder));
}

export function featuredPhotos(): RenderablePhoto[] {
  return toRenderable(photos.filter((p) => p.featured).sort(byOrder));
}

/** One representative photo per category, for the homepage category cards. */
export function coverFor(slug: string): RenderablePhoto | undefined {
  const inCat = photosByCategory(slug);
  return inCat.find((p) => p.featured) ?? inCat[0];
}
