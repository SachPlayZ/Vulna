import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import type { MidnightProvider, MidnightProviders, WalletProvider } from '@midnight-ntwrk/midnight-js-types';

import * as Vulna from '../contracts/managed/hello-world/contract/index.js';
import type { NetworkConfig } from './network.js';
import type { WalletContext } from './wallet.js';
import { VULNA_PRIVATE_STATE_ID, type VulnaPrivateState, vulnaWitnesses } from './vulna-witnesses.js';

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
export const VULNA_ZK_CONFIG_PATH = path.resolve(sourceDirectory, '..', 'contracts', 'managed', 'hello-world');

export type VulnaCircuits = keyof Vulna.ImpureCircuits<VulnaPrivateState> & string;
export type VulnaProviders = MidnightProviders<VulnaCircuits, typeof VULNA_PRIVATE_STATE_ID, VulnaPrivateState>;

export const vulnaCompiledContract = CompiledContract.make('hello-world', Vulna.Contract).pipe(
  CompiledContract.withWitnesses(vulnaWitnesses),
  CompiledContract.withCompiledFileAssets(VULNA_ZK_CONFIG_PATH),
);

function requirePrivateStoragePassword(value: string | undefined): string {
  const password = value?.trim();
  if (!password) {
    throw new Error('PRIVATE_STATE_PASSWORD is required; do not use a shared development fallback.');
  }
  return password;
}

function createWalletProvider(walletContext: WalletContext): WalletProvider & MidnightProvider {
  return {
    getCoinPublicKey: () => walletContext.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletContext.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(transaction, ttl) {
      const recipe = await walletContext.wallet.balanceUnboundTransaction(
        transaction,
        { shieldedSecretKeys: walletContext.shieldedSecretKeys, dustSecretKey: walletContext.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletContext.wallet.finalizeRecipe(recipe);
    },
    submitTx: (transaction) => walletContext.wallet.submitTransaction(transaction),
  };
}

/** Single Node provider factory. State encryption + scope are per wallet account. */
export function createVulnaProviders(input: {
  walletContext: WalletContext;
  network: NetworkConfig;
  privateStatePassword: string | undefined;
  /** Isolates local role contexts sharing a development wallet. */
  privateStateScope?: 'owner' | 'researcher' | 'reviewer';
}): VulnaProviders {
  const walletProvider = createWalletProvider(input.walletContext);
  const zkConfigProvider = new NodeZkConfigProvider<VulnaCircuits>(VULNA_ZK_CONFIG_PATH);
  const walletAccountId = input.walletContext.unshieldedKeystore.getBech32Address().toString();
  const accountId = input.privateStateScope ? `${walletAccountId}:${input.privateStateScope}` : walletAccountId;

  return {
    privateStateProvider: levelPrivateStateProvider<typeof VULNA_PRIVATE_STATE_ID, VulnaPrivateState>({
      midnightDbName: 'vulna-private-state',
      privateStateStoreName: 'vulna-state',
      accountId,
      privateStoragePasswordProvider: () => requirePrivateStoragePassword(input.privateStatePassword),
    }),
    publicDataProvider: indexerPublicDataProvider(input.network.indexer, input.network.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(input.network.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}
