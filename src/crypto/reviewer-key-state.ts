import sodium from 'libsodium-wrappers-sumo';
import { z } from 'zod';

import { bytesToHex, canonicalize, sha256 } from '../protocol/canonicalize.js';
import { VULNA_SCHEMA } from '../protocol/domain.js';
import { bytes32HexSchema } from '../protocol/schemas.js';
import { type CiphertextBytes, type ReviewerKeyPair, VulnaCryptoError } from './report-crypto.js';
import { type EncryptedPrivateStateStore, PrivateStateUnavailableError } from './private-state.js';

const utf8 = new TextEncoder();
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

const keyRecordSchema = z.object({
  keyId: bytes32HexSchema,
  keyVersion: z.number().int().positive(),
  publicKey: z.string().regex(/^[0-9a-f]{64}$/i),
  privateKey: z.string().regex(/^[0-9a-f]{64}$/i),
}).strict();

const stateSchema = z.object({
  schema: z.literal(VULNA_SCHEMA.reviewerKeyState),
  accountId: z.string().min(1).max(512),
  keys: z.record(z.string(), keyRecordSchema),
}).strict();

const envelopeSchema = z.object({
  schema: z.literal(VULNA_SCHEMA.reviewerKeyState),
  cipher: z.literal('xchacha20poly1305-ietf'),
  nonce: z.string().regex(/^[0-9a-f]+$/i),
  ciphertext: z.string().regex(/^[0-9a-f]+$/i),
}).strict();

type State = z.infer<typeof stateSchema>;

function asCiphertext(value: Uint8Array): CiphertextBytes {
  return value as CiphertextBytes;
}

async function crypto() {
  await sodium.ready;
  return sodium;
}

async function storageKey(accountId: string): Promise<string> {
  return `vulna:reviewer-keys:${bytesToHex(await sha256(utf8.encode(accountId)))}`;
}

function aad(accountId: string): Uint8Array {
  return canonicalize({ accountId, purpose: 'reviewer-key-state', schema: VULNA_SCHEMA.reviewerKeyState });
}

function parseJson(value: Uint8Array): unknown {
  try {
    return JSON.parse(utf8Decoder.decode(value));
  } catch {
    throw new VulnaCryptoError('DECRYPTION_FAILED', 'Reviewer key state could not be decrypted.');
  }
}

/** Encrypted, account-scoped reviewer-only Curve25519 key material. */
export class EncryptedReviewerKeyRepository {
  constructor(
    private readonly accountId: string,
    private readonly encryptionKey: Uint8Array,
    private readonly store: EncryptedPrivateStateStore,
  ) {}

  async save(pair: ReviewerKeyPair): Promise<void> {
    const sodium = await crypto();
    if (
      pair.publicKey.length !== sodium.crypto_box_PUBLICKEYBYTES ||
      pair.privateKey.length !== sodium.crypto_box_SECRETKEYBYTES ||
      pair.keyVersion < 1
    ) throw new PrivateStateUnavailableError();
    const state = await this.loadOrEmpty();
    const record = keyRecordSchema.parse({
      keyId: pair.keyId,
      keyVersion: pair.keyVersion,
      publicKey: bytesToHex(pair.publicKey),
      privateKey: bytesToHex(pair.privateKey),
    });
    await this.write({ ...state, keys: { ...state.keys, [record.keyId]: record } });
  }

  async get(keyId: string, keyVersion: number): Promise<ReviewerKeyPair | null> {
    const state = await this.loadOrEmpty();
    const record = state.keys[keyId];
    if (!record || record.keyVersion !== keyVersion) return null;
    const sodium = await crypto();
    return {
      keyId: record.keyId,
      keyVersion: record.keyVersion,
      publicKey: sodium.from_hex(record.publicKey),
      privateKey: sodium.from_hex(record.privateKey),
    };
  }

  private async loadOrEmpty(): Promise<State> {
    const encrypted = await this.store.get(await storageKey(this.accountId));
    if (!encrypted) return { schema: VULNA_SCHEMA.reviewerKeyState, accountId: this.accountId, keys: {} };
    return this.decrypt(encrypted);
  }

  private async write(state: State): Promise<void> {
    const sodium = await crypto();
    if (this.encryptionKey.length !== sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES) throw new PrivateStateUnavailableError();
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(canonicalize(state), aad(this.accountId), null, nonce, this.encryptionKey);
    await this.store.put(await storageKey(this.accountId), asCiphertext(canonicalize(envelopeSchema.parse({
      schema: VULNA_SCHEMA.reviewerKeyState,
      cipher: 'xchacha20poly1305-ietf',
      nonce: bytesToHex(nonce),
      ciphertext: bytesToHex(ciphertext),
    }))));
  }

  private async decrypt(encrypted: CiphertextBytes): Promise<State> {
    const sodium = await crypto();
    try {
      if (this.encryptionKey.length !== sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES) throw new PrivateStateUnavailableError();
      const envelope = envelopeSchema.parse(parseJson(encrypted));
      const nonce = sodium.from_hex(envelope.nonce);
      if (nonce.length !== sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES) throw new VulnaCryptoError('INVALID_ENVELOPE', 'Reviewer key state has an invalid nonce.');
      const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, sodium.from_hex(envelope.ciphertext), aad(this.accountId), nonce, this.encryptionKey);
      const state = stateSchema.parse(parseJson(plaintext));
      if (state.accountId !== this.accountId) throw new VulnaCryptoError('INVALID_ENVELOPE', 'Reviewer key state belongs to a different account.');
      return state;
    } catch (error) {
      if (error instanceof PrivateStateUnavailableError || error instanceof VulnaCryptoError) throw error;
      throw new VulnaCryptoError('DECRYPTION_FAILED', 'Reviewer key state could not be decrypted.');
    }
  }
}
