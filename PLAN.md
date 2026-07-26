# Vulna — Build Plan

> A privacy-preserving vulnerability disclosure and bug-bounty protocol on Midnight Network.
>
> Working name: **Vulna**
> Product principle: **prove the disclosure, not the exploit.**

---

## 1. Executive summary

Vulna lets software projects publish funded security bounties and lets researchers submit vulnerability reports without placing exploit details, reproduction steps, identities, or sensitive attachments on a public ledger.

The protocol combines:

- **Midnight Compact contracts** for publicly verifiable bounty state, access-control decisions, commitments, dispute-safe state transitions, and payout conditions.
- **Local private state and zero-knowledge proofs** for proving ownership of a committed disclosure without revealing its private preimage.
- **Client-side encryption** for selectively sharing the actual report with approved reviewers.
- **Content-addressed encrypted storage** for transporting encrypted reports without trusting the storage provider with plaintext.
- **Shielded payout support**, where feasible with the selected Midnight asset and current SDK, so a researcher can receive a reward without unnecessarily exposing their payment identity.

The MVP must demonstrate one complete story:

1. A project creates and funds a bounty.
2. A researcher creates a vulnerability report locally.
3. The browser encrypts the report before upload.
4. A commitment to the report is recorded on Midnight.
5. Only the authorized reviewer can decrypt the report.
6. The reviewer accepts or rejects the submission.
7. The project marks the issue as patched.
8. The contract releases the reward under the defined policy.
9. The researcher can optionally reveal the report later and prove it matches the original timestamped commitment.

The protocol must never claim that zero-knowledge proofs can determine whether a vulnerability is genuinely exploitable or correctly scored. Human or tool-assisted review still makes that judgment. Midnight proves protocol facts such as commitment ownership, authorized state transitions, non-reuse of a submission identity, and consistency between a later disclosure and the original commitment.

---

## 2. Problem

Traditional vulnerability disclosure has several trust gaps:

- Researchers may reveal enough information for a company to patch the issue without guaranteeing payment.
- A company may dispute when a report was first submitted.
- Public bug-bounty platforms become high-value stores of exploit data.
- Platform operators can inspect confidential reports.
- Researchers may not want their identities or wallet histories publicly linked to security work.
- Companies need an auditable process without publishing the vulnerability before it is safe.
- A later public write-up may be difficult to prove as identical to the original report.

Vulna addresses these gaps by separating:

- **Publicly verifiable facts:** bounty terms, timestamps or ordering, commitment identifiers, review status, accepted severity band, patch status, payout status.
- **Confidential facts:** vulnerability description, reproduction steps, proof-of-concept files, affected endpoints, researcher identity, internal reviewer notes.

---

## 3. Product goals

### 3.1 MVP goals

The MVP is successful when it can:

1. Connect a supported Midnight wallet.
2. Create a public bounty with a reward, scope hash, deadline policy, reviewer key, and public metadata.
3. Lock or demonstrably reserve a supported test asset for the bounty.
4. Produce a canonical vulnerability-report package entirely in the browser.
5. Encrypt the report before any network upload.
6. Commit a digest and blinded commitment to Midnight.
7. Prevent the same local submission credential from being reused for the same bounty.
8. Allow an authorized reviewer to retrieve and decrypt the report.
9. Allow only valid roles to move the submission through the state machine.
10. Release or record the payout only after the acceptance conditions are satisfied.
11. Allow optional delayed disclosure by revealing the digest preimage and matching it to the original commitment.
12. Show a public audit timeline that reveals no exploit content.
13. Pass Compact simulator tests and end-to-end local or Preprod integration tests.

### 3.2 Stretch goals

- Multiple independent reviewers with M-of-N acceptance.
- Encrypted reviewer comments and researcher replies.
- Dispute arbitration with a separately authorized arbitrator.
- Automatic escrow refund after a safely enforceable deadline.
- Private researcher reputation derived from accepted submissions.
- Eligibility proofs without identity disclosure.
- Confidential bounty scopes for invite-only programs.
- Embargoed public disclosure with delayed key release.
- CVSS evidence workflow with reviewer-signed severity attestation.
- Organization teams and delegated treasury controls.
- A standardized export format compatible with HackerOne-style reports.

### 3.3 Explicit non-goals for MVP

- Automatically proving that an exploit works.
- Running untrusted proof-of-concept code on project infrastructure.
- Uploading real zero-day exploits during a public demo.
- Building a complete HackerOne replacement.
- Supporting arbitrary cross-chain payouts.
- Solving Sybil resistance.
- Fully decentralized semantic duplicate detection.
- Storing large files inside Compact private state or on-chain.
- Building a production-grade identity/KYC layer.
- Giving legal advice or guaranteeing safe-harbor protection.

---

## 4. Core user roles

### Project owner

Creates a bounty, defines its public scope, selects reviewers, funds the reward, accepts final resolution, and authorizes payout according to the policy.

### Security reviewer

Has an application encryption public key registered for the bounty. The reviewer decrypts the report locally, verifies the report against the public scope, and records an accept or reject decision.

For the MVP, the project owner and reviewer may be the same wallet, but the code and data model must keep the roles separate.

### Researcher

Builds and encrypts the report locally, submits the commitment, grants encrypted access to the reviewer, tracks status, and optionally discloses the report publicly after patching.

### Public observer

Can inspect bounty terms and the immutable status timeline but cannot see report contents, researcher private state, encrypted content keys, or reviewer-only material.

### Arbitrator — stretch

Can receive a separately encrypted report key and resolve disputes without exposing the report publicly.

---

## 5. Privacy model

### 5.1 What is public

The MVP may expose the following data:

- Bounty identifier.
- Project's DApp-specific identity or authorized key commitment.
- Public bounty title and description stored in normal web metadata.
- Hash of the canonical bounty scope.
- Reward amount and asset type, unless a later shielded escrow design hides them.
- Reviewer encryption-key commitment or registered public key.
- Submission identifier.
- Report commitment.
- Encrypted artifact content hash or CID hash.
- Access-envelope hash.
- Submission state.
- Accepted severity band after review.
- Patch commitment.
- Payout state.
- Optional disclosed report digest after embargo.

