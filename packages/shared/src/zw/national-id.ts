import { z } from 'zod';

/**
 * Zimbabwean national ID — format `NN-NNNNNNN A NN`:
 *   - two-digit registration district
 *   - seven-digit personal sequence
 *   - single check letter
 *   - two-digit place-of-origin district
 *
 * We validate format only. Check-letter validation is out of scope (and in
 * any case the central registry is authoritative, not us).
 */
const PATTERN = /^(\d{2})-?(\d{6,7})\s?([A-Z])\s?(\d{2})$/i;

export class InvalidNationalIdError extends Error {
  constructor(readonly input: string) {
    super(`Not a recognisable Zimbabwean national ID: "${input}"`);
  }
}

export function normaliseNationalId(raw: string): string {
  const m = raw.trim().toUpperCase().match(PATTERN);
  if (!m) throw new InvalidNationalIdError(raw);
  const [, district, seq, check, origin] = m;
  return `${district}-${(seq ?? '').padStart(7, '0')} ${check} ${origin}`;
}

export const ZimNationalIdSchema = z
  .string()
  .transform((v, ctx) => {
    try {
      return normaliseNationalId(v);
    } catch (err) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: err instanceof Error ? err.message : 'Invalid national ID',
      });
      return z.NEVER;
    }
  });
