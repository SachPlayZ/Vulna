/** Operator-only Preview bounty creation. The enrollment bundle is public. */
import { randomBytes } from 'node:crypto';

import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import * as Rx from 'rxjs';
import { z } from 'zod';

import { BountyStatus, ledger } from '../contracts/managed/hello-world/contract/index.js';
import { bytes32FromHex } from '../src/crypto/compact-commitments.js';
import { reviewerEnrollmentPublicSchema } from '../src/crypto/reviewer-enrollment.js';
import { bytesToHex, sha256 } from '../src/protocol/canonicalize.js';
import { getDeployment, getOrCreateSeed, resolveNetwork } from '../src/network.js';
import { createVulnaProviders, vulnaCompiledContract } from '../src/vulna-provider.js';
import { VULNA_PRIVATE_STATE_ID } from '../src/vulna-witnesses.js';
import { createWallet, type WalletContext } from '../src/wallet.js';

const publicTextSchema = z.string().trim().min(1).max(200);
const rewardSchema = z.string().regex(/^[1-9][0-9]*$/);

function enrollmentFromEnvironment() {
  const raw = process.env.VULNA_REVIEWER_ENROLLMENT;
  if (!raw) throw new Error('VULNA_REVIEWER_ENROLLMENT must contain the copied public reviewer bundle.');
  try {
    return reviewerEnrollmentPublicSchema.parse(JSON.parse(raw));
  } catch {
    throw new Error('VULNA_REVIEWER_ENROLLMENT is not a valid public reviewer bundle.');
  }
}

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

async function waitForBounty(input: {
  address: string;
  binding: string;
  status: BountyStatus;
  providers: ReturnType<typeof createVulnaProviders>;
}): Promise<bigint> {
  for (let attempt = 0; attempt < 45; attempt += 1) {
    const state = await input.providers.publicDataProvider.queryContractState(input.address);
    if (state) {
      const publicLedger = ledger(state.data);
      for (let id = 1n; id <= (publicLedger.bountyCount as bigint); id += 1n) {
        if (!publicLedger.bounties.member(id)) continue;
        const bounty = publicLedger.bounties.lookup(id);
        if (bytesToHex(bounty.binding) === input.binding && bounty.status === input.status) return id;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw new Error('Bounty transaction is pending indexer confirmation. Check the operator wallet history before retrying.');
}

async function main(): Promise<void> {
  const { network, config } = resolveNetwork();
  if (network !== 'preview') throw new Error('This operator command is restricted to Preview.');
  const password = process.env.PRIVATE_STATE_PASSWORD;
  if (!password?.trim()) throw new Error('PRIVATE_STATE_PASSWORD is required to access the encrypted V2 owner state.');
  const deployment = getDeployment(network);
  if (!deployment) throw new Error('No Preview V2 deployment is recorded.');
  const enrollment = enrollmentFromEnvironment();
  const title = publicTextSchema.parse(process.env.VULNA_BOUNTY_TITLE ?? 'Harmless fictional disclosure');
  const scope = publicTextSchema.parse(process.env.VULNA_BOUNTY_SCOPE ?? 'Fictional demo application only');
  const reward = BigInt(rewardSchema.parse(process.env.VULNA_BOUNTY_REWARD ?? '1'));
  if (reward > (2n ** 64n) - 1n) throw new Error('VULNA_BOUNTY_REWARD exceeds Uint64.');

  const wallet = await createWallet({ network, networkConfig: config, seed: getOrCreateSeed(network) });
  try {
    await ensureDust(wallet);
    const providers = createVulnaProviders({
      walletContext: wallet,
      network: config,
      privateStatePassword: password,
      privateStateScope: 'owner',
    });
    const contract = await findDeployedContract(providers, {
      compiledContract: vulnaCompiledContract,
      contractAddress: deployment.address,
      privateStateId: VULNA_PRIVATE_STATE_ID,
    });
    const binding = bytesToHex(randomBytes(32));
    const metadataHash = bytesToHex(await sha256(new TextEncoder().encode(`vulna:public-metadata:v2:${title}`)));
    const scopeHash = bytesToHex(await sha256(new TextEncoder().encode(`vulna:public-scope:v2:${scope}`)));
    await contract.callTx.createBounty(
      bytes32FromHex(enrollment.reviewerRoleCommitment),
      bytes32FromHex(enrollment.reviewerEncryptionPublicKey),
      BigInt(enrollment.reviewerKeyVersion),
      bytes32FromHex(binding),
      bytes32FromHex(metadataHash),
      bytes32FromHex(scopeHash),
      reward,
    );
    const bountyId = await waitForBounty({ address: deployment.address, binding, status: BountyStatus.DRAFT, providers });
    await contract.callTx.openBounty(bountyId);
    await waitForBounty({ address: deployment.address, binding, status: BountyStatus.OPEN, providers });
    process.stdout.write(`V2 Preview bounty open: contract=${deployment.address} bountyId=${bountyId}\n`);
  } finally {
    await wallet.wallet.stop();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`V2 Preview bounty creation failed: ${error instanceof Error ? error.message : 'unknown error'}\n`);
  process.exitCode = 1;
});
