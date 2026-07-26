# Vulna architecture

Vulna separates public protocol facts from confidential vulnerability data.

```text
Researcher browser
  canonicalize → digest → encrypt → wrap reviewer key → ciphertext storage
       │                                      │
       │ private witnesses                    │ ciphertext + safe metadata only
       ▼                                      ▼
Midnight Compact contract                  Untrusted blob store
  commitments, hashes, state                  no plaintext, no content key
       │                                      │
       └──────── public references ───────────┘
                         │
                         ▼
Reviewer browser
  verify hashes → unwrap key → decrypt locally → verify commitment → review
```

## Trust boundaries

| Component | Trusted with plaintext? | Responsibility |
| --- | --- | --- |
| Researcher browser | Yes, transient local memory only | Canonicalize, hash, encrypt, save encrypted recovery data, prove ownership. |
| Reviewer browser | Yes, after explicit authorization | Verify artifact/envelope/commitments, decrypt, safely view. |
| Midnight contract | No | Enforce roles, commitments, nullifier, transitions, payout authorization. |
| Indexer | No | Serve public ledger state only. |
| Blob store | No | Persist and return byte-identical ciphertext only. |
| Application server | No | Optional public bounty metadata/search cache only. |

## Protocol shape

- One Compact contract owns MVP bounty and submission state.
- Generated Compact bindings are the only contract-call type boundary.
- One provider factory creates wallet, indexer, ZK, proof, and account-scoped private-state providers; local owner/researcher/reviewer fixtures use isolated encrypted state scopes even when a dev wallet is shared.
- The canonical report is encrypted before any upload. Its plaintext and commitment openings never pass through server components, server actions, analytics, URLs, or unsafe browser persistence.
- Contract confirmation is authoritative only after indexed state reflects it.
- The Compact state machine and its exact public ledger surface are documented in `docs/CONTRACT_STATE_MACHINE.md`; settlement remains intentionally unimplemented until its asset semantics are tested.

## Required local flow

1. Validate report with Zod.
2. Canonicalize with `src/protocol/canonicalize.ts`.
3. Compute SHA-256 report digest locally.
4. Generate fresh openings/content key locally.
5. Encrypt review package; seal content key for reviewer.
6. Verify uploaded ciphertext bytes against local artifact hash.
7. Persist encrypted local proof/recovery state.
8. Submit proof and wait for indexer confirmation.
9. Reviewer fetches ciphertext, verifies indexed artifact/envelope/commitment values, then decrypts locally and proves the review transition.
10. Owner proves patch only after indexed acceptance.
