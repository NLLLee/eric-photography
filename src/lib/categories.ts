// ─────────────────────────────────────────────────────────────────────────────
// Category + sub-tag definitions. The navigation, category pages and the
// portrait sub-tabs are all driven by this file. Add/rename freely — just keep
// the `slug` values in sync with the `category` / `subtag` fields in
// src/data/photos.json.
// ─────────────────────────────────────────────────────────────────────────────

export interface SubTag {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  /** Short line shown under the category title on its gallery page. */
  blurb: string;
  /** Optional sub-tags. When present, the gallery shows filter tabs. */
  subtags?: SubTag[];
}

export const categories: Category[] = [
  {
    slug: 'portraits',
    name: 'Portraits',
    blurb: 'Light, emotion, and the person — graduations, registrations, and free creative work.',
    subtags: [
      { slug: 'graduation', name: 'Graduation' },
      { slug: 'marriage', name: 'Marriage Registration' },
      { slug: 'creative', name: 'Creative' },
    ],
  },
  {
    slug: 'landscape',
    name: 'Landscape',
    blurb: 'Quiet vastness between mountains, sea, and sky.',
  },
  {
    slug: 'street',
    name: 'Street',
    blurb: 'The city breathing — unrehearsed moments.',
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
