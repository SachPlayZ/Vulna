/**
 * Read-only local-environment smoke check.
 *
 * Verifies the current Vulna ABI through the public indexer only. It reads no
 * private state, ciphertext, report payload, or witness data.
 */
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { SubmissionStatus, ledger } from '../contracts/managed/hello-world/contract/index.js';
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
  if (!deployment) fail(`No Vulna deployment recorded for network ${network}.`);
  if (!isHexAddress(deployment.address)) fail('Recorded Vulna deployment address is invalid.');

  const publicDataProvider = indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS);
  const onChainState = await publicDataProvider.queryContractState(deployment.address);
  if (!onChainState) fail(`Indexer returned no contract state for ${deployment.address}.`);
  const publicLedger = ledger(onChainState.data);
  if (publicLedger.bountyCount < 1n || publicLedger.submissionCount < 1n) fail('Indexed Vulna fixture is incomplete.');
  if (publicLedger.submissions.lookup(1n).status !== SubmissionStatus.PATCHED) fail('Indexed submission is not patched.');

  console.log('✅ Vulna indexer confirmation passed');
  console.log(`   contractAddress: ${deployment.address}`);
  console.log(`   network:         ${network}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'unknown error';
  fail(message);
});
