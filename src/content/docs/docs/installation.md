---
title: Install Schooner
description: Install the Schooner CLI on macOS or Linux with Homebrew or the installer script, verify your setup, and prepare for remote development.
lead: "Install Schooner on your local machine. You will connect your remote development machine in the next guide."
---

## Requirements

Schooner supports macOS 13 or later and contemporary Linux distributions on amd64 and arm64. Your system OpenSSH client is required for remote connections.

## Install with Homebrew

Homebrew is the recommended installation method.

```bash
brew install thewelshrich/tap/schooner
```

## Install without Homebrew

The installer selects the matching signed or verified release for your machine.

```bash
curl -fsSL https://raw.githubusercontent.com/thewelshrich/schooner/main/scripts/install.sh | bash
```

The default location is `~/.local/bin/schooner`. The installer does not use `sudo`. In an interactive terminal, it shows the selected release and destination and asks for confirmation. If needed, it separately offers to add the directory to your shell's `PATH`.

You can [read the installer](https://github.com/thewelshrich/schooner/blob/main/scripts/install.sh) before running it, or get tagged binaries from [GitHub Releases](https://github.com/thewelshrich/schooner/releases).

## Check your installation

```bash
schooner version
schooner doctor
```

The first command prints your installed version. Use the environment checks from `doctor` to resolve setup issues before connecting a machine.

If your shell cannot find `schooner` after a direct install, check that `~/.local/bin` is on your `PATH`. Open a new terminal after accepting the installer's shell-profile update.

## Keep Schooner up to date

For a Homebrew installation:

```bash
brew upgrade thewelshrich/tap/schooner
```

To check for an available update without replacing the executable:

```bash
schooner update --check
```

For a direct installation managed by Schooner:

```bash
schooner update
```

On a Homebrew install, `schooner update` prints the Homebrew update command instead of replacing the executable.

## Next: connect your machine

With Schooner installed, [start your first remote session](/docs/first-session/). You will need an Ubuntu machine you can already reach over SSH and a local Git checkout.

---

Checked against the [installer](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/scripts/install.sh) and [update command](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/update.go) at `03d6623`.
