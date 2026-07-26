import assert from 'node:assert/strict';
import test from 'node:test';

import { createReviewerKeyPair, encryptReviewPackage, serializeEncryptedEnvelope } from '../crypto/report-crypto.js';
import { reportCommitment, severityCommitment, severityValue } from '../crypto/compact-commitments.js';
import { createReportDigest } from '../protocol/canonicalize.js';
import { VULNA_SCHEMA } from '../protocol/domain.js';
import { envelopePath, OpaqueEnvelopeError, verifyOpaqueEnvelopeBytes } from './opaque-envelope.js';

test('opaque envelope uses a content-addressed safe path and verifies canonical bytes', async () => {
  const reviewer = await createReviewerKeyPair(1);
  const binding = '11'.repeat(32);
  const opening = '22'.repeat(32);
  const severityOpening = '33'.repeat(32);
  const report = {
    schema: VULNA_SCHEMA.report, bountyId: '1', title: 'Fixture', summary: 'safe', vulnerabilityType: 'Fixture',
    affectedComponents: ['demo'], severityClaim: { band: 'high' as const }, reproductionSteps: ['safe'], impact: 'safe',
    attachments: [], createdAtClient: '2026-07-27T00:00:00.000Z',
  };
  const digest = await createReportDigest(report);
  const severity = await severityValue('high');
  const bundle = await encryptReviewPackage({
    context: {
      bountyId: '1', bountyBinding: binding, submissionTempId: '00000000-0000-4000-8000-000000000001',
      reportCommitment: reportCommitment(binding, digest.digestHex, opening), severityCommitment: severityCommitment(binding, severity, severityOpening), reviewer,
    },
    report,
    reportCommitmentOpening: opening,
    severityCommitmentOpening: severityOpening,
  });
  const bytes = serializeEncryptedEnvelope(bundle.envelope);
  assert.equal(envelopePath(bundle.envelopeHash), `reports/${bundle.envelopeHash}.envelope`);
  assert.deepEqual(await verifyOpaqueEnvelopeBytes(bytes, bundle.envelopeHash), bundle.envelope);
  await assert.rejects(() => verifyOpaqueEnvelopeBytes(new Uint8Array([...bytes, 0]), bundle.envelopeHash), OpaqueEnvelopeError);
  assert.throws(() => envelopePath('not-a-hash'), OpaqueEnvelopeError);
});
