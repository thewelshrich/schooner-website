---
title: Create a DigitalOcean Box
description: Provision a persistent Ubuntu development machine with DigitalOcean, manage provider credentials, resume interrupted creation, and delete infrastructure safely.
lead: Create a development machine in your own DigitalOcean account, then use the same SSH-based workflow as any other Box.
---

## Start with the guided flow

Creating a Droplet creates billable infrastructure in your DigitalOcean account. If you already have a machine, [connect it over SSH](/docs/boxes/) instead.

```bash
schooner box add
```

Choose DigitalOcean. The flow walks through the Box name, Worktree root, credential profile, region, size, Ubuntu image, networking, and SSH key choices. It can connect your first DigitalOcean profile during setup, so a separate provider command is optional. Review the configuration before confirming creation.

DigitalOcean is the currently supported provisioning provider. The compatible Ubuntu choices come from its live catalogue; the CLI supports Ubuntu 24.04 and 26.04 on amd64 and arm64.

Once setup completes, follow [your first session](/docs/first-session/#2-send-your-checkout) from the local repository you want to work on.

## Manage provider credentials

To connect credentials ahead of time:

```bash
schooner provider connect digitalocean
schooner provider list
```

The interactive connection asks for a profile name and a Personal Access Token. Schooner verifies the account and can save the token in the operating-system credential store. The first provider profile becomes the default automatically.

Profiles stay bound to the verified DigitalOcean team. Reconnecting a profile with a token for another team fails rather than silently moving its Boxes between accounts.

<details>
<summary>Named profiles, automation, and credential storage</summary>

To name a profile up front:

```bash
schooner provider connect digitalocean personal
```

Add `--default` when intentionally making that profile the default. Provisioning also accepts `--profile personal` when you need an exact choice.

For non-interactive connection, supply a profile name and make `DIGITALOCEAN_TOKEN` available in the environment through your secret manager. Schooner does not accept a token flag or implicitly save an environment-provided token. An environment token takes precedence during credential resolution and must match the selected profile's team.

If the operating-system credential store is unavailable, an interactively entered token can be used only within the current Schooner process, with a warning. There is no plaintext fallback. Restore credential-store access or provide the environment token for later invocations.

A custom-scoped token needs account and catalogue reads, Droplet create/read/delete, SSH-key create/read/delete, VPC read, and tag create permissions. A Full Access token also covers these operations.

For complete unattended provisioning options, use `schooner box add --help`. Non-interactive creation requires a name, region, size, image, `--yes`, and `--accept-new-host-key`. Choose the configuration deliberately before using those confirmation flags.

</details>

## Understand SSH access

Schooner generates a dedicated local Ed25519 identity for the provisioned Box. The guided flow separately offers local **public** keys from `~/.ssh` and keys already registered with DigitalOcean. It does not read or upload the private halves of those selected local keys.

Selected local public keys are registered with the provider temporarily for Droplet creation. Your ordinary SSH access remains available. To open the Box using its recorded connection:

```bash
schooner box ssh
```

## Resume interrupted creation

If creation stopped partway through, rerun with the same unfinished Box name:

```bash
schooner box add work-cloud
```

Replace `work-cloud` with the name you originally chose. Schooner reuses the saved selections and operation identity to reconcile the existing request instead of blindly creating a second Droplet. Do not switch to a new name just to retry.

The infrastructure may already exist even when preparation did not finish. Check the reported error and your provider account before abandoning an interrupted operation.

## Destroy a cloud machine

First save any work you need. If the Box has managed GitHub access, [disconnect that access](/docs/source-access/#disconnect-a-box) while the machine is still reachable.

To permanently delete a Schooner-provisioned Droplet:

```bash
schooner box destroy work-cloud
```

Review the destruction confirmation. Schooner verifies the provider resource against its recorded identity before deletion, then removes the local Box entry. This command applies only to provider-provisioned DigitalOcean Boxes, not adopted SSH machines.

Use `box remove` only when you intend to forget the Box locally and keep the cloud machine. Neither command automatically revokes GitHub access.

## Disconnect a credential profile

```bash
schooner provider disconnect digitalocean/personal
```

This removes the locally stored provider secret after confirmation. It does not destroy Droplets or revoke the token at DigitalOcean. Safe profile metadata remains so you can reconnect the same account later. A disconnected profile can appear as `action_required` in `provider list`.

---

Verified against [acquisition](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/acquisition/acquisition.go), [recovery tests](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/acquisition/acquisition_test.go), and [credential management](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/credentials/credentials.go) at `03d6623`.
