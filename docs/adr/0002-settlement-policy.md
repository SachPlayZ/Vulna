# ADR 0002: patch-gated NIGHT settlement with honest fallback

## Decision

Vulna uses `PATCH` as the immutable MVP payout policy: the researcher may claim only after acceptance and owner-recorded patch commitment.

The preferred asset is supported NIGHT custody. Phase 6 must demonstrate funding, recipient-correct payout, cancellation/refund, and double-action resistance using current supported APIs.

If atomic custody cannot be proven, Vulna keeps on-chain payout authorization and records a separate transfer receipt hash. UI and docs label that route **non-atomic settlement**; it is not described as escrow, shielded, or trustless.

## Consequences

- DUST is gas/capacity only and never bounty principal.
- No payout claim is implemented until selected asset semantics are verified.
- The owner cannot redirect an accepted researcher's payout recipient.
