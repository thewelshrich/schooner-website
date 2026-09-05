# Contributing to the website

- Keep this a lightweight static Astro site. Use Starlight for documentation.
- Treat [the Schooner CLI](https://github.com/thewelshrich/schooner) source, tests,
  and documentation as authoritative for product behavior.
- Schooner is open source and CLI-first, using user-owned machines, direct SSH,
  ordinary Git repositories, and tmux. It requires no hosted control plane.
- Lead guides with the simplest supported workflow. Introduce flags when needed.
- Verify commands and support claims; distinguish available features from plans.
- Update `docs-sources.json` and guide citations after reviewing upstream changes.
- Keep changes in this repository unless another repository is explicitly in scope.
- Use `npm run dev` locally and `npm run build` to validate site changes.
- Use Conventional Commits. Pushes to `main` deploy through GitHub Pages.
