# Todo

## Plan

- [x] Phase 0 — Scaffold Vulna; verify Compact, Docker, proof server, deploy, circuit call, and indexer read.
- [x] Phase 1 — Freeze schemas, commitments, privacy/threat model, access rules, payout ADR.
- [x] Phase 2 — Implement Compact bounty/submission state machine with generated-contract simulator tests.
- [x] Phase 3 — Implement client crypto, encrypted storage, private-state recovery, leak tests.
  - [x] Add versioned libsodium report/package encryption and reviewer sealed-key envelopes.
  - [x] Add ciphertext-only blob-store adapter with byte-identity verification.
  - [x] Add encrypted account-scoped recovery state plus export/import validation.
  - [x] Add tamper, wrong-key, separate-context, and plaintext-sentinel tests.
- [x] Phase 4 — Integrate wallet/providers, witnesses, real proof-backed submission, indexer confirmation.
  - [x] Add fail-closed, account-scoped witness state and generated-type bindings.
  - [x] Replace scaffold provider wiring with single Vulna provider factory.
  - [x] Collapse lifecycle-only circuits into bounded role dispatchers: local node rejects the 13-verifier-key deployment as block-limit exhausted; preserve all transitions/invariants in one contract.
  - [x] Deploy current Vulna ABI, encrypt/store ciphertext locally, submit proof-backed commitment, confirm indexed state.
  - [x] Add witness/provider/integration coverage; review public transcript for plaintext.
- [x] Phase 5 — Implement separate-context reviewer decrypt/verify/review/patch flow.
  - [x] Persist/version reviewer encryption key material in encrypted reviewer-only local state.
  - [x] Verify ciphertext/envelope hashes and chain commitments before reviewer decryption.
  - [x] Exercise reviewer acknowledge/accept and owner patch in separate authenticated contexts.
  - [x] Add live integration tests for wrong reviewer, invalid state, and patch-before-accept.
- [x] Phase 6 — Implement tested custody/settlement or honest receipt-linked fallback.
  - [x] Spike installed wallet SDK `transferTransaction` with real local NIGHT, distinct recipient, and recipient-wallet balance check.
  - [x] Freeze fallback semantics: receipt-linked, non-atomic, transparent; never call it escrow/shielded/trustless.
  - [x] Bind a salted researcher payout-recipient commitment at submission; record only receipt hash after patch.
  - [x] Add payout receipt/double-action/authorization simulator and live tests.
- [x] Phase 7 — Build Next.js product UI around proven flows.
  - [x] Add a strict Next.js App Router shell without moving private report data across an RSC boundary.
  - [x] Build public bounty detail/audit surfaces with only safe mock/indexed metadata.
  - [x] Build a client-only report composer using React Hook Form + Zod and local encryption before any persisted ciphertext write.
  - [x] Build researcher/reviewer views with safe local-only status, decryption, and receipt-boundary UX.
  - [x] Add unit coverage for validation, encrypted preparation, and the plaintext sentinel boundary.
- [x] Phase 8 — Complete sentinel, CSP, attachment, recovery, accessibility, E2E hardening.
  - [x] Add restrictive headers/CSP and assert them from the running app.
  - [x] Make attachment policy explicit, retain ciphertext-only storage, and protect unsaved in-memory drafts.
  - [x] Apply accessibility review fixes: skip link, labels, live updates, focus, reduced motion, and mobile behavior.
  - [x] Add browser E2E for public HTML/header/sentinel boundaries and the client encryption flow.
- [ ] Phase 9 — Deploy Preprod demo, document, record backup video.
  - [x] Write a safe fictional demo script and browser privacy-evidence command.
  - [x] Verify the full harmless lifecycle on Preview: `2384e08752408e12632a56f93487ee6ff417aa0ca47ec6d6fd16b24ec6d4ae75`.
  - [x] Record local browser privacy-evidence videos (ignored test artifacts).
  - [ ] Deploy to Preprod with a funded user-controlled test wallet.
  - [ ] Record public Preprod transaction references after successful deployment.
