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
- [x] Phase 4 — Integrate wallet/providers, witnesses, real proof-backed submission, indexer confirmation.
  - [x] Add fail-closed, account-scoped witness state and generated-type bindings.
  - [x] Replace scaffold provider wiring with single Vulna provider factory.
  - [x] Collapse lifecycle-only circuits into bounded role dispatchers: local node rejects the 13-verifier-key deployment as block-limit exhausted; preserve all transitions/invariants in one contract.
  - [x] Deploy current Vulna ABI, encrypt/store ciphertext locally, submit proof-backed commitment, confirm indexed state.
  - [x] Add witness/provider/integration coverage; review public transcript for plaintext.
- [x] Phase 5 — Implement separate-context reviewer decrypt/verify/review/patch flow.
  - [x] Persist/version reviewer encryption key material in encrypted reviewer-only local state.
  - [x] Verify ciphertext/envelope hashes and chain commitments before reviewer decryption.
  - [x] Exercise reviewer acknowledge/accept and owner patch in separate authenticated contexts.
  - [x] Add live integration tests for wrong reviewer, invalid state, and patch-before-accept.
- [x] Phase 6 — Implement tested custody/settlement or honest receipt-linked fallback.
  - [x] Spike installed wallet SDK `transferTransaction` with real local NIGHT, distinct recipient, and recipient-wallet balance check.
  - [x] Freeze fallback semantics: receipt-linked, non-atomic, transparent; never call it escrow/shielded/trustless.
  - [x] Bind a salted researcher payout-recipient commitment at submission; record only receipt hash after patch.
  - [x] Add payout receipt/double-action/authorization simulator and live tests.
- [x] Phase 7 — Build Next.js product UI around proven flows.
  - [x] Add a strict Next.js App Router shell without moving private report data across an RSC boundary.
  - [x] Build public bounty detail/audit surfaces with only safe mock/indexed metadata.
  - [x] Build a client-only report composer using React Hook Form + Zod and local encryption before any persisted ciphertext write.
  - [x] Build researcher/reviewer views with safe local-only status, decryption, and receipt-boundary UX.
  - [x] Add unit coverage for validation, encrypted preparation, and the plaintext sentinel boundary.
- [x] Phase 8 — Complete sentinel, CSP, attachment, recovery, accessibility, E2E hardening.
  - [x] Add restrictive headers/CSP and assert them from the running app.
  - [x] Make attachment policy explicit, retain ciphertext-only storage, and protect unsaved in-memory drafts.
  - [x] Apply accessibility review fixes: skip link, labels, live updates, focus, reduced motion, and mobile behavior.
  - [x] Add browser E2E for public HTML/header/sentinel boundaries and the client encryption flow.
- [ ] Phase 9 — Deploy Preprod demo, document, record backup video.
  - [x] Write a safe fictional demo script and browser privacy-evidence command.
  - [x] Verify the full harmless lifecycle on Preview: `2384e08752408e12632a56f93487ee6ff417aa0ca47ec6d6fd16b24ec6d4ae75`.
  - [x] Record local browser privacy-evidence videos (ignored test artifacts).
  - [ ] Deploy to Preprod with a funded user-controlled test wallet.
  - [ ] Record public Preprod transaction references after successful deployment.
- [x] Documentation — rewrite README for the implemented Vulna MVP and verified Preview deployment.
- [ ] Submission readiness — add GitHub Actions CI, deploy the web UI with Vercel CLI, and produce screenshot-ready test output.
  - [x] Add CI workflow for install, typecheck, protocol tests, and production build.
  - [x] Deploy the web UI: `https://midnight-demo-app.vercel.app`.
  - [x] Run full test suite for submission screenshot (25 passing tests).
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
- [x] Phase 4: generated witnesses, six-circuit state-machine simulator, live local deploy, encrypted fixture commitment submission, and indexed-state confirmation.
- [x] Phase 5: encrypted reviewer-key state, separate-process chain-first decryption, live negative authorization/state proofs, acceptance, patch, and indexed confirmation.
- [x] Phase 6: signed local NIGHT transfer, recipient-wallet confirmation, researcher-only receipt acknowledgment, and indexed `PAID` state.
- [x] Phase 7: App Router production build, public route/sentinel HTML inspection, client-only encrypted draft preparation, and protocol/contract/indexer regression checks.
- [x] Phase 8: Chromium browser tests for CSP/security headers, public HTML, client encryption, requests, browser storage, and the plaintext sentinel.
- [x] Phase 9 (Preview evidence): full proof-backed harmless lifecycle and public indexer confirmation.

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
- Added typed Vulna providers/witnesses and a proof-backed local deployment fixture; consolidated lifecycle calls into three public, role-bounded dispatch circuits so the single contract fits the local node's verifier-key deployment limit.
- Added encrypted versioned reviewer-key state, role-isolated local proof contexts, and a live complete confidential lifecycle fixture.
- Added non-atomic receipt-linked settlement: salted recipient commitment, opaque SDK receipt hash, and researcher-only `PAID` acknowledgment.
- Added a strict Next.js App Router product shell with public bounty/audit pages, a client-only encrypted report composer, and plaintext-free reviewer/settlement boundary states.
- Added CSP/security headers, attachment disablement, unsaved draft protection, skip navigation, and Chromium sentinel regression coverage.
- Added the fictional-demo runbook, browser privacy-evidence instructions, and exact Preprod funding/deployment handoff.
- Enabled the proof-backed receipt-settlement lifecycle on public Preview/Preprod when a local private-state password is explicitly supplied; verified the harmless lifecycle on Preview.
- Rewrote the README around the implemented privacy boundary, active scripts, Preview contract, verified explorer link, explicit observer-visibility table, and MVP limitations.
- Added GitHub Actions verification and deployed the public fictional-demo UI with Vercel.

