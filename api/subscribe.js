// api/subscribe.js — Vercel serverless function
// Handles email capture from the Nouri landing page.
// Adds the contact to the Resend audience.
//
// Welcome email is intentionally NOT sent — Nouri does not own a verified Resend
// sender domain yet, and Resend rejects free Vercel subdomains. Signups are
// captured here and will be broadcast to manually once a real domain is verified.
//
// Required environment variables (set in Vercel dashboard):
//   RESEND_API_KEY      — get from resend.com > API Keys
//   RESEND_AUDIENCE_ID  — Resend audience/contact-list ID for the waitlist

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export default async function handler(req, res) {
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

  if (!RESEND_AUDIENCE_ID) {
    console.error('[subscribe] RESEND_AUDIENCE_ID not configured');
    return res.status(500).json({ error: 'RESEND_AUDIENCE_ID not configured' });
  }

  const { email } = req.body ?? {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

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
    return res.status(500).json({ error: 'Failed to save signup. Please try again.' });
  }

  return res.status(200).json({ ok: true });
}
