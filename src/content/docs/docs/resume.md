---
title: Resume your work
description: Return to a persistent remote tmux session with Schooner after disconnecting, and explicitly transfer workspace changes when you need them.
lead: "Return to your remote development session after closing your laptop or losing your connection."
---

## Return to the same checkout

This guide continues from [your first remote session](/docs/first-session/). Open a local terminal and return to the checkout you previously sent to your Box:

```bash
cd repository
schooner resume
```

Replace `repository` with your local checkout path. Your successful `push` or `pull` remembered the Box and remote Worktree, so you do not need to specify them again.

Working with several machines? [Command defaults](/docs/command-basics/) explains when to use a default Box or an explicit override.

:::note[The remote machine must still be running]
Session persistence survives a client disconnect. It does not keep a session alive after the remote machine shuts down or the tmux session ends.
:::

## Transfer changes when you need them

Starting or resuming a session does not copy files or transfer commits. Workspace transfer is explicit.

To bring the remote workspace back to your local checkout:

```bash
schooner pull
```

To send your local checkout to the remote Worktree again:

```bash
schooner push
```

Run these from the relevant local checkout. Read [workspace transfers](/docs/workspace-sync/) for what is copied, dry runs, and conflict checks.

## If you cannot resume

From your local terminal, inspect the Box you used for this checkout. Replace `work-api` with its name:

```bash
schooner box status work-api
```

The name is deliberate here: `box status` does not follow the checkout's remembered link. Naming the Box keeps this diagnostic on the same machine when you have several.

Make sure you are in the same local checkout used for the earlier transfer. Schooner revalidates remembered routes; a stale route fails rather than silently selecting different work.

If the original session has ended, you can start work again:

```bash
schooner start
```

This does not restore processes that have already exited.

## Your SSH access stays available

You can always use your normal SSH connection independently of Schooner. For session inspection and logs, see [sessions and shells](/docs/sessions/). If you are stuck, start with [troubleshooting](/docs/troubleshooting/).

---

Checked against the [CLI implementation at `03d6623`](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/session.go) and its [Box selection rules](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/box/resolver.go).
