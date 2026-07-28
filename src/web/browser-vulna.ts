'use client';

import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { createCallTxOptions, createUnprovenCallTx, createUnprovenDeployTx } from '@midnight-ntwrk/midnight-js-contracts';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { fromHex, parseCoinPublicKeyToHex, parseEncPublicKeyToHex, toHex } from '@midnight-ntwrk/midnight-js-utils';
import { CostModel, Transaction, sampleSigningKey, type FinalizedTransaction, type PreBinding, type Proof, type SignatureEnabled, type UnprovenTransaction } from '@midnight-ntwrk/ledger-v8';
import type { WalletProvider } from '@midnight-ntwrk/midnight-js-types';

import * as Vulna from '../../contracts/managed/hello-world/contract/index.js';
import { deriveBrowserWitnessKey, BrowserWitnessStateRepository } from '../crypto/browser-witness-state.js';
import { createInitialVulnaPrivateState, VULNA_PRIVATE_STATE_ID, type VulnaPrivateState, vulnaWitnesses } from '../vulna-witnesses.js';
import { BrowserVulnaPrivateStateProvider } from './browser-private-provider.js';

export class BrowserTransactionError extends Error {
  constructor(message = 'The wallet transaction could not be completed.') { super(message); this.name = 'BrowserTransactionError'; }
}

export type IndexedBounty = Readonly<{
  id: bigint;
  binding: Uint8Array;
  reviewerEncryptionPublicKey: Uint8Array;
  reviewerKeyVersion: bigint;
  rewardAmount: bigint;
  status: Vulna.BountyStatus;
}>;

type VulnaCircuits = keyof Vulna.ImpureCircuits<VulnaPrivateState> & string;
type BrowserCall =
  | Readonly<{ circuitId: 'createBounty'; args: [Uint8Array, Uint8Array, bigint, Uint8Array, Uint8Array, Uint8Array, bigint] }>
  | Readonly<{ circuitId: 'openBounty'; args: [bigint] }>
  | Readonly<{ circuitId: 'submitDisclosure'; args: [bigint, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array] }>
  | Readonly<{ circuitId: 'researcherTransition'; args: [bigint, Vulna.ResearcherAction, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array] }>;

const compiledContract = CompiledContract.make('hello-world', Vulna.Contract).pipe(
  CompiledContract.withWitnesses(vulnaWitnesses),
  CompiledContract.withCompiledFileAssets('/contract/hello-world'),
);

function randomState(): VulnaPrivateState {
  return createInitialVulnaPrivateState((length) => {
    const bytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  });
}

async function session(api: ConnectedAPI, accountId: string) {
  const [config, shielded] = await Promise.all([api.getConfiguration(), api.getShieldedAddresses()]);
  if (config.networkId !== 'preview') throw new BrowserTransactionError('Switch the wallet to Preview Midnight.');
  setNetworkId(config.networkId);
  const zkConfigProvider = new FetchZkConfigProvider<VulnaCircuits>(new URL('/contract/hello-world/', window.location.origin).toString(), window.fetch.bind(window));
  const provingProvider = await api.getProvingProvider(zkConfigProvider);
  const proofProvider = { proveTx: (transaction: UnprovenTransaction): Promise<Transaction<SignatureEnabled, Proof, PreBinding>> => transaction.prove(provingProvider, CostModel.initialCostModel()) };
  const walletProvider: WalletProvider = {
    getCoinPublicKey: () => parseCoinPublicKeyToHex(shielded.shieldedCoinPublicKey, config.networkId),
    getEncryptionPublicKey: () => parseEncPublicKeyToHex(shielded.shieldedEncryptionPublicKey, config.networkId),
    async balanceTx(transaction: Transaction<SignatureEnabled, Proof, PreBinding>): Promise<FinalizedTransaction> {
      const balanced = await api.balanceUnsealedTransaction(toHex(transaction.serialize()));
      return Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced.tx));
    },
  };
  const key = await deriveBrowserWitnessKey(api, accountId);
  const repository = new BrowserWitnessStateRepository(accountId, key);
  return { config, repository, zkConfigProvider, proofProvider, walletProvider, publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri) };
}

