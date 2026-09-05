# Schooner website

Website and documentation for [Schooner](https://github.com/thewelshrich/schooner).
Built with Astro and Starlight.

## Development

Requires Node.js 24.

```sh
npm ci
npm run dev
```

Run `npm run build` to build the site and `npm run preview` to preview it.

Guides live in `src/content/docs/docs/`; navigation is in `astro.config.mjs`.
Check changes against the CLI source with `npm run docs:check -- /path/to/schooner-cli`.

Pushes to `main` deploy to GitHub Pages at [schooner.sh](https://schooner.sh).
