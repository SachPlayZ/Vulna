/**
 * Local devnet integration: deploy current Vulna ABI, submit one encrypted
 * fictional disclosure, then verify indexed public state. Never logs report
 * plaintext, witnesses, private state, ciphertext, or cryptographic secrets.
 */
import { randomBytes, randomUUID } from 'node:crypto';

import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import * as Rx from 'rxjs';

import { bytes32FromHex, reportCommitment, researcherOwnershipCommitment, roleKey, severityCommitment, severityValue, submissionNullifier } from '../src/crypto/compact-commitments.js';
import { createReviewerKeyPair, encryptReviewPackage } from '../src/crypto/report-crypto.js';
import { bytesToHex, createReportDigest, sha256 } from '../src/protocol/canonicalize.js';
import { VULNA_DOMAIN, VULNA_SCHEMA } from '../src/protocol/domain.js';
import { resolveNetwork, getOrCreateSeed, recordDeployment } from '../src/network.js';
import { MemoryCiphertextByteStore, VerifiedEncryptedBlobStore } from '../src/storage/encrypted-blob-store.js';
import { createWallet, persistWalletState, type WalletContext } from '../src/wallet.js';
import { createVulnaProviders, vulnaCompiledContract } from '../src/vulna-provider.js';
import { createInitialVulnaPrivateState } from '../src/vulna-witnesses.js';

function randomHex(): string {
  return bytesToHex(randomBytes(32));
}

async function ensureDust(walletContext: WalletContext): Promise<void> {
  const state = await walletContext.wallet.waitForSyncedState();
  if (state.dust.balance(new Date()) > 0n) return;
  const unregistered = state.unshielded.availableCoins.filter((coin) => !coin.meta?.registeredForDustGeneration);
  if (unregistered.length > 0) {
    const recipe = await walletContext.wallet.registerNightUtxosForDustGeneration(
      unregistered,
      walletContext.unshieldedKeystore.getPublicKey(),
      (payload) => walletContext.unshieldedKeystore.signData(payload),
    );
    await walletContext.wallet.submitTransaction(await walletContext.wallet.finalizeRecipe(recipe));
  }
  await Rx.firstValueFrom(walletContext.wallet.state().pipe(
    Rx.filter((candidate) => candidate.isSynced && candidate.dust.balance(new Date()) > 0n),
  ));
}

async function waitForIndexedSubmission(input: {
  address: string;
  providers: ReturnType<typeof createVulnaProviders>;
  artifactHash: string;
}): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const state = await input.providers.publicDataProvider.queryContractState(input.address);
    if (state) {
      const ledger = (await import('../contracts/managed/hello-world/contract/index.js')).ledger(state.data);
      if (ledger.bountyCount === 1n && ledger.submissionCount === 1n) {
        const submission = ledger.submissions.lookup(1n);
        if (bytesToHex(submission.artifactHash) === input.artifactHash) return;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error('Indexer did not confirm the proof-backed submission.');
}

async function main(): Promise<void> {
  const { network, config } = resolveNetwork();
  if (network !== 'undeployed') throw new Error('Phase 4 proof flow is restricted to the local undeployed network.');

  const walletContext = await createWallet({ network, networkConfig: config, seed: getOrCreateSeed(network) });
  try {
    await ensureDust(walletContext);
    const baseState = createInitialVulnaPrivateState(randomBytes);
    const bountyBinding = randomHex();
    const reportOpening = randomHex();
    const severityOpening = randomHex();
    const report = {
      schema: VULNA_SCHEMA.report,
      bountyId: '1',
      title: 'Fictional demo report',
      summary: 'Harmless local integration fixture.',
      vulnerabilityType: 'demo',
      affectedComponents: ['demo-only'],
      severityClaim: { band: 'low' as const },
      reproductionSteps: ['No real system is contacted.'],
      impact: 'No impact; fixture only.',
      attachments: [],
      createdAtClient: '2026-01-01T00:00:00.000Z',
    };
    const digest = await createReportDigest(report);
    const severity = await severityValue(report.severityClaim.band);
    const privateState = {
      ...baseState,
      reportDigest: bytes32FromHex(digest.digestHex),
      reportOpening: bytes32FromHex(reportOpening),
      severityValue: bytes32FromHex(severity),
      severityOpening: bytes32FromHex(severityOpening),
    };
    const reportCommitmentValue = reportCommitment(bountyBinding, digest.digestHex, reportOpening);
    const severityCommitmentValue = severityCommitment(bountyBinding, severity, severityOpening);
    const researcherSecret = bytesToHex(privateState.researcherSecret);
    const ownershipCommitment = researcherOwnershipCommitment(bountyBinding, researcherSecret, reportCommitmentValue);
    const nullifier = submissionNullifier(bountyBinding, researcherSecret, digest.digestHex);
    const reviewer = await createReviewerKeyPair();
    const encrypted = await encryptReviewPackage({
      context: {
        bountyId: '1',
        submissionTempId: randomUUID(),
        bountyBinding,
        reportCommitment: reportCommitmentValue,
        severityCommitment: severityCommitmentValue,
        reviewer,
      },
      report,
      reportCommitmentOpening: reportOpening,
      severityCommitmentOpening: severityOpening,
    });
    const encryptedStore = new VerifiedEncryptedBlobStore(new MemoryCiphertextByteStore());
    await encryptedStore.put(encrypted.ciphertext, {
      bountyId: '1',
      submissionTempId: encrypted.envelope.publicMetadata.submissionTempId,
      artifactHash: encrypted.artifactHash,
      envelopeHash: encrypted.envelopeHash,
    });

    const providers = createVulnaProviders({
      walletContext,
      network: config,
      privateStatePassword: process.env.PRIVATE_STATE_PASSWORD,
    });
    const deployed = await deployContract(providers, {
      compiledContract: vulnaCompiledContract,
      args: [],
      privateStateId: 'vulnaPrivateState',
      initialPrivateState: privateState,
    });
    const reviewerRole = roleKey('vulna:reviewer:v1', bytesToHex(privateState.actorSecret));
    const safeMetadataHash = bytesToHex(await sha256(new TextEncoder().encode('vulna:phase4:metadata:v1')));
    const safeScopeHash = bytesToHex(await sha256(new TextEncoder().encode('vulna:phase4:scope:v1')));
    await deployed.callTx.createBounty(bytes32FromHex(reviewerRole), bytes32FromHex(bountyBinding), bytes32FromHex(safeMetadataHash), bytes32FromHex(safeScopeHash), 1n);
    await deployed.callTx.fundBounty(1n);
    await deployed.callTx.submitDisclosure(
      1n,
      bytes32FromHex(reportCommitmentValue),
      bytes32FromHex(encrypted.artifactHash),
      bytes32FromHex(severityCommitmentValue),
      bytes32FromHex(ownershipCommitment),
      bytes32FromHex(nullifier),
    );

    const address = deployed.deployTxData.public.contractAddress;
    await waitForIndexedSubmission({ address, providers, artifactHash: encrypted.artifactHash });
    recordDeployment(network, address, walletContext.unshieldedKeystore.getBech32Address().toString());
    await persistWalletState(network, walletContext);
    process.stdout.write(`Phase 4 proof flow confirmed: ${address}\n`);
  } finally {
    await walletContext.wallet.stop();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Phase 4 proof flow failed.';
  process.stderr.write(`Phase 4 proof flow failed: ${message}\n`);
  process.exitCode = 1;
});
