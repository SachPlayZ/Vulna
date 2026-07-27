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
