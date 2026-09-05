---
title: Command reference
description: A directory of Schooner CLI commands for Boxes, provisioning, Git worktrees, workspace transfers, sessions, source access, diagnostics, and automation.
lead: Find the command for the job, then follow its guide for examples and defaults.
---

In the syntax below, `[value]` is optional and `<value>` is required. Do not type the brackets. Start with [your first session](/docs/first-session/) if you are new to Schooner.

Get the flags supported by your installed version with:

```bash
schooner --help
schooner push --help
```

## Everyday work

Box flags are optional in ordinary use. See [how commands find your work](/docs/command-basics/) before adding explicit selectors everywhere.

| Command | What it does | Guide |
| --- | --- | --- |
| `push [remote-worktree]` | Send the current local workspace to a Box | [Workspace transfers](/docs/workspace-sync/) |
| `pull [remote-worktree]` | Bring a remote workspace into the current local checkout | [Workspace transfers](/docs/workspace-sync/) |
| `start [worktree-path]` | Open persistent work, reusing its managed live Session when present | [Sessions](/docs/sessions/) |
| `resume [worktree-path-or-session-id]` | Return to an existing live Session | [Resume work](/docs/resume/) |
| `sessions` | List managed and unmanaged live tmux Sessions | [Sessions](/docs/sessions/) |
| `logs [session-id]` | Capture bounded history from a managed Session | [Sessions](/docs/sessions/) |
| `stop [session-id]` | Stop a managed Session without changing its Worktree | [Sessions](/docs/sessions/) |
| `shell [worktree-path]` | Open an ephemeral shell in a live Worktree | [Sessions](/docs/sessions/) |

Prefix every command with `schooner`. `push` and `pull` support `--dry-run`; `logs` supports `--lines` from 1 to 2,000. These commands accept `--box` when an explicit Box is useful.

`start`, `resume`, and `shell` require a terminal and human output. An explicit `stop` Session ID acts without the picker and confirmation used by bare `stop`. See [automation](/docs/automation/) for these boundaries.

## Boxes

| Command | What it does |
| --- | --- |
| `box add [name]` | Guide you through adopting an SSH machine or provisioning with DigitalOcean |
| `box list` | List recorded Boxes |
| `box use <name>` | Set the default Box |
| `box status [name]` | Inspect live status on a selected Box |
| `box setup [name]` | Install or repair prerequisites and the host runtime |
| `box update [name]` | Update the selected Box's host runtime |
| `box ssh [name]` | Open a normal login shell using OpenSSH |
| `box remove [name]` | Forget the local Box record without changing the machine |
| `box destroy [name]` | Permanently destroy provider infrastructure and remove its Box |

Read [managing Boxes](/docs/boxes/) for selection, maintenance, and removal. `box ssh` requires a terminal. Removal and destruction do not silently use your default Box. Provider destruction is distinct from forgetting a record.

For adoption, `box add --ssh` accepts an OpenSSH alias or `user@host`. For cloud creation, see [provisioning](/docs/provisioning/) and `schooner box add --help` for supported provider settings and confirmations.

## Cloud provider profiles

| Command | What it does |
| --- | --- |
| `provider connect digitalocean [profile]` | Verify and connect a DigitalOcean credential profile |
| `provider list` | List provider credential profiles |
| `provider disconnect digitalocean/<profile>` | Remove a stored provider credential |

These manage provider credentials; `box add` creates infrastructure. See [DigitalOcean provisioning](/docs/provisioning/) for token storage, profile selection, recovery, and cloud costs.

## Repositories and Worktrees

| Command | What it does |
| --- | --- |
| `clone <repository>` | Clone a Repository as an ordinary primary Git Worktree |
| `worktree list` | Discover live Git Worktrees |
| `worktree inspect <path>` | Inspect an exact Worktree |
| `worktree add <repository-path> <path>` | Add an ordinary linked Git Worktree |
| `worktree remove <path>` | Remove a clean linked Git Worktree |
| `worktree prune` | Prune stale Git Worktree registrations |

All support Box selection with `--box`. `clone --branch` selects a branch or tag; `worktree add --branch` selects an existing branch or ref. See [repositories and Worktrees](/docs/repositories/) for path handling and removal protections. Git remains authoritative.

## Source-host access

| Command | What it does |
| --- | --- |
| `source connect github` | Connect a Box to private GitHub repositories |
| `source status` | Inspect the selected Box's GitHub source access |
| `source disconnect github` | Revoke the Box's GitHub key and remove its private key |

These commands support `--box`. They concern repository access, separate from cloud-provider credentials. See [source access](/docs/source-access/) for device authorization, Box-owned keys, and SSO.

## Local CLI and diagnostics

| Command | What it does | Guide |
| --- | --- | --- |
| `doctor` | Check the machine where the CLI is running | [Troubleshooting](/docs/troubleshooting/) |
| `version` | Show build information | [Installation](/docs/installation/) |
| `update --check` | Check for a local CLI update without replacing it | [Installation](/docs/installation/) |
| `update` | Update the local executable where its installation method permits | [Installation](/docs/installation/) |
| `db destroy` | Permanently discard the local database and its SQLite sidecars | [Advanced inventory reset](/docs/troubleshooting/#advanced-reset-local-inventory) |
| `help [command]` | Show command help | — |

`db destroy` does not destroy cloud resources or erase credential-store entries. Read its scope before using it as a reset.

## Shell completion

Generate a completion script for your shell:

```bash
schooner completion zsh
```

The available generators are `completion bash`, `completion zsh`, `completion fish`, and `completion powershell`. Each prints its shell's script. Use `schooner completion zsh --help` (or your shell's equivalent) for loading instructions. A PowerShell completion generator does not imply Windows client support.

## Global flags

| Flag | Purpose |
| --- | --- |
| `--help`, `-h` | Show help for the current command |
| `--version`, `-v` | Show the CLI version at the root command |
| `--output human\|json` | Choose output format; defaults to `human` |
| `--no-input` | Disable interactive prompts |
| `--accessible` | Use screen-reader-friendly prompts and progress |
| `--color auto\|always\|never` | Control terminal color; defaults to `auto` |
| `--theme auto\|light\|dark` | Set the terminal theme; defaults to `auto` |

Output mode does not make every command scriptable. Read [automation](/docs/automation/) for JSON streams, exit statuses, confirmations, SSH trust, and terminal-only commands.

## Scope of this reference

This directory covers the public release command surface. Internal `host` protocol commands and development-build helpers are implementation details.

DigitalOcean is the current built-in cloud provider; managed source access targets GitHub. Hetzner provisioning, optional coding-agent sessions, and private preview forwarding are planned, not commands available here. There is no public package-management command or generic `schooner run`, and transfers are explicit rather than continuous background synchronization.

---

Verified against [registered commands and flags](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/cli.go), the [public help fixture](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/testdata/help.txt), and [current roadmap](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/docs/roadmap.md) at `03d6623`.
