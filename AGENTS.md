# AGENTS.md — Vulna

This file defines how coding agents must work in this repository. It is a binding implementation guide, not optional advice.

---

## 1. Mission

Build **Vulna**, a privacy-preserving vulnerability disclosure and bug-bounty protocol on Midnight Network.

The product must let a researcher commit a confidential report, selectively disclose it to an authorized reviewer, prove that a later disclosure matches the original commitment, and settle a bounty according to an on-chain state machine.

The product's primary security promise is:

> Vulnerability plaintext never goes on-chain and never reaches application infrastructure before client-side encryption.

Never weaken this promise for convenience.

---

## 2. Required reading order

Before modifying code:

1. Read `PLAN.md` completely.
2. Read `docs/PRIVACY_MODEL.md` and `docs/THREAT_MODEL.md` if present.
3. Read the current Midnight compatibility matrix and release notes.
4. Inspect the generated `create-mn-app` project and lockfile.
5. Inspect the official example closest to the task:
   - Private state/witnesses: election, private guest list, Battleship, or leaderboard.
   - DApp-specific identity/access control: private reserve auction or private party.
   - Token operations: shielded/unshielded token transfer example.
   - Provider setup: current Midnight.js provider guide.
6. Read existing tests before editing contract behavior.

Do not begin with a framework rewrite or dependency upgrade.

---

## 3. Source of truth

Use this priority order:

1. Current compiler behavior and generated types.
2. Current official Midnight compatibility matrix.
3. Current official Midnight documentation and examples.
4. Existing repository tests and protocol decision records.
5. `PLAN.md`.
6. Agent assumptions.

If a plan item is incompatible with the current SDK, do not invent an API. Document the mismatch, implement the closest correct design, and update the relevant docs.

Never copy code from an outdated blog post without verifying it against the installed package versions.

---

## 4. Working method

For every non-trivial task:

1. State the intended change in the task notes.
2. Identify the privacy boundary affected.
3. Identify contract invariants affected.
4. Inspect relevant generated types and official example code.
5. Make the smallest coherent implementation.
6. Add or update tests in the same change.
7. Run the narrowest tests first.
8. Run all affected checks.
9. Review the diff for plaintext leakage and accidental disclosure.
10. Update documentation when behavior or privacy claims change.

Do not make broad speculative changes. Do not “clean up” unrelated files while implementing a feature.

---

## 5. Non-negotiable privacy rules

### Never send plaintext reports to a server

The following must occur in the browser before upload:

- Canonicalization.
- Report digest computation.
- Attachment hashing.
- Content-key generation.
- Report encryption.
- Reviewer key wrapping.

Server routes, server actions, storage adapters, and observability systems may receive ciphertext and safe public metadata only.

### Never store plaintext reports in unsafe browser storage

Forbidden:

- `localStorage`.
- `sessionStorage`.
- URL query parameters.
- URL fragments.
- cookies.
- service-worker caches.
- Redux/Zustand persistence.
- React Query persistence.
- browser logs.

Plaintext may exist only in component-local memory for the minimum time required and in an explicitly encrypted local draft store.

### Never log secrets

Never log:

- Report text.
- Attachment contents or names.
- Content keys.
- Private encryption keys.
- Commitment salts.
- Researcher app secret.
- Witness inputs.
- Decrypted reviewer notes.
- Full ciphertext.

Sanitize thrown provider errors before presenting or recording them.

### Never disclose a value implicitly

Before using `disclose`, writing a ledger field, returning from an exported circuit, making a contract-to-contract call, or sending an unshielded token, document why the value may be public.

A value being a hash does not automatically make publication safe. Consider dictionary attacks, correlation, uniqueness, and metadata leakage.

### Do not promise impossible privacy

Do not claim:

- The authorized reviewer cannot leak a decrypted report.
- Network metadata is hidden.
- A ZK proof verifies that a vulnerability is real.
- A commitment prevents semantic duplicate reports.
- A transparent payout is shielded.
- Off-chain settlement is trustless.

Product copy must match implementation exactly.

---

## 6. Cryptography rules

