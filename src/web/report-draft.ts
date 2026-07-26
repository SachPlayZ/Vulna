import { z } from 'zod';

import { encryptReviewPackage, type EncryptedReportBundle, type ReviewerPublicKey } from '../crypto/report-crypto.js';
import { reportCommitment, severityCommitment, severityValue } from '../crypto/compact-commitments.js';
import { bytesToHex, createReportDigest } from '../protocol/canonicalize.js';
import { VULNA_SCHEMA } from '../protocol/domain.js';
import { type CanonicalReportV1, severityBandSchema } from '../protocol/schemas.js';

export const reportDraftFormSchema = z.object({
  title: z.string().trim().min(8, 'Use a descriptive title.').max(200),
  summary: z.string().trim().min(24, 'Explain the issue without including real credentials.').max(10_000),
  affectedComponent: z.string().trim().min(2, 'Name an affected demo component.').max(240),
  severity: severityBandSchema,
  reproduction: z.string().trim().min(24, 'Add at least one safe reproduction step.').max(10_000),
  impact: z.string().trim().min(24, 'Describe the security impact.').max(10_000),
  remediation: z.string().trim().max(10_000),
}).strict();

export type ReportDraftForm = z.infer<typeof reportDraftFormSchema>;

export type LocalPreparedDisclosure = Readonly<{
  bundle: EncryptedReportBundle;
  publicReference: Readonly<{
    artifactHash: string;
    envelopeHash: string;
    reportCommitment: string;
    severityCommitment: string;
  }>;
}>;

function randomHex(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

function reportFromForm(input: ReportDraftForm): CanonicalReportV1 {
  return {
    schema: VULNA_SCHEMA.report,
    bountyId: '1',
    title: input.title,
    summary: input.summary,
    vulnerabilityType: 'Authorization',
    affectedComponents: [input.affectedComponent],
    severityClaim: { band: input.severity },
    reproductionSteps: [input.reproduction],
    impact: input.impact,
    ...(input.remediation ? { remediationSuggestion: input.remediation } : {}),
    attachments: [],
    createdAtClient: new Date().toISOString(),
  };
}

/** Browser-only preparation. It returns safe references and encrypted bytes, never plaintext persistence. */
export async function prepareLocalDisclosure(input: ReportDraftForm, reviewer: ReviewerPublicKey): Promise<LocalPreparedDisclosure> {
  const form = reportDraftFormSchema.parse(input);
  const report = reportFromForm(form);
  const { digestHex } = await createReportDigest(report);
  const bountyBinding = randomHex();
  const reportOpening = randomHex();
  const severityOpening = randomHex();
  const reportCommitmentValue = reportCommitment(bountyBinding, digestHex, reportOpening);
  const severityCommitmentValue = severityCommitment(
    bountyBinding,
    await severityValue(report.severityClaim.band),
    severityOpening,
  );
  const bundle = await encryptReviewPackage({
    context: {
      bountyId: report.bountyId,
      submissionTempId: globalThis.crypto.randomUUID(),
      bountyBinding,
      reportCommitment: reportCommitmentValue,
      severityCommitment: severityCommitmentValue,
      reviewer,
    },
    report,
    reportCommitmentOpening: reportOpening,
    severityCommitmentOpening: severityOpening,
  });
  return {
    bundle,
    publicReference: {
      artifactHash: bundle.artifactHash,
      envelopeHash: bundle.envelopeHash,
      reportCommitment: reportCommitmentValue,
      severityCommitment: severityCommitmentValue,
    },
  };
}
