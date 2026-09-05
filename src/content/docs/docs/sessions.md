---
title: Manage your sessions
description: Start and resume persistent remote tmux sessions with Schooner, list running work, capture recent output, stop a session, or open a temporary shell.
lead: Keep long-running work on the Box, then inspect it or return to it from your terminal.
---

## Open persistent work

From a local checkout you have [pushed to a Box](/docs/workspace-sync/):

```bash
schooner start
```

Schooner uses the remembered remote Worktree, creates a managed tmux session if needed, and attaches your terminal. If that Worktree already has a managed live session, `start` reuses it.

To detach with the standard tmux key binding, press **Ctrl+B**, release both keys, then press **D**. The session keeps running on the Box. Return later from the same local checkout:

```bash
schooner resume
```

`resume` only attaches to existing work; it never creates a session. If the session has ended, use `start`. The Box must remain running for its processes to stay alive. See [resume your work](/docs/resume/) for connection troubleshooting.

## See what is running

From your local terminal:

```bash
schooner sessions
```

The list shows session IDs, names, ownership, Worktree association, and attached-client counts. **Managed** sessions were created and identified by Schooner. **Unmanaged** sessions are other live tmux sessions Schooner can observe. A session's association describes whether its Worktree can still be matched to live Git state.

:::note[Inspection commands choose their own Box]
`sessions`, `logs`, `stop`, and `shell` do not follow your checkout's Local Link. On your workstation they use an explicit Box, your default, the sole configured Box, or a choice when needed. If you have several machines, add `--box work-api` to inspect the intended one. Replace `work-api` with its name.
:::

## Check recent output

```bash
schooner logs
```

If there is one managed session, Schooner selects it. If there are several, it asks you to choose. The default is the most recent 200 lines of captured pane output.

<details>
<summary>Capture more history from an exact session</summary>

Copy a managed ID from `schooner sessions`, then replace `SESSION_ID`:

```bash
schooner logs SESSION_ID --lines 500
```

The accepted range is 1–2,000 lines. Output is also bounded to 64 KiB, so large output may be truncated. This is a snapshot of available tmux pane history, not a continuous log stream or permanent log archive.

</details>

## Stop work you have finished

```bash
schooner stop
```

Choose a managed session and confirm that it should stop. This ends the tmux session and its running work, while leaving the Worktree files in place. Use detach when you want processes to continue running.

<details>
<summary>Stop an exact session</summary>

```bash
schooner stop SESSION_ID
```

Replace `SESSION_ID` with a managed ID from the session list. An explicit ID stops that session without the interactive confirmation. `stop` and `logs` only accept managed sessions; a repository name or Worktree path is not a session ID.

</details>

## Open a temporary shell

```bash
schooner shell
```

Schooner selects the only available Worktree or asks you to choose one. The shell opens in that directory without creating a persistent managed session. Exit normally when you are done.

To open a particular Worktree, use its path from `schooner worktree list`:

```bash
schooner shell repository-feature
```

`start`, `resume`, and `shell` need an interactive terminal and human output. They are terminal handoffs rather than commands for capturing JSON in a pipeline.

## Select other persistent work

<details>
<summary>Use an exact Worktree path or session ID</summary>

```bash
schooner start repository-feature
schooner resume repository-feature
```

Replace `repository-feature` with an existing remote Worktree path. `resume` also accepts an exact session ID from the session list. Explicit selectors bypass the no-selector checkout-link path, so choose the Box explicitly too when your default is not the intended machine.

Without a Local Link, bare `resume` uses the current local repository as context; outside a local repository it selects the newest managed live session on the chosen Box. It does not create missing work. [Command defaults](/docs/command-basics/) explains routing in more detail.

</details>

---

Checked against the [session commands](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/session.go), [tmux implementation](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/session/tmux.go), and [session lifecycle tests](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/session/tmux_test.go) at `03d6623`.
