# Vulna threat model

## Assets

- Vulnerability report plaintext and attachments.
- Commitment openings, researcher app secret, content key, reviewer private key.
- Reviewer authorization and bounty custody/payout state.
- Correct ordering of commit, review, patch, payout, and disclosure.

## In scope

| Threat | Required control |
| --- | --- |
| Chain observer reads report | Witnesses + ciphertext only; never disclose digest/openings prematurely. |
| Blob provider reads/tampers report | Client encryption; local artifact/envelope hash checks before chain/decryption. |
| Researcher changes report after commit | Canonical digest plus persistent report commitment and encrypted opening. |
| Replay/double claim | Domain-separated nullifier consumed once; payout guard. |
| Unauthorized lifecycle action | DApp-specific owner/reviewer identity or researcher ownership proof; positive/negative tests. |
| Browser/server leak | Sentinel E2E test across requests, logs, storage, cookies, HTML, analytics, and public state. |
| Hostile attachment | Strict allowlist/size cap; inert download or sandboxed safe preview; never execute. |
| Transaction race | Re-read public state after proving; never auto-retry writes; indexer-check uncertainty. |

## Explicit non-guarantees

- An authorized reviewer can disclose plaintext after decrypting it.
- Network/IP metadata and transaction timing are not hidden.
- A ZK proof does not establish that a vulnerability is real.
- A nullifier does not detect semantic duplicates from different identities.
- Transparent or receipt-linked settlement is neither shielded nor trustless.
- Browser malware and compromised reviewer devices are outside MVP protection.

## Stop conditions

Stop implementation and redesign when plaintext reaches infrastructure, a public/private field is unclear, Compact/runtime behavior disagrees with the protocol, a primitive cannot be reproduced by client and contract, custody/refund is unverified, sentinel leaks, or any unauthorized transition succeeds.
