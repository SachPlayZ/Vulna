import { canonicalReportV1Schema, type CanonicalReportV1 } from './schemas.js';

const utf8 = new TextEncoder();

function normalizeString(value: string): string {
  return value.normalize('NFC').replace(/\r\n?/g, '\n');
}

function quoteString(value: string): string {
  let encoded = '"';

  for (const char of normalizeString(value)) {
    switch (char) {
      case '"': encoded += '\\"'; break;
      case '\\': encoded += '\\\\'; break;
      case '\b': encoded += '\\b'; break;
      case '\f': encoded += '\\f'; break;
      case '\n': encoded += '\\n'; break;
      case '\r': encoded += '\\r'; break;
      case '\t': encoded += '\\t'; break;
      default: {
        const codePoint = char.codePointAt(0);
        if (codePoint === undefined) throw new TypeError('Invalid string code point.');
        encoded += codePoint <= 0x1f ? `\\u${codePoint.toString(16).padStart(4, '0')}` : char;
      }
    }
  }

  return `${encoded}"`;
}

function serialize(value: unknown): string {
  if (value === null) return 'null';

  if (typeof value === 'string') return quoteString(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || Object.is(value, -0)) {
      throw new TypeError('Canonical values cannot contain non-finite numbers or negative zero.');
    }
    return String(value);
  }

  if (Array.isArray(value)) return `[${value.map(serialize).join(',')}]`;

  if (typeof value !== 'object') {
    throw new TypeError(`Canonical values cannot contain ${typeof value}.`);
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError('Canonical values must be plain objects.');
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${quoteString(key)}:${serialize(record[key])}`).join(',')}}`;
}

export function canonicalize(value: unknown): Uint8Array {
  return utf8.encode(serialize(value));
}

export function canonicalizeReportV1(report: unknown): { report: CanonicalReportV1; bytes: Uint8Array } {
  const parsed = canonicalReportV1Schema.parse(report);
  return { report: parsed, bytes: canonicalize(parsed) };
}

export async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto SHA-256 is unavailable.');
  }

  const input = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(input).set(bytes);
  return new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', input));
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createReportDigest(report: unknown): Promise<{ report: CanonicalReportV1; bytes: Uint8Array; digest: Uint8Array; digestHex: string }> {
  const { report: parsed, bytes } = canonicalizeReportV1(report);
  const digest = await sha256(bytes);
  return { report: parsed, bytes, digest, digestHex: bytesToHex(digest) };
}
