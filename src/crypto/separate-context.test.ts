import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { spawn } from 'node:child_process';
import * as path from 'node:path';
import test from 'node:test';

import { createReviewerKeyPair, encryptReviewPackage } from './report-crypto.js';
import { VULNA_SCHEMA } from '../protocol/domain.js';
import { createReportDigest } from '../protocol/canonicalize.js';
import { reportCommitment, severityCommitment, severityValue } from './compact-commitments.js';

test('researcher encryption and reviewer decryption work in separate processes', async () => {
  const reviewer = await createReviewerKeyPair(1);
  const report = {
    schema: VULNA_SCHEMA.report,
    bountyId: '42',
    title: 'Separate process report',
    summary: 'Only the reviewer child process may decrypt this test report.',
    vulnerabilityType: 'Test only',
    affectedComponents: ['test'],
    severityClaim: { band: 'medium' as const },
    reproductionSteps: ['Use the harmless test fixture.'],
    impact: 'No real system is affected.',
    attachments: [],
    createdAtClient: '2026-07-26T12:00:00.000Z',
  };
  const bountyBinding = '99'.repeat(32);
  const digest = await createReportDigest(report);
  const context = {
    bountyId: '42',
    submissionTempId: '220c0c8c-a39d-48c5-a3ca-36d2ffdcf07e',
    bountyBinding,
    reportCommitment: reportCommitment(bountyBinding, digest.digestHex, 'bb'.repeat(32)),
    severityCommitment: severityCommitment(bountyBinding, await severityValue(report.severityClaim.band), 'cc'.repeat(32)),
    reviewer,
  };
  const encrypted = await encryptReviewPackage({
    context,
    report,
    reportCommitmentOpening: 'bb'.repeat(32),
    severityCommitmentOpening: 'cc'.repeat(32),
  });
  const input = JSON.stringify({
    context: {
      bountyId: context.bountyId,
      submissionTempId: context.submissionTempId,
      bountyBinding: context.bountyBinding,
      reportCommitment: context.reportCommitment,
      severityCommitment: context.severityCommitment,
      reviewer: {
        keyId: reviewer.keyId,
        keyVersion: reviewer.keyVersion,
        publicKey: Buffer.from(reviewer.publicKey).toString('hex'),
      },
    },
    envelope: encrypted.envelope,
    reviewer: {
      ...reviewer,
      publicKey: Buffer.from(reviewer.publicKey).toString('hex'),
      privateKey: Buffer.from(reviewer.privateKey).toString('hex'),
    },
  });
  const command = path.resolve('node_modules/.bin/tsx');
  const script = path.resolve('scripts/reviewer-decrypt-context.ts');
  const child = spawn(command, [script], { stdio: ['pipe', 'pipe', 'pipe'] });
  child.stdin.end(input);

  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8').on('data', (chunk) => { stdout += chunk; });
  child.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
  const exitCode = await new Promise<number | null>((resolve) => child.on('exit', resolve));
  assert.equal(exitCode, 0, stderr);
  assert.deepEqual(JSON.parse(stdout), { reportDigest: encrypted.reportDigest });
});
