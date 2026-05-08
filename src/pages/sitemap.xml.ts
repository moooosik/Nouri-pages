import type { APIRoute } from 'astro';
import ingredients from '../data/ingredients.json';
import allergens from '../data/allergens.json';
import diets from '../data/diets.json';

const BASE = 'https://nouri-scan.vercel.app';
const today = new Date().toISOString().split('T')[0];

const staticPages = ['', '/privacy', '/support', '/delete-account'];

export const GET: APIRoute = () => {
  const urls: string[] = [
    ...staticPages.map((path) => `${BASE}${path}`),
    ...ingredients.map((e) => `${BASE}/ingredient/${e.slug}`),
    ...allergens.map((e) => `${BASE}/allergen/${e.slug}`),
    ...diets.map((e) => `${BASE}/diet/${e.slug}`),
  ];

  const urlElements = urls
    .map(
      (loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlElements}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
