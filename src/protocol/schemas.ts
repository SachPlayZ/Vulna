import { z } from 'zod';

import { VULNA_SCHEMA } from './domain.js';

export const bytes32HexSchema = z.string().regex(/^[0-9a-f]{64}$/i, 'Expected 32-byte hex.');
export const positiveDecimalStringSchema = z.string().regex(/^(0|[1-9][0-9]*)$/, 'Expected unsigned decimal integer.');

export const severityBandSchema = z.enum(['low', 'medium', 'high', 'critical']);
export type SeverityBand = z.infer<typeof severityBandSchema>;

export const payoutPolicySchema = z.enum(['ACCEPTANCE', 'PATCH']);
export type PayoutPolicy = z.infer<typeof payoutPolicySchema>;

export const attachmentSchema = z.object({
  name: z.string().min(1).max(180),
  mediaType: z.string().min(1).max(127),
  byteLength: positiveDecimalStringSchema,
  digest: bytes32HexSchema,
}).strict();

export const canonicalReportV1Schema = z.object({
  schema: z.literal(VULNA_SCHEMA.report),
  bountyId: positiveDecimalStringSchema,
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(10_000),
  vulnerabilityType: z.string().min(1).max(120),
  affectedComponents: z.array(z.string().min(1).max(240)).max(64),
  severityClaim: z.object({
    band: severityBandSchema,
    cvssVector: z.string().min(1).max(200).optional(),
  }).strict(),
  reproductionSteps: z.array(z.string().min(1).max(10_000)).min(1).max(128),
  impact: z.string().min(1).max(10_000),
  remediationSuggestion: z.string().min(1).max(10_000).optional(),
  attachments: z.array(attachmentSchema).max(16),
  createdAtClient: z.string().datetime({ offset: true }),
}).strict();

export type CanonicalReportV1 = z.infer<typeof canonicalReportV1Schema>;

export const privateReviewPackageV1Schema = z.object({
  schema: z.literal(VULNA_SCHEMA.reviewPackage),
  report: canonicalReportV1Schema,
  reportDigest: bytes32HexSchema,
  reportCommitmentOpening: bytes32HexSchema,
  severityBand: severityBandSchema,
  severityCommitmentOpening: bytes32HexSchema,
}).strict();

export type PrivateReviewPackageV1 = z.infer<typeof privateReviewPackageV1Schema>;

export const encryptedReportEnvelopeV1Schema = z.object({
  schema: z.literal(VULNA_SCHEMA.encryptedReport),
  payloadSchema: z.literal(VULNA_SCHEMA.reviewPackage),
  cipher: z.literal('xchacha20poly1305-ietf'),
  nonce: z.string().regex(/^[0-9a-f]+$/i),
  ciphertext: z.string().regex(/^[0-9a-f]+$/i),
  publicMetadata: z.object({
    bountyId: positiveDecimalStringSchema,
    submissionTempId: z.string().uuid(),
    ciphertextByteLength: positiveDecimalStringSchema,
    attachmentCount: z.number().int().min(0).max(16),
  }).strict(),
  keyEnvelopes: z.array(z.object({
    recipientKeyId: bytes32HexSchema,
    keyVersion: z.number().int().min(1),
    algorithm: z.literal('curve25519-sealed-box'),
    wrappedContentKey: z.string().regex(/^[0-9a-f]+$/i),
  }).strict()).min(1).max(8),
}).strict();

export const publicBountyMetadataV1Schema = z.object({
  schema: z.literal(VULNA_SCHEMA.publicMetadata),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(10_000),
  scope: z.string().min(1).max(20_000),
  safeHarbor: z.string().min(1).max(10_000),
  payoutPolicy: payoutPolicySchema,
}).strict();