- [x] Documentation — rewrite README for the implemented Vulna MVP and verified Preview deployment.
- [x] Submission readiness — add GitHub Actions CI, deploy the web UI with Vercel CLI, and produce screenshot-ready test output.
  - [x] Add CI workflow for dependency install and clean-checkout privacy regression tests.
  - [x] Deploy the web UI: `https://midnight-demo-app.vercel.app`.
  - [x] Run full test suite for submission screenshot (25 passing tests).
  - [x] Correct the hosted navigation network label to Preview Midnight.
- [ ] Visual refresh — animate the landing, add generated editorial assets, polish public routes, and support light/dark themes.
  - [x] Add reduced-motion-safe GSAP entrance and scroll reveals.
  - [x] Add generated dossier and envelope artwork to the landing.
  - [x] Introduce system-aware theme tokens and a manual theme toggle.
  - [x] Restyle bounty, researcher, and reviewer surfaces without changing privacy behavior.
- [x] Wallet connection — add a browser DApp Connector session for Preview wallet authorization.
  - [x] Install the pinned DApp Connector API and enumerate injected wallets safely.
  - [x] Add client-only connect, disconnect, network, and account-change handling.
  - [x] Expose the connected public address and wallet state in navigation and researcher flow.
  - [x] Keep report submission fail-closed until an open bounty and browser ZK bundle are available.
- [ ] Browser transaction flow — let owner wallets open a bounty and researcher wallets submit proof-backed disclosures.
  - [x] Researcher bounty picker — read configured Preview V2 bounty state without private-state setup, auto-load open bounties after wallet connection, and hide custom contract input under advanced configuration.
    - Privacy boundary: public indexer reads use only wallet-provided Preview configuration and contract address; no report data, wallet signature, or encrypted witness state is created to list bounties.
    - Contract invariants: read-only UI selection; submission still revalidates the selected bounty and requires indexed `OPEN` state.
  - [x] Freeze the V2 public bounty metadata: reviewer role commitment, reviewer encryption public key, and safe listing metadata.
  - [x] Update Compact ABI and redeploy a fresh Preview V2 contract because the current contract is `PAID`.
  - [x] Add an untrusted Vercel Blob relay for canonical encrypted report envelopes; browser encrypts before upload and reviewer verifies hashes before decrypting.
  - [x] Serve generated ZK assets and construct browser providers from the connected wallet configuration.
  - [x] Persist account-scoped witness state only as encrypted IndexedDB data derived from wallet authorization.
  - [x] Implement owner create/open bounty and researcher submit/access flows with indexer confirmation.
  - [ ] Add live Preview proof-transaction and plaintext-sentinel tests for the V2 flow.
- [x] Preview V2 deployment — deploy the current V2 ABI with the existing generated Preview test wallet and configure the confirmed public address for the hosted frontend.
  - Privacy boundary: only the public contract address becomes Vercel configuration; no seed, private state password, report, witness, or reviewer key leaves the local deployment environment.
  - Contract invariants: deploy only; do not create a bounty, submit a disclosure, or mutate settlement state.
  - [x] Add a typed deploy-only script using the current generated ABI and existing Preview wallet state.
  - [x] Verify indexed V2 ledger state and record the public address: `02588eea120001e5589c04b8e3d60cba52330c21fb280af45f4e5c058e09b495`.
  - [x] Add the address to production/Preview Vercel configuration and redeploy the frontend.
  - [x] Verify the live app exposes the configured Preview V2 address without exposing secrets.
- [x] Reviewer enrollment and V2 bounty creation — create reviewer role/key material locally, copy only its public bundle to the operator, then create and open a Preview bounty from the encrypted operator state.
  - Privacy boundary: reviewer actor secret and Curve25519 private key remain encrypted in that reviewer browser; the operator receives only role commitment, public key, and key version.
  - Contract invariants: create with a positive policy reward and immutable reviewer key, then transition only DRAFT → OPEN through the recorded V2 owner state.
  - [x] Add versioned encrypted reviewer enrollment state and unit tests.
  - [x] Add connected-wallet reviewer enrollment UI with public-bundle copy only.
  - [x] Add a typed Preview operator script that validates a public bundle and creates/opens one bounty.
  - [x] Deploy the enrollment UI and create/index one V2 Open bounty using an explicit public bundle: Preview V2 bounty `#1`.
