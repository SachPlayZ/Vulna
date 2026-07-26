# ADR 0001: reviewer access grant follows commitment

## Context

The required lifecycle has distinct `Committed` and `AccessGranted` states. A report must be timestamped before a reviewer receives the on-chain envelope reference.

## Decision

`submitDisclosure` records report commitment, ciphertext artifact hash, severity commitment, ownership commitment, and nullifier; status becomes `Committed`.

`grantReviewerAccess` requires researcher ownership proof, records the reviewer-envelope hash, and moves the submission to `AccessGranted`. The reviewer then calls `acknowledgeAccess`, moving it to `UnderReview`.

The encrypted artifact may already exist in untrusted storage, but no on-chain reference binds reviewer access before `grantReviewerAccess` succeeds.

## Consequences

- The public timeline distinguishes commitment from access grant.
- A researcher can withdraw before access is granted.
- Reviewer-side verification must reject a missing/mismatched envelope hash.
- `accessEnvelopeHash` is absent for `Committed` submissions and mandatory from `AccessGranted` onward.