### 5.2 What must remain private

- Vulnerability description.
- Reproduction steps.
- Proof-of-concept source or files.
- Internal URLs, credentials, tokens, logs, screenshots, or customer data.
- Report salt and commitment opening before voluntary disclosure.
- Researcher app secret.
- Researcher real-world identity.
- Reviewer private encryption key.
- Symmetric content-encryption key.
- Private reviewer notes.
- Any rejected report's contents.

### 5.3 Privacy boundary

Compact inputs are private by default, but ledger writes, exported circuit returns, contract-to-contract calls, and unshielded token transfers are public boundaries. Every field crossing one of those boundaries must be reviewed deliberately.

No feature may be described as private merely because it uses a Midnight contract. The implementation must document exactly:

- Which values enter a circuit privately.
- Which values are disclosed.
- Which values are written to public ledger state.
- Which values are contained in transactions or unshielded transfers.
- Which values remain only in encrypted storage or local private state.

### 5.4 Selective disclosure design

Midnight does not automatically transport an arbitrary encrypted vulnerability report from one user's private state to another user's private state. The MVP therefore uses an explicit hybrid design:

1. The researcher creates a random content key locally.
2. The report is encrypted locally with an authenticated symmetric cipher.
3. The content key is sealed to the reviewer's registered encryption public key.
4. Only ciphertext and key envelopes are uploaded.
5. The encrypted artifact hash and envelope hash are committed on-chain.
6. The reviewer downloads ciphertext and decrypts it locally.
7. The reviewer recomputes the canonical report digest and checks that it matches the committed digest supplied through the authorized review flow.

The storage service must never receive plaintext or unsealed content keys.

---

## 6. Threat model

### 6.1 Protected against

- Public-chain observers reading vulnerability details.
- Storage providers reading the report.
- A project denying that a specific committed report existed before patching.
- A researcher swapping in a different report after submission.
- Unauthorized wallets changing bounty or submission state.
- Accidental plaintext exposure through normal server requests.
- Basic replay of the same submission credential within one bounty.
- Tampering with encrypted artifacts after commitment.

### 6.2 Not fully protected against in MVP

- A malicious authorized reviewer leaking plaintext after decryption.
- Reviewer endpoint compromise.
- Browser extensions or malware reading plaintext before encryption.
- Traffic analysis and IP-address correlation.
- A researcher submitting semantically duplicate reports from multiple identities.
- A project and reviewer colluding to reject a valid report.
- Weak or malicious bounty wording.
- Malicious files opened by a reviewer outside the safe preview flow.
- Compromise of locally stored encryption keys.
- Storage censorship or deletion; redundancy reduces but does not eliminate it.

### 6.3 Required mitigations

- Clear authorized-viewer warning before decryption.
- No automatic execution or rendering of active content.
- Safe text-only preview by default.
- Download attachments as inert binary files with explicit confirmation.
- File size and type allowlist for MVP.
- Content Security Policy and no third-party analytics on report routes.
- Encrypted IndexedDB or wallet-backed local storage for private state.
- Generic errors that do not contain report text.
- Optional Tor/privacy-network guidance is documentation-only, not an MVP dependency.

---

## 7. Technical architecture

## 7.1 Stack

### Smart contract and Midnight integration

- Compact smart contract language.
- Midnight.js packages generated or recommended by the current official scaffold.
- Midnight DApp Connector for wallet connection.
- Official public data/indexer provider.
- Official private-state provider.
- Official ZK configuration and proving provider.
- Local Midnight network for development; supported public test environment for the demo.

Do not manually pin versions from this plan. Initialize with the current official `create-mn-app` scaffold, commit the generated lockfile, and keep all Midnight packages on a documented compatible release set.

### Web application

- Next.js App Router.
- TypeScript in strict mode.
- Tailwind CSS.
- shadcn/ui for accessible primitives.
- React Hook Form and Zod.
- TanStack Query only where it meaningfully improves async state.
- Zustand only for small client-side workflow state; never store report plaintext in a global store.

### Cryptography

Preferred implementation:

- `libsodium-wrappers-sumo`.
- XChaCha20-Poly1305 for report payload encryption.
- Sealed boxes or equivalent Curve25519 public-key encryption for wrapping the random content key for each reviewer.
- Secure random values from libsodium or Web Crypto.
- The exact Compact-compatible commitment/hash primitive exposed by the generated runtime for on-chain commitments.

Do not substitute home-grown crypto.

### Encrypted artifact storage

Primary MVP option:

- IPFS-compatible pinning provider or a content-addressed storage gateway.

Development fallback:

- A local storage adapter that persists ciphertext only.

The storage interface must be provider-agnostic:

```ts
interface EncryptedBlobStore {
  put(blob: Uint8Array, metadata: PublicBlobMetadata): Promise<StoredBlob>;
  get(locator: string): Promise<Uint8Array>;
}
```

### Optional application database

A normal database may index public UX metadata such as bounty titles, search text, organization profiles, and cached public chain state. It must not store:

- Report plaintext.
- Content keys.
- Researcher secrets.
- Commitment salts.
- Decrypted reviewer notes.

The chain remains the authority for protocol state.

---

## 7.2 Monorepo layout

