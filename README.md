# Nouri — landing site

Static landing page for [Nouri](../Nouri), hosted on GitHub Pages.

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

## Deploy to GitHub Pages

1. Create a new public repo on GitHub called `nouri-landing` (or whatever you want the URL path to be).
2. From this directory:

   ```sh
   git init
   git add .
   git commit -m "Initial landing site"
   git branch -M main
   git remote add origin https://github.com/moooosik/Nouri-pages.git
   git push -u origin main
   ```

3. In the repo's Settings → Pages, set the source to `main` branch, `/ (root)` folder.
4. After a minute or two the site will be live at `https://moooosik.github.io/Nouri-pages/`.

### Custom domain (later)

If you buy `nouri.app` or similar, add it in Settings → Pages → Custom domain. Create a `CNAME` file at the repo root with just the domain name in it, and update the DNS records as GitHub instructs.

## Things to customise before publishing

- `mailto:` addresses in every HTML file (search for `brianchan97hk@gmail.com`).
- Legal entity / jurisdiction clauses in `privacy.html` and `terms.html` — marked with HTML comments.
- "Last updated" dates at the top of `privacy.html` / `terms.html` if you edit them.
- Open Graph / Twitter card image (currently none — consider adding a `og-image.png`).

## Required URLs for Play Console

When submitting the app to Google Play you'll be asked for:

- **Privacy policy URL** → `https://moooosik.github.io/Nouri-pages/privacy.html`
- **Support email** → the one in `support.html`
- **Homepage URL** (optional for store, required for Google OAuth consent screen) → `https://moooosik.github.io/Nouri-pages/`
