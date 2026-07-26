# Vulna — Phase Plan

## Category

**Single-select choice: Dev tooling.**

Vulna is security workflow infrastructure for software teams and vulnerability researchers. Confidential reporting, reviewer authorization, commitment verification, and patch coordination are the core product. Escrow and payouts support that workflow; they do not make the product primarily DeFi or Payments.

Secondary positioning: privacy-preserving security tooling with on-chain settlement.

## Current baseline

Phase 0 is complete: Vulna now has a generated Midnight scaffold, pinned `pnpm-lock.yaml`, local Docker devnet, compiled Compact contract, generated bindings, and a verified local deploy/call/indexer read. See `docs/COMPATIBILITY.md`.

As checked on 2026-07-26, the official compatibility matrix lists:

| Component | Latest tested version |
| --- | ---: |
| Compact devtools | 0.5.1 |
| Compact compiler | 0.31.1 |
| Compact runtime | 0.16.0 |
| Compact JS | 2.5.1 |
| Platform JS | 2.2.4 |
| Midnight.js | 4.1.1 |
| testkit-js | 4.1.1 |
| DApp Connector API | 4.0.1 |
| Midnight Indexer | 4.3.3 |
| Proof server | 8.1.0 |

The quickstart still names Compact compiler `0.31.0`, while the newer compatibility matrix names `0.31.1`. Follow this source order:

1. Generated scaffold and compiler behavior.
2. Current compatibility matrix.
3. Current official docs/examples.
4. This plan.

Do not manually assemble or independently upgrade the Midnight package family.

## MVP cut

Required:

- One project owner.
- One separately modeled reviewer.
- One researcher proof holder.
- One bounty and one paid winner.
- Browser-only canonicalization, hashing, encryption, and reviewer key wrapping.
- Ciphertext-only storage.
- Report, severity, ownership, and nullifier commitments.
- Reviewer-side local decryption and commitment verification.
- Contract-enforced review, patch, payout, withdrawal, and optional reveal states.
- Supported test asset escrow, or an honestly labeled receipt-linked fallback.
- Public audit timeline containing safe metadata only.
- Sentinel leak test and a harmless fictional demo.

Deferred:

- Multi-reviewer quorum.
- Arbitration.
- Private reputation.
- Invite-only scopes.
- Semantic duplicate detection.
- Cross-chain payouts.
- Production identity/KYC.
- Active proof-of-concept execution.
- Rich attachment preview.

## Delivery rule

Phases are dependency-gated. Do not start polished UI work before the proof-backed private submission and separate-context decryption path works.

## Phase 0 — Official scaffold and toolchain proof

**Goal:** prove the current Midnight stack works before Vulna-specific code.

### Work

- Scaffold the current official `hello-world` contract template in a temporary sibling directory using `create-mn-app@latest`.
- Preserve the generated dependency set, scripts, provider patterns, and lockfile while adapting it into this repository.
- Record Node, Docker, Compact, proof-server, Midnight.js, testkit, connector, and indexer versions.
- Start local node, indexer, and proof server.
- Compile generated Compact code and inspect generated TypeScript types.
- Deploy one contract, call one circuit, and query indexed ledger state.
- Add one account-scoped local witness using dummy data.
- Inspect current official examples:
  - Leaderboard: private ownership proof and browser integration.
  - Private guest list/private reserve auction: DApp-specific identity and role checks.
  - Token transfers: shielded/unshielded NIGHT behavior.
  - Provider guide: one provider factory.

### Privacy boundary

- Use dummy values only.
- Identify which witness values remain private and which circuit values become public through `disclose`, returns, and ledger writes.

### Likely files

- Generated scaffold files.
- `package.json`
- lockfile
- `pnpm-workspace.yaml` if retained by chosen scaffold shape.
- `docs/COMPATIBILITY.md`
- `README.md`

### Verification

- Clean install using the generated lockfile.
- Contract compile.
- Generated type inspection.
- Local deploy/call/read.
- One proof-backed transaction.
- One witness failure test for missing private state.

### Gate

- Clean checkout reproduces the generated example end to end.
- Actual scripts and versions are documented.
- No casts bypass generated contract types.