- Use audited, maintained cryptographic libraries.
- Preferred browser library: `libsodium-wrappers-sumo`.
- Preferred payload cipher: XChaCha20-Poly1305 IETF.
- Preferred reviewer key wrapping: Curve25519 sealed boxes or the documented equivalent.
- Generate a fresh random content key for every report revision.
- Generate fresh nonces as required by the selected primitive.
- Never derive encryption keys from wallet addresses, report contents, salts, or user passwords.
- Use authenticated additional data to bind ciphertext to protocol context.
- Use domain-separated commitments.
- Use the exact Compact-compatible hash/commitment primitive exposed by the installed runtime.
- Never implement a custom cipher, PRNG, signature algorithm, or key derivation function.
- Never silently fall back to plaintext.
- On cryptographic failure, fail closed and preserve the previous valid state.

All crypto formats must include an explicit schema and algorithm version.

---

## 7. Canonicalization rules

Protocol commitments depend on deterministic bytes.

- Use one canonical serializer from `packages/crypto`.
- Normalize strings to Unicode NFC.
- Normalize line endings to `\n`.
- Use UTF-8.
- Use stable object-key ordering.
- Preserve array order unless the schema says otherwise.
- Reject `undefined`, functions, symbols, non-finite numbers, and ambiguous values.
- Do not call raw `JSON.stringify` as the protocol definition.
- Do not change canonicalization after release without introducing a new schema version.
- Add test vectors for every schema version.

Any change to canonicalization requires:

1. A new version identifier or a proof of byte-for-byte compatibility.
2. Updated fixtures.
3. Cross-runtime tests.
4. Migration notes.

---

## 8. Smart-contract rules

### General

- Keep the MVP in one Compact contract unless a demonstrated limitation requires separation.
- Prefer fixed-size hashes and bounded integers over strings.
- Keep circuits small and explicit.
- Avoid storing data that can safely remain off-chain.
- Use assertions for every authorization and state-transition invariant.
- Check arithmetic bounds.
- Consume nullifiers exactly once.
- Prevent double payout.
- Prevent invalid backwards state transitions.
- Do not trust client timestamps.
- Use an officially supported block/time primitive only after confirming its semantics in the installed release.

### Access control

Use the current official DApp-specific identity or signature pattern. Do not use a raw UI wallet address comparison as the only authorization mechanism unless the official contract model requires and validates it.

Privileged actions:

- Bounty owner: fund, configure before opening, mark patched, cancel under valid conditions.
- Reviewer: acknowledge access, request more information, accept, reject.
- Researcher proof holder: append encrypted supplements where allowed, claim rewards, withdraw where allowed, and reveal commitments.

Every privileged circuit needs positive and negative tests.

### Witnesses

Witnesses must:

- Read account-scoped private state.
- Return only the values required by the circuit.
- Reject missing state.
- Never call remote services.
- Never log inputs.
- Never generate a replacement secret when one is missing.

A missing commitment opening is a recovery problem, not a reason to manufacture a new opening.

### Public returns and ledger writes

Treat these as public. Review each one for metadata leakage. Prefer status codes and commitments over free text.

### Token handling

- Do not use DUST as bounty principal; it is a non-transferable gas/capacity resource.
- Use a currently supported NIGHT or custom test-token flow.
- Clearly distinguish shielded and unshielded transfers.
- If payout settlement is not atomic, label it and represent it as a receipt-linked fallback.
- Never claim escrow before custody and refund paths are tested.

---

## 9. State-machine rules

Use explicit enums and centralized transition guards.

Valid submission path:

```text
Committed
  -> AccessGranted
  -> UnderReview
  -> NeedsMoreInfo -> UnderReview
  -> Accepted
  -> Patched
  -> Paid
  -> Disclosed (optional)
```

Alternative terminal paths:

```text
UnderReview -> Rejected
Committed -> Withdrawn
NeedsMoreInfo -> Withdrawn
```

Do not permit transitions by setting a status field directly from UI code. Contract circuits are authoritative.

Required invariants:

- One submission cannot be paid twice.
- One bounty cannot have more than one paid winner in MVP.
- A rejected submission cannot become accepted.
- A withdrawn submission cannot re-enter review.
- A paid bounty cannot be cancelled or refunded.
- The accepted submission must belong to the bounty.
- A patch cannot be recorded before acceptance.
- A reveal must open the original commitment and prove the stored researcher ownership commitment.
- Supplements must be append-only and must not mutate the original report commitment.
- A nullifier can appear only once.
- Escrow outflow cannot exceed funded amount.

---

## 10. Storage rules

The storage layer is untrusted.

Before upload:

- Encrypt locally.
- Compute local artifact hash.
- Compute key-envelope hash.

After upload:

- Fetch or verify the returned content bytes where practical.
- Confirm their hash matches the local artifact hash.
- Only then submit the on-chain reference.

Before decryption:

