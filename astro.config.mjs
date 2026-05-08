// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// output: 'server' enables SSR with the Vercel adapter.
// Existing pages that use getStaticPaths() are automatically prerendered (SSG).
// The new /scan/[id] page uses `export const prerender = false` to opt into SSR.
// vite.ssr.noExternal ensures the @astrojs/vercel entrypoint is bundled (not
// treated as an external module by Rollup), fixing "cannot be external" errors.
// The existing api/subscribe.js serverless function is framework-independent
// and is retained as-is in the api/ directory.
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ['@astrojs/vercel'],
    },
  },
});
