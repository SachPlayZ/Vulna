export const VULNA_SCHEMA = {
  report: 'vulna.report.v1',
  reviewPackage: 'vulna.review-package.v1',
  encryptedReport: 'vulna.encrypted-report.v1',
  privateState: 'vulna.private-state.v1',
  publicMetadata: 'vulna.public-metadata.v1',
} as const;

export const VULNA_DOMAIN = {
  reportDigest: 'vulna:report-digest:v1',
  reportCommitment: 'vulna:report-commitment:v1',
  severityCommitment: 'vulna:severity:v1',
  researcherOwnership: 'vulna:researcher-owner:v1',
  submissionNullifier: 'vulna:submission-nullifier:v1',
  bountyBinding: 'vulna:bounty-binding:v1',
} as const;

for (const value of Object.values(VULNA_DOMAIN)) {
  if (new TextEncoder().encode(value).length > 32) {
    throw new Error(`Vulna domain exceeds Compact Bytes<32>: ${value}`);
  }
}