- Download ciphertext.
- Verify its hash against chain state.
- Verify envelope metadata and recipient key ID.
- Then decrypt.

Storage adapters may not inspect, transform, compress, or reserialize ciphertext unless the resulting byte identity and hash behavior are explicitly designed for it.

---

## 11. Attachment safety

Reports may contain hostile attachments.

MVP restrictions:

- Allow text, images, PDFs, and inert archives only if required.
- Enforce a strict total byte limit.
- Never render HTML attachments.
- Never execute JavaScript, binaries, macros, or proof-of-concept scripts.
- Do not auto-open PDFs in an embedded privileged context.
- Use sandboxed preview or download-as-file behavior.
- Strip or avoid server-side previews.
- Display hashes and media types.

The demo must use harmless text files or images only.

---

## 12. Frontend rules

- Use Next.js App Router and strict TypeScript.
- Use server components for public read-only pages when safe.
- Use client components for wallet, proof, encryption, private-state, and decryption flows.
- Never pass report plaintext through server-component props.
- Never put report plaintext into server actions.
- Keep sensitive state component-local.
- Use React Hook Form + Zod for report forms.
- Provide explicit progress states for encryption, upload, proof generation, submission, and indexer confirmation.
- Do not show success until indexed contract state confirms it.
- Handle wallet account and network changes.
- Do not hide proof-generation latency behind fake completion.
- Maintain keyboard navigation and accessible labels.
- Respect reduced-motion preferences.

### Required privacy indicators

The report flow must visibly progress through:

```text
Local draft
Encrypted locally
Ciphertext uploaded
Commitment submitted
Confirmed on Midnight
```

Never use a generic “Uploaded” label before encryption is complete.

---

## 13. Provider and wallet rules

- Build providers in one factory module.
- Do not instantiate competing provider stacks throughout the UI.
- Use environment-specific configuration validated at startup.
- Use the DApp Connector API recommended for the installed release.
- Use account-scoped private-state storage.
- Treat wallet disconnect, lock, account change, and network change as first-class events.
- Abort or restart a transaction flow when the account changes.
- Re-query chain state before submitting after long proof-generation work.
- Surface actionable wrong-network errors.
- Never print seed phrases, private keys, or raw wallet API objects.

---

## 14. Data and schema rules

- Zod schemas are the boundary for all untrusted web data.
- Compact-generated types are the boundary for contract calls.
- Do not use `any` around contract clients.
- Store integer token values as `bigint`; format only at the UI boundary.
- Never use floating-point arithmetic for rewards.
- Use explicit decimal conversion utilities for token display.
- Version all stored report, envelope, private-state backup, and public metadata schemas.
- Reject unsupported future schema versions safely.

---

## 15. Error-handling rules

- Use typed domain errors.
- Map provider errors to sanitized user-facing codes.
- Never expose stack traces in production UI.
- Never include sensitive values in an error message.
- Preserve original error causes only in local development after sanitization.
- Do not retry contract writes automatically.
- Safe automatic retry is allowed for idempotent public reads and ciphertext downloads.
- On uncertain transaction state, query the indexer before offering retry.

Forbidden pattern:

```ts
throw new Error(`Could not encrypt report: ${JSON.stringify(report)}`);
```

Required pattern:

```ts
throw new VulnaError("ENCRYPTION_FAILED", "The report could not be encrypted.", {
  cause: sanitizeError(error),
});
```

---

## 16. Testing requirements

No feature is complete without tests.

### Contract changes

Must include:

- Happy path.
- Unauthorized caller.
- Wrong state.
- Boundary values.
- Replay/double action.
- Privacy review of outputs.

### Crypto changes

Must include:

- Deterministic fixtures where expected.
- Randomized round trips.
- Wrong key.
- Tampered nonce.
- Tampered ciphertext.
- Tampered associated data.
- Wrong recipient envelope.
- Schema version rejection.

### UI changes

Must include the most appropriate combination of:

- Component tests.
- Playwright flow.
- Accessibility assertions.
- Loading and error states.
- Wallet/account change behavior.

### Plaintext leak test

Maintain a sentinel string such as:

```text
VULNA_PRIVATE_SENTINEL_7F3A
```

End-to-end tests must fail if this value appears in:

- Network request bodies.
- Server logs.
- localStorage.
- sessionStorage.
- cookies.
- public page HTML.
- analytics calls.
- indexed public contract state.

It may appear only in the researcher's in-memory editor and the authorized reviewer's decrypted in-memory view during the test.

