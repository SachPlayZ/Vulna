import { Buffer } from 'node:buffer';

import { decryptReviewPackage, verifyCiphertextHash, verifyEnvelopeHash, type EncryptionContext, type ReviewerKeyPair } from '../src/crypto/report-crypto.js';

type Input = {
  context: Omit<EncryptionContext, 'reviewer'> & { reviewer: Omit<EncryptionContext['reviewer'], 'publicKey'> & { publicKey: string } };
  envelope: unknown;
  reviewer: Omit<ReviewerKeyPair, 'publicKey' | 'privateKey'> & { publicKey: string; privateKey: string };
  expected?: { artifactHash: string; envelopeHash: string; reportCommitment: string; severityCommitment: string };
};

async function readInput(): Promise<Input> {
  let source = '';
  for await (const chunk of process.stdin) source += chunk;
  return JSON.parse(source) as Input;
}

async function main() {
  const input = await readInput();
  const context: EncryptionContext = {
    ...input.context,
    reviewer: { ...input.context.reviewer, publicKey: new Uint8Array(Buffer.from(input.context.reviewer.publicKey, 'hex')) },
  };
  const reviewer: ReviewerKeyPair = {
    ...input.reviewer,
    publicKey: new Uint8Array(Buffer.from(input.reviewer.publicKey, 'hex')),
    privateKey: new Uint8Array(Buffer.from(input.reviewer.privateKey, 'hex')),
  };
  if (input.expected) {
    const envelope = input.envelope as { ciphertext?: string };
    if (typeof envelope.ciphertext !== 'string') throw new Error('Ciphertext is invalid.');
    const ciphertext = new Uint8Array(Buffer.from(envelope.ciphertext, 'hex'));
    if (
      !(await verifyCiphertextHash(ciphertext, input.expected.artifactHash)) ||
      !(await verifyEnvelopeHash(input.envelope, input.expected.envelopeHash)) ||
      input.context.reportCommitment !== input.expected.reportCommitment ||
      input.context.severityCommitment !== input.expected.severityCommitment
    ) throw new Error('Indexed report integrity check failed.');
  }
  const reviewPackage = await decryptReviewPackage({ context, envelope: input.envelope, reviewer });
  process.stdout.write(JSON.stringify({ reportDigest: reviewPackage.reportDigest }));
}

main().catch(() => {
  process.exitCode = 1;
});