```text
vulna-bounties/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── page.tsx
│       │   ├── bounties/
│       │   │   ├── page.tsx
│       │   │   ├── new/page.tsx
│       │   │   └── [bountyId]/page.tsx
│       │   ├── submissions/
│       │   │   └── [submissionId]/page.tsx
│       │   ├── researcher/page.tsx
│       │   ├── reviewer/page.tsx
│       │   └── settings/keys/page.tsx
│       ├── components/
│       ├── features/
│       │   ├── bounties/
│       │   ├── disclosures/
│       │   ├── reviewer/
│       │   ├── payouts/
│       │   └── audit-timeline/
│       ├── lib/
│       └── public/
├── contracts/
│   └── vulna/
│       ├── src/vulna.compact
│       ├── src/witnesses.ts
│       ├── generated/
│       └── test/
│           ├── simulator/
│           └── integration/
├── packages/
│   ├── midnight/
│   │   ├── providers.ts
│   │   ├── contract-client.ts
│   │   ├── wallet.ts
│   │   └── network.ts
│   ├── crypto/
│   │   ├── canonicalize.ts
│   │   ├── commitments.ts
│   │   ├── encryption.ts
│   │   ├── envelopes.ts
│   │   └── key-store.ts
│   ├── storage/
│   │   ├── interface.ts
│   │   ├── ipfs.ts
│   │   └── local.ts
│   ├── shared/
│   │   ├── schemas.ts
│   │   ├── domain.ts
│   │   ├── constants.ts
│   │   └── errors.ts
│   └── ui/
├── scripts/
│   ├── deploy.ts
│   ├── seed-demo.ts
│   └── verify-deployment.ts
├── docs/
│   ├── PRIVACY_MODEL.md
│   ├── THREAT_MODEL.md
│   ├── DEMO.md
│   └── ARCHITECTURE.md
├── .env.example
├── AGENTS.md
├── PLAN.md
├── README.md
├── package.json
└── pnpm-workspace.yaml
```

If the official scaffold generates a materially different structure, preserve its provider and contract conventions and adapt this logical separation without fighting the scaffold.

---

## 8. Domain model

All on-chain structures below are conceptual. Exact Compact types must be selected from the current compiler and standard library. Avoid dynamic strings on-chain; use fixed-size bytes, integers, maps, sets, and hashes.

### 8.1 Bounty

```ts
type Bounty = {
  id: bigint;
  ownerAuthKey: Bytes32;
  reviewerAuthKey: Bytes32;
  reviewerEncryptionKeyHash: Bytes32;
  metadataHash: Bytes32;
  scopeHash: Bytes32;
  rewardAsset: Bytes32;
  rewardAmount: bigint;
  deadlinePolicy: bigint;
  payoutPolicy: PayoutPolicy;
  status: BountyStatus;
  acceptedSubmissionId?: bigint;
};
```

```ts
enum BountyStatus {
  Draft = 0,
  Open = 1,
  UnderReview = 2,
  Accepted = 3,
  Patched = 4,
  Paid = 5,
  Cancelled = 6,
  Refunded = 7,
}
```

### 8.2 Submission

```ts
type Submission = {
  id: bigint;
  bountyId: bigint;
  reportCommitment: Bytes32;
  artifactHash: Bytes32;
  accessEnvelopeHash: Bytes32;
  researcherOwnershipCommitment: Bytes32;
  researcherNullifier: Bytes32;
  severityCommitment: Bytes32;
  supplementHeadHash?: Bytes32;
  supplementCount: bigint;
  status: SubmissionStatus;
  acceptedSeverity?: number;
  patchCommitment?: Bytes32;
  payoutReceipt?: Bytes32;
};
```

```ts
enum SubmissionStatus {
  Committed = 0,
  AccessGranted = 1,
  UnderReview = 2,
  NeedsMoreInfo = 3,
  Accepted = 4,
  Rejected = 5,
  Patched = 6,
  Paid = 7,
  Disclosed = 8,
  Withdrawn = 9,
}
```

### 8.3 Private researcher state

```ts
type ResearcherPrivateState = {
  appSecret: Bytes32;
  submissions: Record<string, {
    bountyId: string;
    reportDigest: Bytes32;
    commitmentSalt: Bytes32;
    severityValue: number;
    severitySalt: Bytes32;
    contentKey: Bytes32;
    artifactLocator: string;
    encryptedArtifactHash: Bytes32;
    localEncryptionMetadata: LocalEncryptionMetadata;
    supplements: Array<{
      supplementDigest: Bytes32;
      supplementSalt: Bytes32;
      contentKey: Bytes32;
      artifactLocator: string;
      encryptedArtifactHash: Bytes32;
    }>;
  }>;
};
```

Do not put the complete report body in Compact private state. Store it as encrypted client data and retain only the digest, opening values, and minimum recovery metadata required for proofs.

### 8.4 Reviewer key profile

```ts
type ReviewerKeyProfile = {
  walletIdentity: string;
  encryptionPublicKey: string;
  keyVersion: number;
  createdAt: string;
  revokedAt?: string;
};
```

A reviewer key rotation must not invalidate access to historical submissions. Existing envelopes remain bound to the old key version unless re-encrypted by the researcher.

---

## 9. Canonical report format

Every commitment depends on deterministic serialization. Define a versioned canonical schema before implementing the contract.

```ts
type CanonicalReportV1 = {
  schema: "vulna.report.v1";
  bountyId: string;
  title: string;
  summary: string;
  vulnerabilityType: string;
  affectedComponents: string[];
  severityClaim: {
    band: "low" | "medium" | "high" | "critical";
    cvssVector?: string;
  };
  reproductionSteps: string[];
  impact: string;
  remediationSuggestion?: string;
  attachments: Array<{
    name: string;
    mediaType: string;
    byteLength: number;
    digest: string;
  }>;
  createdAtClient: string;
};
```

Canonicalization rules:

- UTF-8 encoding.
- Unicode normalization to NFC.
- Stable object-key ordering.
- Arrays preserve user order unless the schema explicitly declares them unordered.
- Normalize line endings to `\n`.
- Reject non-finite numbers.
- Store integer sizes as decimal strings when cross-runtime precision matters.
- Include the schema identifier in every hash domain.
- Hash attachments separately; include their digests in the canonical report.
- Never use `JSON.stringify` on an arbitrary object as the protocol canonicalization rule.

The encrypted payload is a **private review package**, not only the report body:

```ts
type PrivateReviewPackageV1 = {
  schema: "vulna.review-package.v1";
  report: CanonicalReportV1;
  reportDigest: string;
  commitmentSalt: string;
  severityBand: "low" | "medium" | "high" | "critical";
  severitySalt: string;
};
```

