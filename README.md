PromptParto is a lightweight web tool for breaking long prompts into manageable parts. It supports multiple split strategies, dark mode, AI-assisted refinement and undo/redo history.

## Features

- **Flexible splitting** - choose automatic splitting, by paragraph or line, a custom delimiter or a regular expression.
- **Dark mode toggle** - switch themes with a single click or `Ctrl+D`.
- **AI refine** - refine any prompt part using Gemini AI directly from the interface.
- **Undo/redo** - revert changes with `Ctrl+Z` and `Ctrl+Y`.
- Drag & drop text files or use the **Upload File** button, automatic saving, and export to text, Markdown or JSON.
- Animated buttons and badges show progress and give feedback on copy/share actions and successful splits.

## Running locally

Simply open `index.html` in your browser. Styles are in `css/style.css` and JavaScript in `js/components/main.js`. The page loads TailwindCSS and other assets from public CDNs, so an internet connection is required on first load. You can also host the project on GitHub Pages, integrated with Cloudflare for enhanced performance and security.

### Project structure

```
/
  index.html
  css/
    style.css
  js/
    components/
      main.js
  prompts/
    example.json
```

## Example prompt

A sample prompt is provided in `prompts/example.json`. Use the **Load Example** button (`Alt+L`) to insert it into the editor.

## Stored data

PromptParto saves your settings, saved prompts and history in your browser's `localStorage`. Use the export buttons to back up your data or the import option to restore it. You can also export individual parts or the entire prompt in text, Markdown or JSON format.

## Gemini API key

To use the AI refine features you must provide a valid Gemini API key. Open the AI modal, scroll to **Advanced Settings**, and paste your key in the **Gemini API Key** field. The key is saved in your browser's `sessionStorage` (`promptPartoApiKey`). Without this key the AI actions will show an error.

## Keyboard shortcuts

- `Ctrl+Z` / `Ctrl+Y` – Undo/Redo.
- `Ctrl+D` – Toggle dark mode.
- `Ctrl+S` – Save current prompt.
- `Alt+L` – Load example prompt.
- `Ctrl+E` – Export as text.
- `Ctrl+M` – Export as Markdown.
- `Ctrl+J` – Export as JSON.
- `Ctrl+Shift+C` – Clear all.
- `Ctrl+O` – Clear output only.
- `Ctrl+H` – Show history.
- `Ctrl+T` – Show templates.

## Development

Install dependencies with `npm install`, then run the linters and tests:

```bash
npm run lint
npm test
```

`npm run lint` checks all JavaScript files under `js/` using ESLint and all CSS files with Stylelint.
`npm test` runs the Jest test suite.


The build step (`npm run build`) outputs the production files to `dist/` and automatically generates `dist/sitemap.xml` based on all HTML files. This ensures search engines always receive an up‑to‑date sitemap when new pages are added.

## Fonts

PromptParto bundles the [Inter](https://github.com/rsms/inter) and [Vazirmatn](https://github.com/fontstore/Vazirmatn) typefaces. Both families are distributed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL). Attribution files can be found in `assets/fonts/`.

## Content Security Policy

When hosting the site on GitHub Pages behind Cloudflare, configure a strict
`Content-Security-Policy` header. A recommended policy is:

```text
default-src 'self' blob:;
script-src 'self' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://static.cloudflareinsights.com 'nonce-RasoulCSP';
style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net 'nonce-RasoulCSP';
style-src-attr 'none';
style-src-elem 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
img-src 'self' data:;
connect-src 'self' https://static.cloudflareinsights.com https://api.github.com https://orcid.org https://about.me https://www.researchgate.net https://www.linkedin.com https://github.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'self';
```

This policy keeps only the domains required for CDN assets and analytics.