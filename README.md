# MultiVault

On-chain multi-asset vault for DAO-style multisig payouts. Upgradeable
via UUPS proxy. Built for Base Mainnet/Testnet. Operated exclusively
through GitHub Actions (no local runs).

## Key Features

-   Upgradeable UUPS proxy with clean deployments manifests per chain
-   DAO-oriented payout flow for native and ERC-20 assets
-   GitHub Actions only: deploy and upgrade from the UI
-   Base ecosystem alignment for visible on-chain builder activity

## Workflows

### Upgrade Proxy

Workflow: `.github/workflows/upgrade.yml`\
Manual trigger: **Actions → Upgrade Proxy → Run workflow**\
Input: - `network`: `basesepolia` or `base`

The workflow runs `scripts/upgrade.ts`, which: - Reads
`deployments/<chainId>.json` for the target network - Upgrades the
existing UUPS proxy to a new implementation - Updates the manifest with
the new implementation and metadata

### Deploy Proxy

A deploy workflow already exists in this repository and can be used to
seed the proxy on Base networks. If the workflow name or structure is
updated, the addresses must be reflected in `deployments/*.json` to keep
upgrade flow consistent.

## Required Secrets (Repository → Settings → Secrets and variables → Actions)

-   `PRIVATE_KEY`: EOA private key used for deploy/upgrade
-   `BASE_RPC_MAINNET`: HTTPS RPC URL for Base Mainnet
-   `BASE_RPC_SEPOLIA`: HTTPS RPC URL for Base Sepolia
-   `ETHERSCAN_API_KEY`: Optional, for explorer verification compatible
    endpoints

## Scripts

-   `scripts/upgrade.ts`: Performs UUPS upgrade using OpenZeppelin
    Upgrades plugin and updates deployments manifest.

## How to Upgrade

1.  Ensure `deployments/<chainId>.json` contains the correct `proxy` and
    `contractName`.
2.  Push the new contract code.
3.  Open **Actions → Upgrade Proxy**, choose `basesepolia` for test or
    `base` for mainnet.
4.  After success, check updated `deployments/<chainId>.json` in the
    artifact and commit it to the repo.

## Security

-   Minimal privileges in workflows
-   Private key only via GitHub Actions secrets
-   Immutable proxy address; logic evolves through upgrades only

## Roadmap

-   Add MultiVault core logic for DAO payouts and Sub-Accounts
    integration
-   Integrate Base Pay events ingestion to record incoming intents
-   Expose a minimal UI for testnet interactions
-   Automate explorer verification after each upgrade