The reviewer receives the report commitment opening inside the encrypted package so they can independently recompute the canonical digest, severity commitment, and report commitment. The package must never contain the researcher app secret or private payout credentials.

The exact serializer must have test vectors committed to the repository.

---

## 10. Commitment scheme

Use domain-separated commitments. Exact hashing must use a primitive that can be reproduced identically by Compact and TypeScript through the generated runtime or an officially documented helper.

Conceptually:

```text
reportDigest = H(
  "vulna:report-digest:v1" || canonicalReportBytes
)

reportCommitment = H(
  "vulna:report-commitment:v1" ||
  bountyId ||
  reportDigest ||
  commitmentSalt
)

severityCommitment = H(
  "vulna:severity:v1" ||
  bountyId ||
  severityBand ||
  severitySalt
)

researcherOwnershipCommitment = H(
  "vulna:researcher-owner:v1" ||
  appSecret ||
  bountyId ||
  reportCommitment
)

researcherNullifier = H(
  "vulna:submission-nullifier:v1" ||
  appSecret ||
  bountyId ||
  reportDigest
)
```

Properties:

- The salt must be random and at least 256 bits where the selected primitive permits it.
- The report digest must not be posted directly until the protocol intentionally reveals it.
- The researcher ownership commitment lets the same private credential authorize later supplement, claim, withdrawal, and reveal actions without publishing the researcher's identity.
- The nullifier prevents reuse of the same app secret and report digest for the same bounty, but does not provide global semantic duplicate detection.
- The app secret is never included in the encrypted review package.
- Domain strings must never be reused for unrelated commitments.
- Never truncate a digest without an explicit collision analysis.

---

## 11. Encrypted artifact format

Use a versioned envelope:

```ts
type EncryptedReportEnvelopeV1 = {
  schema: "vulna.encrypted-report.v1";
  payloadSchema: "vulna.review-package.v1";
  cipher: "xchacha20poly1305-ietf";
  nonce: string;
  ciphertext: string;
  publicMetadata: {
    bountyId: string;
    submissionTempId: string;
    ciphertextByteLength: number;
    attachmentCount: number;
  };
  keyEnvelopes: Array<{
    recipientKeyId: string;
    algorithm: "curve25519-sealed-box";
    wrappedContentKey: string;
  }>;
};
```

Authenticated additional data must include:

```text
schema || bountyId || reportCommitment || reviewerKeyVersion
```

This binds ciphertext to its intended protocol context.

The researcher must compute and store:

- Ciphertext/content-address hash.
- Envelope hash.
- Storage locator.
- Reviewer key identifier.
- Algorithm version.

Never derive the content key from the report, wallet address, password, or commitment salt. Generate it randomly.

---

## 12. Compact contract design

Use one contract for the MVP to reduce deployment and integration risk. Separate contracts can be considered after the complete flow works.

### 12.1 Public ledger state

Conceptual fields:

```text
owner / maintenance authority
bounty counter
submission counter
bounties map
submissions map
used nullifier set
authorized owner keys
reviewer authorization keys
reviewer encryption-key hashes
researcher ownership commitments
supplement-chain heads
escrow balances or payout authorization records
```

Exact nested structs may be constrained by Compact. Flatten maps if required.

### 12.2 Private witnesses

The generated TypeScript witness provider should expose only minimal private values:

```text
researcher app secret
report digest
commitment salt
severity value
severity salt
DApp-specific signing material where required
```

Witness functions must:

- Read from the account-scoped private-state provider.
- Throw typed, sanitized errors when state is unavailable.
- Never log witness values.
- Never fetch private inputs from a remote API.
- Never silently substitute zero values.

### 12.3 Proposed exported circuits

Names are provisional and must be adjusted to valid Compact syntax.

#### `createBounty`

Inputs:

- `metadataHash`
- `scopeHash`
- `reviewerAuthKey`
- `reviewerEncryptionKeyHash`
- `rewardAsset`
- `rewardAmount`
- `deadlinePolicy`

Rules:

- Caller is recorded as owner using the official DApp-specific identity/access-control pattern.
- Reward must be positive.
- Bounty starts as `Draft` or `Open` depending on whether funding is atomic.
- Emits only public safe values.

#### `fundBounty`

Rules:

- Owner-only.
- Receives a supported asset into contract custody or atomically verifies a wallet intent.
- Funding cannot exceed protocol bounds.
- Moves bounty to `Open` after required funding is present.

Use NIGHT or a supported custom test asset, not DUST. DUST is a non-transferable capacity resource for gas.

#### `submitDisclosure`

Public outputs/arguments:

- `bountyId`
- `reportCommitment`
- `artifactHash`
- `accessEnvelopeHash`
- `severityCommitment`
- `researcherOwnershipCommitment`
- `researcherNullifier`

Private witness inputs:

- `reportDigest`
- `commitmentSalt`
- `appSecret`
- `severityValue`
- `severitySalt`

Rules:

- Bounty is open.
- Nullifier has not been used.
- Recompute and verify report commitment.
- Recompute and verify severity commitment.
- Recompute and verify researcher ownership commitment.
- Recompute and verify nullifier.
- Record submission and consume nullifier.
- Do not disclose report digest, salts, severity value, or researcher secret.

#### `acknowledgeAccess`

Rules:

- Reviewer-only.
- Confirms the reviewer could retrieve and decrypt the artifact.
- Moves `AccessGranted` to `UnderReview`.
- Does not prove the report is valid.

#### `requestMoreInfo`

Rules:

- Reviewer-only.
- Stores only a public reason code or a hash of an encrypted message.
- Does not store reviewer comments in plaintext.

#### `addEncryptedSupplement`

Inputs:

- `submissionId`
- `supplementCommitment`
- `supplementArtifactHash`
- `supplementEnvelopeHash`
- `previousSupplementHeadHash`

Private witness inputs:

- researcher app secret
- supplement digest
- supplement salt

Rules:

