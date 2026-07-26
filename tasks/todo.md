# Todo

## Plan

- [x] Phase 0 — Scaffold Vulna; verify Compact, Docker, proof server, deploy, circuit call, and indexer read.
- [ ] Phase 1 — Freeze schemas, commitments, privacy/threat model, access rules, payout ADR.
- [ ] Phase 2 — Implement Compact bounty/submission state machine with simulator tests.
- [ ] Phase 3 — Implement client crypto, encrypted storage, private-state recovery, leak tests.
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
- [ ] Per phase: narrow tests, affected checks, privacy-output review, diff review.

## Review

### Changed

- Adopted official `create-mn-app` Vulna scaffold and lockfile.
- Initialized local Git repository.
- Renamed planning/protocol docs to Vulna.
- Added compatibility baseline and ignored generated local private-state database.

### Verified

- Compact 0.5.1/compiler 0.31.1.
- Docker node, indexer, and proof server healthy.
- Local contract deployed, transaction submitted, and ledger state indexed.

### Risks

- No Git remote configured; Phase 0 can commit locally but cannot push yet.
- `pnpm install` reports ignored optional dependency build scripts; re-check before browser/build work.
- Atomic shielded payout is unproven; Phase 6 must spike it before product claims.

### Follow-ups

- Start Phase 1.
