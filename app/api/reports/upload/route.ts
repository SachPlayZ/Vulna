import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_ENVELOPE_BYTES = 256_000;
const ENVELOPE_PATH = /^reports\/([a-f0-9]{64})\.envelope$/;

function authorizedEnvelopePath(pathname: string, clientPayload: string | null): string {
  const match = ENVELOPE_PATH.exec(pathname);
  if (!match || !clientPayload) throw new Error('Invalid encrypted report upload.');

  let payload: unknown;
  try {
    payload = JSON.parse(clientPayload);
  } catch {
    throw new Error('Invalid encrypted report upload.');
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid encrypted report upload.');
  const envelopeHash = (payload as { envelopeHash?: unknown }).envelopeHash;
  if (envelopeHash !== match[1]) throw new Error('Invalid encrypted report upload.');
  return match[1];
}

/**
 * This endpoint never receives report plaintext or blob bytes. It only issues a
 * short-lived, path-constrained token for the browser's direct ciphertext upload.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        if (multipart) throw new Error('Multipart report uploads are not allowed.');
        const envelopeHash = authorizedEnvelopePath(pathname, clientPayload);
        return {
          allowedContentTypes: ['application/octet-stream'],
          maximumSizeInBytes: MAX_ENVELOPE_BYTES,
          validUntil: Date.now() + 5 * 60_000,
          addRandomSuffix: false,
          allowOverwrite: false,
          cacheControlMaxAge: 31_536_000,
          tokenPayload: JSON.stringify({ schema: 'vulna.blob-upload.v1', envelopeHash }),
        };
      },
    });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Encrypted report upload could not be authorized.' }, { status: 400 });
  }
}
