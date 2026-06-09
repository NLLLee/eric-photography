// ─────────────────────────────────────────────────────────────────────────────
// Central site config. Edit this to change your name, tagline, contact info, etc.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  /** Photographer / brand name shown in the header and footer. */
  name: 'Eric Li',
  /** Short title used in <title> and OpenGraph. */
  title: 'Eric Li — Photography',
  /** One-line positioning shown on the hero. */
  tagline: 'Photography is the art of a moment — and the story behind it.',
  /** Longer personal positioning shown on the hero / about page. */
  intro:
    'I’m a human‑focused photographer drawn to portraits, landscapes, and the streets. Using subtle light and honest emotion, I preserve the moments you’ll want to revisit time after time.',
  /** Used for SEO meta description on the home page. */
  description:
    'Eric Li Photography Portfolio — Portraits (Graduation, Marriage Registration, Creative), Landscapes & Street Photography.',
  /** Contact email (used on the contact + about pages and footer). */
  email: '1293739100qq@gmail.com',
  /** Where you're based, shown in footer / about. */
  location: 'Boston, MA',
  /** Filename (in src/photos/) used as the homepage hero. If missing, the first
   *  featured photo is used instead. */
  heroPhoto: 'landscape1.jpg',
  /** Social links. Leave a value empty ('') to hide that link. */
  social: {
    instagram: 'https://www.instagram.com/enll_l_/',
    instagramStudio: 'https://www.instagram.com/eric_lee_studio/',
    xiaohongshu: 'https://xhslink.com/m/3jzxuvYqFy2',
  },
} as const;

/** Web3Forms access key, read from the PUBLIC_WEB3FORMS_ACCESS_KEY env var. */
export const WEB3FORMS_ACCESS_KEY =
  import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? '';
