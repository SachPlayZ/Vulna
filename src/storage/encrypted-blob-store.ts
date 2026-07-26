import { bytesToHex, sha256 } from '../protocol/canonicalize.js';
import { type CiphertextBytes, verifyCiphertextHash } from '../crypto/report-crypto.js';

export type PublicBlobMetadata = Readonly<{
  bountyId: string;
  submissionTempId: string;
  artifactHash: string;
  envelopeHash: string;
}>;

export type StoredBlob = Readonly<{
  locator: string;
  byteLength: number;
  artifactHash: string;
}>;

export interface CiphertextByteStore {
  put(locator: string, bytes: CiphertextBytes): Promise<void>;
  get(locator: string): Promise<CiphertextBytes | null>;
}

export interface EncryptedBlobStore {
  put(blob: CiphertextBytes, metadata: PublicBlobMetadata): Promise<StoredBlob>;
  getVerified(stored: StoredBlob): Promise<CiphertextBytes>;
}

export class BlobIntegrityError extends Error {
  constructor() {
    super('Encrypted blob integrity verification failed.');
    this.name = 'BlobIntegrityError';
  }
}

function asCiphertext(bytes: Uint8Array): CiphertextBytes {
  return bytes as CiphertextBytes;
}

function copy(bytes: CiphertextBytes): CiphertextBytes {
  return asCiphertext(new Uint8Array(bytes));
}

/** Development/test implementation. It accepts only opaque ciphertext bytes. */
export class MemoryCiphertextByteStore implements CiphertextByteStore {
  #values = new Map<string, CiphertextBytes>();

  async put(locator: string, bytes: CiphertextBytes): Promise<void> {
    this.#values.set(locator, copy(bytes));
  }

  async get(locator: string): Promise<CiphertextBytes | null> {
    const value = this.#values.get(locator);
    return value ? copy(value) : null;
  }

  /** Test-only mutation hook for integrity failure coverage. */
  tamper(locator: string): void {
    const value = this.#values.get(locator);
    if (!value || value.length === 0) throw new Error('Stored ciphertext is unavailable.');
    const replacement = copy(value);
    replacement[0] ^= 1;
    this.#values.set(locator, replacement);
  }
}

/** Browser adapter. Its object store contains only opaque encrypted byte arrays. */
export class IndexedDbCiphertextByteStore implements CiphertextByteStore {
  #database: Promise<IDBDatabase> | undefined;

  constructor(
    private readonly databaseName = 'vulna-ciphertext',
    private readonly objectStoreName = 'blobs',
  ) {}

  async put(locator: string, bytes: CiphertextBytes): Promise<void> {
    const database = await this.database();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(this.objectStoreName, 'readwrite');
      transaction.objectStore(this.objectStoreName).put(copy(bytes), locator);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new BlobIntegrityError());
      transaction.onabort = () => reject(new BlobIntegrityError());
    });
  }

  async get(locator: string): Promise<CiphertextBytes | null> {
    const database = await this.database();
    return new Promise<CiphertextBytes | null>((resolve, reject) => {
      const request = database.transaction(this.objectStoreName, 'readonly').objectStore(this.objectStoreName).get(locator);
      request.onsuccess = () => {
        if (request.result === undefined) return resolve(null);
        if (!(request.result instanceof Uint8Array)) return reject(new BlobIntegrityError());
        resolve(copy(asCiphertext(request.result)));
      };
      request.onerror = () => reject(new BlobIntegrityError());
    });
  }

  private database(): Promise<IDBDatabase> {
    if (!this.#database) {
      if (!globalThis.indexedDB) throw new BlobIntegrityError();
      this.#database = new Promise<IDBDatabase>((resolve, reject) => {
        const request = globalThis.indexedDB.open(this.databaseName, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(this.objectStoreName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new BlobIntegrityError());
      });
    }
    return this.#database;
  }
}

export class VerifiedEncryptedBlobStore implements EncryptedBlobStore {
  constructor(private readonly bytes: CiphertextByteStore) {}

  async put(blob: CiphertextBytes, metadata: PublicBlobMetadata): Promise<StoredBlob> {
    if (!await verifyCiphertextHash(blob, metadata.artifactHash)) {
      throw new BlobIntegrityError();
    }
    const locator = `ciphertext:${metadata.artifactHash}`;
    await this.bytes.put(locator, blob);
    return { locator, byteLength: blob.length, artifactHash: metadata.artifactHash };
  }

  async getVerified(stored: StoredBlob): Promise<CiphertextBytes> {
    const blob = await this.bytes.get(stored.locator);
    if (!blob || blob.length !== stored.byteLength || !await verifyCiphertextHash(blob, stored.artifactHash)) {
      throw new BlobIntegrityError();
    }
    return blob;
  }
}

export async function contentHash(bytes: Uint8Array): Promise<string> {
  return bytesToHex(await sha256(bytes));
}
