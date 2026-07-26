import sodium from 'libsodium-wrappers-sumo';

import { bytesToHex, canonicalize, canonicalizeReportV1, createReportDigest, sha256 } from '../protocol/canonicalize.js';
import { VULNA_SCHEMA } from '../protocol/domain.js';
import {
  encryptedReportEnvelopeV1Schema,
  privateReviewPackageV1Schema,
  type CanonicalReportV1,
  type PrivateReviewPackageV1,
  type SeverityBand,
} from '../protocol/schemas.js';
import { reportCommitment, severityCommitment, severityValue } from './compact-commitments.js';

declare const ciphertextBrand: unique symbol;
export type CiphertextBytes = Uint8Array & { readonly [ciphertextBrand]: 'vulna-ciphertext' };

export class VulnaCryptoError extends Error {
  constructor(
    readonly code: 'DECRYPTION_FAILED' | 'ENCRYPTION_FAILED' | 'REVIEWER_KEY_MISMATCH' | 'INVALID_ENVELOPE',
    message: string,
  ) {
    super(message);
    this.name = 'VulnaCryptoError';
  }
}

export type ReviewerPublicKey = {
  keyId: string;
  keyVersion: number;
  publicKey: Uint8Array;
};

export type ReviewerKeyPair = ReviewerPublicKey & {
  privateKey: Uint8Array;
};

export type EncryptionContext = {
  bountyId: string;
  submissionTempId: string;
  bountyBinding: string;
  reportCommitment: string;
  severityCommitment: string;
  reviewer: ReviewerPublicKey;
};

export type EncryptedReportBundle = {
  envelope: ReturnType<typeof encryptedReportEnvelopeV1Schema.parse>;
  ciphertext: CiphertextBytes;
  artifactHash: string;
  envelopeHash: string;
  reportDigest: string;
};

const utf8 = new TextEncoder();
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

function ensureBytes(value: Uint8Array, expectedLength: number, label: string): void {
  if (value.length !== expectedLength) {
    throw new VulnaCryptoError('INVALID_ENVELOPE', `${label} has an invalid length.`);
  }
}

function asCiphertext(bytes: Uint8Array): CiphertextBytes {
  return bytes as CiphertextBytes;
}

async function ready() {
  await sodium.ready;
  return sodium;
}

function associatedData(context: EncryptionContext): Uint8Array {
  return canonicalize({
    bountyId: context.bountyId,
    payloadSchema: VULNA_SCHEMA.reviewPackage,
    reportCommitment: context.reportCommitment,
    reviewerKeyId: context.reviewer.keyId,
    reviewerKeyVersion: context.reviewer.keyVersion,
    schema: VULNA_SCHEMA.encryptedReport,
  });
}

async function fingerprint(publicKey: Uint8Array): Promise<string> {
  return bytesToHex(await sha256(publicKey));
}

function parseJson(bytes: Uint8Array): unknown {
  try {
    return JSON.parse(utf8Decoder.decode(bytes));
  } catch {
    throw new VulnaCryptoError('DECRYPTION_FAILED', 'The encrypted report could not be decrypted.');
  }
}