- [ ] Wallet connection recovery — accept an authorized Preview connector when optional capability hints are unsupported, retain safe diagnostics, and verify the reviewer enrollment path.
  - Privacy boundary: diagnostics contain only sanitized wallet/network codes; no wallet API object, account secret, signature, or report data is logged.
  - [x] Inspect installed connector types and the failing connection path.
  - [x] Make optional wallet capability hints non-blocking and add regression coverage.
  - [ ] Deploy and verify Preview connection from the live reviewer route.
- [ ] Commit each completed phase; push each commit once Git remote exists.

- [x] Git deployment reliability — generate Compact assets during the production build so a clean Vercel Git checkout does not depend on ignored local files.
  - Privacy boundary: build-only generation; no wallet state, report data, or secrets enter the artifact.
  - [x] Version generated contract bindings required by the web build, retain explicit local contract generation checks, add a reusable pre-push verification command, and exercise the build from a fresh clone.

## Verification

- [x] Phase 0: `pnpm install --frozen-lockfile`.
- [x] Phase 0: `pnpm run setup`.
- [x] Phase 0: `pnpm run test:e2e`.
- [x] Phase 0: real `storeMessage` transaction + indexed state read.
- [x] Phase 1: protocol unit tests, strict typecheck, Compact compile, privacy-output review.
- [ ] Per phase: narrow tests, affected checks, privacy-output review, diff review.
  - [x] Git deployment reliability: clean-checkout build, typecheck, protocol tests, browser suite, and Vercel Git deployment.
- [x] Phase 2: generated Compact lifecycle and negative authorization/replay simulator tests.
- [x] Phase 3: XChaCha/Curve25519 round trip, Compact-compatible commitment verification, tamper/wrong-key/key-rotation tests, ciphertext storage, encrypted recovery, separate-process reviewer, and sentinel storage tests.
- [x] Phase 4: generated witnesses, six-circuit state-machine simulator, live local deploy, encrypted fixture commitment submission, and indexed-state confirmation.
- [x] Phase 5: encrypted reviewer-key state, separate-process chain-first decryption, live negative authorization/state proofs, acceptance, patch, and indexed confirmation.
- [x] Phase 6: signed local NIGHT transfer, recipient-wallet confirmation, researcher-only receipt acknowledgment, and indexed `PAID` state.
- [x] Phase 7: App Router production build, public route/sentinel HTML inspection, client-only encrypted draft preparation, and protocol/contract/indexer regression checks.
- [x] Phase 8: Chromium browser tests for CSP/security headers, public HTML, client encryption, requests, browser storage, and the plaintext sentinel.
- [x] Phase 9 (Preview evidence): full proof-backed harmless lifecycle and public indexer confirmation.
- [x] Visual refresh: run build, web tests, light/dark responsive inspection, and privacy-output review.
- [x] Wallet connection: run connector unit/browser coverage, build, privacy regression, and public-state review.
- [ ] Browser transaction flow: run V2 contract simulator, ciphertext-relay tests, browser wallet mocks, indexer confirmation, and privacy-output review.
  - [x] Researcher bounty picker: typecheck, browser wallet auto-load coverage, production build, and plaintext-output review.
- [x] Preview V2 deployment: compile, typecheck, deploy-only indexer confirmation, live config check, and diff/privacy review.
- [x] Reviewer enrollment and V2 bounty creation: crypto tests, typecheck, contract simulator, live operator transaction, frontend build, and privacy review.
  - [x] Live Preview operator transaction created and indexer-confirmed V2 bounty `#1` as `OPEN`.

## Review

### Changed

