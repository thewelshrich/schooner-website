---
title: Use Schooner in scripts
description: Automate Schooner with explicit targets, versioned JSON output, noninteractive prompts, command-specific confirmations, and OpenSSH host trust.
lead: Keep everyday commands short. Make scripts explicit about their targets, input, and failure handling.
---

## Inspect before you automate

Start with a read operation. Replace `work-api` with the Box you intend to inspect:

```bash
schooner box status work-api --output json --no-input
```

For commands that accept a Box flag, the equivalent pattern is:

```bash
schooner worktree list --box work-api --output json --no-input
schooner sessions --box work-api --output json --no-input
```

Explicit names prevent a script's destination changing when you add a Box or change a default. This is useful for automation; it is not a requirement for [everyday commands](/docs/command-basics/).

## Prompts and output are separate choices

`--no-input` disables Schooner prompts. `--output json` also prevents interactive selection. A choice that would require a picker fails instead of choosing an arbitrary target.

Interactive Schooner prompts require human output and terminals on standard input and standard error. Redirecting standard input or standard error can therefore change whether prompts are available.

JSON result documents use a `schema_version` field. Result fields depend on the command. Ordinary command errors are written to standard error as JSON with an `error.code` and `error.message`, and sometimes `error.context`. Keep the two streams separate:

```bash
schooner box status work-api --output json --no-input \
  > status.json 2> status-error.json
```

Check the process exit status before consuming results. An unsuccessful diagnostic can still write a report to standard output: `doctor`, for example, returns a failure status when its report is unhealthy. Do not assume every failure has an error document or parse human progress messages as an API.

The normal CLI exit statuses are `0` for success, `1` for an execution failure, `2` for invalid usage, and `130` for an abort. Terminal handoffs can propagate a subprocess status. JSON schemas and command behavior are still evolving; pin the CLI version used by your automation and consult its help.

## Preview workspace transfers

Run from the local Git checkout. Select the remote Worktree explicitly when several could match:

```bash
schooner push repository --box work-api --dry-run --output json --no-input
```

A push dry run inspects the transfer without changing the Box. For the reverse direction, use `pull --dry-run` to inspect without changing the local checkout. Read the [workspace transfer guide](/docs/workspace-sync/) before removing `--dry-run`; these transfer workspace state, including uncommitted work.

## Confirmations belong to each command

There is no global `--yes`. Use a command's confirmation flag only when you intend its documented effect.

| Operation | Noninteractive requirement |
| --- | --- |
| Adopt an SSH machine | Box name, `--ssh`, and `--yes`; usable SSH authentication and host trust |
| Provision a machine | Explicit provisioning choices and confirmations; see [DigitalOcean provisioning](/docs/provisioning/) |
| Forget a Box | Explicit name and `--yes` for local removal |
| Destroy a provider Box | Explicit name and `--yes` for permanent infrastructure destruction |
| Disconnect a provider profile | Exact provider/profile and `--yes` |
| Disconnect GitHub source access | Resolvable Box and `--yes` |
| Stop a Session | Exact managed Session ID; there is no `--yes` flag |

**An explicit `stop` Session ID is the instruction to stop it.** Bare `stop` uses a picker and confirmation; `stop SESSION_ID` acts without that confirmation. See [Sessions](/docs/sessions/) before using it in a script.

<details>
<summary>Adopt an already trusted SSH machine without prompts</summary>

```bash
schooner box add work-api --ssh work-api --yes --no-input --output json
```

Here the first `work-api` is the Schooner Box name and the second is an existing OpenSSH destination. Setup changes the remote machine. Authenticate and verify its host key before running this unattended.

</details>

## Preserve SSH trust

Schooner uses system OpenSSH. Noninteractive SSH operations use batch mode, so missing authentication or an unknown host can fail instead of asking for input.

`box add --accept-new-host-key` allows OpenSSH to trust a **new** host key. It never accepts a changed key. Use it only when first-contact trust is appropriate for the machine you are adding; `--yes` alone does not grant host trust.

A changed key requires investigation and verification of the expected machine. Do not disable host-key checking to make a script pass. See [connection troubleshooting](/docs/troubleshooting/#ssh-or-host-trust-fails).

## Terminal commands stay interactive

`start`, `resume`, `shell`, and `box ssh` require a terminal and support human output only. They do not become headless session APIs when you add `--no-input`. That flag can suppress selection and SSH prompts while you still use a terminal.

Use `sessions` and `logs` for structured session inspection. GitHub device authorization may also need a human: prepare [source access](/docs/source-access/) interactively before an unattended private clone. Provider credentials have their own [profile and environment setup](/docs/provisioning/).

---

Verified against [CLI output and exit handling](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/cli.go), [Box commands](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/box.go), and [Session commands](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/session.go) at `03d6623`.
