import assert from 'node:assert/strict';
import test from 'node:test';

import { VULNA_SCHEMA } from '../protocol/domain.js';
import { createReportDigest } from '../protocol/canonicalize.js';
import { reportCommitment, severityCommitment, severityValue } from './compact-commitments.js';
import {
  createReviewerKeyPair,
  decryptReviewPackage,
  encryptReviewPackage,
  type EncryptionContext,
  verifyEnvelopeHash,
  VulnaCryptoError,
} from './report-crypto.js';

const report = {
  schema: VULNA_SCHEMA.report,
  bountyId: '42',
  title: 'Harmless test report',
  summary: 'A fictional authorization issue for cryptographic tests.',
  vulnerabilityType: 'Authorization bypass',
  affectedComponents: ['demo-api'],
  severityClaim: { band: 'high' as const },
  reproductionSteps: ['Sign in to the fictional test app.', 'Open the harmless test route.'],
  impact: 'No real system is affected.',
  attachments: [],
  createdAtClient: '2026-07-26T12:00:00.000Z',
};

async function context(): Promise<EncryptionContext> {
  const reviewer = await createReviewerKeyPair(1);
  const digest = await createReportDigest(report);
  const bountyBinding = '99'.repeat(32);
  return {
    bountyId: '42',
    submissionTempId: '220c0c8c-a39d-48c5-a3ca-36d2ffdcf07e',
    bountyBinding,
    reportCommitment: reportCommitment(bountyBinding, digest.digestHex, openings.reportCommitmentOpening),
    severityCommitment: severityCommitment(bountyBinding, await severityValue(report.severityClaim.band), openings.severityCommitmentOpening),
    reviewer,
  };
}

const openings = {
  reportCommitmentOpening: 'bb'.repeat(32),
  severityCommitmentOpening: 'cc'.repeat(32),
};

function expectCryptoFailure(code: VulnaCryptoError['code']) {
  return (error: unknown) => error instanceof VulnaCryptoError && error.code === code;
}

test('researcher encryption and separate reviewer decryption round-trip', async () => {
  const encryptionContext = await context();
  const encrypted = await encryptReviewPackage({ context: encryptionContext, report, ...openings });
  const decrypted = await decryptReviewPackage({
    context: encryptionContext,
    envelope: encrypted.envelope,
    reviewer: encryptionContext.reviewer as Awaited<ReturnType<typeof createReviewerKeyPair>>,
  });

  assert.equal(decrypted.report.title, report.title);
  assert.equal(decrypted.reportDigest, encrypted.reportDigest);
  assert.equal(encrypted.envelope.publicMetadata.ciphertextByteLength, String(encrypted.ciphertext.length));
});

test('wrong reviewer, tampering, and associated-data mismatch fail closed', async () => {
  const encryptionContext = await context();
  const encrypted = await encryptReviewPackage({ context: encryptionContext, report, ...openings });
  const wrongReviewer = await createReviewerKeyPair(1);
  await assert.rejects(
    () => decryptReviewPackage({ context: encryptionContext, envelope: encrypted.envelope, reviewer: wrongReviewer }),
    expectCryptoFailure('REVIEWER_KEY_MISMATCH'),
  );

  const alteredCiphertext = structuredClone(encrypted.envelope);
  alteredCiphertext.ciphertext = `${alteredCiphertext.ciphertext.slice(0, -2)}00`;
  assert.equal(await verifyEnvelopeHash(alteredCiphertext, encrypted.envelopeHash), false);
  await assert.rejects(
    () => decryptReviewPackage({ context: encryptionContext, envelope: alteredCiphertext, reviewer: encryptionContext.reviewer as Awaited<ReturnType<typeof createReviewerKeyPair>> }),
    expectCryptoFailure('DECRYPTION_FAILED'),
  );

  const alteredNonce = structuredClone(encrypted.envelope);
  alteredNonce.nonce = `${alteredNonce.nonce.slice(0, -2)}00`;
  await assert.rejects(
    () => decryptReviewPackage({ context: encryptionContext, envelope: alteredNonce, reviewer: encryptionContext.reviewer as Awaited<ReturnType<typeof createReviewerKeyPair>> }),
    expectCryptoFailure('DECRYPTION_FAILED'),
  );

  const alteredEnvelope = structuredClone(encrypted.envelope);
  alteredEnvelope.keyEnvelopes[0]!.wrappedContentKey = `${alteredEnvelope.keyEnvelopes[0]!.wrappedContentKey.slice(0, -2)}00`;
  assert.equal(await verifyEnvelopeHash(alteredEnvelope, encrypted.envelopeHash), false);
  await assert.rejects(
    () => decryptReviewPackage({ context: encryptionContext, envelope: alteredEnvelope, reviewer: encryptionContext.reviewer as Awaited<ReturnType<typeof createReviewerKeyPair>> }),
    expectCryptoFailure('DECRYPTION_FAILED'),
  );

  const alteredMetadata = structuredClone(encrypted.envelope);
  alteredMetadata.publicMetadata.attachmentCount = 1;
  await assert.rejects(
    () => decryptReviewPackage({ context: encryptionContext, envelope: alteredMetadata, reviewer: encryptionContext.reviewer as Awaited<ReturnType<typeof createReviewerKeyPair>> }),
    expectCryptoFailure('DECRYPTION_FAILED'),
  );

  await assert.rejects(
    () => decryptReviewPackage({
      context: { ...encryptionContext, reportCommitment: 'dd'.repeat(32) },
      envelope: encrypted.envelope,
      reviewer: encryptionContext.reviewer as Awaited<ReturnType<typeof createReviewerKeyPair>>,
    }),
    expectCryptoFailure('DECRYPTION_FAILED'),
  );
});

test('reviewer key rotation preserves only the original envelope access', async () => {
  const encryptionContext = await context();
  const encrypted = await encryptReviewPackage({ context: encryptionContext, report, ...openings });
  const rotatedReviewer = await createReviewerKeyPair(2);

  await assert.rejects(
    () => decryptReviewPackage({
      context: { ...encryptionContext, reviewer: rotatedReviewer },
      envelope: encrypted.envelope,
      reviewer: rotatedReviewer,
    }),
    expectCryptoFailure('REVIEWER_KEY_MISMATCH'),
  );
  const decrypted = await decryptReviewPackage({
    context: encryptionContext,
    envelope: encrypted.envelope,
    reviewer: encryptionContext.reviewer as Awaited<ReturnType<typeof createReviewerKeyPair>>,
  });
  assert.equal(decrypted.reportDigest.length, 64);
});