## Phase 1 — Freeze protocol and privacy specification

**Goal:** settle protocol decisions before contract implementation.

### Work

- Create `docs/ARCHITECTURE.md`, `docs/PRIVACY_MODEL.md`, and `docs/THREAT_MODEL.md`.
- Inventory every public, private, encrypted, and local-only value.
- Freeze:
  - `vulna.report.v1`
  - `vulna.review-package.v1`
  - `vulna.encrypted-report.v1`
  - encrypted private-state backup v1
  - public metadata v1
- Define deterministic canonicalization:
  - UTF-8
  - Unicode NFC
  - `\n` line endings
  - stable object-key ordering
  - preserved array order
  - rejection of ambiguous values
- Freeze domain separators and cross-runtime commitment vectors.
- Freeze bounty/submission enums and centralized transition table.
- Define owner, reviewer, and researcher-proof authorization.
- Decide through an ADR:
  - NIGHT vs supported custom test asset.
  - Atomic custody vs receipt-linked fallback.
  - `ACCEPTANCE` vs `PATCH` payout policy.
  - Supported block/time semantics, or no time-based behavior in MVP.
- Freeze attachment allowlist and total-size limit.
- Define typed, sanitized error codes.

### Privacy boundary

- Public: safe bounty metadata, scope hash, reward terms, reviewer key identifier, commitments, artifact/envelope hashes, status, accepted severity, patch commitment, payout receipt, optional revealed digest.
- Private: report body, attachments, salts, openings, app secret, content key, reviewer private key, private notes, rejected-report contents.
- Explain dictionary/correlation risk for every published hash.

### Contract invariants

- Central transition table is authoritative.
- One nullifier use.
- One paid winner.
- No rejected/withdrawn state revival.
- No patch before acceptance.
- No double payout/refund.
- Reveal must prove original commitment and researcher ownership.
- Supplements append; never mutate original commitment.
- Escrow outflow never exceeds funding.

### Likely files

- `packages/shared/src/schemas.ts`
- `packages/shared/src/domain.ts`
- `packages/crypto/src/canonicalize.ts`
- `packages/crypto/test/vectors/*`
- `docs/ARCHITECTURE.md`
- `docs/PRIVACY_MODEL.md`
- `docs/THREAT_MODEL.md`
- `docs/adr/*`

### Verification

- Canonicalization vectors cover Unicode, line endings, key order, arrays, invalid values, and large integer strings.
- TypeScript and Compact-compatible hashing produce identical fixtures.
- Every ledger field/output has a written privacy justification.

### Gate

- Schemas, vectors, transitions, authorization, payout strategy, and public/private field inventory are reviewed and frozen.

## Phase 2 — Compact state machine in simulator

**Goal:** enforce protocol lifecycle before network/UI integration.

### Work

- Keep one MVP Compact contract.
- Implement explicit bounty/submission enums and transition guards.
- Implement:
  - `createBounty`
  - `fundBounty` state placeholder if token custody is deferred
  - `submitDisclosure`
  - `acknowledgeAccess`
  - `requestMoreInfo`
  - `addEncryptedSupplement`
  - `acceptDisclosure`
  - `rejectDisclosure`
  - `withdrawSubmission`
  - `markPatched`
  - payout authorization/claim state without pretending funds moved
  - `revealReport`
  - `cancelBounty`
- Use installed Compact primitives for persistent commitments/hashes.
- Use fixed-size hashes and bounded integers.
- Add owner/reviewer DApp-specific authorization.
- Keep witness inputs minimal and account-scoped.
- Review every `disclose`, public return, and ledger write.

### Privacy boundary

- Never disclose report digest, salts, severity claim before acceptance, app secret, content key, or reviewer private key.
- Public reason values are bounded codes; never free text.

### Tests

- Happy path for every circuit.
- Unauthorized owner/reviewer/researcher.
- Wrong state and invalid transition.
- Reused nullifier.
- Wrong commitment opening.
- Wrong ownership secret.
- Double accept/payout/refund/action.
- Boundary reward values and arithmetic overflow/underflow.
- Reveal mismatch.
- Supplement head mismatch.
- Privacy review of all outputs.