- Adopted official `create-mn-app` Vulna scaffold and lockfile.
- Initialized local Git repository.
- Renamed planning/protocol docs to Vulna.
- Added compatibility baseline and ignored generated local private-state database.
- Added strict schemas, canonicalization vectors, state-transition guards, privacy/threat/architecture docs, and protocol ADRs.
- Implemented Phase 2 Compact lifecycle, append-only encrypted supplements, DApp-specific role commitments, nullifier replay prevention, and optional proof-gated digest reveal.
- Added generated-contract runtime simulator tests and an exact public-ledger/privacy inventory.
- Kept the Phase 0 local smoke as a raw node/indexer check because its recorded `storeMessage` deployment is not the new Vulna ABI.
- Implemented browser-safe XChaCha20-Poly1305 report encryption, sealed reviewer key envelopes, Compact-runtime commitment verification, ciphertext-only storage, encrypted account-scoped recovery, and IndexedDB adapters.
- Added typed Vulna providers/witnesses and a proof-backed local deployment fixture; consolidated lifecycle calls into three public, role-bounded dispatch circuits so the single contract fits the local node's verifier-key deployment limit.
- Added encrypted versioned reviewer-key state, role-isolated local proof contexts, and a live complete confidential lifecycle fixture.
- Added non-atomic receipt-linked settlement: salted recipient commitment, opaque SDK receipt hash, and researcher-only `PAID` acknowledgment.
- Added a strict Next.js App Router product shell with public bounty/audit pages, a client-only encrypted report composer, and plaintext-free reviewer/settlement boundary states.
- Added CSP/security headers, attachment disablement, unsaved draft protection, skip navigation, and Chromium sentinel regression coverage.
- Added the fictional-demo runbook, browser privacy-evidence instructions, and exact Preprod funding/deployment handoff.
- Enabled the proof-backed receipt-settlement lifecycle on public Preview/Preprod when a local private-state password is explicitly supplied; verified the harmless lifecycle on Preview.
- Rewrote the README around the implemented privacy boundary, active scripts, Preview contract, verified explorer link, explicit observer-visibility table, and MVP limitations.
- Added GitHub Actions verification and deployed the public fictional-demo UI with Vercel.
- Corrected the hosted navigation from Local Midnight to Preview Midnight and redeployed it.
- Added an editorial landing with generated dossier imagery, GSAP reveal motion, a system-aware light/dark theme, and unified public workspace styling without moving report data across the browser privacy boundary.
- Added a browser-only DApp Connector session for Preview Midnight. It enumerates injected wallets without hardcoded provider keys, exposes only the unshielded address, and clears state on disconnect or network changes.
- Added a public Vercel Blob relay for immutable, content-addressed encrypted report envelopes. The browser-side upload helper verifies returned bytes before use; the server route only issues path-constrained short-lived upload tokens and never accepts report bytes.
- Updated the pending V2 Compact ABI so each bounty binds an immutable reviewer Curve25519 public key and key version; renamed `fundBounty` to `openBounty` to avoid a false custody claim.
- Added browser-served V2 ZK assets, a DApp Connector proof/balance/submit bridge, encrypted account-and-contract-scoped witness state, owner deploy/create/open controls, and researcher commit/grant-access controls. UI success waits for indexed state; it never relies on a fabricated connector transaction ID.
- Added a Preview-only V2 deploy command that uses the existing generated test wallet, retains its owner witness state only in encrypted local private state, and never creates a bounty, report, or settlement record. The public V2 address is configured in Vercel; researcher and bounty-read views prefill it.
- Added encrypted account-scoped reviewer enrollment with a Curve25519 key pair and reviewer role secret, plus a public-only copy bundle. The operator bounty command accepts that strict public bundle and performs only `createBounty` then `openBounty` using the retained V2 owner state.
- Made optional DApp Connector capability hints non-blocking and removed the unsupported status call from connection health checks. The connector now validates Preview using required configuration plus public address only.
- Created and opened Preview V2 bounty `#1` using a reviewer-supplied public enrollment bundle; no reviewer private material entered operator state or source control.
- Replaced the researcher contract-loader with an auto-loaded open-bounty picker; custom public contracts remain available only under advanced configuration.
- Allowed only the required Preview indexer HTTPS/WSS origins in CSP so the browser can retrieve public bounty state; normalized generated bounty statuses before UI comparison.

### Verified

