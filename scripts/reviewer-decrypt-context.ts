import { Buffer } from 'node:buffer';

import { decryptReviewPackage, type EncryptionContext, type ReviewerKeyPair } from '../src/crypto/report-crypto.js';

type Input = {
  context: Omit<EncryptionContext, 'reviewer'> & { reviewer: Omit<EncryptionContext['reviewer'], 'publicKey'> & { publicKey: string } };
  envelope: unknown;
  reviewer: Omit<ReviewerKeyPair, 'publicKey' | 'privateKey'> & { publicKey: string; privateKey: string };
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
  const reviewPackage = await decryptReviewPackage({ context, envelope: input.envelope, reviewer });
  process.stdout.write(JSON.stringify({ reportDigest: reviewPackage.reportDigest }));
}

main().catch(() => {
  process.exitCode = 1;
});