### Verified

- Compact 0.5.1/compiler 0.31.1.
- Docker node, indexer, and proof server healthy.
- Local contract deployed, transaction submitted, and ledger state indexed.
- `pnpm test`, `pnpm exec tsc --noEmit`, and `pnpm run compile` pass for Phase 1.
- Phase 2: `pnpm test` (7 protocol + 2 generated-contract simulator tests), `pnpm run build`, `pnpm run test:e2e`, and `git diff --check` pass.
- Phase 3: `pnpm test` (15 protocol/crypto/storage + 2 Compact simulator tests), `pnpm run build`, `pnpm run test:e2e`, `pnpm audit --prod --audit-level=high`, and `git diff --check` pass.
- Phase 4: `pnpm test` (17 protocol/crypto/witness + 2 Compact simulator tests), `pnpm run build`, `PRIVATE_STATE_PASSWORD=… pnpm run test:integration`, `pnpm run test:e2e`, and `git diff --check` pass.
- Phase 5: `pnpm test` (19 protocol/crypto/witness + 2 Compact simulator tests), `pnpm run build`, `PRIVATE_STATE_PASSWORD=… pnpm run test:integration`, `pnpm run test:e2e`, and `git diff --check` pass. Current indexed local contract: `0636cae28615b2be09989c086df9475532918f2f9d1608ba1046126dce0a3fea`.
- Phase 6: `pnpm test` (21 protocol/crypto/witness + 2 Compact simulator tests), `pnpm run build`, `PRIVATE_STATE_PASSWORD=… pnpm run test:integration`, `pnpm run test:e2e`, and `git diff --check` pass. Current indexed local contract: `48af20177f2c37004763a862bb1e82f8c5484c247dc93a08801fdb09819fc90f`.
- Phase 7: `pnpm test` (23 protocol/crypto/witness/UI + 2 Compact simulator tests), `pnpm run build`, `pnpm run test:e2e`, and `git diff --check` pass. All five static product routes returned HTTP 200 with no plaintext sentinel in server-rendered HTML.
- Phase 8: `pnpm run test:web` (2 Chromium browser tests), `pnpm test`, `pnpm run build`, `pnpm run test:e2e`, and `git diff --check` pass. Browser coverage confirms no sentinel in requests, public HTML, localStorage, sessionStorage, cookies, or ciphertext staged in IndexedDB.
- Phase 9 Preview evidence: `PRIVATE_STATE_PASSWORD=<Keychain secret> pnpm run setup -- --network preview` confirmed `PAID`; `pnpm run test:e2e` confirmed public indexer state for `2384e08752408e12632a56f93487ee6ff417aa0ca47ec6d6fd16b24ec6d4ae75`.
- README refresh: `pnpm run test:e2e`, Preview explorer HTTP 200, and `git diff --check` pass.
- Submission readiness: Vercel production URL returned HTTP 200 with CSP; local `pnpm test` passed 23 protocol/privacy and 2 Compact simulator tests.

### Risks

- `pnpm install` reports ignored optional dependency build scripts; re-check before browser/build work.
- Atomic shielded custody/refund remains unproven. The MVP records only an honestly labeled, transparent non-atomic settlement receipt.
- Compact/client commitment parity is explicitly deferred to Phase 2 generated-contract tests; no custom commitment primitive exists in application code.
- Local integration fixture is intentionally harmless; it uses isolated local role state but one dev wallet, so it does not prove multi-wallet UX.
- Current six-circuit ABI intentionally discloses a bounded action code; this matches the metadata distinct circuit names disclosed before consolidation.
- The CSP permits `wasm-unsafe-eval` for the installed Compact runtime only; it excludes third-party origins and ordinary `unsafe-eval`.
- Preprod deployment remains pending until a user-controlled Preprod wallet is funded. Preview confirmation is not a substitute.

### Follow-ups

- Phase 9 still needs funding for the Preprod generated wallet address before a public Preprod deployment can be attempted.
