import sodium from 'libsodium-wrappers-sumo';
import { z } from 'zod';

import { bytesToHex, canonicalize, sha256 } from '../protocol/canonicalize.js';
import { VULNA_SCHEMA } from '../protocol/domain.js';
import { bytes32HexSchema, positiveDecimalStringSchema } from '../protocol/schemas.js';
import { type CiphertextBytes, VulnaCryptoError } from './report-crypto.js';

const utf8 = new TextEncoder();
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

const privateSubmissionRecordSchema = z.object({
  bountyId: positiveDecimalStringSchema,
  reportDigest: bytes32HexSchema,
  reportCommitmentOpening: bytes32HexSchema,
  severityValue: bytes32HexSchema,
  severityCommitmentOpening: bytes32HexSchema,
  artifactLocator: z.string().min(1).max(2_000),
  artifactHash: bytes32HexSchema,
  envelopeHash: bytes32HexSchema,
}).strict();

export type PrivateSubmissionRecord = z.infer<typeof privateSubmissionRecordSchema>;

const privateStateSchema = z.object({
  schema: z.literal(VULNA_SCHEMA.privateState),
  accountId: z.string().min(1).max(512),
  appSecret: bytes32HexSchema,
  submissions: z.record(z.string().uuid(), privateSubmissionRecordSchema),
}).strict();

type PrivateState = z.infer<typeof privateStateSchema>;

const encryptedPrivateStateSchema = z.object({
  schema: z.literal(VULNA_SCHEMA.privateState),
  cipher: z.literal('xchacha20poly1305-ietf'),
  nonce: z.string().regex(/^[0-9a-f]+$/i),
  ciphertext: z.string().regex(/^[0-9a-f]+$/i),
}).strict();

export interface EncryptedPrivateStateStore {
  get(key: string): Promise<CiphertextBytes | null>;
  put(key: string, value: CiphertextBytes): Promise<void>;
}

export class PrivateStateUnavailableError extends Error {
  constructor() {
    super('Vulna private state is unavailable. Restore an encrypted backup before continuing.');
    this.name = 'PrivateStateUnavailableError';
  }
}

function asCiphertext(value: Uint8Array): CiphertextBytes {
  return value as CiphertextBytes;
}

function copy(value: CiphertextBytes): CiphertextBytes {
  return asCiphertext(new Uint8Array(value));
}

async function crypto() {
  await sodium.ready;
  return sodium;
}

async function storageKey(accountId: string): Promise<string> {
  return `vulna:private-state:${bytesToHex(await sha256(utf8.encode(accountId)))}`;
}

function aad(accountId: string): Uint8Array {
  return canonicalize({ accountId, purpose: 'private-state', schema: VULNA_SCHEMA.privateState });
}

function parseJson(value: Uint8Array): unknown {
  try {
    return JSON.parse(utf8Decoder.decode(value));
  } catch {
    throw new VulnaCryptoError('DECRYPTION_FAILED', 'Encrypted private state could not be decrypted.');
  }
}

export async function generatePrivateStateKey(): Promise<Uint8Array> {
  const sodium = await crypto();
  return sodium.crypto_aead_xchacha20poly1305_ietf_keygen();
}

export class EncryptedPrivateStateRepository {
  constructor(
    private readonly accountId: string,
    private readonly encryptionKey: Uint8Array,
    private readonly store: EncryptedPrivateStateStore,
  ) {}

  async initialize(appSecret: string): Promise<void> {
    if (await this.loadOrNull()) return;
    await this.write(privateStateSchema.parse({
      schema: VULNA_SCHEMA.privateState,
      accountId: this.accountId,
      appSecret,
      submissions: {},
    }));
  }

  async saveSubmissionOpening(submissionId: string, record: PrivateSubmissionRecord): Promise<void> {
    const state = await this.requireState();
    await this.write({ ...state, submissions: { ...state.submissions, [submissionId]: privateSubmissionRecordSchema.parse(record) } });
  }

  async getSubmissionOpening(submissionId: string): Promise<PrivateSubmissionRecord | null> {
    return (await this.loadOrNull())?.submissions[submissionId] ?? null;
  }

  async exportEncryptedBackup(): Promise<CiphertextBytes> {
    const encrypted = await this.store.get(await storageKey(this.accountId));
    if (!encrypted) throw new PrivateStateUnavailableError();
    return copy(encrypted);
  }

  async importEncryptedBackup(backup: CiphertextBytes): Promise<void> {
    const state = await this.decrypt(backup);
    if (state.accountId !== this.accountId) {
      throw new VulnaCryptoError('INVALID_ENVELOPE', 'Encrypted private state belongs to a different account.');
    }
    await this.store.put(await storageKey(this.accountId), copy(backup));
  }