- Researcher proves ownership against `researcherOwnershipCommitment`.
- Only allowed in `NeedsMoreInfo`.
- Appends a separately encrypted supplement; it never replaces or mutates the original report artifact.
- Verifies that `previousSupplementHeadHash` equals the current head.
- Stores the new chained head and increments the supplement counter.
- Moves the submission back to `UnderReview` after a valid supplement.
- The reviewer decrypts and verifies the supplement separately from the original report.

#### `acceptDisclosure`

Inputs:

- `submissionId`
- accepted severity band
- patch commitment placeholder or patch deadline policy

Rules:

- Reviewer or owner according to configured policy.
- Submission must be under review.
- Bounty must not already have a paid winning submission.
- Stores the accepted public severity band.
- Moves submission and bounty to `Accepted`.

For the MVP, support one winning submission per bounty. Later submissions can be marked duplicate or rejected through public reason codes without revealing content.

#### `rejectDisclosure`

Rules:

- Reviewer-only.
- Stores a bounded public reason code, not free text.
- Does not reveal severity commitment opening.
- Rejected report remains confidential.

#### `markPatched`

Inputs:

- `submissionId`
- `patchCommitment`

Rules:

- Owner-only.
- Submission must be accepted.
- Records a commit hash, release hash, advisory hash, or other public patch evidence commitment.
- Moves submission and bounty to `Patched`.

#### `claimReward`

Private witness inputs:

- researcher app secret
- payout recipient data where the selected shielded token API permits it to remain private

Rules:

- Researcher proves ownership against `researcherOwnershipCommitment`.
- Enforces the bounty's immutable payout policy.
- Default MVP policy: accepted + patched.
- Prevents double payout.
- Pays only the accepted submission's owner.
- Uses the most private correctly supported recipient and token flow.
- If shielded contract payout is not ready, use a transparent test payout or receipt-linked settlement and label the privacy boundary honestly.

A separate owner-triggered `authorizePayout` circuit may be used only if required by the chosen policy; it must not let the owner redirect the reward to a different recipient.

#### `revealReport`

Private inputs:

- `reportDigest`
- `commitmentSalt`

Public result:

- Verified report digest or disclosure hash.

Rules:

- Researcher proves ownership against `researcherOwnershipCommitment`.
- Researcher proves the opening matches the original commitment.
- Only the researcher-controlled proof path can reveal it.
- The report body itself remains off-chain; the UI may publish the plaintext separately after explicit confirmation.
- Disclosure is irreversible and requires a high-friction confirmation screen.

#### `cancelBounty`

Rules:

- Owner-only.
- Allowed only before valid active submissions, unless protocol terms specify otherwise.
- Escrow refund must be atomic with cancellation.

### 12.4 State-transition invariants

The contract must enforce:

- A bounty cannot be paid twice.
- A submission cannot be accepted after rejection or withdrawal.
- Only an open bounty accepts submissions.
- A used nullifier cannot be reused.
- Only the authorized reviewer can review.
- Only the owner can patch or cancel.
- A paid bounty cannot be cancelled or refunded.
- A bounty cannot have two winning submission IDs in MVP.
- A report reveal must match the exact original commitment and researcher ownership commitment.
- Supplements are append-only and cannot rewrite the original report or historical supplement heads.
- Payout amount cannot exceed funded escrow.
- Funding and refund arithmetic cannot underflow or overflow.

---

## 13. Payout design

### 13.1 Preferred MVP path

Use an official token-transfer pattern supported by the selected Midnight release:

- Public reward amount for understandable demo economics.
- Contract custody or an atomic transaction intent where supported.
- Shielded researcher recipient where correctly supported by the contract/wallet flow.
- Explicit UI labels for public versus shielded properties.

### 13.2 Safe fallback

If correct contract escrow with the chosen asset blocks the core privacy demo:

1. Implement the full disclosure, review, patch, and payout-authorization state machine.
2. Execute a separate wallet transfer linked by a payout receipt hash.
3. Label it as **non-atomic payout settlement**.
4. Never fake an escrow or claim funds are trustless when they are not.

The hackathon demo should favor a truthful partial implementation over an insecure or misleading financial flow.

### 13.3 Reward-policy decision

Default policy:

```text
release when submission.status == Patched
and bounty.status == Patched
and payout has not occurred
```

For demo speed, expose a project configuration option:

- `ACCEPTANCE`: payout immediately after acceptance.
- `PATCH`: payout after patch evidence.

The policy is immutable after the first submission.

---

## 14. Application flows

## 14.1 Project creates a bounty

1. Connect wallet.
2. Ensure the project encryption/reviewer key is registered.
3. Enter public metadata:
   - Title.
   - Public description.
   - In-scope assets.
   - Out-of-scope classes.
   - Safe-harbor text.
   - Reward amount.
   - Severity policy.
   - Disclosure policy.
4. Canonicalize the scope document and compute `scopeHash`.
5. Upload public metadata or store it in the app database.
6. Call `createBounty`.
7. Fund the bounty.
8. Verify indexed state.
9. Display the public bounty page.

## 14.2 Researcher submits privately

1. Connect wallet or create a DApp-specific pseudonymous researcher profile.
2. Open bounty and verify the scope hash.
3. Compose report locally.
4. Attach only safe demo files within limits.
5. Canonicalize the report.
6. Generate report digest, salts, severity commitment, researcher ownership commitment, and nullifier.
7. Build the private review package containing the report plus the report/severity openings, but not the researcher app secret.
8. Generate a random content key.
9. Encrypt the private review package locally.
10. Seal the content key to the reviewer's encryption public key.
11. Upload ciphertext.
12. Verify uploaded bytes match the local artifact hash.
13. Store private opening and ownership values locally before transaction submission.
14. Call `submitDisclosure`.
15. Confirm the indexed submission state.
16. Show a recovery/export prompt for local private state.

Do not upload before encryption. Do not submit the chain transaction before local private state is durably saved.

## 14.3 Reviewer decrypts and reviews

