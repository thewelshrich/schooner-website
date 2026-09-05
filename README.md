# Schooner website

The public website for [Schooner](https://github.com/thewelshrich/schooner), the
open-source CLI for persistent remote development machines.

## Development

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. The generated static site is in
`dist/` and can be served by any static host.

## Documentation

Starlight owns `/docs/`. The homepage remains a standalone Astro page.

- Guides: `src/content/docs/docs/` (Markdown).
- Documentation theme: `src/styles/docs.css`.
- Navigation: `astro.config.mjs`.
- Product evidence: `docs-sources.json` pins the CLI revision and source-file hashes.

Before updating guides, check the current CLI README and relevant implementation.
Run `npm run docs:check -- /path/to/schooner-cli` to detect upstream source changes.
Review the affected guides before updating the manifest and their source links.
Website guides are task-oriented adaptations; command behavior remains owned by the CLI.

The public origin defaults to `https://schooner.sh`. `PUBLIC_SITE_URL` can override
it for a different publication target. The homepage and documentation include
canonical URLs, and Starlight generates the sitemap.

`npm run build` also builds the documentation search index. Use `npm run preview`
to verify search against the built site; the development server is for authoring.

## GitHub Pages deployment

`.github/workflows/deploy.yml` builds with Node 24 and `npm ci`, then publishes only
`dist/` through GitHub Pages. Pushes to `main` and manual workflow dispatch trigger
a deployment. Build and deployment permissions are separated; no deployment token
needs to be stored in this repository.

Repository setup:

1. Publish the source to the chosen GitHub repository with `main` as its default branch.
2. In **Settings → Pages**, select **GitHub Actions** as the source.
3. Set the custom domain to **schooner.sh** before changing DNS.
4. Push to `main` or run **Deploy to GitHub Pages** from Actions.
5. Configure the domain records below, then enable **Enforce HTTPS** when the certificate is ready.

The site uses root-relative URLs for its custom domain. It is not configured for
hosting under a `/repository-name/` path. A `CNAME` file does not configure the domain
for a custom Actions deployment; the repository Pages setting does.

### Domain records

On 2026-09-05 public DNS showed Cloudflare nameservers (`leo.ns.cloudflare.com`
and `kenia.ns.cloudflare.com`). Namecheap is the registrar; update the active
Cloudflare DNS zone instead of the Namecheap Advanced DNS panel. Keep unrelated
mail, TXT and subdomain records intact.

For GitHub account `thewelshrich`, configure these website records. Use DNS-only
records during GitHub domain validation and certificate issuance.

| Type | Name | Target |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | thewelshrich.github.io |

Replace conflicting website records for `@` and `www`; do not change nameservers
or unrelated records. With `schooner.sh` selected as the custom domain, GitHub can
redirect `www.schooner.sh` to the apex. Domain verification through GitHub account
**Settings → Pages** also supports a GitHub-provided TXT record; retain it after verification.

References: [Astro deployment](https://docs.astro.build/en/guides/deploy/github/),
[GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site),
[Namecheap DNS instructions](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/)
(the latter applies only if Namecheap manages the domain's nameservers).
