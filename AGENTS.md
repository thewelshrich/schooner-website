# Schooner Website Context

## Repository Role

This repository contains the public-facing website for Schooner.

Schooner is an open-source, CLI-first remote development machine manager. It
helps developers create or adopt persistent machines, prepare them for
development, work with Git repositories and worktrees, and keep long-running
sessions available through tools such as SSH and tmux.

The website should explain the current open-source product accurately, help
people evaluate it, guide them toward installation and documentation, and make
the project's trust model clear.

## Related Repositories

Three local repositories are available while working on the website:

| Repository | Role | How to use it |
| --- | --- | --- |
| `/Users/richardthomas/Projects/schooner-website` | Current public website | Make website changes here. This repository owns website structure, content, design, and implementation decisions. |
| `/Users/richardthomas/Projects/schooner-cli` | Current open-source Schooner product | Treat this as the authoritative source for current product behavior, terminology, installation, commands, support, roadmap, and positioning. |
| `/Users/richardthomas/Projects/schooner` | Legacy SaaS and desktop-era product | Use only as a reference for historical design work, domain knowledge, proven behavior, and reusable assets or ideas. Do not treat its product direction as current. |

When sources disagree, prefer this repository's explicit website decisions,
then `schooner-cli`, and lastly the legacy `schooner` repository.

## Current Product Positioning

Use the current product truths from `schooner-cli`:

- Schooner is open source and CLI-first.
- It operates persistent, user-owned development machines.
- It uses the user's system OpenSSH client for direct machine communication.
- Git remains authoritative for repositories and worktrees.
- tmux keeps development sessions persistent and resumable.
- Users retain ordinary SSH access independently of Schooner.
- There is no required Schooner account or hosted control plane for ordinary
  machine operation.
- Human-friendly interactive flows should also support deterministic automation
  where the CLI provides flags and structured output.

Do not describe Schooner as a hosted SaaS control plane, a licensed desktop or
tray application, or an organization-and-billing product. Those concepts belong
to the legacy repository unless they have been deliberately reintroduced and
documented in `schooner-cli`.

## Sources of Truth

Before publishing concrete claims, consult the relevant material in
`/Users/richardthomas/Projects/schooner-cli`:

- `AGENTS.md` for product direction and non-negotiable boundaries.
- `README.md` for the public overview, installation, and common workflows.
- `docs/` for detailed behavior, support status, architecture, and roadmap.
- CLI help, tests, and implementation for behavior not settled by documentation.

Do not invent commands, flags, integrations, supported platforms, providers,
pricing, or roadmap commitments. If current documentation and implementation
appear inconsistent, call out the mismatch instead of silently choosing the
more marketable claim.

## Website Content Principles

- Lead with the user's outcome: persistent remote development without giving up
  ownership of their machine or existing tools.
- Prefer concrete, verifiable language over broad claims such as "revolutionary"
  or "effortless."
- Make trust and ownership legible: direct SSH, user-owned infrastructure, normal
  Git repositories, and no dependency on a hosted control plane.
- Keep terminology aligned with the current CLI. In particular, use **Box** only
  where it matches current product language for a managed remote machine.
- Clearly distinguish features available today from planned work.
- Keep installation commands and examples copyable and synchronized with the
  current CLI documentation.
- Treat the legacy repository as inspiration, not as copy-ready product truth.

## Working Across Repositories

Changes requested for the public website belong in this repository unless the
user explicitly asks to update another repository. Reading the related
repositories for context does not authorize modifying them.

If an asset or code fragment is adapted from the legacy repository, verify that
it still reflects the current product and that its licence and attribution are
compatible with this repository before copying it.

## Project Conventions

The website is a static Astro project. Keep it lightweight: prefer Astro,
semantic HTML, CSS, and small browser scripts over client-side frameworks and
server infrastructure. This leaves room for a future documentation section
without making the homepage depend on it.

Use `npm run dev` for local development and `npm run build` for the production
static build in `dist/`. The project is host-agnostic; do not add deployment or
hosting-provider configuration unless the user explicitly requests it.

Use Conventional Commits when this directory is initialized as a Git repository,
unless a later repository-specific instruction supersedes this convention.
