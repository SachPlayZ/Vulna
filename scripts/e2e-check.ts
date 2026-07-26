/**
 * Read-only local-environment smoke check.
 *
 * The recorded deployment is the Phase 0 hello-world scaffold. It remains a
 * useful node/indexer health check, but it is intentionally not treated as a
 * Vulna protocol test after Phase 2 changed the Compact ABI. Phase 4 replaces
 * it with a deployed Vulna contract and witness-backed integration flow.
 */
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { getDeployment, resolveNetwork } from '../src/network';

const { network, config: networkConfig } = resolveNetwork();

function fail(message: string): never {
  console.error(`❌ e2e-check failed: ${message}`);
  process.exit(1);
}

function isHexAddress(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-fA-F]+$/.test(value) && value.length >= 32;
}

async function main() {
  const deployment = getDeployment(network);
  if (!deployment) fail(`No scaffold deployment recorded for network ${network}.`);
  if (!isHexAddress(deployment.address)) fail('Recorded scaffold deployment address is invalid.');

  const publicDataProvider = indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS);
  const onChainState = await publicDataProvider.queryContractState(deployment.address);
  if (!onChainState) fail(`Indexer returned no contract state for ${deployment.address}.`);

  console.log('✅ scaffold node/indexer smoke passed');
  console.log(`   contractAddress: ${deployment.address}`);
  console.log(`   network:         ${network}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'unknown error';
  fail(message);
});
