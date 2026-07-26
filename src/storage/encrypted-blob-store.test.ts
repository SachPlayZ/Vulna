import assert from 'node:assert/strict';
import test from 'node:test';

import { createReviewerKeyPair, encryptReviewPackage, serializeEncryptedEnvelope } from '../crypto/report-crypto.js';
import { VULNA_SCHEMA } from '../protocol/domain.js';
import { createReportDigest } from '../protocol/canonicalize.js';
import { reportCommitment, severityCommitment, severityValue } from '../crypto/compact-commitments.js';
import { BlobIntegrityError, MemoryCiphertextByteStore, VerifiedEncryptedBlobStore } from './encrypted-blob-store.js';

const sentinel = 'VULNA_PRIVATE_SENTINEL_7F3A';

async function encryptedFixture() {
  const reviewer = await createReviewerKeyPair(1);
  const report = {
    schema: VULNA_SCHEMA.report,
    bountyId: '42',
    title: sentinel,
    summary: 'A harmless sentinel storage test.',
    vulnerabilityType: 'Test only',
    affectedComponents: ['test'],
    severityClaim: { band: 'low' as const },
    reproductionSteps: ['Use the harmless test fixture.'],
    impact: 'No real system is affected.',
    attachments: [],
    createdAtClient: '2026-07-26T12:00:00.000Z',
  };
  const bountyBinding = '99'.repeat(32);
  const digest = await createReportDigest(report);
  const encrypted = await encryptReviewPackage({
    context: {
      bountyId: '42',
      submissionTempId: '220c0c8c-a39d-48c5-a3ca-36d2ffdcf07e',
      bountyBinding,
      reportCommitment: reportCommitment(bountyBinding, digest.digestHex, 'bb'.repeat(32)),
      severityCommitment: severityCommitment(bountyBinding, await severityValue(report.severityClaim.band), 'cc'.repeat(32)),
      reviewer,
    },
    report,
    reportCommitmentOpening: 'bb'.repeat(32),
    severityCommitmentOpening: 'cc'.repeat(32),
  });
  return { encrypted, serializedEnvelope: serializeEncryptedEnvelope(encrypted.envelope) };
}

test('ciphertext store accepts encrypted bytes only and verifies a returned copy', async () => {
  const { encrypted, serializedEnvelope } = await encryptedFixture();
  const raw = new MemoryCiphertextByteStore();
  const store = new VerifiedEncryptedBlobStore(raw);
  const stored = await store.put(encrypted.ciphertext, {
    bountyId: '42',
    submissionTempId: '220c0c8c-a39d-48c5-a3ca-36d2ffdcf07e',
    artifactHash: encrypted.artifactHash,
    envelopeHash: encrypted.envelopeHash,
  });

  assert.deepEqual(await store.getVerified(stored), encrypted.ciphertext);
  assert.equal(new TextDecoder().decode(serializedEnvelope).includes(sentinel), false);
});

test('ciphertext storage fails closed on returned-byte tampering', async () => {
  const { encrypted } = await encryptedFixture();
  const raw = new MemoryCiphertextByteStore();
  const store = new VerifiedEncryptedBlobStore(raw);
  const stored = await store.put(encrypted.ciphertext, {
    bountyId: '42',
    submissionTempId: '220c0c8c-a39d-48c5-a3ca-36d2ffdcf07e',
    artifactHash: encrypted.artifactHash,
    envelopeHash: encrypted.envelopeHash,
  });
  raw.tamper(stored.locator);
  await assert.rejects(() => store.getVerified(stored), BlobIntegrityError);
});
