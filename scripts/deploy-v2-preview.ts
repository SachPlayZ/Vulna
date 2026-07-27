/** Deploy only: creates no bounty, submission, or settlement record. */
import { randomBytes } from 'node:crypto';

import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import * as Rx from 'rxjs';

import { getOrCreateSeed, recordDeployment, resolveNetwork } from '../src/network.js';
import { createVulnaProviders, vulnaCompiledContract } from '../src/vulna-provider.js';
import { createInitialVulnaPrivateState, VULNA_PRIVATE_STATE_ID } from '../src/vulna-witnesses.js';
import { createWallet, persistWalletState, type WalletContext } from '../src/wallet.js';

async function ensureDust(wallet: WalletContext): Promise<void> {
  const current = await wallet.wallet.waitForSyncedState();
  if (current.dust.balance(new Date()) > 0n) return;
  const coins = current.unshielded.availableCoins.filter((coin) => !coin.meta?.registeredForDustGeneration);
  if (coins.length > 0) {
    const recipe = await wallet.wallet.registerNightUtxosForDustGeneration(
      coins,
      wallet.unshieldedKeystore.getPublicKey(),
      (payload) => wallet.unshieldedKeystore.signData(payload),
    );
    await wallet.wallet.submitTransaction(await wallet.wallet.finalizeRecipe(recipe));
  }
  await Rx.firstValueFrom(wallet.wallet.state().pipe(
    Rx.filter((state) => state.isSynced && state.dust.balance(new Date()) > 0n),
  ));
}

async function waitForIndexedState(
  address: string,
  providers: ReturnType<typeof createVulnaProviders>,
): Promise<void> {
  for (let attempt = 0; attempt < 45; attempt += 1) {
    if (await providers.publicDataProvider.queryContractState(address)) return;
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw new Error('V2 deployment submitted but was not indexed within 90 seconds. Check the Preview indexer before retrying.');
}

async function main(): Promise<void> {
  const { network, config } = resolveNetwork();
  if (network !== 'preview') throw new Error('This deploy-only command is restricted to Preview.');
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD;
  if (!privateStatePassword?.trim()) throw new Error('PRIVATE_STATE_PASSWORD is required to retain the V2 owner state securely.');

  const wallet = await createWallet({ network, networkConfig: config, seed: getOrCreateSeed(network) });
  try {
    await ensureDust(wallet);
    const ownerState = createInitialVulnaPrivateState(randomBytes);
    const providers = createVulnaProviders({
      walletContext: wallet,
      network: config,
      privateStatePassword,
      privateStateScope: 'owner',
    });
    const deployed = await deployContract(providers, {
      compiledContract: vulnaCompiledContract,
      args: [],
      privateStateId: VULNA_PRIVATE_STATE_ID,
      initialPrivateState: ownerState,
    });
    const address = String(deployed.deployTxData.public.contractAddress);
    await waitForIndexedState(address, providers);
    recordDeployment(network, address, wallet.unshieldedKeystore.getBech32Address().toString());
    await persistWalletState(network, wallet);
    process.stdout.write(`V2 Preview deployment indexed: ${address}\n`);
  } finally {
    await wallet.wallet.stop();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`V2 Preview deployment failed: ${error instanceof Error ? error.message : 'unknown error'}\n`);
  process.exitCode = 1;
});
