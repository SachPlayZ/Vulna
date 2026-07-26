/** Proof-backed, non-atomic settlement lifecycle; only safe values are printed. */
import { randomBytes, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import * as path from 'node:path';

import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk';
import * as Rx from 'rxjs';

import { OwnerAction, ResearcherAction, ReviewerAction, SubmissionStatus, ledger } from '../contracts/managed/hello-world/contract/index.js';
import { bytes32FromHex, reportCommitment, researcherOwnershipCommitment, roleKey, severityCommitment, severityValue, submissionNullifier } from '../src/crypto/compact-commitments.js';
import { createReviewerKeyPair, encryptReviewPackage, verifyCiphertextHash, verifyEnvelopeHash } from '../src/crypto/report-crypto.js';
import { generatePrivateStateKey, MemoryEncryptedPrivateStateStore } from '../src/crypto/private-state.js';
import { EncryptedReviewerKeyRepository } from '../src/crypto/reviewer-key-state.js';
import { payoutRecipientCommitment, settlementReceiptHash } from '../src/crypto/settlement.js';
import { bytesToHex, createReportDigest, sha256 } from '../src/protocol/canonicalize.js';
import { VULNA_SCHEMA } from '../src/protocol/domain.js';
import { getOrCreateSeed, recordDeployment, resolveNetwork } from '../src/network.js';
import { MemoryCiphertextByteStore, VerifiedEncryptedBlobStore } from '../src/storage/encrypted-blob-store.js';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from '../src/wallet.js';
import { createVulnaProviders, vulnaCompiledContract } from '../src/vulna-provider.js';
import { VULNA_PRIVATE_STATE_ID, createInitialVulnaPrivateState, type VulnaPrivateState } from '../src/vulna-witnesses.js';

const zero = '00'.repeat(32);
const hex = () => bytesToHex(randomBytes(32));

function withReport(state: VulnaPrivateState, digest: string, reportOpening: string, severity: string, severityOpening: string): VulnaPrivateState {
  return { ...state, reportDigest: bytes32FromHex(digest), reportOpening: bytes32FromHex(reportOpening), severityValue: bytes32FromHex(severity), severityOpening: bytes32FromHex(severityOpening) };
}

async function ensureDust(wallet: WalletContext): Promise<void> {
  const state = await wallet.wallet.waitForSyncedState();
  if (state.dust.balance(new Date()) > 0n) return;
  const coins = state.unshielded.availableCoins.filter((coin) => !coin.meta?.registeredForDustGeneration);
  if (coins.length) {
    const recipe = await wallet.wallet.registerNightUtxosForDustGeneration(coins, wallet.unshieldedKeystore.getPublicKey(), (payload) => wallet.unshieldedKeystore.signData(payload));
    await wallet.wallet.submitTransaction(await wallet.wallet.finalizeRecipe(recipe));
  }
  await Rx.firstValueFrom(wallet.wallet.state().pipe(Rx.filter((next) => next.isSynced && next.dust.balance(new Date()) > 0n)));
}

async function mustReject(run: () => Promise<unknown>, message: string): Promise<void> {
  try { await run(); } catch { return; }
  throw new Error(message);
}

async function reviewerProcess(input: unknown): Promise<{ reportDigest: string }> {
  const child = spawn(path.resolve('node_modules/.bin/tsx'), [path.resolve('scripts/reviewer-decrypt-context.ts')], { stdio: ['pipe', 'pipe', 'pipe'] });
  child.stdin.end(JSON.stringify(input));
  let stdout = ''; let stderr = '';
  child.stdout.setEncoding('utf8').on('data', (chunk) => { stdout += chunk; });
  child.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
  const code = await new Promise<number | null>((resolve) => child.on('exit', resolve));
  if (code !== 0) throw new Error(`Reviewer verification failed: ${stderr || 'unknown error'}`);
  return JSON.parse(stdout) as { reportDigest: string };
}

async function waitPatched(address: string, providers: ReturnType<typeof createVulnaProviders>, artifactHash: string): Promise<void> {
  for (let attempt = 0; attempt < 45; attempt += 1) {
    const state = await providers.publicDataProvider.queryContractState(address);
    if (state) {
      const submission = ledger(state.data).submissions.lookup(1n);
      if (submission.status === SubmissionStatus.PATCHED && bytesToHex(submission.artifactHash) === artifactHash) return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error('Indexer did not confirm the patched lifecycle.');
}

async function waitPaid(address: string, providers: ReturnType<typeof createVulnaProviders>): Promise<void> {
  for (let attempt = 0; attempt < 45; attempt += 1) {
    const state = await providers.publicDataProvider.queryContractState(address);
    if (state && ledger(state.data).submissions.lookup(1n).status === SubmissionStatus.PAID) return;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error('Indexer did not confirm the settlement receipt.');
}

export async function runPhase6SettlementFlow(): Promise<void> {
  const { network, config } = resolveNetwork();
  if (network !== 'undeployed' && !process.env.PRIVATE_STATE_PASSWORD?.trim()) {
    throw new Error('PRIVATE_STATE_PASSWORD is required for Preview or Preprod deployment.');
  }
  const wallet = await createWallet({ network, networkConfig: config, seed: getOrCreateSeed(network), restore: false });
  const recipient = await createWallet({ network, networkConfig: config, seed: randomBytes(32).toString('hex'), restore: false });
  try {
    await ensureDust(wallet);
    const ownerState = createInitialVulnaPrivateState(randomBytes);
    const reviewerState = createInitialVulnaPrivateState(randomBytes);
    const binding = hex(); const reportOpening = hex(); const severityOpening = hex();
    const report = { schema: VULNA_SCHEMA.report, bountyId: '1', title: 'Fictional lifecycle fixture', summary: 'Harmless local-only report.', vulnerabilityType: 'demo', affectedComponents: ['demo-only'], severityClaim: { band: 'medium' as const }, reproductionSteps: ['No real system is contacted.'], impact: 'No impact; fixture only.', attachments: [], createdAtClient: '2026-01-01T00:00:00.000Z' };
    const digest = await createReportDigest(report); const severity = await severityValue(report.severityClaim.band);
    const researcherState = withReport(createInitialVulnaPrivateState(randomBytes), digest.digestHex, reportOpening, severity, severityOpening);
    const reportCommitmentValue = reportCommitment(binding, digest.digestHex, reportOpening);
    const severityCommitmentValue = severityCommitment(binding, severity, severityOpening);
    const researcherSecret = bytesToHex(researcherState.researcherSecret);
    const ownership = researcherOwnershipCommitment(binding, researcherSecret, reportCommitmentValue);
    const nullifier = submissionNullifier(binding, researcherSecret, digest.digestHex);
    const recipientAddressText = recipient.unshieldedKeystore.getBech32Address().toString();
    const recipientCommitment = await payoutRecipientCommitment(recipientAddressText, hex());

    const keyStore = new MemoryEncryptedPrivateStateStore();
    const reviewerVault = new EncryptedReviewerKeyRepository('local-reviewer', await generatePrivateStateKey(), keyStore);
    const generatedReviewer = await createReviewerKeyPair(); await reviewerVault.save(generatedReviewer);
    const reviewer = await reviewerVault.get(generatedReviewer.keyId, generatedReviewer.keyVersion);
    if (!reviewer) throw new Error('Reviewer key recovery failed.');
    const encrypted = await encryptReviewPackage({ context: { bountyId: '1', submissionTempId: randomUUID(), bountyBinding: binding, reportCommitment: reportCommitmentValue, severityCommitment: severityCommitmentValue, reviewer }, report, reportCommitmentOpening: reportOpening, severityCommitmentOpening: severityOpening });
    const blobs = new VerifiedEncryptedBlobStore(new MemoryCiphertextByteStore());
    const stored = await blobs.put(encrypted.ciphertext, { bountyId: '1', submissionTempId: encrypted.envelope.publicMetadata.submissionTempId, artifactHash: encrypted.artifactHash, envelopeHash: encrypted.envelopeHash });

    const ownerProviders = createVulnaProviders({ walletContext: wallet, network: config, privateStatePassword: process.env.PRIVATE_STATE_PASSWORD, privateStateScope: 'owner' });
    const deployed = await deployContract(ownerProviders, { compiledContract: vulnaCompiledContract, args: [], privateStateId: VULNA_PRIVATE_STATE_ID, initialPrivateState: ownerState });
    const address = deployed.deployTxData.public.contractAddress;
    const researcherProviders = createVulnaProviders({ walletContext: wallet, network: config, privateStatePassword: process.env.PRIVATE_STATE_PASSWORD, privateStateScope: 'researcher' });
    const reviewerProviders = createVulnaProviders({ walletContext: wallet, network: config, privateStatePassword: process.env.PRIVATE_STATE_PASSWORD, privateStateScope: 'reviewer' });
    const researcherContract = await findDeployedContract(researcherProviders, { compiledContract: vulnaCompiledContract, contractAddress: address, privateStateId: VULNA_PRIVATE_STATE_ID, initialPrivateState: researcherState });
    const reviewerContract = await findDeployedContract(reviewerProviders, { compiledContract: vulnaCompiledContract, contractAddress: address, privateStateId: VULNA_PRIVATE_STATE_ID, initialPrivateState: reviewerState });
    const reviewerRole = roleKey('vulna:reviewer:v1', bytesToHex(reviewerState.actorSecret));
    await deployed.callTx.createBounty(bytes32FromHex(reviewerRole), bytes32FromHex(binding), bytes32FromHex(bytesToHex(await sha256(new TextEncoder().encode('vulna:phase5:metadata:v1')))), bytes32FromHex(bytesToHex(await sha256(new TextEncoder().encode('vulna:phase5:scope:v1')))), 1n);
    await deployed.callTx.fundBounty(1n);
    await researcherContract.callTx.submitDisclosure(1n, bytes32FromHex(reportCommitmentValue), bytes32FromHex(encrypted.artifactHash), bytes32FromHex(severityCommitmentValue), bytes32FromHex(ownership), bytes32FromHex(nullifier), bytes32FromHex(recipientCommitment));
    await mustReject(() => deployed.callTx.reviewerTransition(1n, ReviewerAction.ACKNOWLEDGE_ACCESS, 0n), 'Owner passed reviewer authorization.');
    await mustReject(() => reviewerContract.callTx.reviewerTransition(1n, ReviewerAction.ACKNOWLEDGE_ACCESS, 0n), 'Reviewer acknowledged before access grant.');
    await researcherContract.callTx.researcherTransition(1n, ResearcherAction.GRANT_ACCESS, bytes32FromHex(encrypted.envelopeHash), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero));
    await mustReject(() => deployed.callTx.ownerTransition(1n, 1n, OwnerAction.MARK_PATCHED, bytes32FromHex(hex())), 'Owner patched before acceptance.');

    const indexed = await ownerProviders.publicDataProvider.queryContractState(address);
    if (!indexed) throw new Error('Indexer did not return submitted state.');
    const submission = ledger(indexed.data).submissions.lookup(1n); const ciphertext = await blobs.getVerified(stored);
    if (!(await verifyCiphertextHash(ciphertext, bytesToHex(submission.artifactHash))) || !(await verifyEnvelopeHash(encrypted.envelope, encrypted.envelopeHash)) || bytesToHex(submission.reportCommitment) !== reportCommitmentValue || bytesToHex(submission.severityCommitment) !== severityCommitmentValue) throw new Error('Indexed report integrity verification failed.');
    const publicReviewer = { keyId: reviewer.keyId, keyVersion: reviewer.keyVersion, publicKey: Buffer.from(reviewer.publicKey).toString('hex') };
    const reviewed = await reviewerProcess({ context: { bountyId: '1', submissionTempId: encrypted.envelope.publicMetadata.submissionTempId, bountyBinding: binding, reportCommitment: bytesToHex(submission.reportCommitment), severityCommitment: bytesToHex(submission.severityCommitment), reviewer: publicReviewer }, envelope: encrypted.envelope, reviewer: { ...publicReviewer, privateKey: Buffer.from(reviewer.privateKey).toString('hex') }, expected: { artifactHash: bytesToHex(submission.artifactHash), envelopeHash: encrypted.envelopeHash, reportCommitment: bytesToHex(submission.reportCommitment), severityCommitment: bytesToHex(submission.severityCommitment) } });
    if (reviewed.reportDigest !== digest.digestHex) throw new Error('Reviewer digest verification failed.');
    await reviewerContract.callTx.reviewerTransition(1n, ReviewerAction.ACKNOWLEDGE_ACCESS, 0n);
    await reviewerContract.callTx.reviewerTransition(1n, ReviewerAction.ACCEPT, 2n);
    await deployed.callTx.ownerTransition(1n, 1n, OwnerAction.MARK_PATCHED, bytes32FromHex(hex()));
    await waitPatched(address, ownerProviders, encrypted.artifactHash);
    const recipientAddress = MidnightBech32m.parse(recipientAddressText).decode(UnshieldedAddress, network);
    // Fresh wallet contexts avoid reusing a Dust spend after the long proof batch.
    const settlementWallet = await createWallet({ network, networkConfig: config, seed: getOrCreateSeed(network), restore: false });
    let transferId: string;
    try {
      await ensureDust(settlementWallet);
      const transfer = await settlementWallet.wallet.transferTransaction([{ type: 'unshielded', outputs: [{ type: unshieldedToken().raw, receiverAddress: recipientAddress, amount: 1n }] }], {
        shieldedSecretKeys: settlementWallet.shieldedSecretKeys, dustSecretKey: settlementWallet.dustSecretKey,
      }, { ttl: new Date(Date.now() + 30 * 60 * 1000), payFees: true });
      const signedTransfer = await settlementWallet.wallet.signRecipe(transfer, (payload) => settlementWallet.unshieldedKeystore.signData(payload));
      transferId = await settlementWallet.wallet.submitTransaction(await settlementWallet.wallet.finalizeRecipe(signedTransfer));
    } finally { await settlementWallet.wallet.stop(); }
    await Rx.firstValueFrom(recipient.wallet.state().pipe(Rx.filter((state) => state.isSynced && state.unshielded.availableCoins.some((coin) => coin.utxo.value >= 1n))));
    const receiptHash = await settlementReceiptHash(transferId);
    await mustReject(() => reviewerContract.callTx.researcherTransition(1n, ResearcherAction.ACKNOWLEDGE_SETTLEMENT, bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(receiptHash)), 'Reviewer acknowledged settlement.');
    const receiptWallet = await createWallet({ network, networkConfig: config, seed: getOrCreateSeed(network), restore: false });
    try {
      await ensureDust(receiptWallet);
      const receiptProviders = createVulnaProviders({ walletContext: receiptWallet, network: config, privateStatePassword: process.env.PRIVATE_STATE_PASSWORD, privateStateScope: 'researcher' });
      const receiptContract = await findDeployedContract(receiptProviders, { compiledContract: vulnaCompiledContract, contractAddress: address, privateStateId: VULNA_PRIVATE_STATE_ID, initialPrivateState: researcherState });
      await mustReject(() => receiptContract.callTx.researcherTransition(1n, ResearcherAction.ACKNOWLEDGE_SETTLEMENT, bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero)), 'Missing receipt was accepted.');
      await receiptContract.callTx.researcherTransition(1n, ResearcherAction.ACKNOWLEDGE_SETTLEMENT, bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(zero), bytes32FromHex(receiptHash));
      await waitPaid(address, receiptProviders);
      recordDeployment(network, address, receiptWallet.unshieldedKeystore.getBech32Address().toString()); await persistWalletState(network, receiptWallet);
    } finally { await receiptWallet.wallet.stop(); }
    process.stdout.write(`Phase 6 settlement confirmed: ${address}\n`);
  } finally { await wallet.wallet.stop(); await recipient.wallet.stop(); }
}