### Likely files

- `contracts/vulna/src/vulna.compact`
- `contracts/vulna/src/witnesses.ts`
- generated bindings
- `contracts/vulna/test/simulator/*`

### Gate

- All simulator tests pass.
- Every privileged circuit has positive and negative authorization tests.
- State cannot be mutated directly from UI/client helpers.

## Phase 3 — Client crypto and ciphertext storage

**Goal:** prove end-to-end confidentiality without blockchain integration.

### Work

- Implement canonical report/package serialization.
- Add reviewer Curve25519 encryption key generation, fingerprint, and versioning.
- Generate fresh random content key per report/revision.
- Encrypt package using XChaCha20-Poly1305 IETF.
- Seal content key to reviewer key using maintained libsodium APIs.
- Bind schema, bounty ID, report commitment, and reviewer key version as authenticated data.
- Hash local ciphertext bytes and envelope.
- Build provider-neutral ciphertext storage interface plus local adapter.
- Upload ciphertext only; fetch and verify returned bytes.
- Implement encrypted, account-scoped local private-state storage and backup/restore.
- Persist opening/recovery data before allowing chain submission.

### Privacy boundary

- Plaintext exists only in component-local memory and authorized reviewer memory.
- No plaintext in server routes/actions, URLs, logs, global stores, browser persistence, or service-worker cache.
- Storage sees ciphertext and safe public metadata only.

### Tests

- Deterministic canonicalization fixtures.
- Randomized encryption round trips.
- Wrong key/recipient.
- Tampered nonce, ciphertext, associated data, envelope, and storage bytes.
- Unsupported/future schema version.
- Reviewer key rotation preserves old-envelope access.
- Separate browser/process contexts: researcher encrypts; reviewer decrypts.
- Sentinel absent from network request bodies and storage.

### Likely files

- `packages/crypto/src/*`
- `packages/crypto/test/*`
- `packages/storage/src/*`
- `packages/storage/test/*`
- `packages/midnight/src/private-state.ts`

### Gate

- Wrong/tampered inputs fail closed.
- Storage can never receive plaintext through its typed API.
- Separate-context reviewer recomputes commitments matching researcher output.

## Phase 4 — Real proof-backed researcher submission

**Goal:** connect crypto output to Midnight without leaking openings.

### Work

- Build one environment-validated provider factory.
- Integrate current DApp Connector API and wallet lifecycle.
- Build strictly typed contract client from generated types.
- Implement account-scoped private-state/witness provider.
- Deploy/connect contract.
- Submit report, severity, ownership, and nullifier commitments using real proof generation.
- Query indexer for authoritative confirmation.
- Handle wallet disconnect/lock, account switch, network switch, proof timeout, and uncertain transaction state.
- Re-query bounty state after long proof generation and before submission.
- Never auto-retry writes.

### Privacy boundary

- Witnesses read locally; no remote calls/logging.
- Chain receives commitments/hashes/status only.
- Indexer confirmation, not wallet submission response, triggers success.

### Tests

- Real proof-backed valid submission.
- Missing/wrong account private state.
- Wrong network.
- Account change during encryption/proving.
- Bounty closes during proof generation.
- Indexer lag and uncertain transaction lookup.
- Reconnect restores public state without changing secrets.

### Likely files

- `packages/midnight/src/providers.ts`
- `packages/midnight/src/wallet.ts`
- `packages/midnight/src/contract-client.ts`
- `packages/midnight/src/network.ts`
- `contracts/vulna/test/integration/*`

### Gate

- Encrypted artifact exists.
- On-chain commitment is indexed.
- Public observers cannot derive report plaintext/openings.
- Researcher can prove ownership after reconnect.

## Phase 5 — Reviewer lifecycle and patch flow

**Goal:** complete confidential review in a separate authorized context.

### Work

- Register/version reviewer encryption public key.
- Retrieve ciphertext and verify artifact/envelope hashes before decryption.
- Verify recipient key ID, then decrypt locally.
- Recompute canonical digest, report commitment, and severity commitment.
- Compare all values with indexed chain state.
- Implement reviewer transitions:
  - acknowledge access
  - request more info
  - accept
  - reject
