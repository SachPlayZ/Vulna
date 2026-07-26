# Vulna demo runbook

## Safety

Use only the fictional `Acme Notes` program and harmless text. Do not scan,
exploit, or enter real credentials, URLs, customer data, or proof-of-concept
code.

## Local demo

1. Start the local Midnight services and full proven lifecycle:

   ```bash
   export PRIVATE_STATE_PASSWORD='a-unique-local-secret'
   pnpm run setup
   pnpm run test:e2e
   ```

2. Start the product UI:

   ```bash
   pnpm dev
   ```

3. Open `http://localhost:3000/bounties/acme-notes` and explain that scope,
   reward policy, commitments, status, and receipt hash are public—but report
   plaintext is not.
4. Open `/researcher`; enter a harmless report. Show the visible sequence:
   local draft → encrypted locally → ciphertext staged locally. The UI does
   not claim an upload, chain submission, or confirmation before real wallet
   proof and indexer confirmation.
5. Open `/reviewer`; explain the chain-first verification order and why the
   inbox has no plaintext preview. The live integration fixture separately
   proves reviewer decryption, acceptance, owner patch, external NIGHT transfer,
   and researcher receipt acknowledgment.
6. Explain settlement precisely: it is a transparent, non-atomic external
   transfer. `PAID` is an authenticated receipt acknowledgment, not escrow,
   shielding, trustless settlement, or proof of payment.

## Privacy evidence

```bash
pnpm run test:web
```

Chromium verifies restrictive headers and the sentinel boundary across public
HTML, network request bodies, localStorage, sessionStorage, cookies, and
IndexedDB ciphertext. It also exercises the browser encryption/staging path.

## Preprod handoff

A user-controlled funded Preprod wallet is required before deployment. Do not
reuse the local devnet genesis seed. After setting `MIDNIGHT_WALLET_SEED` to a
funded test-only wallet (or funding the generated address shown by the setup
command), run:

```bash
export MIDNIGHT_WALLET_SEED='test-only-preprod-seed'
export PRIVATE_STATE_PASSWORD='a-unique-local-secret'
pnpm run setup -- --network preprod
pnpm run test:e2e
```

Record the deployed address, transaction references, and indexer confirmation
in the demo submission notes. Do not claim a Preprod deployment until those
commands succeed.
