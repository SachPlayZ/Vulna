import { bytesToHex, sha256 } from '../protocol/canonicalize.js';
import { type EncryptedReportBundle, serializeEncryptedEnvelope, verifyEnvelopeHash } from '../crypto/report-crypto.js';

const ENVELOPE_HASH = /^[a-f0-9]{64}$/;

export type OpaqueEnvelopeReference = Readonly<{
  artifactHash: string;
  envelopeHash: string;
  url: string;
}>;

export class OpaqueEnvelopeError extends Error {
  constructor() {
    super('Encrypted report envelope verification failed.');
    this.name = 'OpaqueEnvelopeError';
  }
}

export function envelopePath(envelopeHash: string): string {
  const normalized = envelopeHash.toLowerCase();
  if (!ENVELOPE_HASH.test(normalized)) throw new OpaqueEnvelopeError();
  return `reports/${normalized}.envelope`;
}

export async function verifyOpaqueEnvelopeBytes(bytes: Uint8Array, expectedEnvelopeHash: string): Promise<unknown> {
  if (bytesToHex(await sha256(bytes)) !== expectedEnvelopeHash.toLowerCase()) throw new OpaqueEnvelopeError();
  try {
    const envelope = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!await verifyEnvelopeHash(envelope, expectedEnvelopeHash)) throw new OpaqueEnvelopeError();
    return envelope;
  } catch (error) {
    if (error instanceof OpaqueEnvelopeError) throw error;
    throw new OpaqueEnvelopeError();
  }
}

/** Browser-only direct upload. The app server sees a token request, never report bytes. */
export async function uploadOpaqueEnvelope(bundle: EncryptedReportBundle): Promise<OpaqueEnvelopeReference> {
  if (typeof window === 'undefined') throw new OpaqueEnvelopeError();
  const { upload } = await import('@vercel/blob/client');
  const bytes = serializeEncryptedEnvelope(bundle.envelope);
  await verifyOpaqueEnvelopeBytes(bytes, bundle.envelopeHash);
  const result = await upload(envelopePath(bundle.envelopeHash), new Blob([new Uint8Array(bytes).buffer], {
    type: 'application/octet-stream',
  }), {
    access: 'public',
    contentType: 'application/octet-stream',
    handleUploadUrl: '/api/reports/upload',
    clientPayload: JSON.stringify({ envelopeHash: bundle.envelopeHash }),
  });

  const response = await fetch(result.url, { cache: 'no-store' });
  if (!response.ok) throw new OpaqueEnvelopeError();
  await verifyOpaqueEnvelopeBytes(new Uint8Array(await response.arrayBuffer()), bundle.envelopeHash);
  return { artifactHash: bundle.artifactHash, envelopeHash: bundle.envelopeHash, url: result.url };
}
