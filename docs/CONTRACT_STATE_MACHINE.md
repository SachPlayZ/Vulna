# Vulna Compact state machine

`contracts/hello-world.compact` is the single MVP protocol contract. Its legacy
filename is retained only while the generated scaffold scripts still reference
it; the contract and application are Vulna.

## Public ledger

All ledger fields and exported-circuit arguments are public. They contain only
safe protocol references:

| Field | Public data | Reason |
| --- | --- | --- |
| `bounties` | Role-key hashes, binding, metadata/scope hashes, reward terms, status, counters | Auditable bounty lifecycle. Hashes remain correlatable metadata. |
| `submissions` | Commitments, ciphertext artifact/envelope hashes, nullifier, bounded codes, patch commitment, optional revealed digest, status | Binds the immutable encrypted submission and public decisions without report plaintext. |
| `supplements` | Supplement commitment, ciphertext artifact/envelope hashes, append-chain hashes | Lets a reviewer retrieve and integrity-check append-only encrypted supplements. |
| `usedNullifiers` | High-entropy submission nullifiers | Prevents a replay within the protocol. |
| counters | Sequential public IDs | Allows map lookup and audit ordering. |

The following never enter public state: report text, report digest before
voluntary reveal, report/severity/supplement openings, researcher secret,
severity value, content key, reviewer private key, envelope bytes, and reviewer
comments. They are witnesses or encrypted off-chain payloads.

`revealReport` intentionally writes `revealedReportDigest` only after proving
the stored report commitment and researcher ownership commitment. The digest is
public after that irreversible action and may still be vulnerable to dictionary
or correlation attacks; it is not the report body.

## Authorization and transitions

- Owner role key: create/fund/cancel bounty; mark an accepted winner patched.
- Reviewer role key: acknowledge access, request bounded more-info/rejection
  codes, accept a submission.
- Researcher proof: grant access, append a supplement, withdraw, reveal.

The deployed ABI groups lifecycle operations into three bounded public action
codes: `researcherTransition`, `reviewerTransition`, and `ownerTransition`.
This preserves the same public operation metadata that individual circuit names
previously revealed, while lowering verifier-key count from 13 to 6 so the
current local node can deploy the one-contract MVP. Every branch repeats its
role and state assertions; unsupported action codes fail.

```text
Committed -> AccessGranted -> UnderReview -> NeedsMoreInfo -> UnderReview
                                              |                  |
                                              +-> Withdrawn      +-> Accepted -> Patched -> Disclosed
                                                                 +-> Rejected
```

`Cancelled` is limited to a draft bounty or an open bounty with no submission.
One bounty has at most one accepted winner. The `PATCHED` state means patch
evidence was recorded; it does not claim that NIGHT or another asset moved.

## Settlement boundary

No `claimReward` or `PAID` circuit exists yet. ADR 0002 prohibits a fake payout
state until Phase 6 verifies either supported custody or a receipt-linked,
explicitly non-atomic settlement flow. The status machine therefore ends at
`PATCHED` or optional `DISCLOSED` for this phase.

## Verification

`pnpm run test:contract` compiles the current Compact source and executes the
generated JavaScript contract against the installed Compact runtime. It covers
the full happy path plus zero reward, wrong role, invalid commitment opening,
nullifier replay, invalid bounded codes, supplement head mismatch, rejected or
withdrawn revival, unsafe cancellation, duplicate acceptance, and invalid
reveal opening.