- Compact 0.5.1/compiler 0.31.1.
- Docker node, indexer, and proof server healthy.
- Local contract deployed, transaction submitted, and ledger state indexed.
- `pnpm test`, `pnpm exec tsc --noEmit`, and `pnpm run compile` pass for Phase 1.
- Phase 2: `pnpm test` (7 protocol + 2 generated-contract simulator tests), `pnpm run build`, `pnpm run test:e2e`, and `git diff --check` pass.
- Phase 3: `pnpm test` (15 protocol/crypto/storage + 2 Compact simulator tests), `pnpm run build`, `pnpm run test:e2e`, `pnpm audit --prod --audit-level=high`, and `git diff --check` pass.
- Phase 4: `pnpm test` (17 protocol/crypto/witness + 2 Compact simulator tests), `pnpm run build`, `PRIVATE_STATE_PASSWORD=… pnpm run test:integration`, `pnpm run test:e2e`, and `git diff --check` pass.
- Phase 5: `pnpm test` (19 protocol/crypto/witness + 2 Compact simulator tests), `pnpm run build`, `PRIVATE_STATE_PASSWORD=… pnpm run test:integration`, `pnpm run test:e2e`, and `git diff --check` pass. Current indexed local contract: `0636cae28615b2be09989c086df9475532918f2f9d1608ba1046126dce0a3fea`.
- Phase 6: `pnpm test` (21 protocol/crypto/witness + 2 Compact simulator tests), `pnpm run build`, `PRIVATE_STATE_PASSWORD=… pnpm run test:integration`, `pnpm run test:e2e`, and `git diff --check` pass. Current indexed local contract: `48af20177f2c37004763a862bb1e82f8c5484c247dc93a08801fdb09819fc90f`.
- Phase 7: `pnpm test` (23 protocol/crypto/witness/UI + 2 Compact simulator tests), `pnpm run build`, `pnpm run test:e2e`, and `git diff --check` pass. All five static product routes returned HTTP 200 with no plaintext sentinel in server-rendered HTML.
- Phase 8: `pnpm run test:web` (2 Chromium browser tests), `pnpm test`, `pnpm run build`, `pnpm run test:e2e`, and `git diff --check` pass. Browser coverage confirms no sentinel in requests, public HTML, localStorage, sessionStorage, cookies, or ciphertext staged in IndexedDB.
- Phase 9 Preview evidence: `PRIVATE_STATE_PASSWORD=<Keychain secret> pnpm run setup -- --network preview` confirmed `PAID`; `pnpm run test:e2e` confirmed public indexer state for `2384e08752408e12632a56f93487ee6ff417aa0ca47ec6d6fd16b24ec6d4ae75`.
- README refresh: `pnpm run test:e2e`, Preview explorer HTTP 200, and `git diff --check` pass.
- Submission readiness: Vercel production URL returned HTTP 200 with CSP; local `pnpm test` passed 23 protocol/privacy and 2 Compact simulator tests.
- GitHub Actions: [CI run #2](https://github.com/SachPlayZ/Vulna/actions/runs/30214867918) passed `pnpm run test:ci` from a clean checkout.
- Hosted network label: production alias `https://vulna-midnight.vercel.app` returned HTTP 200 with `Preview Midnight` rendered.
- Visual refresh: `pnpm run test:web` passed 3 Chromium tests, including theme preference persistence; `pnpm run test:ci` passed 21 privacy/protocol tests; production build and `git diff --check` passed. Desktop light and mobile dark views were inspected locally after motion settled.
- Visual refresh deployment: Vercel production deployment `dpl_3SjXixEjyf6MDrh9qeaZmjGXimNX` is ready; the canonical live demo renders the updated hero, generated assets, and Preview Midnight label.
- Wallet connection: `pnpm run test:web` passed 5 Chromium checks, including Preview connection and wrong-network rejection; `pnpm run test:ci` passed 23 protocol/privacy checks; production build and diff checks passed. Desktop researcher wallet state was inspected locally.
- Blob relay/V2 ABI: `pnpm run test:protocol` passed 26 tests, `pnpm run typecheck` passed, Compact V2 compiled, and the production upload route returned `405` to an unsupported `HEAD` request with the expected exact Blob CSP origin.
- Preview V2 deployment: `pnpm run typecheck`, `pnpm run compile`, `pnpm run test:protocol` (27 tests), production build, and diff checks passed. `02588eea120001e5589c04b8e3d60cba52330c21fb280af45f4e5c058e09b495` indexed on Preview. Vercel production deployment `dpl_2HdT1WEB7R99xftHi46jgVgmKjK4` is ready; its canonical alias renders the address and serves V2 ZK assets with CSP.
- Reviewer enrollment: `pnpm run typecheck`, Compact compile, `pnpm run test:protocol` (29 tests), production build, and browser regression passed. Vercel production deployment `dpl_J5VeaYTFWzqo97rHTya3bwnz2jx3` is ready; its reviewer route renders enrollment with no public plaintext sentinel.
- Wallet recovery: `pnpm run typecheck` and 6 Chromium browser checks passed, including a Preview wallet that rejects optional hints/status calls. Vercel production deployment `dpl_Bu7c6TuL8SGZMMmJaTBerwAk1WGM` is ready.
- Wallet recovery follow-up: the connector no longer invokes `hintUsage` at all during connection. Typecheck and all 6 browser checks passed; Vercel production deployment `dpl_J2GioNVJjwB7bMYh7cV8uBhXDPKx` is ready.
- V2 bounty creation: `pnpm run create:bounty:v2:preview` completed with Preview contract `02588eea120001e5589c04b8e3d60cba52330c21fb280af45f4e5c058e09b495`, bounty `#1`, and indexer-confirmed `OPEN` state.
- Researcher bounty picker: `pnpm run typecheck`, `pnpm run test:protocol` (29 tests), and `pnpm run test:web` (8 browser checks) passed. Browser coverage confirms automatic public reads do not call shielded-address or signature/private-state setup.
- Researcher bounty picker deployment: Vercel production deployment `dpl_To2PBEeuHTgeKeDgr9eBierTsF3k` is ready and aliased to `https://vulna-midnight.vercel.app`.
- Bounty picker repair: direct Preview indexer read confirmed V2 bounty `#1` is `OPEN`; `pnpm run typecheck`, `pnpm run test:protocol` (30 tests), and `pnpm run test:web` (8 browser checks) passed. Vercel deployment `dpl_7xQhfxYeFdFHEeJ72vDz5to9t9HA` is live; a signature-free browser wallet mock displayed bounty `#1` from the real Preview indexer.
- Git deployment reliability: `pnpm run check:push` passed both locally and from a fresh clone, including generated Compact assets, typecheck, 30 protocol/privacy tests, and the production build. CI now runs the compiler-free clean-checkout production build.
- Git deployment fix: a compiler-free fresh clone passed `pnpm run check:push` after adding the generated contract JS/types required by Next.js and retaining the already-versioned public ZK assets. `pnpm run check:contract` verifies compiler output locally.

### Risks

- `pnpm install` reports ignored optional dependency build scripts; re-check before browser/build work.
- Atomic shielded custody/refund remains unproven. The MVP records only an honestly labeled, transparent non-atomic settlement receipt.
- Compact/client commitment parity is explicitly deferred to Phase 2 generated-contract tests; no custom commitment primitive exists in application code.
- Local integration fixture is intentionally harmless; it uses isolated local role state but one dev wallet, so it does not prove multi-wallet UX.
- Current six-circuit ABI intentionally discloses a bounded action code; this matches the metadata distinct circuit names disclosed before consolidation.
- The CSP permits `wasm-unsafe-eval` for the installed Compact runtime only; it excludes third-party origins and ordinary `unsafe-eval`.
- GitHub Actions runs the 21-test generated-binding-independent suite; the full Compact simulator suite remains a local/toolchain verification command.
- Preprod deployment remains pending until a user-controlled Preprod wallet is funded. Preview confirmation is not a substitute.
- The V1 Preview fixture is `PAID`; V2 bounty `#1` is `OPEN`. A real browser-wallet disclosure transaction against V2 remains unexercised, and the UI must keep success gated on indexer confirmation.
- The public Blob relay is ciphertext-only but not an authenticated anti-abuse service yet; its short-lived tokens are path/content/size constrained. Add wallet-signature verification and rate limiting before high-volume production use.
- V2 browser actions compile and pass mocked/privacy coverage, but a real Preview wallet must approve the deploy and proof calls. The connector cannot be driven from this environment, so live V2 transaction evidence remains user-controlled.
- The encrypted operator owner state is not available to arbitrary connected wallets. Preview V2 bounty `#1` is open, but a real browser-wallet disclosure transaction has not yet been exercised against it.
- Additional V2 bounties require a reviewer-generated public enrollment bundle. The operator must never invent or recover the reviewer private key or role secret.

### Follow-ups

- Phase 9 still needs funding for the Preprod generated wallet address before a public Preprod deployment can be attempted.
