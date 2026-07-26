# Todo

## Plan

- [x] Phase 0 — Scaffold Vulna; verify Compact, Docker, proof server, deploy, circuit call, and indexer read.
- [x] Phase 1 — Freeze schemas, commitments, privacy/threat model, access rules, payout ADR.
- [x] Phase 2 — Implement Compact bounty/submission state machine with generated-contract simulator tests.
- [x] Phase 3 — Implement client crypto, encrypted storage, private-state recovery, leak tests.
  - [x] Add versioned libsodium report/package encryption and reviewer sealed-key envelopes.
  - [x] Add ciphertext-only blob-store adapter with byte-identity verification.
  - [x] Add encrypted account-scoped recovery state plus export/import validation.
  - [x] Add tamper, wrong-key, separate-context, and plaintext-sentinel tests.
- [ ] Phase 4 — Integrate wallet/providers, witnesses, real proof-backed submission, indexer confirmation.
- [ ] Phase 5 — Implement separate-context reviewer decrypt/verify/review/patch flow.
- [ ] Phase 6 — Implement tested custody/settlement or honest receipt-linked fallback.
- [ ] Phase 7 — Build Next.js product UI around proven flows.
- [ ] Phase 8 — Complete sentinel, CSP, attachment, recovery, accessibility, E2E hardening.
- [ ] Phase 9 — Deploy Preprod demo, document, record backup video.
- [ ] Commit each completed phase; push each commit once Git remote exists.

## Verification

- [x] Phase 0: `pnpm install --frozen-lockfile`.
- [x] Phase 0: `pnpm run setup`.
- [x] Phase 0: `pnpm run test:e2e`.
- [x] Phase 0: real `storeMessage` transaction + indexed state read.
- [x] Phase 1: protocol unit tests, strict typecheck, Compact compile, privacy-output review.
- [ ] Per phase: narrow tests, affected checks, privacy-output review, diff review.
- [x] Phase 2: generated Compact lifecycle and negative authorization/replay simulator tests.
- [x] Phase 3: XChaCha/Curve25519 round trip, Compact-compatible commitment verification, tamper/wrong-key/key-rotation tests, ciphertext storage, encrypted recovery, separate-process reviewer, and sentinel storage tests.

## Review

### Changed

- Adopted official `create-mn-app` Vulna scaffold and lockfile.
- Initialized local Git repository.
- Renamed planning/protocol docs to Vulna.
- Added compatibility baseline and ignored generated local private-state database.
- Added strict schemas, canonicalization vectors, state-transition guards, privacy/threat/architecture docs, and protocol ADRs.
- Implemented Phase 2 Compact lifecycle, append-only encrypted supplements, DApp-specific role commitments, nullifier replay prevention, and optional proof-gated digest reveal.
- Added generated-contract runtime simulator tests and an exact public-ledger/privacy inventory.
- Kept the Phase 0 local smoke as a raw node/indexer check because its recorded `storeMessage` deployment is not the new Vulna ABI.
- Implemented browser-safe XChaCha20-Poly1305 report encryption, sealed reviewer key envelopes, Compact-runtime commitment verification, ciphertext-only storage, encrypted account-scoped recovery, and IndexedDB adapters.

### Verified

- Compact 0.5.1/compiler 0.31.1.
- Docker node, indexer, and proof server healthy.
- Local contract deployed, transaction submitted, and ledger state indexed.
- `pnpm test`, `pnpm exec tsc --noEmit`, and `pnpm run compile` pass for Phase 1.
- Phase 2: `pnpm test` (7 protocol + 2 generated-contract simulator tests), `pnpm run build`, `pnpm run test:e2e`, and `git diff --check` pass.
- Phase 3: `pnpm test` (15 protocol/crypto/storage + 2 Compact simulator tests), `pnpm run build`, `pnpm run test:e2e`, `pnpm audit --prod --audit-level=high`, and `git diff --check` pass.

### Risks

- No Git remote configured; Phase 0 can commit locally but cannot push yet.
- `pnpm install` reports ignored optional dependency build scripts; re-check before browser/build work.
- Atomic shielded payout is unproven; Phase 6 must spike it before product claims.
- Compact/client commitment parity is explicitly deferred to Phase 2 generated-contract tests; no custom commitment primitive exists in application code.
- Current devnet deployment is the Phase 0 scaffold ABI; Phase 4 must deploy the Vulna ABI with account-scoped witnesses before calling it through providers.
- Payout/`PAID` is intentionally absent until Phase 6 proves custody or an honestly labeled receipt-linked fallback.
- Phase 4 must inject wallet/account-derived private-state keys and deploy the current Vulna ABI; Phase 3 deliberately does not invent replacement state when it is missing.

### Follow-ups

- Start Phase 4 provider factory, account-scoped witnesses, Vulna deployment, and real proof-backed submission.
