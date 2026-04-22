import { z } from 'zod';

/**
 * Money handling for HHA.
 *
 * Zimbabwe has three relevant currencies right now: USD, ZWL (legacy Zim
 * dollar), and ZWG (gold-backed Zim dollar launched 2024). Fees are quoted in
 * USD but can settle in any of the three; exchange handling is the bursary's
 * problem, not the portal's — we just need to never lose precision.
 *
 * Money is represented as minor units (cents) in an integer, or as a decimal
 * string. We never use JS numbers for monetary arithmetic.
 */
export const CurrencyCodeSchema = z.enum(['USD', 'ZWL', 'ZWG']);
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

/**
 * Matches a non-negative decimal with up to two fractional digits.
 * Examples: "0", "0.00", "1650", "1650.50". Rejects "-1", "1.234", "1,650".
 */
export const DecimalAmountSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a non-negative decimal with up to two places.');

export type DecimalAmount = z.infer<typeof DecimalAmountSchema>;

export interface Money {
  readonly currency: CurrencyCode;
  readonly amount: DecimalAmount;
}

/**
 * Parse a decimal string into a BigInt count of minor units.
 *  "1650" → 165000n     (USD$1650.00)
 *  "1650.5" → 165050n
 *  "1650.50" → 165050n
 */
export function toMinorUnits(amount: DecimalAmount): bigint {
  const [whole, fraction = ''] = amount.split('.');
  const padded = `${fraction}00`.slice(0, 2);
  const wholePart = BigInt((whole ?? '0').replace(/^$/, '0'));
  const fracPart = BigInt(padded);
  return wholePart * 100n + fracPart;
}

export function fromMinorUnits(minor: bigint): DecimalAmount {
  const sign = minor < 0n ? '-' : '';
  const abs = minor < 0n ? -minor : minor;
  const whole = abs / 100n;
  const frac = abs % 100n;
  return `${sign}${whole}.${frac.toString().padStart(2, '0')}` as DecimalAmount;
}

/**
 * Formats a Money value for display. We don't use `Intl.NumberFormat` for the
 * currency itself — ZWG is not an ISO 4217 code and Intl rejects it.
 */
export function formatMoney(m: Money, locale = 'en-ZW'): string {
  const numeric = Number(m.amount);
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
  return `${m.currency} ${formatted}`;
}

export const MoneySchema = z.object({
  currency: CurrencyCodeSchema,
  amount: DecimalAmountSchema,
});
