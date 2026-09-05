---
title: Connect and manage a Box
description: Adopt an Ubuntu machine over SSH, inspect its live status, repair its setup, update Schooner, and understand local removal versus cloud destruction.
lead: Bring a machine you already own. Schooner prepares it for development while keeping ordinary SSH access available.
---

## Connect an existing machine

Start with Ubuntu 24.04 or 26.04 on amd64 or arm64, reachable through your system's OpenSSH client. An SSH alias from `~/.ssh/config` works, as does a `user@host` destination.

```bash
schooner box add
```

Choose the existing SSH machine option. The guided flow asks for a Box name, SSH destination, and a directory for your work. You can accept the default Worktree root, `~/schooner`.

After confirmation, Schooner checks the machine, establishes its identity, prepares Git and tmux, and installs its host runtime. If Git or tmux is missing, setup needs passwordless sudo. You can instead install the missing packages yourself and retry. You do not need to run a separate `box setup` after a successful add.

Your machine is now ready for the [first-session workflow](/docs/first-session/).

<details>
<summary>Prefill the Box name and SSH destination</summary>

```bash
schooner box add work-api --ssh work-api
```

The first `work-api` is Schooner's Box name; the second is an OpenSSH alias. They can differ. The remaining choices and confirmation stay interactive.

For unattended use, the name, `--ssh`, and `--yes` are required. Establish host trust in advance, or deliberately use `--accept-new-host-key` to permit a new host key. That flag never accepts a changed key.

</details>

## Check the machine

```bash
schooner box list
schooner box status
```

`list` reads your local inventory. `status` connects to the selected machine, verifies its identity, and reports live readiness. It can report a missing or unavailable runtime without silently repairing it.

With one Box, no name is needed. For several Boxes, `status` uses a saved default or an interactive choice; `box status` does not follow the current checkout's Local Link. To inspect one specific machine, use `schooner box status work-api`.

## Repair or update

| Task | Command |
| --- | --- |
| Install or repair prerequisites and the host runtime | `schooner box setup` |
| Update the host runtime | `schooner box update` |
| Open an ordinary interactive SSH shell | `schooner box ssh` |

Each command accepts a Box name when you want an exact target, such as `schooner box setup work-api`. `update` updates Schooner's remote runtime; it does not perform a general operating-system upgrade or repair missing Git and tmux prerequisites. Use `setup` for that repair.

If Schooner reports that the connected machine no longer matches the recorded identity, verify your SSH destination and the machine before proceeding. Setup and update refuse to modify a different machine under an existing Box identity.

## Choose a default

You can skip this with a single Box. If you use several and want a usual target:

```bash
schooner box use work-api
```

This saves a default. A checkout's remembered Local Link still takes precedence for contextual work commands such as bare `start` and `resume`. See [how commands find your work](/docs/command-basics/).

## Forget a Box

When you want to stop tracking a machine locally:

```bash
schooner box remove work-api
```

Review the confirmation. This removes the local inventory entry without changing the machine, its files, or its running sessions. A cloud machine continues to exist and incur any provider charges.

If you want to permanently delete a Schooner-provisioned DigitalOcean machine instead, follow [cloud destruction](/docs/provisioning/#destroy-a-cloud-machine). Removing it locally first discards the Box entry that `destroy` needs.

Disconnect [GitHub source access](/docs/source-access/#disconnect-a-box) before removal when configured. Box removal does not revoke GitHub keys or remove their files.

---

Verified against [Box commands](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/box.go), the [Box service](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/box/service.go), and its [tests](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/box/service_test.go) at `03d6623`.
