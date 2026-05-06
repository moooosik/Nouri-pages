// api/subscribe.js — Vercel serverless function
// Handles email capture from the Nouri landing page.
// Adds the contact to the Resend audience and sends a welcome email.
//
// Required environment variable (set in Vercel dashboard):
//   RESEND_API_KEY   — get from resend.com > API Keys
//
// Optional (set to override defaults):
//   RESEND_AUDIENCE_ID  — Resend audience/contact-list ID for the waitlist

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

// App Store listing URL — update when the app is live.
const APP_STORE_URL = 'https://apps.apple.com/app/nouri-food-label-reader/id6745219940';

export default async function handler(req, res) {
  // CORS — only needed if the form origin differs from the function origin.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!RESEND_API_KEY) {
    console.error('[subscribe] RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const { email } = req.body ?? {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Add contact to Resend audience (if an audience ID is configured).
  if (RESEND_AUDIENCE_ID) {
    try {
      const contactRes = await fetch(
        `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: normalizedEmail }),
        }
      );

      if (!contactRes.ok) {
        const body = await contactRes.text();
        console.error(`[subscribe] Resend contacts error ${contactRes.status}: ${body}`);
        // Continue — still send the welcome email even if contact-list add fails.
      }
    } catch (err) {
      console.error('[subscribe] Resend contacts fetch failed:', err);
    }
  }

  // 2. Send welcome email via Resend.
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Nouri <hello@nouri-scan.vercel.app>',
      to: [normalizedEmail],
      subject: 'You\'re on the Nouri list',
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
          <p style="font-size: 22px; font-weight: bold; margin-bottom: 8px;">Thanks for signing up.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #444;">
            Nouri is a food label scanner for iOS. Point your camera at any nutrition label and
            find out — in seconds — what's actually in what you're buying, filtered against your
            allergens and dietary preferences.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #444;">
            We'll send you a note the moment there's something new to share. In the meantime,
            you can check out the app on the App Store:
          </p>
          <p style="margin: 28px 0;">
            <a href="${APP_STORE_URL}"
               style="background:#2D6A4F; color:#F5F1E8; text-decoration:none; padding: 12px 24px;
                      border-radius: 4px; font-family: monospace; font-size: 13px; letter-spacing: 1px;
                      display:inline-block;">
              View on the App Store →
            </a>
          </p>
          <p style="font-size: 13px; color: #888; border-top: 1px solid #eee; padding-top: 16px; margin-top: 32px;">
            You're receiving this because you signed up at nouri-scan.vercel.app.
            Reply to unsubscribe.
          </p>
        </div>
      `,
      text: `Thanks for signing up for Nouri.\n\nNouri is a food label scanner for iOS — point your camera at any nutrition label and find out what's actually in what you're buying.\n\nCheck out the app on the App Store: ${APP_STORE_URL}\n\nYou're receiving this because you signed up at nouri-scan.vercel.app. Reply to unsubscribe.`,
    }),
  });

  if (!emailRes.ok) {
    const body = await emailRes.text();
    console.error(`[subscribe] Resend email error ${emailRes.status}: ${body}`);
    return res.status(500).json({ error: 'Failed to send welcome email. Please try again.' });
  }

  return res.status(200).json({ ok: true });
}