  private async requireState(): Promise<PrivateState> {
    const state = await this.loadOrNull();
    if (!state) throw new PrivateStateUnavailableError();
    return state;
  }

  private async loadOrNull(): Promise<PrivateState | null> {
    const encrypted = await this.store.get(await storageKey(this.accountId));
    return encrypted ? this.decrypt(encrypted) : null;
  }

  private async write(state: PrivateState): Promise<void> {
    await this.store.put(await storageKey(this.accountId), await this.encrypt(state));
  }

  private async encrypt(state: PrivateState): Promise<CiphertextBytes> {
    const sodium = await crypto();
    if (this.encryptionKey.length !== sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES) {
      throw new PrivateStateUnavailableError();
    }
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(canonicalize(state), aad(this.accountId), null, nonce, this.encryptionKey);
    return asCiphertext(canonicalize(encryptedPrivateStateSchema.parse({
      schema: VULNA_SCHEMA.privateState,
      cipher: 'xchacha20poly1305-ietf',
      nonce: bytesToHex(nonce),
      ciphertext: bytesToHex(ciphertext),
    })));
  }

  private async decrypt(encrypted: CiphertextBytes): Promise<PrivateState> {
    const sodium = await crypto();
    try {
      if (this.encryptionKey.length !== sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES) throw new PrivateStateUnavailableError();
      const envelope = encryptedPrivateStateSchema.parse(parseJson(encrypted));
      const nonce = sodium.from_hex(envelope.nonce);
      if (nonce.length !== sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES) {
        throw new VulnaCryptoError('INVALID_ENVELOPE', 'Encrypted private state has an invalid nonce.');
      }
      const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, sodium.from_hex(envelope.ciphertext), aad(this.accountId), nonce, this.encryptionKey);
      const state = privateStateSchema.parse(parseJson(plaintext));
      if (state.accountId !== this.accountId) throw new VulnaCryptoError('INVALID_ENVELOPE', 'Encrypted private state belongs to a different account.');
      return state;
    } catch (error) {
      if (error instanceof PrivateStateUnavailableError || error instanceof VulnaCryptoError) throw error;
      throw new VulnaCryptoError('DECRYPTION_FAILED', 'Encrypted private state could not be decrypted.');
    }
  }
}

export class MemoryEncryptedPrivateStateStore implements EncryptedPrivateStateStore {
  #values = new Map<string, CiphertextBytes>();

  async get(key: string): Promise<CiphertextBytes | null> {
    const value = this.#values.get(key);
    return value ? copy(value) : null;
  }

  async put(key: string, value: CiphertextBytes): Promise<void> {
    this.#values.set(key, copy(value));
  }

  valuesForTest(): readonly CiphertextBytes[] {
    return [...this.#values.values()].map(copy);
  }
}

/** Browser adapter. It writes only the encrypted private-state envelope. */
export class IndexedDbEncryptedPrivateStateStore implements EncryptedPrivateStateStore {
  #database: Promise<IDBDatabase> | undefined;

  constructor(
    private readonly databaseName = 'vulna-private-state',
    private readonly objectStoreName = 'encrypted-records',
  ) {}

  async get(key: string): Promise<CiphertextBytes | null> {
    const database = await this.database();
    return new Promise<CiphertextBytes | null>((resolve, reject) => {
      const request = database.transaction(this.objectStoreName, 'readonly').objectStore(this.objectStoreName).get(key);
      request.onsuccess = () => {
        if (request.result === undefined) return resolve(null);
        if (!(request.result instanceof Uint8Array)) return reject(new PrivateStateUnavailableError());
        resolve(copy(asCiphertext(request.result)));
      };
      request.onerror = () => reject(new PrivateStateUnavailableError());
    });
  }

  async put(key: string, value: CiphertextBytes): Promise<void> {
    const database = await this.database();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(this.objectStoreName, 'readwrite');
      transaction.objectStore(this.objectStoreName).put(copy(value), key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new PrivateStateUnavailableError());
      transaction.onabort = () => reject(new PrivateStateUnavailableError());
    });
  }

  private database(): Promise<IDBDatabase> {
    if (!this.#database) {
      if (!globalThis.indexedDB) throw new PrivateStateUnavailableError();
      this.#database = new Promise<IDBDatabase>((resolve, reject) => {
        const request = globalThis.indexedDB.open(this.databaseName, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(this.objectStoreName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new PrivateStateUnavailableError());
      });
    }
    return this.#database;
  }
}