1. Connect authorized reviewer wallet.
2. Fetch public submission state.
3. Fetch encrypted blob.
4. Verify artifact hash and envelope hash before decryption.
5. Unseal the content key locally.
6. Decrypt locally.
7. Render a safe text preview.
8. Recompute the canonical report digest.
9. Recompute the report and severity commitments using the encrypted openings.
10. Verify both match public chain state.
11. Call `acknowledgeAccess`.
12. Accept, reject, or request more information.

## 14.4 Project patches and pays

1. Publish or select patch evidence.
2. Compute patch commitment.
3. Call `markPatched`.
4. Researcher calls `claimReward`, or completes the documented receipt-linked fallback.
5. Display payout receipt and privacy boundary.
6. Invite the researcher to disclose after the embargo.

## 14.5 Researcher discloses later

1. Researcher opens submission from local private state.
2. UI explains that disclosure cannot be undone.
3. Researcher chooses what public content to publish.
4. Call `revealReport` with private opening values.
5. Upload or publish the redacted public report.
6. Public page verifies the published report digest against the original commitment.

---

## 15. UI and page requirements

### 15.1 Landing page

Communicate three ideas immediately:

- Commit privately.
- Review selectively.
- Prove when it existed.

Avoid generic hacker imagery. Use a restrained security aesthetic with diagrams showing ciphertext, commitments, and controlled disclosure.

### 15.2 Bounty explorer

Cards show:

- Project.
- Title.
- Reward.
- Scope tags.
- Status.
- Reviewer policy.
- Disclosure policy.

Never show researcher identifiers in the explorer.

### 15.3 Bounty details

Sections:

- Public scope.
- Reward and payout policy.
- Safe-harbor statement.
- Reviewer key fingerprint.
- Public contract state.
- Create-private-report CTA.

### 15.4 Report composer

Requirements:

- Local-only privacy banner.
- Autosave only to encrypted local storage.
- Explicit indicator: `Not uploaded` → `Encrypted locally` → `Ciphertext uploaded` → `Committed on-chain`.
- Attachment allowlist and size limits.
- Canonical report preview.
- Key backup warning.
- No third-party scripts.

### 15.5 Researcher dashboard

Shows:

- Local submissions matched to public chain records.
- Review state.
- Encrypted artifact availability.
- Recovery status.
- Reward state.
- Optional disclosure action.

When private state is missing, say so plainly; do not infer or reconstruct secrets.

### 15.6 Reviewer inbox

Shows only submissions assigned to the connected reviewer. Before decryption, display only public metadata and ciphertext integrity status.

Reviewer actions:

- Decrypt locally.
- Verify commitment.
- Accept.
- Reject with reason code.
- Request encrypted follow-up.

### 15.7 Public audit timeline

Example:

```text
Bounty created
Bounty funded
Disclosure committed
Reviewer access acknowledged
Disclosure accepted — High
Patch commitment recorded
Reward released
Report voluntarily disclosed
```

Each event links to a transaction or indexed contract action where possible.

---

## 16. API and adapter boundaries

### Contract client

```ts
interface VulnaContractClient {
  createBounty(input: CreateBountyInput): Promise<TxResult>;
  fundBounty(input: FundBountyInput): Promise<TxResult>;
  submitDisclosure(input: SubmitDisclosureInput): Promise<TxResult>;
  acknowledgeAccess(submissionId: bigint): Promise<TxResult>;
  requestMoreInfo(input: RequestMoreInfoInput): Promise<TxResult>;
  addEncryptedSupplement(input: AddSupplementInput): Promise<TxResult>;
  acceptDisclosure(input: AcceptDisclosureInput): Promise<TxResult>;
  rejectDisclosure(input: RejectDisclosureInput): Promise<TxResult>;
  markPatched(input: MarkPatchedInput): Promise<TxResult>;
  claimReward(submissionId: bigint): Promise<TxResult>;
  revealReport(submissionId: bigint): Promise<TxResult>;
  getBounty(id: bigint): Promise<BountyView>;
  getSubmission(id: bigint): Promise<SubmissionView>;
}
```

### Crypto service

```ts
interface DisclosureCryptoService {
  canonicalize(report: CanonicalReportV1): Uint8Array;
  createCommitments(input: CommitmentInput): Promise<CommitmentBundle>;
  encryptReport(input: EncryptReportInput): Promise<EncryptedReportBundle>;
  decryptReviewPackage(input: DecryptReportInput): Promise<PrivateReviewPackageV1>;
  verifyArtifact(input: VerifyArtifactInput): Promise<VerificationResult>;
}
```

### Private-state repository

```ts
interface ResearcherPrivateStateRepository {
  initializeAccount(accountId: string): Promise<void>;
  saveSubmissionOpening(record: PrivateSubmissionRecord): Promise<void>;
  getSubmissionOpening(submissionId: string): Promise<PrivateSubmissionRecord | null>;
  exportEncryptedBackup(): Promise<Uint8Array>;
  importEncryptedBackup(data: Uint8Array): Promise<void>;
}
```

---

## 17. Validation and error handling

### Client validation

- Enforce report schema with Zod.
- Enforce maximum character and attachment limits before encryption.
- Normalize text before hashing.
- Require reviewer key fingerprint confirmation.
- Verify bounty is still open immediately before transaction creation.
- Re-fetch state after proof generation if proof creation takes long enough for state to change.

### Error taxonomy

```ts
type VulnaErrorCode =
  | "WALLET_NOT_CONNECTED"
  | "WRONG_NETWORK"
  | "PRIVATE_STATE_UNAVAILABLE"
  | "ENCRYPTION_KEY_MISSING"
  | "REVIEWER_KEY_MISMATCH"
  | "ENCRYPTION_FAILED"
  | "UPLOAD_FAILED"
  | "ARTIFACT_HASH_MISMATCH"
  | "PROOF_GENERATION_FAILED"
  | "CONTRACT_STATE_CHANGED"
  | "UNAUTHORIZED_TRANSITION"
  | "PAYOUT_FAILED"
  | "DECRYPTION_FAILED"
  | "INVALID_COMMITMENT_OPENING";
```

