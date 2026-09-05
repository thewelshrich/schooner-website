# Command presentation audit

Reviewed 2026-09-05 against CLI revision 03d6623. Website changes only; CLI implementation and tests were read, not modified.

## Editorial rule

Lead quick starts with the cheapest interactive path. Document the preconditions that make it work. Put flags, exact selectors, multi-Box choices, and automation beside the tasks that need them, rather than in every example.

The approved first journey is `box add`, then `push`, `start`, and later `resume` from the same local checkout. `doctor` remains in installation verification. `pull` is explicit workspace transfer, not an automatic part of resume.

## Behavior and evidence

Paths are relative to the schooner-cli repository.

| Task | Default presentation | When to expand | Evidence |
| --- | --- | --- | --- |
| Add a machine | `schooner box add` | Prefill name and `--ssh`; unattended flags belong in automation | `internal/cli/box.go:33`, `internal/ui/prompts/prompts.go:54` |
| Send a checkout | `schooner push` from local repo | Exact remote Worktree, `--box`, `--dry-run` | `internal/cli/push.go:47`, `:248` |
| Open persistent work | `schooner start` after push | Worktree selector, Box override | `internal/cli/session.go:35`, `:327` |
| Return to live work | `schooner resume` | Exact Worktree or session ID; another Box | `internal/cli/session.go:106`, `:417` |
| Bring workspace back | `schooner pull` | Explicit remote Worktree, Box override, dry run | `internal/cli/pull.go:51`, `:182` |
| Inspect/connect to a Box | `box status`, `box ssh` | Name the Box when diagnosing a linked checkout on multiple machines | `internal/cli/box.go:554`, `:636` |
| Set default | Optional `box use <name>` | Multiple machines, commands with no applicable link | `internal/box/resolver.go:33` |
| Session inspection | `sessions`, `logs` | Select Box/session; bounded logs `--lines` | `internal/cli/session.go:206`, `:223` |
| Stop session / temporary shell | `stop`, `shell` | Explain stop confirmation and ephemeral shell distinction | `internal/cli/session.go:253`, `:294` |

## Selection distinctions to preserve

- Workstation selection: explicit Box, current Local Link, saved default, sole Box, interactive picker. Tests: `internal/box/resolver_test.go:15,36,58,72`.
- A sole Box does not require `box use`; adding it does not persist a default.
- Local Links apply to push/pull and selector-free start/resume. Do not extend this claim to sessions/logs/stop/shell/source/clone/worktree or box status.
- Explicit selectors and missing linked targets do not silently fall through. Explicit Box can bypass stale contextual links; see `internal/cli/session_test.go:89`.
- On a prepared Box, the direct local runtime is checked before workstation inventory resolution. Explicit --box forces SSH; see `internal/boxtarget/resolver.go:56`.
- Bare resume without a link matches the local repository, or selects the newest managed session on the selected Box outside a repository. It never creates a session. See `internal/workcontext/context.go:98` and its tests.
- Start without push can offer to clone the network origin. That does not copy local dirty state; push-before-start remains the introductory path.
- Interactive means terminal stdin/stderr, human output, no --no-input. Ambiguous automation must fail rather than guess.
- Remove/destroy never implicitly use default Box selection.

## Documentation coverage

Expanded on 2026-09-05 using three source-reading agents, with primary editorial review and independent checks against command constructors, transfer routing, maintenance behavior, session limits, and database handling.

| Public surface | Website guide |
| --- | --- |
| push, pull | `/docs/workspace-sync/` |
| start, resume, sessions, logs, stop, shell | `/docs/sessions/` plus introductory guides |
| clone, worktree list/inspect/add/remove/prune | `/docs/repositories/` |
| box add/list/use/status/setup/update/ssh/remove | `/docs/boxes/` |
| provider connect/list/disconnect, cloud box add/destroy | `/docs/provisioning/` |
| source connect/status/disconnect | `/docs/source-access/` |
| global flags, JSON, no-input, command confirmations | `/docs/automation/` |
| doctor, recovery, advanced db destroy | `/docs/troubleshooting/` |
| version, update, installation | `/docs/installation/` |
| public command directory, completion, help | `/docs/command-reference/` |

The primary review corrected a Box-list selection ambiguity, a Quickstart fragment link, and moved provider permission requirements into the website. Cross-links connect private clone setup, session diagnostics, transfer recovery, and the command directory.

Current scope covers the released public command families. Exhaustive flag help remains available in the installed CLI; hidden host protocol and developer-only commands are intentionally excluded. Planned providers, previews, and coding-agent sessions are not presented as available.

Implementation and tests were inspected; Go tests and remote operations were not run. This task changes the website only. The expanded source manifest records the inspected implementation, tests, and upstream documents for future drift checks.

## Documentation mismatch

The CLI README's --box examples are valid, but more explicit than the minimum interactive path. Website examples now explain the defaults supported by implementation. The CLI README was intentionally not edited because this task authorizes website changes only.

The source manifest includes implementation and test hashes, so `npm run docs:check -- /path/to/schooner-cli` detects changes requiring re-review.

## Validation of expanded docs

- Production static build: 14 documentation pages plus homepage and 404.
- Internal page links and fragment targets: passed across all 16 built pages.
- Every documentation page has one title and description.
- Pinned file citations resolve against the clean CLI checkout; 54 source hashes pass `docs:check`.
- Browser search finds newly added recovery content, including text inside optional details.
- Desktop rendering and 390px mobile reference checked; mobile document width stays within the viewport and expanded navigation exposes every guide.
- Screenshots saved in `artifacts/docs-expanded-{desktop,reference,mobile}.png`.

Canonical URLs and sitemap generation still need the production `PUBLIC_SITE_URL`; no domain or hosting configuration was invented.