async function publicSession(api: ConnectedAPI) {
  const config = await api.getConfiguration();
  if (config.networkId !== 'preview') throw new BrowserTransactionError('Switch the wallet to Preview Midnight.');
  setNetworkId(config.networkId);
  return { publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri) };
}

async function submitTransaction(api: ConnectedAPI, unprovenTx: UnprovenTransaction, proofProvider: Awaited<ReturnType<typeof session>>['proofProvider'], walletProvider: WalletProvider): Promise<void> {
  const proven = await proofProvider.proveTx(unprovenTx);
  const balanced = await walletProvider.balanceTx(proven);
  await api.submitTransaction(toHex(balanced.serialize()));
}

async function waitForIndex<T>(read: () => Promise<T>, predicate: (value: T) => boolean): Promise<T> {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const value = await read();
    if (predicate(value)) return value;
    await new Promise((resolve) => window.setTimeout(resolve, 2_000));
  }
  throw new BrowserTransactionError('The transaction is pending indexer confirmation. Check the wallet history before retrying.');
}

export async function deployVulnaV2(api: ConnectedAPI, accountId: string): Promise<string> {
  const current = await session(api, accountId);
  const initialPrivateState = randomState();
  const deployment = await createUnprovenDeployTx({ zkConfigProvider: current.zkConfigProvider, walletProvider: current.walletProvider }, {
    compiledContract, initialPrivateState, signingKey: sampleSigningKey(),
  });
  const contractAddress = String(deployment.public.contractAddress);
  await submitTransaction(api, deployment.private.unprovenTx, current.proofProvider, current.walletProvider);
  await waitForIndex(() => current.publicDataProvider.queryContractState(contractAddress), () => true);
  await current.repository.save(contractAddress, initialPrivateState);
  return contractAddress;
}

export async function initializeResearcherWitnessState(api: ConnectedAPI, accountId: string, contractAddress: string): Promise<VulnaPrivateState> {
  const current = await session(api, accountId);
  const existing = await current.repository.get(contractAddress);
  if (existing) return existing;
  const initial = randomState();
  await current.repository.save(contractAddress, initial);
  return initial;
}

export async function saveDisclosureWitnessState(api: ConnectedAPI, accountId: string, contractAddress: string, values: Readonly<{ reportDigest: Uint8Array; reportOpening: Uint8Array; severityValue: Uint8Array; severityOpening: Uint8Array }>): Promise<void> {
  const current = await session(api, accountId);
  const state = await current.repository.get(contractAddress);
  if (!state) throw new BrowserTransactionError('Initialize encrypted researcher state before preparing a report.');
  await current.repository.save(contractAddress, { ...state, ...values });
}

export async function listIndexedBounties(api: ConnectedAPI, contractAddress: string): Promise<ReadonlyArray<IndexedBounty>> {
  const current = await publicSession(api);
  const state = await current.publicDataProvider.queryContractState(contractAddress);
  if (!state) throw new BrowserTransactionError('Contract state is not indexed yet.');
  const ledger = Vulna.ledger(state.data);
  const count = ledger.bountyCount as bigint;
  const bounties: IndexedBounty[] = [];
  for (let id: bigint = 1n; id <= count; id = id + 1n) {
    if (!ledger.bounties.member(id)) continue;
    const bounty = ledger.bounties.lookup(id);
    bounties.push({ id, binding: new Uint8Array(bounty.binding), reviewerEncryptionPublicKey: new Uint8Array(bounty.reviewerEncryptionPublicKey), reviewerKeyVersion: bounty.reviewerKeyVersion as bigint, rewardAmount: bounty.rewardAmount as bigint, status: bounty.status });
  }
  return bounties;
}

