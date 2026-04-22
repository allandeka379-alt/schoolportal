/**
 * argon2 shim for the seed script.
 *
 * The seed does not ship to production; it uses scrypt (built into Node) so
 * that running `pnpm db:seed` does not require a native argon2 addon. The API
 * shape mirrors the production argon2 call site so the seed reads naturally.
 *
 * Production code (apps/api) uses the real `argon2` module.
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const argon2id = 2 as const;

export interface HashOptions {
  type: number;
}

export function hash(password: string, _opts?: HashOptions): Promise<string> {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return Promise.resolve(`scrypt$1$${salt.toString('base64')}$${derived.toString('base64')}`);
}

export function verify(encoded: string, password: string): Promise<boolean> {
  const [alg, _version, saltB64, hashB64] = encoded.split('$');
  if (alg !== 'scrypt' || !saltB64 || !hashB64) return Promise.resolve(false);
  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');
  const derived = scryptSync(password, salt, expected.length);
  return Promise.resolve(derived.length === expected.length && timingSafeEqual(derived, expected));
}
