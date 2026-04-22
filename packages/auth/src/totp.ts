/**
 * TOTP (RFC 6238) generator & verifier.
 *
 * Used for the staff 2FA flow. The secret is stored encrypted at rest; this
 * module only handles the mathematics. Drift window defaults to ±1 step
 * (30 s); callers can widen for lossy time sync on older devices.
 */
import { createHmac, randomBytes } from 'node:crypto';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateTotpSecret(bytes = 20): string {
  const raw = randomBytes(bytes);
  return toBase32(raw);
}

export interface VerifyOptions {
  readonly digits?: number;
  readonly stepSeconds?: number;
  readonly window?: number;
  readonly now?: Date;
}

export function totp(secretBase32: string, at: Date = new Date(), digits = 6, step = 30): string {
  const counter = Math.floor(at.getTime() / 1000 / step);
  return hotp(secretBase32, counter, digits);
}

export function verifyTotp(
  secretBase32: string,
  code: string,
  opts: VerifyOptions = {},
): boolean {
  const digits = opts.digits ?? 6;
  const step = opts.stepSeconds ?? 30;
  const window = opts.window ?? 1;
  const now = opts.now ?? new Date();
  const baseCounter = Math.floor(now.getTime() / 1000 / step);

  for (let offset = -window; offset <= window; offset += 1) {
    const candidate = hotp(secretBase32, baseCounter + offset, digits);
    if (constantTimeEqual(candidate, code)) return true;
  }
  return false;
}

function hotp(secretBase32: string, counter: number, digits: number): string {
  const key = fromBase32(secretBase32);
  const buf = Buffer.alloc(8);
  // Node's BigInt-safe way to write a 64-bit counter.
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac('sha1', key).update(buf).digest();
  const lastByte = hmac[hmac.length - 1];
  if (lastByte === undefined) throw new Error('HMAC output empty');
  const offset = lastByte & 0xf;
  const code =
    (((hmac[offset] ?? 0) & 0x7f) << 24) |
    (((hmac[offset + 1] ?? 0) & 0xff) << 16) |
    (((hmac[offset + 2] ?? 0) & 0xff) << 8) |
    ((hmac[offset + 3] ?? 0) & 0xff);
  return (code % 10 ** digits).toString().padStart(digits, '0');
}

function toBase32(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32_ALPHABET[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32_ALPHABET[(value << (5 - bits)) & 0x1f];
  return out;
}

function fromBase32(s: string): Buffer {
  const clean = s.replace(/=+$/, '').toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) throw new Error(`Invalid base32 character: ${ch}`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
