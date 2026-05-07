# Nouri Landing — Overview

> 60-second pitch. Read this first when arriving fresh; then `README.md` for deploy + customization details.

---

## What it is

The **static marketing site** for the [Nouri](../20260422_nouri/Nouri/) iOS app. Plain HTML + CSS, no build step. All pages share `styles.css`. Lives in `Projects/products/20260422_nouri-landing/`, source repo `moooosik/Nouri-pages` on GitHub.

## Why it exists

Required infrastructure for the App Store listing — Apple needs a **Privacy Policy URL** + **Support URL** + **Marketing URL** before a build can ship. Also serves as the discovery / SEO landing for organic search and Reddit / X / Product Hunt traffic during the 90-day launch.

## URLs

| Role | URL |
|---|---|
| **Primary** (used in App Store listing) | https://nouri-scan.vercel.app/ |
| Fallback (GitHub Pages) | https://moooosik.github.io/Nouri-pages/ |

Both auto-deploy from `main` branch via independent integrations — push once, both update in under a minute. If the primary domain is ever swapped to a real domain (`nouri.app` etc.), Vercel auto-provisions SSL and the `*.vercel.app` URL keeps working as a permanent fallback.

## Pages

- `index.html` — hero + features + how-it-works + waitlist CTA
- `privacy.html` — privacy policy
- `terms.html` — terms of service
- `support.html` — contact + FAQ
- `delete-account.html` — required by Apple for any app with auth

## Status (as of 2026-05-03)

**Stage:** Live, in production. Used by the live App Store listing for build 7.

**No active build work.** Maintenance only:

- Update copy when Nouri's positioning evolves
- Add Open Graph / Twitter card image (currently none — `og-image.png` would help social shares during the 90-day launch)
- Wire **email capture** + **Resend welcome sequence** (logged as pending in Nouri's PROGRESS.md)
- Update privacy.html "Last updated" date if data flows change

## Tech stack

| Layer | Choice |
|---|---|
| Markup | Plain HTML — no framework |
| Styles | One shared `styles.css` |
| Hosting | Vercel (primary) + GitHub Pages (fallback) — both auto-deploy from `main` |
| Build step | None |
| Fonts | Google Fonts |

Deliberately minimal — App Store legal-page URLs need to be **bulletproof and never go down**. Anything more complex (build step, framework, dynamic backend) adds a failure mode without giving anything back.

## Cross-portfolio note

This is the only product in the portfolio that's a pure static landing page. Other product landings (`section174-app.pages.dev`, `workercheck-app.pages.dev`, `contractorcheck-app.pages.dev`, `sprsready.pages.dev`, `nonprofitregistr.pages.dev`) live on **Cloudflare Pages** instead — Vercel was chosen here because Nouri's tooling already pointed at Vercel and the App Store URL was set before the rest of the portfolio existed.

## Doc map

| Doc | Purpose | Update cadence |
|---|---|---|
| `overview.md` | This file. 60-second pitch + status. | Rarely — only when role changes |
| `README.md` | Deploy mechanics + customization checklist + Play Console URL list | When deploy mechanics change |
| HTML pages | Content. Push to `main` to deploy. | When copy or legal terms change |
