import { z } from 'zod';

/**
 * Zimbabwean phone-number normalisation.
 *
 * We accept the three common shapes: "0772 123 456", "263772123456",
 * "+263 772 123 456" — and coerce them all to strict E.164. We reject
 * operator prefixes that don't map to a known MNO because a mistyped
 * prefix often masks a genuine typo.
 */
export const ZW_MOBILE_PREFIXES = {
  econet: ['77', '78'],
  netone: ['71'],
  telecel: ['73'],
} as const;

const ALL_PREFIXES = Object.values(ZW_MOBILE_PREFIXES).flat();

export type MobileOperator = keyof typeof ZW_MOBILE_PREFIXES;

export class InvalidPhoneError extends Error {
  constructor(readonly input: string) {
    super(`Not a valid Zimbabwean mobile number: "${input}"`);
  }
}

/** Strip anything that isn't a digit or a leading '+'. */
function normaliseDigits(raw: string): string {
  return raw.replace(/[^\d+]/g, '');
}

/**
 * Returns a strict E.164 phone like "+263772123456", or throws.
 */
export function toE164(raw: string): string {
  const trimmed = normaliseDigits(raw);
  let national: string;

  if (trimmed.startsWith('+263')) national = trimmed.slice(4);
  else if (trimmed.startsWith('263')) national = trimmed.slice(3);
  else if (trimmed.startsWith('0')) national = trimmed.slice(1);
  else national = trimmed;

  if (!/^\d{9}$/.test(national)) throw new InvalidPhoneError(raw);
  const prefix = national.slice(0, 2);
  if (!ALL_PREFIXES.includes(prefix as (typeof ALL_PREFIXES)[number])) {
    throw new InvalidPhoneError(raw);
  }
  return `+263${national}`;
}

export function detectOperator(e164: string): MobileOperator | null {
  if (!e164.startsWith('+263')) return null;
  const prefix = e164.slice(4, 6);
  for (const [op, prefixes] of Object.entries(ZW_MOBILE_PREFIXES)) {
    if ((prefixes as readonly string[]).includes(prefix)) return op as MobileOperator;
  }
  return null;
}

export const ZimPhoneSchema = z
  .string()
  .transform((v, ctx) => {
    try {
      return toE164(v);
    } catch (err) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: err instanceof Error ? err.message : 'Invalid phone number',
      });
      return z.NEVER;
    }
  });
