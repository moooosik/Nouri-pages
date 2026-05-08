// Dynamic OG image endpoint — /scan/[id]/og.png
// Returns a 1200×630 PNG card with product name and allergen pills.
// Rendered server-side at request time; cached for 24 hours at the CDN edge.

import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';

export const prerender = false;

type AllergenEntry = {
  allergen?: string;
  ingredient?: string;
};

type ScanResult = {
  productName?: string;
  allergens?: AllergenEntry[];
};

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  const SUPABASE_URL = import.meta.env.SUPABASE_URL ?? '';
  const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY ?? '';

  let productName = 'Unknown Product';
  let allergenNames: string[] = [];

  if (id && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const url = `${SUPABASE_URL}/rest/v1/public_scans?image_hash=eq.${encodeURIComponent(id)}&select=result_json&limit=1`;
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: 'application/json',
        },
      });
      if (res.ok) {
        const rows: Array<{ result_json: string }> = await res.json();
        if (rows.length > 0 && rows[0].result_json) {
          const scanResult = JSON.parse(rows[0].result_json) as ScanResult;
          productName = scanResult.productName ?? productName;
          allergenNames = (scanResult.allergens ?? [])
            .map((a) => a.allergen ?? a.ingredient ?? '')
            .filter(Boolean)
            .slice(0, 5);
        }
      }
    } catch {
      // Fetch failed — fall through to default values; OG image must never 500.
    }
  }

  const allergenPillsHtml = allergenNames
    .map(
      (name) =>
        `<div style="background:#2D6A4F;color:#F5F1E8;font-size:22px;font-weight:600;padding:10px 22px;border-radius:999px;letter-spacing:0.03em;">${name}</div>`
    )
    .join('');

  const html = `
    <div style="display:flex;flex-direction:column;width:1200px;height:630px;background:#0e1b14;padding:72px 80px;font-family:sans-serif;justify-content:space-between;">
      <div style="display:flex;flex-direction:column;gap:0;">
        <div style="font-size:18px;font-weight:500;color:#52B788;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;">nouri · scan result</div>
        <div style="font-size:72px;font-weight:700;color:#F5F1E8;line-height:1.1;letter-spacing:-0.02em;max-width:900px;">${productName}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:24px;">
        ${allergenNames.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:12px;">${allergenPillsHtml}</div>` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(82,183,136,0.3);padding-top:24px;">
          <div style="font-size:22px;color:rgba(245,241,232,0.55);letter-spacing:0.04em;">Free ingredient scanner for iOS</div>
          <div style="font-size:28px;font-weight:700;color:#2D6A4F;letter-spacing:0.05em;text-transform:uppercase;">nouri-scan.vercel.app</div>
        </div>
      </div>
    </div>
  `;

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: '#0e1b14',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '0' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontWeight: 500,
                      color: '#52B788',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: '28px',
                    },
                    children: 'nouri · scan result',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '72px',
                      fontWeight: 700,
                      color: '#F5F1E8',
                      lineHeight: '1.1',
                      letterSpacing: '-0.02em',
                      maxWidth: '900px',
                    },
                    children: productName,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '24px' },
              children: [
                ...(allergenNames.length > 0
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
                          children: allergenNames.map((name) => ({
                            type: 'div',
                            props: {
                              style: {
                                background: '#2D6A4F',
                                color: '#F5F1E8',
                                fontSize: '22px',
                                fontWeight: 600,
                                padding: '10px 22px',
                                borderRadius: '999px',
                                letterSpacing: '0.03em',
                              },
                              children: name,
                            },
                          })),
                        },
                      },
                    ]
                  : []),
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(82,183,136,0.3)',
                      paddingTop: '24px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '22px',
                            color: 'rgba(245,241,232,0.55)',
                            letterSpacing: '0.04em',
                          },
                          children: 'Free ingredient scanner for iOS',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '28px',
                            fontWeight: 700,
                            color: '#2D6A4F',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                          },
                          children: 'nouri-scan.vercel.app',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, s-maxage=86400',
      },
    }
  );
};
