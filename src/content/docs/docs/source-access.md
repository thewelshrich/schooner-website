---
title: Access private GitHub repositories
description: Connect a Box to GitHub with a dedicated SSH key, understand credential ownership, recover authentication failures, and revoke access when finished.
lead: Give each Box its own GitHub identity without copying your laptop's private keys or putting a GitHub token on the machine.
---

## Connect when you need it

You can keep using the Box user's existing Git and SSH configuration. Managed source access is useful when that machine needs access to private GitHub repositories.

```bash
schooner source connect github
```

On your workstation, the command uses your default or only Box, or asks you to choose. It does not follow a checkout's Local Link. With several machines, use `schooner source connect github --box work-api` when you want an exact target.

When authorization is needed, Schooner explains the GitHub App permission and credential locations, then asks for confirmation. Follow the displayed GitHub URL and one-time code. The URL remains available if opening your browser fails.

Schooner creates the Box's dedicated SSH key, registers its public key on GitHub, and verifies SSH access. A successful connection prints a receipt and disconnect instructions. You can also let an interactive `clone` or contextual `start` offer this setup after the Box's existing GitHub authentication fails.

## What receives access

| Location | What Schooner keeps there |
| --- | --- |
| Your workstation's credential store | GitHub access and refresh tokens for managing SSH keys |
| The Box | Its dedicated Ed25519 private key, public key, and managed GitHub host trust |
| GitHub | The public key, titled `Schooner / <box-name>` |

The GitHub App requests the account permission needed to read and write Git SSH keys; it cannot read repositories through that App permission. The registered SSH key is what gives the Box Git access under your GitHub account's permissions.

One locally authorized GitHub account is shared across connected Boxes, but every Box gets its own key. Disconnecting one Box leaves the others' keys in place. Schooner rejects switching to a different GitHub account while Boxes remain bound.

The Box's private key stays on that Box. GitHub tokens stay in the local operating-system credential store. If the store is unavailable, Schooner warns and uses credentials only for the current process; it does not create a plaintext fallback.

## Inspect access

```bash
schooner source status
```

The result separates local, Box, and GitHub observations. States include `not_connected`, `connected`, `action_required`, `cleanup_pending`, `conflict`, and `unknown`. An outage can leave some observations unavailable while preserving the facts Schooner can still verify.

A registered key is not necessarily a completed connection: if SSH verification was interrupted, run `schooner source connect github` again to finish verification. Schooner reconciles an existing key rather than relying on its display title or blindly registering a duplicate.

## Recover an authentication problem

| What you see | What to do |
| --- | --- |
| A missing or expired device authorization | Run `source connect github` in an interactive terminal and use the new code. |
| SSH verification pending | Retry `source connect github`; registration alone is not enough. |
| GitHub SAML SSO required | Authorize the displayed `Schooner / <box-name>` SSH key for the named organization in GitHub, then retry. |
| Managed GitHub host trust needs refreshing | Retry `source connect github`. Schooner does not bypass strict host-key checking. |
| `host_runtime_update_required` during clone recovery | Update the selected Box with `schooner box update`, then retry. |

A successful account-level connection does not guarantee access to every repository. Confirm that your GitHub account can access the requested repository and complete any organization SSO authorization.

<details>
<summary>Use source access in automation</summary>

Establish the GitHub account in an interactive invocation first. Non-interactive commands can use or refresh a stored credential, but cannot start device authorization.

An explicit automated `source connect github --box work-api` can reconcile or register the selected Box's key when a usable credential already exists. Add the CLI's non-interactive options as appropriate for your script. When fresh authorization is required, the command fails with `authentication_required` guidance instead of opening a browser.

Automatic recovery during `clone` or `start` does not register a new key in JSON or non-interactive mode. Use an explicit source connection as your automation setup step.

</details>

## Disconnect a Box

Before removing or destroying a Box with managed source access:

```bash
schooner source disconnect github
```

Check the Box named in the confirmation. With multiple machines, target the intended Box explicitly using `--box work-api`. Unattended disconnection requires `--yes`.

Schooner verifies the recorded GitHub key, revokes it first, then removes the Box's key files. If revocation succeeds but the machine is unreachable, the result can succeed with a warning and `cleanup_pending`. A later `source status` or `source disconnect` retries that already-authorized cleanup when the Box becomes available.

After the final Box is fully disconnected, Schooner removes the local Source Account metadata and credential. `box remove` and `box destroy` do not perform source disconnection automatically.

<details>
<summary>You already removed the Box locally</summary>

Retained source metadata allows revocation by the former Box name:

```bash
schooner source disconnect github --box former-box-name
```

Replace the name with the original Box name. GitHub revocation can complete before the machine is re-adopted. Removing its inactive private key still requires access to that same machine; a replacement machine reusing the name is not treated as the original.

</details>

---

Verified against [source commands](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/cli/source.go), the [source lifecycle](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/source/source.go), and its [recovery tests](https://github.com/thewelshrich/schooner/blob/03d6623bbc8bc3b57a1300c26627960d74deb87d/internal/source/source_test.go) at `03d6623`.
