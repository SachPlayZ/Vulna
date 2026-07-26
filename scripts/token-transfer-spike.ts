/** Proves installed SDK local NIGHT transfer semantics; prints no keys or balances. */
import { randomBytes } from 'node:crypto';
import { MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk';
import * as Rx from 'rxjs';

import { getOrCreateSeed, resolveNetwork } from '../src/network.js';
import { createWallet, unshieldedToken } from '../src/wallet.js';

const TEST_AMOUNT = 1n;

async function main(): Promise<void> {
  const { network, config } = resolveNetwork();
  if (network !== 'undeployed') throw new Error('Settlement spike is restricted to the local undeployed network.');
  const owner = await createWallet({ network, networkConfig: config, seed: getOrCreateSeed(network) });
  const recipient = await createWallet({ network, networkConfig: config, seed: randomBytes(32).toString('hex'), restore: false });
  try {
    const recipientAddress = MidnightBech32m.parse(recipient.unshieldedKeystore.getBech32Address().toString()).decode(UnshieldedAddress, network);
    const recipe = await owner.wallet.transferTransaction([{
      type: 'unshielded',
      outputs: [{ type: unshieldedToken().raw, receiverAddress: recipientAddress, amount: TEST_AMOUNT }],
    }], {
      shieldedSecretKeys: owner.shieldedSecretKeys,
      dustSecretKey: owner.dustSecretKey,
    }, { ttl: new Date(Date.now() + 30 * 60 * 1000), payFees: true });
    const signed = await owner.wallet.signRecipe(
      recipe,
      (payload) => owner.unshieldedKeystore.signData(payload),
    );
    await owner.wallet.submitTransaction(await owner.wallet.finalizeRecipe(signed));
    await Rx.firstValueFrom(recipient.wallet.state().pipe(
      Rx.filter((state) => state.isSynced && state.unshielded.availableCoins.some((coin) => coin.utxo.value >= TEST_AMOUNT)),
    ));
    process.stdout.write('Local NIGHT transfer spike confirmed.\n');
  } finally {
    await owner.wallet.stop();
    await recipient.wallet.stop();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`Settlement spike failed: ${error instanceof Error ? error.message : 'unknown error'}\n`);
  process.exitCode = 1;
});
