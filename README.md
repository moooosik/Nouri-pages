# Nouri — landing site

Static landing page for [Nouri](../Nouri), hosted on Vercel at `https://nouri-scan.vercel.app/`.

(Also live on GitHub Pages at `https://moooosik.github.io/Nouri-pages/` as a fallback — both auto-deploy from `main`.)

Plain HTML + CSS, no build step. Fonts from Google Fonts. All pages share `styles.css`.

## Pages

- `index.html` — hero, features, how it works, waitlist CTA
- `privacy.html` — privacy policy (review before publishing)
- `terms.html` — terms of service (review before publishing)
- `support.html` — contact + FAQ

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```sh
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

The repo (`moooosik/Nouri-pages` on GitHub) is wired to **both** Vercel and GitHub Pages. Just commit and push to `main` — both auto-deploy in under a minute.

```sh
git add .
git commit -m "your message"
git push
```

- **Primary URL (used in App Store listing):** `https://nouri-scan.vercel.app/`
- **Fallback URL (GitHub Pages):** `https://moooosik.github.io/Nouri-pages/`

### Custom domain (later)

If you buy `nouri.app` or similar, add it in Vercel → Settings → Domains. Vercel auto-provisions SSL and updates DNS instructions for you. The old `nouri-scan.vercel.app` URL keeps working as a permanent fallback.

## Things to customise before publishing

- `mailto:` addresses in every HTML file (search for `brianchan97hk@gmail.com`).
- Legal entity / jurisdiction clauses in `privacy.html` and `terms.html` — marked with HTML comments.
- "Last updated" dates at the top of `privacy.html` / `terms.html` if you edit them.
- Open Graph / Twitter card image (currently none — consider adding a `og-image.png`).

## Required URLs for Play Console

When submitting the app to Google Play you'll be asked for:

- **Privacy policy URL** → `https://nouri-scan.vercel.app/privacy.html`
- **Support email** → the one in `support.html`
- **Homepage URL** (optional for store, required for Google OAuth consent screen) → `https://nouri-scan.vercel.app/`
