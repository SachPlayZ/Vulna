# Lessons

## Pattern

- Mistake: The hosted UI retained a local-network label after the Preview deployment.
- Rule: Verify every runtime-visible network label against the deployment target before release.

## Pattern

- Mistake: Presented browser-wallet deployment as the only route despite an existing generated Preview deployer wallet.
- Rule: Before prescribing deployment steps, inspect the project’s recorded deployment path and use the explicitly authorized funded test wallet when available.

## Pattern

- Mistake: Treated optional DApp Connector hints and status APIs as authorization prerequisites.
- Rule: Connect with required configuration and public address only; make capability hints advisory and keep diagnostics sanitized.

## Pattern

- Mistake: Exposed a developer-facing contract lookup as the primary researcher flow.
- Rule: Auto-load configured public contracts and show actionable bounty cards; keep raw address entry behind an advanced/debug affordance.

## Pattern

- Mistake: Assumed an indexer-delivered Compact enum always arrived as a JavaScript number.
- Rule: Normalize public generated values at the read boundary before UI comparisons; use generated enum constants, never magic status numbers.

## Pattern

- Mistake: Tightened CSP without allowlisting the required Preview indexer transports.
- Rule: When browser code reads Midnight public state, allowlist only its exact indexer HTTPS and WSS origins, then assert them in browser security tests.