User-facing errors must not interpolate report text, keys, salts, ciphertext, stack traces, or provider response bodies that may contain sensitive values.

---

## 18. Testing strategy

Midnight proof generation is expensive, so use layered tests.

### 18.1 Pure unit tests

Test:

- Canonical serialization.
- Unicode and line-ending normalization.
- Commitment test vectors.
- Encryption/decryption round trips.
- Wrong-key rejection.
- Ciphertext tamper detection.
- Envelope tamper detection.
- Attachment digest verification.
- State-machine helper functions.
- Input validation.

### 18.2 Compact simulator tests

Cover every circuit and assertion:

- Create valid bounty.
- Reject zero reward.
- Reject unauthorized funding or changes.
- Submit valid commitment.
- Reject wrong opening.
- Reject reused nullifier.
- Reject submission to closed bounty.
- Enforce reviewer-only review actions.
- Enforce owner-only patch action.
- Reject double acceptance where disallowed.
- Reject double payout.
- Verify reveal opening.
- Reject invalid reveal.
- Check refund/cancellation invariants.
- Check overflow/underflow boundaries.

### 18.3 Integration tests

Run against the supported local Midnight environment:

- Deploy contract.
- Connect test wallets/providers.
- Create and fund bounty.
- Generate real proof for disclosure.
- Query indexed state.
- Review and accept.
- Patch and settle payout.
- Reconnect client and recover public state.
- Verify private state is account-scoped.

### 18.4 End-to-end browser tests

Use Playwright for:

- Wallet connector mocked adapter tests.
- Full researcher encryption and upload flow.
- Reviewer decrypt flow in a separate browser context.
- Failed decryption with wrong key.
- No plaintext report in network requests.
- No plaintext report in localStorage, console logs, page source, analytics, or error reporting.
- Public observer cannot access reviewer route data.
- Disclosure warning and confirmation.

### 18.5 Security regression tests

Add explicit tests that search captured network traffic and browser storage for known sentinel strings included in demo reports. The test fails if the sentinel appears anywhere except approved in-memory reviewer rendering.

---

## 19. Build phases and verification gates

## Phase 0 — Environment and spike

Tasks:

- Scaffold with current official Midnight tooling.
- Run the default example.
- Compile one Compact contract.
- Start local network and proof server.
- Connect wallet or test wallet adapter.
- Deploy and call one circuit.
- Query its ledger state.
- Implement one local private witness.

Gate:

- A clean checkout can run the sample end-to-end using documented commands.
- Tool versions and compatibility matrix are recorded.
- No Vulna feature work starts until this works.

## Phase 1 — Protocol specification

Tasks:

- Freeze report schema v1.
- Freeze commitment domains.
- Freeze state enums and transition table.
- Define role authorization.
- Select the supported bounty asset.
- Decide whether payout is atomic escrow or receipt-linked fallback.
- Write `PRIVACY_MODEL.md` and `THREAT_MODEL.md`.

Gate:

- Test vectors exist for canonicalization and commitments.
- Every proposed public field has a privacy justification.

## Phase 2 — Compact state machine

Tasks:

- Implement bounty creation.
- Implement submission commitment.
- Implement nullifier set.
- Implement role checks.
- Implement review actions.
- Implement patch and payout state.
- Implement optional reveal.
- Add simulator tests.

Gate:

- All state transitions pass simulator tests.
- Negative tests exist for every authorization and replay rule.

## Phase 3 — Client crypto

Tasks:

- Reviewer app key generation and registration.
- Report canonicalization.
- Content-key generation.
- XChaCha20-Poly1305 encryption.
- Reviewer key envelope.
- Ciphertext storage adapter.
- Integrity verification.
- Encrypted local private-state storage.

Gate:

- Storage server sees only ciphertext.
- Wrong key and tampered ciphertext fail closed.
- Browser test confirms no plaintext network request.

## Phase 4 — Midnight client integration

Tasks:

- Provider factory.
- Wallet connection.
- Contract deployment script.
- Contract client wrapper.
- Witness provider.
- Indexer reads/subscriptions.
- Transaction status handling.
- Account/network switching handling.

Gate:

- A real proof-backed submission is visible through the indexer.
- Reconnecting does not corrupt private state.

## Phase 5 — Product UI

Tasks:

- Landing page.
- Bounty explorer and details.
- Create-bounty flow.
- Researcher report composer.
- Researcher dashboard.
- Reviewer inbox and safe preview.
- Public audit timeline.
- Payout and disclosure screens.

Gate:

- Complete demo works without developer console intervention.
- Mobile layout is usable for viewing, while report composition may recommend desktop.
- Accessibility checks have no critical violations.

## Phase 6 — Escrow and settlement

Tasks:

- Integrate selected asset.
- Verify custody and refund paths.
- Add payout receipt.
- Add double-spend and insufficient-balance tests.
- Label shielded and unshielded boundaries in UI.

Gate:

- Funding, payout, and refund are tested end-to-end.
- Product claims match the implemented privacy level.

## Phase 7 — Hardening and demo

Tasks:

- CSP and secure headers.
- Remove analytics from private routes.
- Redact logs.
- Add demo seed data.
- Record backup demo video.
- Write architecture diagram and demo script.
- Run threat-model checklist.
- Test fresh-machine setup.

Gate:

- A judge can understand the privacy boundary in under two minutes.
- The full demo succeeds twice from a clean state.
- All tests pass and no sentinel plaintext leaks.

---

## 20. Suggested seven-day hackathon schedule

### Day 1 — Midnight spike and specification

- Scaffold project.
- Run local environment.
- Study private-state, witness, access-control, and token-transfer examples.
- Freeze protocol schema and privacy boundaries.

Deliverable: deployed hello-world contract plus finalized state-transition diagram.

### Day 2 — Compact contract core

- Bounty creation.
- Submission commitments.
- Nullifiers.
- Reviewer/owner authorization.
- Simulator tests.

