# Vulna compatibility baseline

Checked: 2026-07-26.

## Source order

1. Generated scaffold and compiler behavior.
2. [Midnight compatibility matrix](https://docs.midnight.network/relnotes/support-matrix).
3. Current official documentation/examples.
4. Vulna protocol docs.

## Compatible stack

| Component | Version |
| --- | ---: |
| Node.js | 22.22.2 |
| pnpm | 10.12.1 |
| Compact devtools | 0.5.1 |
| Compact compiler | 0.31.1 |
| Compact runtime | 0.16.0 |
| Midnight.js packages | 4.1.1 |
| Wallet SDK | 1.2.0 |
| Indexer | 4.3.3 |
| Proof server | 8.1.0 |
| Local node | 1.0.0 |

The official quickstart currently mentions Compact compiler `0.31.0`; the compatibility matrix lists `0.31.1`. Vulna uses the matrix-compatible compiler and generated `pnpm-lock.yaml`.

## Phase 0 proof

- `pnpm install --frozen-lockfile` succeeded.
- `pnpm run setup` started local node, indexer, and proof server; compiled and deployed the generated Compact contract.
- `pnpm run test:e2e` reconnected to the deployment and queried indexed ledger state.
- A real `storeMessage("vulna-phase-0")` transaction succeeded at local block 55; the indexed state returned the same message.
- Generated artifacts include TypeScript bindings, prover/verifier keys, and ZKIR for `storeMessage`.

## Local-only data

Never commit `.midnight-state.json`, `.midnight-wallet-state/`, `midnight-level-db/`, `contracts/managed/`, or `node_modules/`. They contain deployment state, wallet sync/private state, generated artifacts, or installed packages.

## Command note

Use `pnpm run setup`, not `pnpm setup`: pnpm reserves `setup` for its own command and will not run the package script.