---

## 17. Verification commands

Use scripts from the repository's actual `package.json`. Keep these logical checks available even if exact script names differ:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm test:integration
pnpm test:e2e
pnpm build
```

For every completed task, report:

- Commands run.
- Tests passed.
- Tests skipped and why.
- Any environment dependency not available.

Do not say “all tests pass” unless they were actually run.

---

## 18. Build order

Agents must follow this order unless a concrete blocker is documented:

1. Official scaffold runs.
2. Contract simulator spike works.
3. Protocol schemas and test vectors are frozen.
4. Contract state machine passes simulator tests.
5. Client encryption and separate-context decryption work, including reviewer verification of encrypted commitment openings.
6. Real proof-backed submission and researcher ownership proof work.
7. Reviewer state transition works.
8. Payout or honest settlement fallback works.
9. UI is completed.
10. Security hardening and demo polish.

Do not build polished dashboards before the private proof and encryption path works.

---

## 19. Task completion template

Use this checklist in pull requests or task notes:

```md
## Change
- What was implemented?

## Privacy boundary
- What remains private?
- What became public?
- Why is each disclosure necessary?

## Contract invariants
- Which transitions or invariants changed?

## Tests
- [ ] Unit
- [ ] Compact simulator
- [ ] Integration
- [ ] E2E
- [ ] Plaintext sentinel

## Verification
- Commands and results

## Remaining risk
- Known limitation or follow-up
```

---

## 20. Prohibited shortcuts

Do not:

- Put the report in IPFS unencrypted.
- Put the report digest on-chain before intended disclosure without analyzing dictionary risk.
- Store report plaintext in a database “temporarily.”
- Use base64 as encryption.
- Use wallet signatures as encryption.
- Build custom cryptography.
- Trust a storage provider's claimed hash without local verification.
- Trust client timestamps for deadlines.
- Use floating-point token math.
- Skip negative authorization tests.
- Mock a successful payout in production code.
- fake transaction hashes.
- mark a transaction confirmed before indexer confirmation.
- call transparent settlement shielded.
- auto-execute proof-of-concept code.
- introduce third-party analytics on report or reviewer routes.
- weaken CSP to make a UI library easier to use.
- swallow a cryptographic or contract error and continue.

---

## 21. Dependency policy

- Prefer dependencies already present in the official scaffold.
- Add a dependency only when it materially reduces risk or complexity.
- Record why security-sensitive dependencies are needed.
- Pin versions through the lockfile.
- Do not upgrade the Midnight package family independently; maintain a documented compatible set.
- Run package audit tools, but manually assess findings in build tooling and cryptographic paths.
- Never replace an official provider package with an unverified wrapper for convenience.

---

## 22. Documentation policy

Update docs when:

- A public/private field changes.
- A circuit is added or removed.
- A state transition changes.
- The payout privacy model changes.
- An encryption format changes.
- A known threat is discovered.
- Setup commands change.

Required docs before demo:

- `README.md`
- `PLAN.md`
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/PRIVACY_MODEL.md`
- `docs/THREAT_MODEL.md`
- `docs/DEMO.md`

Architecture and privacy docs must use precise language, not marketing claims.

---

## 23. Demo safety

- Use a fictional target.
- Use a harmless mocked vulnerability.
- Do not scan, exploit, or test a real service.
- Do not include real credentials, customer data, or secrets.
- Use test assets only.
- Seed a deterministic fallback demo.
- Record a backup video after the full flow succeeds.

---

## 24. Stop conditions

Stop and reassess before proceeding when:

- A proposed value's public/private status is unclear.
- Current SDK behavior conflicts with assumptions.
- A cryptographic primitive is unsupported in both client and contract environments.
- Contract custody or refund semantics are unverified.
- A change would send plaintext through server infrastructure.
- A test reveals a sentinel leak.
- An unauthorized account can trigger a privileged transition.
- Generated types are being bypassed with casts.

Resolve the underlying design issue. Do not patch around it with `any`, disabled tests, or misleading UI.

---

## 25. Final quality bar

A change is acceptable only when it is:

- Correct against the installed Midnight release.
- Explicit about privacy boundaries.
- Tested at the appropriate layer.
- Strictly typed.
- Minimal and reviewable.
- Honest about limitations.
- Free of plaintext leakage.
- Reproducible from a clean checkout.

The strongest demo is not the one with the most features. It is the one that makes one confidential disclosure lifecycle work reliably and proves exactly what remained private.
