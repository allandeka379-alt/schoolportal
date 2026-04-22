/**
 * i18n primitives.
 *
 * Phase-one strategy:
 *   - UI strings live in JSON bundles keyed by locale, loaded by the web app.
 *   - Content that a human authors (announcements, feedback comments) is
 *     translated at write-time via a machine-translation service and stored
 *     in `AnnouncementTranslation`/similar. Machine output is flagged so a
 *     reviewer can override it.
 *
 * This file only defines the locale vocabulary and a couple of helpers.
 */
export const SUPPORTED_LOCALES = ['EN', 'SN', 'ND'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, { english: string; native: string }> = {
  EN: { english: 'English', native: 'English' },
  SN: { english: 'Shona', native: 'ChiShona' },
  ND: { english: 'Ndebele', native: 'isiNdebele' },
};

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(v);
}

export function resolveLocale(candidate: string | null | undefined, fallback: Locale = 'EN'): Locale {
  if (!candidate) return fallback;
  const upper = candidate.toUpperCase();
  return isLocale(upper) ? upper : fallback;
}
