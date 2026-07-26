import assert from 'node:assert/strict';
import test from 'node:test';

import { canonicalize, canonicalizeReportV1, createReportDigest } from './canonicalize.js';
import { VULNA_SCHEMA } from './domain.js';

const report = {
  schema: VULNA_SCHEMA.report,
  bountyId: '42',
  title: 'Unicode cafe\u0301\r\nreport',
  summary: 'Summary\rwith normalized lines.',
  vulnerabilityType: 'Authorization bypass',
  affectedComponents: ['api', 'web'],
  severityClaim: { band: 'high' as const },
  reproductionSteps: ['Sign in', 'Request another user record'],
  impact: 'Unauthorized data access.',
  attachments: [{
    name: 'proof.txt',
    mediaType: 'text/plain',
    byteLength: '12',
    digest: '11'.repeat(32),
  }],
  createdAtClient: '2026-07-26T12:00:00.000Z',
};

test('canonical report normalizes text and sorts object keys', () => {
  const { bytes } = canonicalizeReportV1(report);
  const actual = new TextDecoder().decode(bytes);

  assert.equal(actual, '{"affectedComponents":["api","web"],"attachments":[{"byteLength":"12","digest":"1111111111111111111111111111111111111111111111111111111111111111","mediaType":"text/plain","name":"proof.txt"}],"bountyId":"42","createdAtClient":"2026-07-26T12:00:00.000Z","impact":"Unauthorized data access.","reproductionSteps":["Sign in","Request another user record"],"schema":"vulna.report.v1","severityClaim":{"band":"high"},"summary":"Summary\\nwith normalized lines.","title":"Unicode café\\nreport","vulnerabilityType":"Authorization bypass"}');
});

test('report digest is deterministic', async () => {
  const first = await createReportDigest(report);
  const second = await createReportDigest({ ...report, title: 'Unicode café\nreport' });

  assert.equal(first.digestHex, second.digestHex);
  assert.equal(first.digestHex, '6872d04bf7e2a33a3e7546c6125e0197f54d8d4398068e20a2163fccacb92703');
});

test('canonicalization rejects ambiguous values', () => {
  assert.throws(() => canonicalize({ value: undefined }), /undefined/);
  assert.throws(() => canonicalize({ value: Number.NaN }), /non-finite/);
  assert.throws(() => canonicalize({ value: -0 }), /negative zero/);
  assert.throws(() => canonicalize({ value: new Date() }), /plain objects/);
});

test('report schema rejects unknown fields', () => {
  assert.throws(() => canonicalizeReportV1({ ...report, unexpected: true }), /Unrecognized key/);
});
