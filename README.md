# app-pages

Static site for app-facing pages (marketing, support, privacy), published with GitHub Pages.

- Production URL: `https://kevinxft.github.io/app-pages/`
- Current implemented app: `KeyLaunch`
- Localization: `en`, `zh`, `ja`, `ko`, `es`, `fr`, `de`

## What is in this repo

This repo is a plain HTML/CSS/JS site with no build step.

- `index.html`: app directory homepage (links to each app page)
- `key-launch/marketing/index.html`: KeyLaunch marketing page
- `key-launch/support/index.html`: KeyLaunch support page
- `key-launch/privacy/index.html`: KeyLaunch privacy policy page
- `shared/js/i18n.js`: shared language detection + switcher + translation loading
- `shared/lang/*.json`: translation dictionaries

## Directory structure

```text
app-pages/
|-- index.html
|-- key-launch/
|   |-- marketing/index.html
|   |-- support/index.html
|   `-- privacy/index.html
`-- shared/
    |-- js/i18n.js
    `-- lang/
        |-- en.json
        |-- zh.json
        |-- ja.json
        |-- ko.json
        |-- es.json
        |-- fr.json
        `-- de.json
```

## Local preview

Any static server works.

```bash
cd app-pages
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## How i18n works

`shared/js/i18n.js` does the following:

1. Detects language from localStorage (`app-pages-lang`) first, then browser language.
2. Loads `shared/lang/<lang>.json`.
3. Replaces text using `data-i18n` and tooltip titles using `data-i18n-title`.
4. Injects a language switcher UI into each page.

When adding new copy:

- Add stable keys in HTML (`data-i18n="..."`).
- Add matching keys in **all** language JSON files.
- Keep key paths consistent across locales.

## Add a new app page set

1. Create a new folder like `<app-slug>/` with:
   - `marketing/index.html`
   - `support/index.html`
   - `privacy/index.html`
2. Reuse the existing i18n pattern and include:
   - `<script src="../../shared/js/i18n.js"></script>`
3. Add app card + links in root `index.html`.
4. Add translation keys in all `shared/lang/*.json` files.
5. Test on desktop + mobile viewport.

## Deployment

This repo is intended for GitHub Pages deployment from the default branch.

After push, pages are available under:

- Home: `https://kevinxft.github.io/app-pages/`
- KeyLaunch marketing: `https://kevinxft.github.io/app-pages/key-launch/marketing/`
- KeyLaunch support: `https://kevinxft.github.io/app-pages/key-launch/support/`
- KeyLaunch privacy: `https://kevinxft.github.io/app-pages/key-launch/privacy/`

## Current note

`index.html` already includes a `Baking Note` card and links, but the corresponding `baking-note/` page files are not present yet.
