import { bytesToHex, canonicalize, sha256 } from '../protocol/canonicalize.js';
import { VULNA_DOMAIN, VULNA_SCHEMA } from '../protocol/domain.js';
import { bytes32FromHex } from './compact-commitments.js';

/** A salted public binding; the wallet address and opening never go on-chain. */
export async function payoutRecipientCommitment(destination: string, opening: string): Promise<string> {
  if (!destination.trim() || !/^[0-9a-f]{64}$/i.test(opening)) throw new Error('Invalid payout recipient commitment input.');
  return bytesToHex(await sha256(canonicalize({
    destination,
    domain: VULNA_DOMAIN.payoutRecipient,
    opening: opening.toLowerCase(),
    schema: VULNA_SCHEMA.settlementReceipt,
  })));
}

/** Public receipt binding for the deliberately non-atomic external transfer. */
export async function settlementReceiptHash(transactionId: string): Promise<string> {
  const normalized = transactionId.trim();
  // Wallet SDK transaction identifiers are opaque strings, not necessarily hashes.
  if (!normalized || normalized.length > 512) throw new Error('Invalid settlement transaction identifier.');
  return bytesToHex(await sha256(canonicalize({ schema: VULNA_SCHEMA.settlementReceipt, transactionId: normalized })));
}

export function settlementHashBytes(value: string): Uint8Array {
  return bytes32FromHex(value);
}
