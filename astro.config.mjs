// @ts-check
import { defineConfig } from 'astro/config';

// Static output — no adapter required for Vercel static deployment.
// Vercel detects Astro and runs `npm run build` automatically.
// The existing api/subscribe.js serverless function is framework-independent
// and is retained as-is in the api/ directory.
export default defineConfig({
  output: 'static',
});
