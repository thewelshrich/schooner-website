---
title: Find and fix a problem
description: Diagnose Schooner connection, setup, session, workspace transfer, and GitHub access issues without losing your machine or work.
lead: Check the connection and the live machine first, then repair the part that failed.
---

## Start with the right machine

```bash
schooner box list
```

Find the Box you intended to use, then inspect it. Replace `work-api` in this guide with that name:

```bash
schooner box status work-api
```

Using a name here is deliberate. `box status` does not follow the current checkout's Local Link, so its default can differ from the Box that `resume` or `push` uses. [Command defaults](/docs/command-basics/) explains the difference.

For a problem with the machine where the CLI itself is running:

```bash
schooner doctor
schooner version
```

`doctor` checks the current machine, not a remote Box. It reports readiness and returns a failure status if unhealthy; it does not install repairs.

## SSH or host trust fails

Try the Box's recorded SSH destination using your ordinary terminal:

```bash
ssh work-api
```

Here `work-api` must be the actual SSH alias or `user@host` destination, which may differ from its Schooner name. Check the destination, SSH configuration, keys or agent, and network access. Schooner uses the same system OpenSSH client; ordinary SSH access remains available independently.

An unknown host may need first-contact verification. A **changed** host key is a different problem: verify the expected machine and key before repairing your OpenSSH trust entry. `--accept-new-host-key` never accepts changed keys.

If a script works interactively but fails with `--no-input` or JSON output, it may depend on an authentication or trust prompt. Prepare SSH access first; see [automation](/docs/automation/).

## Setup or the remote runtime is incomplete

For missing prerequisites or interrupted preparation, repair the selected Box:

```bash
schooner box setup work-api
```

This installs or repairs prerequisites and the host runtime; it changes the remote machine. If the error specifically requests a newer host runtime, use:

```bash
schooner box update work-api
```

`box update` updates the remote runtime. The top-level `schooner update` concerns your local executable. See [installation and updates](/docs/installation/) for how installation ownership affects local updates.

For an interrupted DigitalOcean add, use the [provisioning recovery instructions](/docs/provisioning/) and the same Box name. Avoid starting a second differently named provision just because a connection step failed.

## Resume cannot find a Session

From the checkout you normally work in:

```bash
schooner resume
```

`resume` only returns to a live Session. If none exists for that work, open one:

```bash
schooner start
```

If the result is unexpected, inspect the intended Box explicitly:

```bash
schooner sessions --box work-api
```

A Session can survive a failed terminal attachment. If `start` says the Session remains running, repair the connection and resume it instead of repeatedly creating new work. [Sessions](/docs/sessions/) covers exact selectors and the distinction between managed and unmanaged tmux Sessions.

## A checkout's remembered target is stale

Schooner revalidates Local Links. A removed Box, changed Box identity, missing Worktree, or different repository at the remembered path can invalidate one. It fails instead of sending your files somewhere else.

Inspect the intended destination:

```bash
schooner worktree list --box work-api
```

After confirming which Worktree contains the right repository, an explicit Box and Worktree let you inspect a new transfer target:

```bash
schooner push repository --box work-api --dry-run
```

Replace `repository` with the verified remote Worktree path. Choose `pull` instead if the remote workspace is the state you intend to bring back. A successful real push or pull refreshes the Local Link; a dry run does not. Follow the [workspace transfer guide](/docs/workspace-sync/) before applying changes.

## A workspace transfer reports a conflict

Read the staged, unstaged, untracked, or conflicted counts in the error. Inspect the destination with Git and preserve work you need before retrying. Do not assume that a force option or automatic merge exists.

When a push reports that it created a remote clone but could not apply your workspace, the clone may remain. The error distinguishes that case from a transfer that changed no remote files. A pull conflict can report that no local files were changed. Follow the actual message rather than treating all failures as a completed transfer.

Use `--dry-run` to review the next attempt. See [workspace transfers](/docs/workspace-sync/) for what Schooner transfers and how it protects the receiving checkout.

## A private GitHub clone fails

Inspect the Box's source identity:

```bash
schooner source status --box work-api
```

For missing authorization, connect in an interactive terminal, then retry:

```bash
schooner source connect github --box work-api
```

For organization SAML SSO, authorize the SSH key named in Schooner's error in the relevant GitHub organization. A successful device authorization does not itself grant that organization access.

Managed GitHub host-trust errors may direct you to reconnect source access. An error about the Box user's ordinary `known_hosts` requires checking that user's SSH trust instead. Schooner keeps strict host-key checking; follow the specific recovery message. [Source access](/docs/source-access/) explains ownership and revocation.

## Advanced: reset local inventory

<details>
<summary>Only when you intend to discard Schooner's local database</summary>

`db destroy` is a destructive local reset, not a connection repair. It removes the active database and its SQLite sidecars, losing recorded inventory and operation state. It leaves provider resources, credential-store entries, SSH identities, and migration backups in place. A cloud machine can therefore remain running and billable after the reset.

The database lives at `~/Library/Application Support/Schooner/state.db` on macOS. On Linux it uses `$XDG_STATE_HOME/schooner/state.db` when configured, or `~/.local/state/schooner/state.db` otherwise. Preserve a suitable backup before intentionally discarding this state.

```bash
schooner db destroy
```

The interactive command asks for confirmation. In noninteractive use, it requires `--yes`. This does not replace [Box removal or provider destruction](/docs/boxes/).

</details>

---

Verified against [Box maintenance](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/box.go), [clone recovery](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/clone_recovery.go), and [local database handling](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/inventory/sqlite/path.go) at `03d6623`.
