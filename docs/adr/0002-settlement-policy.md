# ADR 0002: patch-gated NIGHT settlement with honest fallback

## Decision

Vulna uses `PATCH` as the immutable MVP payout policy: the researcher may claim only after acceptance and owner-recorded patch commitment.

The preferred asset is supported NIGHT custody. The installed 4.1.1 wallet SDK has
been spiked successfully for signed wallet-to-wallet NIGHT transfer, but no
contract-custody API or atomic refund path has been proven. Vulna therefore uses
the fallback below for the MVP.

If atomic custody cannot be proven, Vulna keeps on-chain payout authorization and records a separate transfer receipt hash. UI and docs label that route **non-atomic settlement**; it is not described as escrow, shielded, or trustless.

## Consequences

- DUST is gas/capacity only and never bounty principal.
- A settlement transfer is an unshielded wallet transfer; its amount and recipient are transparent to the network.
- There is no contract-held balance and therefore no on-chain refund path in this fallback.
- No payout claim is implemented until selected asset semantics are verified.
- The researcher's payout-recipient commitment is bound before review; only the researcher proof holder can acknowledge a receipt after patch. This is an attestation, not a proof that a transfer occurred.
