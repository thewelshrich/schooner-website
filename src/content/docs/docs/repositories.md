---
title: Repositories and worktrees
description: Clone repositories onto a Schooner Box, inspect live Git worktrees, add parallel checkouts, and remove completed worktrees with built-in protection.
lead: Work with ordinary Git repositories and parallel checkouts on your own machine.
---

## Start with the work you already have

If your project is already on your laptop, [push your workspace](/docs/workspace-sync/) first. That carries local commits and uncommitted changes as well as the checkout.

If you want a fresh checkout from a Git host, clone it directly onto the Box. For example, to work on Schooner itself:

```bash
schooner clone https://github.com/thewelshrich/schooner.git
schooner start schooner
```

Replace the URL with your repository and `schooner` with the resulting Worktree path. Clone creates a normal primary Git Worktree beneath the Box's Worktree Root. It does not copy a local checkout's unpushed commits or uncommitted files.

For private repositories, see [GitHub access](/docs/source-access/) to connect the Box to your source host and understand where credentials live.

With one configured Box, no Box flag is needed. Clone and Worktree commands do not follow a local checkout's remembered link: they use their own [Box selection](/docs/command-basics/). Add `--box work-api` when you intentionally need a different machine.

## See the live checkouts

```bash
schooner worktree list
```

The list groups ordinary primary and linked Worktrees by repository and shows their branch and staged, unstaged, untracked, and conflicted counts. Schooner discovers live Git state beneath the Worktree Root; Git remains authoritative.

Inspect one checkout in more detail:

```bash
schooner worktree inspect schooner
```

Use the actual path from the list. Relative paths are interpreted beneath the Box's Worktree Root. Inspection includes the full path, repository origin, Git directories, HEAD, and status.

If discovery reports warnings, inspect the affected paths before treating the list as complete.

## Add a parallel checkout

A linked Worktree lets you work on another branch without changing your existing checkout:

```bash
schooner worktree add schooner schooner-feature
schooner start schooner-feature
```

Here `schooner` identifies the existing repository checkout and `schooner-feature` is the new destination under the Worktree Root. Git's normal Worktree branch selection applies; for a new destination name with no matching branch, Git creates the branch from HEAD. Review the result with `worktree inspect` before editing.

<details>
<summary>Check out an existing branch or a specific ref</summary>

```bash
schooner worktree add schooner schooner-review --branch feature
```

Use `feature` for an existing branch or ref in the remote repository. `--branch` selects what to check out; it is not a Schooner flag for creating a named branch. A branch already checked out elsewhere remains subject to Git's normal restrictions.

To choose a branch or tag when cloning:

```bash
schooner clone https://github.com/thewelshrich/schooner.git --branch main
```

Replace `main` with a branch or tag that exists in your repository. A tag checkout may have a detached HEAD.

</details>

## Remove a finished linked Worktree

First save the work you want to keep and [stop its managed session](/docs/sessions/#stop-work-you-have-finished). Then remove the linked checkout:

```bash
schooner worktree remove schooner-feature
```

Removal refuses Worktrees with local changes, untracked or ignored files, or an active managed session. It also refuses a primary Worktree. There is no force option to bypass those checks.

The command removes the linked checkout; it does not delete its Git branch. Review ignored files such as local configuration or generated output if the checkout looks clean but removal is blocked. Schooner does not stop arbitrary processes merely because they are using that directory.

## Clean up stale registrations

If a linked checkout was removed outside Git and left a stale registration:

```bash
schooner worktree prune
```

This asks Git to prune stale Worktree registrations in discovered repositories. It is not a command for deleting live checkout directories.

## Existing paths and interrupted operations

Clone and Worktree creation refuse to overwrite an unrelated existing destination. Use `worktree list` and `worktree inspect` to understand what is already there.

Schooner records lifecycle operations so a matching retry can reconcile an interrupted clone, add, or removal. If the command reports an uncertain outcome, inspect the named paths and follow its guidance before retrying. Do not manually remove recovery files to make an operation appear complete.

---

Checked against the [clone and Worktree commands](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/worktree.go), [Git lifecycle implementation](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/repository/lifecycle.go), and [lifecycle tests](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/repository/lifecycle_test.go) at `03d6623`.
