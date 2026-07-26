import { runPhase6SettlementFlow } from './phase5-review-flow.js';

runPhase6SettlementFlow().catch((error: unknown) => {
  process.stderr.write(`Phase 6 settlement failed: ${error instanceof Error ? error.message : 'unknown error'}\n`);
  process.exitCode = 1;
});
