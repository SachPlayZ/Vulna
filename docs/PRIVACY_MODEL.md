# Vulna privacy model

## Security promise

Vulnerability plaintext never goes on-chain and never reaches application infrastructure before browser-side encryption.

This does not hide transaction existence, circuit choice, timing, network metadata, public ledger writes, or plaintext an authorized reviewer chooses to leak.

## Data inventory

| Data | Location | Visibility | Justification |
| --- | --- | --- | --- |
| Bounty title, scope policy, reward, reviewer key ID | Public metadata + ledger | Public | Programs must be discoverable/auditable. |
| Scope hash, bounty binding | Ledger | Public | Binds public policy/protocol context. |
| Report body, reproduction, attachments, URLs, secrets | Browser then encrypted blob | Private | Core protected material. |
| Report digest, report/severity openings, researcher app secret | Account-scoped private state | Private until voluntary reveal | Needed for proof/verification; dictionary and identity-link risk. |
| Report commitment, ownership commitment, nullifier | Ledger | Public | Proves fixed submission/ownership and prevents reuse. Nullifier is derived from high-entropy secret. |
| Ciphertext artifact hash, envelope hash | Ledger | Public | Integrity reference only; still correlatable metadata. |
| Content key, reviewer private key | Browser-local key material | Private | Decryption authority. |
| Salted payout-recipient commitment, accepted severity band, state, patch commitment, receipt hash | Ledger | Public | Auditable non-atomic lifecycle without report content. The commitment does not hide a separate transparent transfer. |
| Rejected-report content and notes | Encrypted local/blob data | Private | Never publish. |

## Disclosure review

Every exported circuit argument, `disclose`, ledger key, ledger value, circuit return, unshielded transfer, and public metadata field needs a written reason before implementation.

- Circuit arguments are public transcript data. Private values must come from witnesses.
- A `Map` key and `Set` member are public. Do not use them for anonymous membership proofs.
- Persistent commitments/hashes survive upgrades; transient primitives never back ledger data.
- A hash is not automatically safe: assess small domains, dictionary attacks, uniqueness, and correlation.
- Reviewers verify ciphertext and envelope hashes before decryption, then recompute report digest and commitments locally.
- The `PAID` status is a researcher receipt acknowledgment after a separate wallet transfer. It is not proof of transfer, escrow, shielding, or trustless settlement.

## Browser/storage rules

Forbidden for plaintext: `localStorage`, `sessionStorage`, cookies, URL query/fragment, server actions, service-worker cache, global state persistence, analytics, logs, and error messages.

The blob store cannot transform, compress, inspect, or reserialize ciphertext unless byte identity and hashes remain explicitly verified.

The product UI sends restrictive CSP, framing, referrer, MIME-sniffing, and
permissions headers on every route. Private report routes have no third-party
scripts or analytics. Attachments are disabled in the MVP UI; no active file is
rendered or executed. Draft text remains component-local and warns before page
exit; only verified ciphertext is staged in IndexedDB.

The precise encrypted report, storage, and recovery format is in `docs/CRYPTO_FORMAT.md`. The account encryption key is supplied by the wallet/private-state integration in Phase 4; no missing-state path manufactures a replacement secret or opening.
