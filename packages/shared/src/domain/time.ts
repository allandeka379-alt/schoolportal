/**
 * Time helpers.
 *
 * Source of truth: UTC `timestamptz` in Postgres. Display: the school's
 * configured timezone, default Africa/Harare. The portal never uses the
 * server process's local timezone.
 */
export const HARARE_TZ = 'Africa/Harare';

export function nowUtc(): Date {
  return new Date();
}

/** ISO-8601 string with offset, rendered in the given tz. */
export function formatInTz(d: Date, tz: string = HARARE_TZ): string {
  return new Intl.DateTimeFormat('en-ZW', {
    timeZone: tz,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

export function isSameLocalDay(a: Date, b: Date, tz: string = HARARE_TZ): boolean {
  const fmt = new Intl.DateTimeFormat('en-ZW', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(a) === fmt.format(b);
}

/** Days between two dates (calendar days, not 24h blocks). Useful for late-penalty math. */
export function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
