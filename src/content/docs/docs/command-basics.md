---
title: How commands find your work
description: Learn how Schooner chooses a Box and Worktree, when commands need no flags, and when to use explicit selectors for multiple machines or automation.
lead: Start with the short command. Add a selector only when you need to change where it runs.
---

## The everyday path

From a local checkout you have already sent to a Box:

| What you want to do | Command |
| --- | --- |
| Open persistent work | `schooner start` |
| Return to a live session | `schooner resume` |
| Send your local workspace | `schooner push` |
| Bring the remote workspace back | `schooner pull` |

A successful `push` or `pull` remembers a **Local Link** between your checkout and its Box and remote Worktree. Bare `start` and `resume` use that link; they do not transfer files themselves.

## How your Box is chosen

For `push`, `pull`, and `start` or `resume` without a positional selector, Schooner checks these in order when running from your workstation:

1. An explicit `--box` value, if you supplied one.
2. The current checkout's remembered Local Link.
3. Your saved default Box.
4. The only configured Box, if there is just one.
5. An interactive choice if several Boxes remain.

If a remembered target is missing or stale, the command fails rather than silently switching to a different machine. Adding the first Box does not save a default; the single-Box choice is automatic.

Other commands do not all use checkout links. For example, `sessions`, `box status`, and `box ssh` use their own explicit/default/single-Box selection rather than following the checkout's Local Link.

## Working with more than one Box

<details>
<summary>Set a default for commands without a checkout link</summary>

```bash
schooner box use work-api
```

Replace `work-api` with a configured Box name. A checkout's remembered link still takes precedence over this default for contextual work commands.

</details>

<details>
<summary>Choose a Box for one command</summary>

```bash
schooner resume --box work-api
```

Use this when you intentionally want to select the Box for this invocation. It does not set your saved default. It also does not mean that every `resume` needs a `--box` flag.

Schooner still validates the Worktree or Session it will use; a Box override does not move files or guarantee a matching session exists there.

</details>

## When you need an exact target

When you work with several Worktrees or Sessions, a positional selector can be useful. For example:

```bash
schooner start repository
```

This explicitly selects work instead of using the no-selector Local Link path. See [repositories and worktrees](/docs/repositories/) for path selectors and [sessions and shells](/docs/sessions/) for session IDs. Your installed command help lists the exact syntax.

You can also run work commands directly on a prepared Box. Without `--box`, Schooner can use that machine's local runtime. An explicit `--box` selects the SSH route instead.

## Keep automation explicit

The guides above assume an interactive local terminal. With `--no-input` or JSON output, ambiguous choices fail instead of prompting. Scripts should provide the values they need and handle command failures. The [automation guide](/docs/automation/) explains JSON output, confirmation flags, and commands that still need a terminal.

Removal and destruction are separate actions: they do not silently use the default Box. See [managing Boxes](/docs/boxes/) for the difference between forgetting a machine and destroying its infrastructure.

---

Based on the [Box resolver](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/box/resolver.go) and [session commands](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/session.go) at `03d6623`.