Deliverable: contract state machine with passing positive and negative tests.

### Day 3 — Encryption and storage

- Canonical report package.
- Local encryption.
- Reviewer key wrapping.
- Ciphertext storage adapter.
- Integrity tests.

Deliverable: researcher encrypts; separate reviewer context decrypts; server never sees plaintext.

### Day 4 — Full Midnight integration

- Witness provider.
- Contract client.
- Real proof generation.
- Indexer reads.
- Submission transaction.

Deliverable: encrypted report commitment appears on-chain and reviewer decrypts it.

### Day 5 — Review, patch, and payout

- Reviewer workflow.
- Acceptance/rejection.
- Patch commitment.
- Asset funding and payout or honest settlement fallback.

Deliverable: complete protocol lifecycle.

### Day 6 — UI polish and security hardening

- Public audit timeline.
- Researcher dashboard.
- Safe reviewer preview.
- CSP, logging audit, privacy tests.

Deliverable: judge-ready product.

### Day 7 — Demo, documentation, and contingency

- Seed demo bounty.
- Record backup video.
- Final testnet deployment.
- Prepare pitch and architecture diagram.
- Fix only demo-critical issues.

Deliverable: reliable live demo, video, README, and submission assets.

---

## 21. Demo scenario

Use a fictional product and harmless vulnerability.

### Scenario

Project: `Acme Notes`
Bounty: `Authentication and authorization issues`
Reward: `1,000 test tokens`
Demo issue: a mocked authorization check missing from a demo endpoint.

### Script

1. **Project view:** Create and fund the Acme Notes bounty.
2. **Researcher view:** Write a report containing a visible sentinel phrase.
3. Show browser network panel: only ciphertext is uploaded.
4. Submit the commitment to Midnight.
5. **Public view:** Show timestamp/order, commitment, and status—but no report.
6. **Reviewer view:** Connect authorized key, verify ciphertext hash, decrypt locally.
7. Accept as `High`.
8. Project records a patch commit hash.
9. Release reward.
10. Researcher voluntarily reveals a redacted public report.
11. UI proves it matches the original commitment.
12. Show that the sentinel never appeared in public chain state or storage logs.

Never demo against a real third-party system.

---

## 22. Observability

Allowed telemetry:

- Page route names for public pages.
- Transaction state categories.
- Proof-generation duration rounded into broad buckets.
- Generic error codes.
- Storage upload byte size.

Forbidden telemetry:

- Form fields.
- Report title or summary.
- Attachment names.
- Wallet identifiers on private routes unless essential and consented.
- Ciphertext, hashes tied to user analytics, keys, salts, witnesses.
- Decrypted content.
- Reviewer decisions before chain confirmation.

Use local structured logs in development with a strict sanitizer. Production logging must default to minimal.

---

## 23. Security checklist

- [ ] No report plaintext leaves the browser before encryption.
- [ ] No report plaintext is sent to server actions.
- [ ] No plaintext in localStorage or sessionStorage.
- [ ] Private keys and content keys are never logged.
- [ ] Commitment domains are unique and versioned.
- [ ] Canonicalization has cross-runtime test vectors.
- [ ] Ciphertext uses authenticated encryption.
- [ ] Reviewer public keys are fingerprinted and versioned.
- [ ] Artifact hash checked before decryption.
- [ ] Decryption failure is fail-closed.
- [ ] Attachments do not execute in the browser.
- [ ] CSP blocks unexpected script origins.
- [ ] Private pages contain no third-party analytics.
- [ ] Contract authorization tests cover every privileged circuit.
- [ ] Replay and double-payout tests pass.
- [ ] Financial arithmetic uses bounded integer checks.
- [ ] Disclosure action has an irreversible-action confirmation.
- [ ] Demo uses fictional, harmless vulnerabilities.

---

## 24. Definition of done

The MVP is done only when:

- The Compact contract compiles from a clean checkout.
- Simulator tests pass.
- Integration tests prove a real private submission flow.
- The app connects to a supported Midnight wallet/environment.
- A project can create and fund a bounty.
- A researcher can encrypt and submit a report commitment.
- The public cannot access report plaintext.
- The authorized reviewer can decrypt and verify the artifact.
- Unauthorized wallets cannot review, patch, or pay.
- The protocol prevents duplicate payout.
- The project can mark a patch and the verified researcher owner can claim the reward.
- Optional disclosure verifies against the original commitment.
- The UI accurately labels all privacy boundaries.
- A fresh setup guide works.
- A backup demo video exists.
- No critical security or accessibility issue remains.

---

## 25. Post-MVP roadmap

### V1.1 — Private communication

Encrypted threaded messages, artifact revisions, and reviewer requests committed by hash.

### V1.2 — Dispute arbitration

Separate arbitrator envelopes, bonded disputes, and auditable resolution.

### V1.3 — Researcher reputation

Prove statements such as “I have at least three accepted high-severity reports” without revealing which programs they came from.

### V1.4 — Organization programs

Team roles, private invite-only scopes, recurring budgets, and delegated reviewer policies.

### V1.5 — Embargo automation

Optional delayed disclosure policies, key-release workflows, and advisory generation.

### V2 — Protocol standard

Publish canonical report, commitment, key-envelope, and payout-receipt formats so other platforms can interoperate.

---

## 26. Primary Midnight references to consult during implementation

Use the current official documentation rather than copying stale snippets:

- Midnight documentation index and compatibility matrix.
- `create-mn-app` quickstart.
- Compact language reference and standard library.
- Private guest-list, private reserve auction, election, and Battleship examples.
- Shielded and unshielded token-transfer example.
- Midnight DApp Connector API.
- Midnight.js provider configuration guide.
- Private-state provider documentation.
- Proof-server guide.
- Local Midnight network guide.
- Indexer GraphQL API.
- Current release notes.

When implementation details conflict with this plan, the current official compiler, generated types, compatibility matrix, and examples are authoritative. Update the plan and record the decision rather than forcing outdated assumptions.