- Implement append-only encrypted supplement flow.
- Implement owner-only patch commitment.
- Use safe text-only preview; attachments download as inert files.

### Privacy boundary

- Reviewer plaintext never enters server components/actions or analytics.
- Acknowledgement proves access action, not vulnerability validity.
- Rejected reports remain encrypted/private.

### Tests

- Authorized reviewer success.
- Unauthorized wallet cannot fetch protected key material or transition state.
- Wrong reviewer key.
- Artifact/envelope/opening mismatch.
- Invalid supplement chain.
- Rejected/withdrawn state cannot revive.
- Patch before acceptance fails.

### Likely files

- `apps/web/features/reviewer/*`
- `apps/web/features/disclosures/*`
- contract integration tests
- crypto integration tests

### Gate

- Researcher and reviewer complete flow in separate contexts.
- Reviewer independently verifies original commitment.
- Unauthorized transitions fail.

## Phase 6 — Funding and settlement

**Goal:** move real test funds, or expose an honest non-atomic fallback.

### Work

- Run a focused token-custody spike using current official shielded/unshielded transfer APIs.
- Use NIGHT or a supported custom test token; never DUST.
- If supported correctly:
  - fund contract custody
  - verify balance
  - claim only by accepted researcher proof holder
  - refund only through valid cancellation
- If blocked:
  - keep on-chain payout authorization
  - execute separate wallet transfer
  - bind payout receipt hash to submission
  - label settlement non-atomic and not trustless
- Expose public/shielded boundaries accurately.

### Contract invariants

- Amount uses bounded integers/`bigint`; no floating point.
- No overfund/underflow.
- No payout before configured state.
- Recipient cannot be redirected by owner.
- No double payout/refund.
- Paid bounty cannot cancel/refund.

### Tests

- Funding, insufficient balance, exact balance.
- Authorized payout and refund.
- Unauthorized recipient/change attempt.
- Double payout/refund.
- Accepted submission belongs to bounty.
- Shielded/unshielded disclosure review.

### Likely files

- contract token circuits
- `apps/web/features/payouts/*`
- `packages/midnight/src/tokens.ts`
- settlement integration tests
- payout ADR/privacy docs

### Gate

- Funding plus payout/refund works end to end, or fallback is visibly and technically non-atomic.
- Product copy exactly matches implemented privacy/custody.

## Phase 7 — Vertical-slice product UI

**Goal:** expose the proven lifecycle without changing protocol authority.

### Work

- Build:
  - landing page
  - bounty explorer/details
  - create/fund bounty
  - local report composer
  - researcher dashboard
  - reviewer inbox/safe preview
  - patch/payout
  - public audit timeline
  - optional reveal
- Use Next.js App Router + strict TypeScript.
- Keep sensitive flows in client components.
- Use React Hook Form + Zod.
- Show real progress:
  - Local draft
  - Encrypted locally
  - Ciphertext uploaded
  - Commitment submitted
  - Confirmed on Midnight
- Abort/restart sensitive transaction flows on account/network change.
- Require high-friction confirmation before irreversible disclosure.

### Privacy boundary

- Never pass plaintext via server-component props or server actions.
- Never persist plaintext through Zustand, React Query, storage, cookies, or URL.
- Public timeline includes safe protocol metadata only.

### Tests

- Component validation/loading/error states.
- Keyboard navigation and accessible labels.
- Reduced motion.
- Wallet/account/network changes.
- No success before indexer confirmation.
- Public observer cannot access reviewer plaintext.

### Gate

- Full lifecycle works without console intervention.
- No critical accessibility findings.
- Desktop composer works; mobile viewing remains usable.

## Phase 8 — Security, recovery, and E2E hardening

**Goal:** prove security promise, failure behavior, and recoverability.

### Work