export async function createReviewerKeyPair(keyVersion = 1): Promise<ReviewerKeyPair> {
  if (!Number.isSafeInteger(keyVersion) || keyVersion < 1) {
    throw new VulnaCryptoError('INVALID_ENVELOPE', 'Reviewer key version is invalid.');
  }
  const crypto = await ready();
  const keyPair = crypto.crypto_box_keypair();
  return {
    keyId: await fingerprint(keyPair.publicKey),
    keyVersion,
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export async function encryptReviewPackage(input: {
  context: EncryptionContext;
  report: CanonicalReportV1;
  reportCommitmentOpening: string;
  severityCommitmentOpening: string;
}): Promise<EncryptedReportBundle> {
  const crypto = await ready();
  try {
    ensureBytes(input.context.reviewer.publicKey, crypto.crypto_box_PUBLICKEYBYTES, 'Reviewer public key');
    if (!Number.isSafeInteger(input.context.reviewer.keyVersion) || input.context.reviewer.keyVersion < 1) {
      throw new VulnaCryptoError('INVALID_ENVELOPE', 'Reviewer key version is invalid.');
    }
    if (input.context.reviewer.keyId !== await fingerprint(input.context.reviewer.publicKey)) {
      throw new VulnaCryptoError('REVIEWER_KEY_MISMATCH', 'Reviewer encryption key could not be verified.');
    }

    const { report, digestHex } = await createReportDigest(input.report);
    if (report.bountyId !== input.context.bountyId) {
      throw new VulnaCryptoError('INVALID_ENVELOPE', 'Report context does not match its bounty.');
    }
    if (input.context.reportCommitment !== reportCommitment(input.context.bountyBinding, digestHex, input.reportCommitmentOpening)) {
      throw new VulnaCryptoError('INVALID_ENVELOPE', 'Report commitment does not match the local opening.');
    }
    if (input.context.severityCommitment !== severityCommitment(
      input.context.bountyBinding,
      await severityValue(report.severityClaim.band),
      input.severityCommitmentOpening,
    )) {
      throw new VulnaCryptoError('INVALID_ENVELOPE', 'Severity commitment does not match the local opening.');
    }
    const reviewPackage = privateReviewPackageV1Schema.parse({
      schema: VULNA_SCHEMA.reviewPackage,
      report,
      reportDigest: digestHex,
      reportCommitmentOpening: input.reportCommitmentOpening,
      severityBand: report.severityClaim.band,
      severityCommitmentOpening: input.severityCommitmentOpening,
    });
    const contentKey = crypto.crypto_aead_xchacha20poly1305_ietf_keygen();
    try {
      const nonce = crypto.randombytes_buf(crypto.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
      const ciphertext = crypto.crypto_aead_xchacha20poly1305_ietf_encrypt(
        canonicalize(reviewPackage),
        associatedData(input.context),
        null,
        nonce,
        contentKey,
      );
      const wrappedContentKey = crypto.crypto_box_seal(contentKey, input.context.reviewer.publicKey);
      const envelope = encryptedReportEnvelopeV1Schema.parse({
        schema: VULNA_SCHEMA.encryptedReport,
        payloadSchema: VULNA_SCHEMA.reviewPackage,
        cipher: 'xchacha20poly1305-ietf',
        nonce: bytesToHex(nonce),
        ciphertext: bytesToHex(ciphertext),
        publicMetadata: {
          bountyId: input.context.bountyId,
          submissionTempId: input.context.submissionTempId,
          ciphertextByteLength: String(ciphertext.length),
          attachmentCount: report.attachments.length,
        },
        keyEnvelopes: [{
          recipientKeyId: input.context.reviewer.keyId,
          keyVersion: input.context.reviewer.keyVersion,
          algorithm: 'curve25519-sealed-box',
          wrappedContentKey: bytesToHex(wrappedContentKey),
        }],
      });
      const envelopeBytes = canonicalize(envelope);
      return {
        envelope,
        ciphertext: asCiphertext(ciphertext),
        artifactHash: bytesToHex(await sha256(ciphertext)),
        envelopeHash: bytesToHex(await sha256(envelopeBytes)),
        reportDigest: digestHex,
      };
    } finally {
      crypto.memzero(contentKey);
    }
  } catch (error) {
    if (error instanceof VulnaCryptoError) throw error;
    throw new VulnaCryptoError('ENCRYPTION_FAILED', 'The report could not be encrypted.');
  }
}

export async function decryptReviewPackage(input: {
  context: EncryptionContext;
  envelope: unknown;
  reviewer: ReviewerKeyPair;
}): Promise<PrivateReviewPackageV1> {
  const crypto = await ready();
  try {
    const envelope = encryptedReportEnvelopeV1Schema.parse(input.envelope);
    ensureBytes(input.reviewer.publicKey, crypto.crypto_box_PUBLICKEYBYTES, 'Reviewer public key');
    ensureBytes(input.reviewer.privateKey, crypto.crypto_box_SECRETKEYBYTES, 'Reviewer private key');
    if (input.reviewer.keyId !== await fingerprint(input.reviewer.publicKey)) {
      throw new VulnaCryptoError('REVIEWER_KEY_MISMATCH', 'Reviewer encryption key could not be verified.');
    }
    const recipient = envelope.keyEnvelopes.find((candidate) =>
      candidate.recipientKeyId === input.reviewer.keyId && candidate.keyVersion === input.reviewer.keyVersion,
    );
    if (!recipient) {
      throw new VulnaCryptoError('REVIEWER_KEY_MISMATCH', 'No encrypted key is available for this reviewer.');
    }
    if (envelope.publicMetadata.bountyId !== input.context.bountyId || input.context.reviewer.keyId !== input.reviewer.keyId || input.context.reviewer.keyVersion !== input.reviewer.keyVersion) {
      throw new VulnaCryptoError('INVALID_ENVELOPE', 'Encrypted report context does not match.');
    }
    const nonce = sodium.from_hex(envelope.nonce);
    const ciphertext = sodium.from_hex(envelope.ciphertext);
    const wrappedContentKey = sodium.from_hex(recipient.wrappedContentKey);
    ensureBytes(nonce, crypto.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES, 'Nonce');
    ensureBytes(wrappedContentKey, crypto.crypto_box_SEALBYTES + crypto.crypto_aead_xchacha20poly1305_ietf_KEYBYTES, 'Wrapped content key');
    if (String(ciphertext.length) !== envelope.publicMetadata.ciphertextByteLength) {
      throw new VulnaCryptoError('INVALID_ENVELOPE', 'Ciphertext length does not match its metadata.');
    }
    const contentKey = crypto.crypto_box_seal_open(wrappedContentKey, input.reviewer.publicKey, input.reviewer.privateKey);
    try {
      const plaintext = crypto.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        ciphertext,
        associatedData(input.context),
        nonce,
        contentKey,
      );
      const reviewPackage = privateReviewPackageV1Schema.parse(parseJson(plaintext));
      const digest = await createReportDigest(reviewPackage.report);
      if (
        digest.digestHex !== reviewPackage.reportDigest ||
        reviewPackage.report.bountyId !== input.context.bountyId ||
        reviewPackage.report.attachments.length !== envelope.publicMetadata.attachmentCount ||
        reviewPackage.severityBand !== reviewPackage.report.severityClaim.band ||
        input.context.reportCommitment !== reportCommitment(input.context.bountyBinding, digest.digestHex, reviewPackage.reportCommitmentOpening) ||
        input.context.severityCommitment !== severityCommitment(
          input.context.bountyBinding,
          await severityValue(reviewPackage.severityBand),
          reviewPackage.severityCommitmentOpening,
        )
      ) {
        throw new VulnaCryptoError('DECRYPTION_FAILED', 'The encrypted report could not be verified.');
      }
      return reviewPackage;
    } finally {
      crypto.memzero(contentKey);
    }
  } catch (error) {
    if (error instanceof VulnaCryptoError) throw error;
    throw new VulnaCryptoError('DECRYPTION_FAILED', 'The encrypted report could not be decrypted.');
  }
}

export function serializeEncryptedEnvelope(envelope: EncryptedReportBundle['envelope']): CiphertextBytes {
  return asCiphertext(canonicalize(envelope));
}

export async function verifyCiphertextHash(ciphertext: Uint8Array, expectedHash: string): Promise<boolean> {
  return bytesToHex(await sha256(ciphertext)) === expectedHash.toLowerCase();
}

export async function verifyEnvelopeHash(envelope: unknown, expectedHash: string): Promise<boolean> {
  try {
    return bytesToHex(await sha256(canonicalize(encryptedReportEnvelopeV1Schema.parse(envelope)))) === expectedHash.toLowerCase();
  } catch {
    return false;
  }
}
