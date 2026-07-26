import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import sodium from 'libsodium-wrappers-sumo';
import { z } from 'zod';

import { bytesToHex, canonicalize, sha256 } from '../protocol/canonicalize.js';
import { type CiphertextBytes } from './report-crypto.js';
import { IndexedDbEncryptedPrivateStateStore, type EncryptedPrivateStateStore } from './private-state.js';
import { type VulnaPrivateState, VulnaWitnessStateError } from '../vulna-witnesses.js';

const utf8 = new TextEncoder();
const stateSchema = z.object({
  accountId: z.string().min(1).max(512),
  contractAddress: z.string().min(1).max(512),
  values: z.object({
    actorSecret: z.string().regex(/^[0-9a-f]{64}$/i), researcherSecret: z.string().regex(/^[0-9a-f]{64}$/i),
    reportDigest: z.string().regex(/^[0-9a-f]{64}$/i), reportOpening: z.string().regex(/^[0-9a-f]{64}$/i),
    severityValue: z.string().regex(/^[0-9a-f]{64}$/i), severityOpening: z.string().regex(/^[0-9a-f]{64}$/i),
    supplementDigest: z.string().regex(/^[0-9a-f]{64}$/i), supplementOpening: z.string().regex(/^[0-9a-f]{64}$/i),
  }).strict(),
}).strict();

type StoredWitnessState = z.infer<typeof stateSchema>;

function asCiphertext(value: Uint8Array): CiphertextBytes {
  return value as CiphertextBytes;
}

function toHexState(state: VulnaPrivateState): StoredWitnessState['values'] {
  return {
    actorSecret: bytesToHex(state.actorSecret), researcherSecret: bytesToHex(state.researcherSecret), reportDigest: bytesToHex(state.reportDigest), reportOpening: bytesToHex(state.reportOpening),
    severityValue: bytesToHex(state.severityValue), severityOpening: bytesToHex(state.severityOpening), supplementDigest: bytesToHex(state.supplementDigest), supplementOpening: bytesToHex(state.supplementOpening),
  };
}

function fromHex(value: string): Uint8Array {
  const result = new Uint8Array(32);
  for (let i = 0; i < 32; i += 1) result[i] = Number.parseInt(value.slice(i * 2, i * 2 + 2), 16);
  return result;
}

function toWitnessState(value: StoredWitnessState['values']): VulnaPrivateState {
  return {
    actorSecret: fromHex(value.actorSecret), researcherSecret: fromHex(value.researcherSecret), reportDigest: fromHex(value.reportDigest), reportOpening: fromHex(value.reportOpening),
    severityValue: fromHex(value.severityValue), severityOpening: fromHex(value.severityOpening), supplementDigest: fromHex(value.supplementDigest), supplementOpening: fromHex(value.supplementOpening),
  };
}

async function recordKey(accountId: string, contractAddress: string): Promise<string> {
  return `vulna:witness-state:${bytesToHex(await sha256(utf8.encode(`${accountId}:${contractAddress}`)))}`;
}

/** Derives an in-memory encryption key from a wallet-authorized signature; never persists the signature or key. */
export async function deriveBrowserWitnessKey(api: ConnectedAPI, accountId: string): Promise<Uint8Array> {
  const signature = await api.signData(`Vulna encrypted witness state v1:${accountId}`, { encoding: 'text', keyType: 'unshielded' });
  return new Uint8Array(await sha256(utf8.encode(`vulna:witness-key:v1:${signature.signature}`)));
}

export class BrowserWitnessStateRepository {
  constructor(
    private readonly accountId: string,
    private readonly encryptionKey: Uint8Array,
    private readonly store: EncryptedPrivateStateStore = new IndexedDbEncryptedPrivateStateStore('vulna-browser-witness-state'),
  ) {}

  async get(contractAddress: string): Promise<VulnaPrivateState | null> {
    const raw = await this.store.get(await recordKey(this.accountId, contractAddress));
    if (!raw) return null;
    const encrypted = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(raw)) as { nonce?: string; ciphertext?: string };
    if (!encrypted.nonce || !encrypted.ciphertext) throw new VulnaWitnessStateError();
    await sodium.ready;
    try {
      const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null, sodium.from_hex(encrypted.ciphertext), canonicalize({ accountId: this.accountId, contractAddress, purpose: 'browser-witness-state', schema: 'v1' }), sodium.from_hex(encrypted.nonce), this.encryptionKey,
      );
      const parsed = stateSchema.parse(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(plaintext)));
      if (parsed.accountId !== this.accountId || parsed.contractAddress !== contractAddress) throw new VulnaWitnessStateError();
      return toWitnessState(parsed.values);
    } catch {
      throw new VulnaWitnessStateError();
    }
  }

  async save(contractAddress: string, state: VulnaPrivateState): Promise<void> {
    await sodium.ready;
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
    const plaintext = canonicalize(stateSchema.parse({ accountId: this.accountId, contractAddress, values: toHexState(state) }));
    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
      plaintext, canonicalize({ accountId: this.accountId, contractAddress, purpose: 'browser-witness-state', schema: 'v1' }), null, nonce, this.encryptionKey,
    );
    await this.store.put(await recordKey(this.accountId, contractAddress), asCiphertext(canonicalize({ schema: 'vulna.browser-witness-state.v1', nonce: bytesToHex(nonce), ciphertext: bytesToHex(ciphertext) })));
  }
}
