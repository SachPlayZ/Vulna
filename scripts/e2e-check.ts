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
  const configuredAddress = process.env.VULNA_E2E_CONTRACT_ADDRESS?.trim();
  const deployment = getDeployment(network);
  const address = configuredAddress || (network === 'undeployed' ? deployment?.address : undefined);
  if (!address) fail('Set VULNA_E2E_CONTRACT_ADDRESS to the completed lifecycle fixture on Preview or Preprod.');
  if (!isHexAddress(address)) fail('Configured contract address is invalid.');

  const publicDataProvider = indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS);
  const onChainState = await publicDataProvider.queryContractState(address);
  if (!onChainState) fail(`Indexer returned no contract state for ${address}.`);
  const publicLedger = ledger(onChainState.data);
  if (publicLedger.bountyCount < 1n || publicLedger.submissionCount < 1n) fail('Indexed Vulna fixture is incomplete.');
  if (publicLedger.submissions.lookup(1n).status !== SubmissionStatus.PAID) fail('Indexed submission settlement is not acknowledged.');

  console.log('✅ Vulna indexer confirmation passed');
  console.log(`   contractAddress: ${address}`);
  console.log(`   network:         ${network}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'unknown error';
  fail(message);
});
