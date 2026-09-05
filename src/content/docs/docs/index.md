---
title: Your machines. Your workflow.
description: Get started with Schooner, the open-source CLI for persistent remote development using your own machines, SSH, Git worktrees, and tmux.
lead: "Schooner brings SSH, Git worktrees, and tmux together so you can work on a remote machine and return to the same session later."
---

Your machine stays yours. There is no required Schooner account or hosted control plane, and ordinary SSH access stays available.

## Start with a machine you own

This getting-started path uses an Ubuntu machine you can already reach over SSH. You will install Schooner locally, connect the machine, send a checkout, and start a persistent development session.

1. **[Install Schooner](/docs/installation/)** — set up the CLI on macOS or Linux and check your environment.
2. **[Start your first remote session](/docs/first-session/)** — connect your machine and work from a local Git checkout.
3. **[Resume your work](/docs/resume/)** — return after a disconnected terminal or a closed laptop.

## Three tools you already know

| Tool | Its role |
| --- | --- |
| **OpenSSH** | Your system SSH client connects directly to your machine. |
| **Git** | Repositories and worktrees remain ordinary Git repositories. |
| **tmux** | Development sessions stay on the remote machine when you disconnect. |

Schooner calls a managed remote machine a **Box**. It prepares the development tools for your SSH user and runs on demand rather than requiring a persistent Schooner daemon.

## What you need

- A local machine running **macOS 13 or later**, or a contemporary **Linux** distribution, on amd64 or arm64.
- The system OpenSSH client.
- A remote **Ubuntu 24.04 or 26.04** machine on amd64 or arm64 that you can access over SSH.
- A local Git checkout to work with.

If you need a machine, Schooner can also provision a DigitalOcean Droplet. That creates billable infrastructure; the [provisioning guide](/docs/provisioning/) covers that separate path.

## Find your next task

| What you want to do | Guide |
| --- | --- |
| Move your current checkout between machines | [Transfer your workspace](/docs/workspace-sync/) |
| Inspect sessions, read logs, or open a temporary shell | [Sessions and shells](/docs/sessions/) |
| Clone a repository or work on another branch | [Repositories and worktrees](/docs/repositories/) |
| Choose where a command runs | [Command defaults](/docs/command-basics/) |
| Add, check, or update a development machine | [Manage your Boxes](/docs/boxes/) |
| Create a machine in your DigitalOcean account | [Provision a machine](/docs/provisioning/) |
| Give a Box access to private GitHub repositories | [GitHub access](/docs/source-access/) |
| Use Schooner in a script | [Automation](/docs/automation/) |
| Diagnose a problem and recover your setup | [Troubleshooting](/docs/troubleshooting/) |

## Keep control of your environment

Your SSH access is independent of Schooner. Repositories stay in Git, sessions stay in tmux, and your infrastructure stays in your own account.

Browse the [command reference](/docs/command-reference/) to find a command by task. Run `schooner <command> --help` for the exact options in your installed version. See the [roadmap](https://github.com/thewelshrich/schooner/blob/main/docs/roadmap.md) for current capabilities and planned work.

---

Based on the [CLI documentation at `03d6623`](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/README.md).
