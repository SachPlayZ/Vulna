# Vulna encrypted report format

Phase 3 uses `libsodium-wrappers-sumo` `0.8.4` because it supplies the required,
maintained XChaCha20-Poly1305 and Curve25519 sealed-box primitives. Vulna does
not implement a cipher, random generator, key derivation, or commitment hash.

## Report encryption

1. Validate and canonicalize `vulna.report.v1` locally.
2. SHA-256 its canonical UTF-8 bytes for the private report digest.
3. Build the private `vulna.review-package.v1`, including the report and its
   encrypted-only commitment openings.
4. Generate a fresh 32-byte content key and 24-byte XChaCha nonce.
5. Encrypt with `crypto_aead_xchacha20poly1305_ietf_encrypt`.
6. Seal that content key with the reviewer Curve25519 public key using
   `crypto_box_seal`.

The encrypted envelope is `vulna.encrypted-report.v1`. Its public fields are
only the ciphertext, nonce, safe submission metadata, a reviewer key ID and
version, and wrapped content-key bytes. The report body, digest, openings, and
content key are not public.

Authenticated additional data is canonicalized from:

```text
vulna.encrypted-report.v1
vulna.review-package.v1
bountyId
reportCommitment
reviewerKeyId
reviewerKeyVersion
```

Changing any of those values causes decryption to fail. Reviewers must verify
the ciphertext artifact hash and envelope hash before decrypting.

Before encryption and after decryption, Vulna recomputes the report and
severity commitments with the installed Compact runtime's `persistentCommit`
primitive, using the same domain separators and public bounty binding as the
contract. The reviewer compares those results with public contract commitments;
Vulna never substitutes SHA-256 for a Compact commitment.

## Storage and recovery

The `EncryptedBlobStore` API accepts an opaque branded ciphertext byte array,
not strings or report objects. It hashes bytes locally before storage and after
retrieval. The IndexedDB adapters write only opaque ciphertext envelopes; they
never use `localStorage`, `sessionStorage`, cookies, or URLs.

`EncryptedPrivateStateRepository` encrypts account-scoped recovery data with
the same AEAD primitive and binds it to the account ID through authenticated
data. Its caller must inject an existing 32-byte account encryption key. A
missing state throws a recovery error; the repository never invents a
replacement app secret, commitment opening, or account key. Phase 4 connects
that key and repository to wallet-backed account state.

## Tested failures

- Wrong recipient key or key version.
- Ciphertext, nonce, key-envelope, and AAD tampering.
- Envelope hash mismatch.
- Key rotation: prior envelopes remain decryptable only by their original key.
- Returned storage-byte tampering.
- Missing, wrong-key, and wrong-account private-state backups.
- Researcher/reviewer encryption and decryption in separate Node processes.
- Sentinel absence from serialized encrypted storage and recovery backups.
