import sodium from 'libsodium-wrappers-sumo';
import { z } from 'zod';

import { bytesToHex, canonicalize, sha256 } from '../protocol/canonicalize.js';
import { VULNA_SCHEMA } from '../protocol/domain.js';
import { bytes32HexSchema } from '../protocol/schemas.js';
import { roleKey } from './compact-commitments.js';
import { type CiphertextBytes, createReviewerKeyPair, type ReviewerKeyPair, VulnaCryptoError } from './report-crypto.js';
import { type EncryptedPrivateStateStore, PrivateStateUnavailableError } from './private-state.js';

const utf8 = new TextEncoder();
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
const reviewerRoleDomain = 'vulna:reviewer:v1';

export const reviewerEnrollmentPublicSchema = z.object({
  schema: z.literal(VULNA_SCHEMA.reviewerEnrollmentPublic),
  reviewerRoleCommitment: bytes32HexSchema,
  reviewerEncryptionPublicKey: bytes32HexSchema,
  reviewerKeyVersion: z.number().int().positive(),
}).strict();

export type ReviewerEnrollmentPublic = z.infer<typeof reviewerEnrollmentPublicSchema>;

const enrollmentStateSchema = z.object({
  schema: z.literal(VULNA_SCHEMA.reviewerEnrollmentState),
  accountId: z.string().min(1).max(512),
  actorSecret: bytes32HexSchema,
  reviewer: z.object({
    keyId: bytes32HexSchema,
    keyVersion: z.number().int().positive(),
    publicKey: bytes32HexSchema,
    privateKey: bytes32HexSchema,
  }).strict(),
}).strict();

const enrollmentEnvelopeSchema = z.object({
  schema: z.literal(VULNA_SCHEMA.reviewerEnrollmentState),
  cipher: z.literal('xchacha20poly1305-ietf'),
  nonce: z.string().regex(/^[0-9a-f]+$/i),
  ciphertext: z.string().regex(/^[0-9a-f]+$/i),
}).strict();

type EnrollmentState = z.infer<typeof enrollmentStateSchema>;

export type ReviewerEnrollment = Readonly<{
  actorSecret: Uint8Array;
  reviewer: ReviewerKeyPair;
}>;

function asCiphertext(value: Uint8Array): CiphertextBytes {
  return value as CiphertextBytes;
}

async function crypto() {
  await sodium.ready;
  return sodium;
}

async function storageKey(accountId: string): Promise<string> {
  return `vulna:reviewer-enrollment:${bytesToHex(await sha256(utf8.encode(accountId)))}`;
}

function aad(accountId: string): Uint8Array {
  return canonicalize({ accountId, purpose: 'reviewer-enrollment', schema: VULNA_SCHEMA.reviewerEnrollmentState });
}

function parseJson(value: Uint8Array): unknown {
  try {
    return JSON.parse(utf8Decoder.decode(value));
  } catch {
    throw new VulnaCryptoError('DECRYPTION_FAILED', 'Reviewer enrollment could not be decrypted.');
  }
}

function toEnrollment(state: EnrollmentState): ReviewerEnrollment {
  return {
    actorSecret: sodium.from_hex(state.actorSecret),
    reviewer: {
      keyId: state.reviewer.keyId,
      keyVersion: state.reviewer.keyVersion,
      publicKey: sodium.from_hex(state.reviewer.publicKey),
      privateKey: sodium.from_hex(state.reviewer.privateKey),
    },
  };
}

function toState(accountId: string, enrollment: ReviewerEnrollment): EnrollmentState {
  return enrollmentStateSchema.parse({
    schema: VULNA_SCHEMA.reviewerEnrollmentState,
    accountId,
    actorSecret: bytesToHex(enrollment.actorSecret),
    reviewer: {
      keyId: enrollment.reviewer.keyId,
      keyVersion: enrollment.reviewer.keyVersion,
      publicKey: bytesToHex(enrollment.reviewer.publicKey),
      privateKey: bytesToHex(enrollment.reviewer.privateKey),
    },
  });
}

/** The only operator-facing data. It intentionally excludes every private key and secret. */
export function reviewerEnrollmentPublic(enrollment: ReviewerEnrollment): ReviewerEnrollmentPublic {
  return reviewerEnrollmentPublicSchema.parse({
    schema: VULNA_SCHEMA.reviewerEnrollmentPublic,
    reviewerRoleCommitment: roleKey(reviewerRoleDomain, bytesToHex(enrollment.actorSecret)),
    reviewerEncryptionPublicKey: bytesToHex(enrollment.reviewer.publicKey),
    reviewerKeyVersion: enrollment.reviewer.keyVersion,
  });
}

/** Encrypted account-scoped reviewer role secret and Curve25519 key pair. */
export class EncryptedReviewerEnrollmentRepository {
  constructor(
    private readonly accountId: string,
    private readonly encryptionKey: Uint8Array,
    private readonly store: EncryptedPrivateStateStore,
  ) {}

  async getOrCreate(): Promise<ReviewerEnrollment> {
    const existing = await this.loadOrNull();
    if (existing) return existing;
    const sodium = await crypto();
    const enrollment: ReviewerEnrollment = {
      actorSecret: sodium.randombytes_buf(32),
      reviewer: await createReviewerKeyPair(1),
    };
    await this.write(toState(this.accountId, enrollment));
    return enrollment;
  }

  async get(): Promise<ReviewerEnrollment | null> {
    return this.loadOrNull();
  }

  private async loadOrNull(): Promise<ReviewerEnrollment | null> {
    const encrypted = await this.store.get(await storageKey(this.accountId));
    if (!encrypted) return null;
    const state = await this.decrypt(encrypted);
    return toEnrollment(state);
  }

  private async write(state: EnrollmentState): Promise<void> {
    const sodium = await crypto();
    if (this.encryptionKey.length !== sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES) throw new PrivateStateUnavailableError();
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(canonicalize(state), aad(this.accountId), null, nonce, this.encryptionKey);
    await this.store.put(await storageKey(this.accountId), asCiphertext(canonicalize(enrollmentEnvelopeSchema.parse({
      schema: VULNA_SCHEMA.reviewerEnrollmentState,
      cipher: 'xchacha20poly1305-ietf',
      nonce: bytesToHex(nonce),
      ciphertext: bytesToHex(ciphertext),
    }))));
  }

  private async decrypt(encrypted: CiphertextBytes): Promise<EnrollmentState> {
    const sodium = await crypto();
    try {
      if (this.encryptionKey.length !== sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES) throw new PrivateStateUnavailableError();
      const envelope = enrollmentEnvelopeSchema.parse(parseJson(encrypted));
      const nonce = sodium.from_hex(envelope.nonce);
      if (nonce.length !== sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES) throw new VulnaCryptoError('INVALID_ENVELOPE', 'Reviewer enrollment has an invalid nonce.');
      const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, sodium.from_hex(envelope.ciphertext), aad(this.accountId), nonce, this.encryptionKey);
      const state = enrollmentStateSchema.parse(parseJson(plaintext));
      if (state.accountId !== this.accountId) throw new VulnaCryptoError('INVALID_ENVELOPE', 'Reviewer enrollment belongs to a different account.');
      return state;
    } catch (error) {
      if (error instanceof PrivateStateUnavailableError || error instanceof VulnaCryptoError) throw error;
      throw new VulnaCryptoError('DECRYPTION_FAILED', 'Reviewer enrollment could not be decrypted.');
    }
  }
}
