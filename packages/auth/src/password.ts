/**
 * Password hashing & verification — argon2id.
 *
 * Parameters target ~300ms on a modern x86 server; tune by running
 * `pnpm --filter @hha/auth test:bench` before changing.
 *
 * Never log the raw password or the raw hash. Verification is timing-safe
 * because argon2 library uses constant-time equality internally.
 */
import argon2 from 'argon2';

export interface HashOptions {
  readonly timeCost?: number;
  readonly memoryCost?: number;
  readonly parallelism?: number;
}

const DEFAULTS: Required<HashOptions> = {
  timeCost: 3,
  memoryCost: 64 * 1024,
  parallelism: 4,
};

export async function hashPassword(plain: string, opts?: HashOptions): Promise<string> {
  const resolved = { ...DEFAULTS, ...opts };
  return argon2.hash(plain, {
    type: argon2.argon2id,
    timeCost: resolved.timeCost,
    memoryCost: resolved.memoryCost,
    parallelism: resolved.parallelism,
  });
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}

/**
 * True when a hash was created with weaker parameters than our current
 * defaults — callers should re-hash on the next successful sign-in.
 */
export function needsRehash(hash: string, opts?: HashOptions): boolean {
  const resolved = { ...DEFAULTS, ...opts };
  return argon2.needsRehash(hash, {
    type: argon2.argon2id,
    timeCost: resolved.timeCost,
    memoryCost: resolved.memoryCost,
    parallelism: resolved.parallelism,
  });
}