- Add strict CSP/security headers.
- Remove third-party analytics from report/reviewer routes.
- Centralize typed errors and sanitization.
- Audit logs, thrown errors, telemetry, network payloads, HTML, browser storage, cookies, and indexed state.
- Enforce attachment allowlist/size limits and inert preview/download.
- Test encrypted private-state export/import and missing-state recovery messaging.
- Run dependency audit; manually assess crypto/build-path findings.
- Review every public field for metadata leakage.

### Sentinel test

Use `VULNA_PRIVATE_SENTINEL_7F3A`. Fail if found in:

- Network request bodies.
- Server logs.
- `localStorage`.
- `sessionStorage`.
- Cookies.
- Public HTML.
- Analytics.
- Indexed public state.

Allowed only in researcher editor memory and authorized reviewer decrypted memory.

### Verification

- Unit.
- Compact simulator.
- Integration/local network.
- Browser E2E with separate researcher/reviewer contexts.
- Typecheck.
- Lint.
- Production build.
- Diff review for plaintext leakage and unrelated changes.

### Gate

- No sentinel leak.
- No unauthorized privileged transition.
- No generated-type bypass.
- Crypto failures preserve prior valid state and fail closed.

## Phase 9 — Preprod, documentation, and demo

**Goal:** reproducible, judge-ready confidential disclosure lifecycle.

### Work

- Deploy supported build to Preprod.
- Seed fictional `Acme Notes` bounty and harmless mock authorization issue.
- Run create → encrypt → upload ciphertext → commit → decrypt/verify → accept → patch → settle → optional reveal.
- Create:
  - `README.md`
  - `docs/ARCHITECTURE.md`
  - `docs/PRIVACY_MODEL.md`
  - `docs/THREAT_MODEL.md`
  - `docs/DEMO.md`
  - architecture/privacy diagram
- Record backup demo video only after full flow succeeds.
- Prepare concise limitations:
  - reviewer can leak decrypted data
  - network metadata is not hidden
  - ZK does not prove vulnerability validity
  - nullifier does not prevent semantic duplicates
  - transparent/non-atomic payouts are not shielded/trustless

### Gate

- Fresh-machine setup succeeds.
- Full demo succeeds twice from clean state.
- All required checks pass.
- Public can see audit trail but not sentinel/report plaintext.
- Privacy boundary is explainable in under two minutes.

## Cross-cutting completion checklist

Every non-trivial change records:

1. Intended change.
2. Privacy boundary affected.
3. Contract invariants affected.
4. Official example/generated types inspected.
5. Tests added.
6. Commands/results.
7. Plaintext-leak review.
8. Documentation changes.
9. Remaining risk.

Stop immediately if:

- Public/private status is unclear.
- Installed SDK contradicts design.
- Required crypto primitive is unsupported.
- Custody/refund semantics remain unverified.
- Plaintext reaches infrastructure.
- Sentinel leaks.
- Unauthorized transition succeeds.
- Generated types require unsafe casts.

## Current official references

- [Compatibility matrix](https://docs.midnight.network/relnotes/support-matrix)
- [Latest stable release](https://docs.midnight.network/relnotes/overview)
- [`create-mn-app` quickstart](https://docs.midnight.network/getting-started/quickstart)
- [Leaderboard ownership-proof DApp](https://docs.midnight.network/examples/dapps/leaderboard)
- [Private guest-list contract](https://docs.midnight.network/examples/contracts/private-guest-list)
- [Private reserve-auction contract](https://docs.midnight.network/examples/contracts/private-reserve-auction)
- [Shielded/unshielded token transfers](https://docs.midnight.network/examples/contracts/token-transfers)
- [Provider configuration](https://docs.midnight.network/guides/configure-providers)

## Suggested milestone mapping

| Milestone | Phases | Outcome |
| --- | --- | --- |
| M0: Stack proof | 0 | Current scaffold compiles, deploys, proves, indexes |
| M1: Protocol core | 1–2 | Frozen schemas + simulator-safe state machine |
| M2: Confidential path | 3–4 | Ciphertext-only storage + real proof-backed submission |
| M3: Complete lifecycle | 5–6 | Review, patch, payout/fallback |
| M4: Product | 7 | Usable vertical-slice UI |
| M5: Release | 8–9 | Leak-tested, documented Preprod demo |
