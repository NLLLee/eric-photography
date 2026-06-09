// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT: change this to your real domain once deployed (used for SEO,
// canonical URLs and sitemap). e.g. 'https://eric-photo.vercel.app'
const SITE_URL = process.env.SITE_URL ?? 'https://your-domain.vercel.app';

// https://astro.build
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  // Static output (default). Vercel auto-detects Astro and runs `astro build`.
  // Images are optimized at build time by the built-in sharp service.
  image: {
    // Generate modern formats. Astro falls back automatically for old browsers.
    // (sharp is the default service; listed here for clarity.)
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
