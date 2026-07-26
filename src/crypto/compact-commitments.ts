import { CompactTypeBytes, CompactTypeVector, persistentCommit, persistentHash } from '@midnight-ntwrk/compact-runtime';

import { bytesToHex, sha256 } from '../protocol/canonicalize.js';
import { VULNA_DOMAIN } from '../protocol/domain.js';
import type { SeverityBand } from '../protocol/schemas.js';

const bytes32 = new CompactTypeBytes(32);
const commitmentInput = new CompactTypeVector(3, bytes32);
const roleKeyInput = new CompactTypeVector(2, bytes32);
const ownershipInput = new CompactTypeVector(4, bytes32);
const utf8 = new TextEncoder();

function pad32(value: string): Uint8Array {
  const encoded = utf8.encode(value);
  if (encoded.length > 32) throw new Error('Compact domain separator exceeds Bytes<32>.');
  const bytes = new Uint8Array(32);
  bytes.set(encoded);
  return bytes;
}

export function bytes32FromHex(value: string): Uint8Array {
  if (!/^[0-9a-f]{64}$/i.test(value)) throw new Error('Expected 32-byte hex.');
  const bytes = new Uint8Array(32);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

export function reportCommitment(binding: string, digest: string, opening: string): string {
  return bytesToHex(persistentCommit(
    commitmentInput,
    [pad32(VULNA_DOMAIN.reportCommitment), bytes32FromHex(binding), bytes32FromHex(digest)],
    bytes32FromHex(opening),
  ));
}

export function severityCommitment(binding: string, severity: string, opening: string): string {
  return bytesToHex(persistentCommit(
    commitmentInput,
    [pad32(VULNA_DOMAIN.severityCommitment), bytes32FromHex(binding), bytes32FromHex(severity)],
    bytes32FromHex(opening),
  ));
}

/** Exact client equivalent of Compact `roleKey`; result is public role metadata. */
export function roleKey(domain: string, secret: string): string {
  return bytesToHex(persistentHash(
    roleKeyInput,
    [pad32(domain), bytes32FromHex(secret)],
  ));
}

/** Exact client equivalent of Compact `ownershipCommitmentFor`. */
export function researcherOwnershipCommitment(binding: string, secret: string, report: string): string {
  return bytesToHex(persistentHash(
    ownershipInput,
    [
      pad32(VULNA_DOMAIN.researcherOwnership),
      bytes32FromHex(secret),
      bytes32FromHex(binding),
      bytes32FromHex(report),
    ],
  ));
}

/** Exact client equivalent of Compact `nullifierFor`. Never reuse a result. */
export function submissionNullifier(binding: string, secret: string, digest: string): string {
  return bytesToHex(persistentHash(
    ownershipInput,
    [
      pad32(VULNA_DOMAIN.submissionNullifier),
      bytes32FromHex(secret),
      bytes32FromHex(binding),
      bytes32FromHex(digest),
    ],
  ));
}

export async function severityValue(band: SeverityBand): Promise<string> {
  return bytesToHex(await sha256(utf8.encode(`${VULNA_DOMAIN.severityBand}:${band}`)));
}
