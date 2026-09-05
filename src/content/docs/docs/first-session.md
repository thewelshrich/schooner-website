---
title: Your first remote session
description: Connect an existing Ubuntu machine over SSH, transfer a local Git checkout, and start a persistent remote development session with Schooner.
lead: "Take a local checkout to a machine you own, then start a development session that can survive a disconnected terminal."
---

## Before you begin

[Install Schooner](/docs/installation/) on your local machine. Have an Ubuntu 24.04 or 26.04 machine you can already reach over SSH, and a local Git checkout to work with.

Run the commands below in your **local terminal**. `repository` stands for the path to your checkout.

## 1. Connect your machine

```bash
schooner box add
```

Choose the existing SSH machine option. The guided flow asks for a Box name, your SSH destination, and a worktree location. Use the SSH alias or `user@host` you already connect with, and review the setup before confirming.

Schooner prepares Git, tmux, and its remote runtime for that SSH user. Your machine is now a **Box** in Schooner. Ordinary SSH access continues to work.

<details>
<summary>Already know the name and SSH destination?</summary>

You can fill those values in ahead of the prompts:

```bash
schooner box add work-api --ssh work-api
```

Here, the first `work-api` is the Box name; the second is an existing SSH host alias. These arguments are optional in the interactive flow.

</details>

## 2. Send your checkout

```bash
cd repository
schooner push
```

With one configured Box, Schooner selects it automatically. If you have several, it uses the checkout's existing link or your saved default, then offers a choice if needed.

`push` transfers the checkout to a remote Worktree and remembers the route. If several matching remote Worktrees exist, the interactive flow lets you choose one. Review any source-access or transfer prompts.

:::note[An explicit workspace transfer]
Schooner's `push` transfers your workspace; it is not `git push` and does not continuously synchronize files.
:::

## 3. Start working

From the same checkout:

```bash
schooner start
```

Schooner follows the route remembered by `push` to open persistent work on the remote Worktree. You do not need to repeat the Box name or repository path.

## Come back later

After disconnecting, return to that local checkout and run:

```bash
schooner resume
```

Continue with [resuming your work](/docs/resume/), or read [how command defaults work](/docs/command-basics/) when you need to choose a different Box or Worktree.

---

Checked against the [CLI implementation at `03d6623`](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/session.go) and its [Box selection rules](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/box/resolver.go).
