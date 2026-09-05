---
title: Move work between machines
description: Use Schooner push and pull to transfer commits, staged changes, and uncommitted files between a local checkout and a remote Worktree, with dry runs and conflict protection.
lead: Send the work you have now. Bring it back when you need it, including changes you have not committed.
---

## Send your local checkout

Run this inside the local Git checkout you want to work on remotely:

```bash
schooner push
```

On your first push, Schooner finds a matching remote Worktree or prepares a new destination. If several Worktrees match the same repository, it asks you to choose. A repository with a network origin can be cloned on the Box before your local workspace is applied; a checkout without one can be transferred as a normal Git repository.

A successful transfer remembers a **Local Link** between this local checkout, its Box, and the remote Worktree. Subsequent `push`, `pull`, `start`, and `resume` can use that link without extra flags. See [command defaults](/docs/command-basics/) for how multiple machines are selected.

Then open your remote session:

```bash
schooner start
```

## Bring remote work back

From the same local checkout:

```bash
schooner pull
```

Pull needs an existing remote Worktree and an existing local checkout. Without a Local Link, it looks for Worktrees with the same network repository identity and asks you to choose if several match.

Neither command publishes work to GitHub or another Git host. Use ordinary `git push` when you are ready to publish commits. Starting or resuming a session does not transfer files automatically.

## What moves with your workspace

The transfer carries the current HEAD and its commit history, branch or detached-HEAD state, Git index, tracked files, and nonignored untracked files. Staged and unstaged changes remain distinct. Tracked deletions, executable file modes, and supported symbolic links are preserved.

Ignored files stay on their own machine. That includes dependencies, generated files, or local configuration when your Git ignore rules exclude them. An ignored destination file that collides with incoming work causes a conflict instead of being overwritten.

## Preview a transfer

```bash
schooner push --dry-run
```

Or, before bringing work back:

```bash
schooner pull --dry-run
```

A dry run inspects the workspaces, reports the planned action and changed-file count, and checks for conflicts. It does not apply the workspace, create the proposed remote checkout, or save a Local Link. It still needs access to the selected Box. Conditions can change after the preview, so the real transfer validates them again.

## When Schooner stops for a conflict

These are workspace transfers, not merges. Unless the two workspaces already match, the destination must be clean and must not contain commits missing from the source.

| Command | Destination protected |
| --- | --- |
| `schooner push` | Remote Worktree |
| `schooner pull` | Current local checkout |

If a transfer stops, inspect the destination's `git status` and commit history. Save its work and reconcile divergent commits with Git before retrying. There is no force flag that bypasses these checks. Identical workspaces are reported as already up to date, even if both contain the same uncommitted changes.

Schooner also rechecks state during the operation. If it reports an uncertain outcome after interruption, inspect both workspaces before retrying; do not assume the destination is unchanged.

## Choose an exact route

<details>
<summary>Use a different Worktree or repair a stale link</summary>

First inspect the intended Box with `schooner worktree list --box work-api`. Then use its actual Worktree path:

```bash
schooner push repository-feature --box work-api --dry-run
schooner push repository-feature --box work-api
```

Replace `work-api` with your Box name and `repository-feature` with a path beneath its Worktree Root. Relative paths are resolved from that root. Use `pull` instead of `push` to bring that exact remote workspace into your current checkout.

Supplying both the Box and Worktree gives Schooner an explicit route when repairing a stale Local Link. A successful transfer saves the new route; the dry run does not.

</details>

## Checkout limitations

Workspace transfer currently rejects submodules, shallow or partial clones, sparse checkouts, unresolved merge state, and in-progress Git operations such as a rebase. Some Git configurations that alter file representation are also unsupported, including automatic line-ending conversion and skip-worktree or assume-unchanged index entries.

If Schooner reports an unsupported checkout, follow the specific error. You can still use normal Git and SSH on your machine independently of workspace transfer.

---

Checked against [push and pull routing](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/push.go), [transfer checks](https://github.com/thewelshrich/schooner/tree/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/workspacetransfer), and [checkout preservation tests](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/repository/checkout_test.go) at `03d6623`.