async function callWithWitnessState(
  api: ConnectedAPI,
  accountId: string,
  contractAddress: string,
  request: BrowserCall,
  confirmed: () => Promise<boolean>,
): Promise<void> {
  const current = await session(api, accountId);
  const state = await current.repository.get(contractAddress);
  if (!state) throw new BrowserTransactionError('Encrypted witness state is missing for this wallet and contract. Restore it before continuing.');
  const privateStateProvider = new BrowserVulnaPrivateStateProvider(current.repository);
  privateStateProvider.setContractAddress(contractAddress);
  const providers = { zkConfigProvider: current.zkConfigProvider, publicDataProvider: current.publicDataProvider, walletProvider: current.walletProvider, privateStateProvider };
  const options = createCallTxOptions(compiledContract, request.circuitId, contractAddress, VULNA_PRIVATE_STATE_ID, undefined, request.args);
  const created = await createUnprovenCallTx(providers, options);
  await submitTransaction(api, created.private.unprovenTx, current.proofProvider, current.walletProvider);
  await waitForIndex(confirmed, (value) => value);
  await current.repository.save(contractAddress, created.private.nextPrivateState);
}

export async function openBounty(api: ConnectedAPI, accountId: string, contractAddress: string, bountyId: bigint): Promise<void> {
  await callWithWitnessState(api, accountId, contractAddress, { circuitId: 'openBounty', args: [bountyId] }, async () => {
    const bounties = await listIndexedBounties(api, contractAddress);
    return bounties.some((bounty) => bounty.id === bountyId && bounty.status === Vulna.BountyStatus.OPEN);
  });
}

export async function createBounty(api: ConnectedAPI, accountId: string, contractAddress: string, input: Readonly<{
  reviewerRole: Uint8Array;
  reviewerEncryptionPublicKey: Uint8Array;
  reviewerKeyVersion: bigint;
  binding: Uint8Array;
  metadataHash: Uint8Array;
  scopeHash: Uint8Array;
  rewardAmount: bigint;
}>): Promise<void> {
  const before = (await listIndexedBounties(api, contractAddress)).length;
  await callWithWitnessState(api, accountId, contractAddress, {
    circuitId: 'createBounty',
    args: [input.reviewerRole, input.reviewerEncryptionPublicKey, input.reviewerKeyVersion, input.binding, input.metadataHash, input.scopeHash, input.rewardAmount],
  }, async () => (await listIndexedBounties(api, contractAddress)).length > before);
}

export async function submitDisclosure(api: ConnectedAPI, accountId: string, contractAddress: string, args: [bigint, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array]): Promise<bigint> {
  await callWithWitnessState(api, accountId, contractAddress, { circuitId: 'submitDisclosure', args }, async () => {
    const current = await session(api, accountId);
    const state = await current.publicDataProvider.queryContractState(contractAddress);
    if (!state) return false;
    const ledger = Vulna.ledger(state.data);
    for (let id: bigint = 1n; id <= (ledger.submissionCount as bigint); id = id + 1n) {
      if (toHex(ledger.submissions.lookup(id).nullifier) === toHex(args[5])) return true;
    }
    return false;
  });
  const current = await session(api, accountId);
  const state = await current.publicDataProvider.queryContractState(contractAddress);
  if (!state) throw new BrowserTransactionError('Submission state is not indexed yet.');
  const ledger = Vulna.ledger(state.data);
  for (let id: bigint = 1n; id <= (ledger.submissionCount as bigint); id = id + 1n) {
    const candidate = ledger.submissions.lookup(id);
    if (toHex(candidate.nullifier) === toHex(args[5])) return id;
  }
  throw new BrowserTransactionError('Submitted disclosure could not be located after indexing.');
}

export async function grantReviewerAccess(api: ConnectedAPI, accountId: string, contractAddress: string, submissionId: bigint, envelopeHash: Uint8Array): Promise<void> {
  const zero = new Uint8Array(32);
  await callWithWitnessState(api, accountId, contractAddress, {
    circuitId: 'researcherTransition',
    args: [submissionId, Vulna.ResearcherAction.GRANT_ACCESS, envelopeHash, zero, zero, zero, zero, zero],
  }, async () => {
    const current = await session(api, accountId);
    const state = await current.publicDataProvider.queryContractState(contractAddress);
    if (!state) return false;
    return Vulna.ledger(state.data).submissions.lookup(submissionId).status === Vulna.SubmissionStatus.ACCESS_GRANTED;
  });
}
