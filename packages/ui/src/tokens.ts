/**
 * Design tokens — the single source of truth for the visual language
 * described in Section 2 of the proposal: "considered typography, restrained
 * colour, and meaningful hierarchy".
 *
 * These are *also* expressed in packages/config/tailwind/preset.cjs so
 * consumer apps can use the `heritage-*`, `savanna-*` etc. colour classes
 * directly. If you change a value here, change it there too — there is a
 * test in this package that keeps them in sync.
 */
export const COLOR_TOKENS = {
  heritage: {
    primary: '#0f1d3a',
    hover: '#2b3a55',
    subtle: '#e1e8f2',
    ink: '#0a1428',
  },
  savanna: {
    primary: '#d9951f',
    subtle: '#faf0cb',
  },
  msasa: {
    primary: '#c85549',
    subtle: '#f8e4e2',
  },
  granite: {
    ink: '#20242b',
    muted: '#667487',
    subtle: '#eceef2',
    surface: '#f7f8f9',
  },
} as const;

export const TYPOGRAPHY_TOKENS = {
  family: {
    display: '"Source Serif 4", Georgia, serif',
    body: 'Inter, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  /** Type scale — major third, rounded to whole pixels where possible. */
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.75rem',
    '5xl': '3.5rem',
  },
} as const;

export const RADIUS_TOKENS = {
  sm: '0.25rem',
  base: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
} as const;

/**
 * Role → accent mapping. Each portal picks up its role accent in the nav
 * rail so a user glancing between two tabs always knows which role they are
 * acting in.
 */
export const PORTAL_ACCENT = {
  student: COLOR_TOKENS.heritage.primary,
  teacher: COLOR_TOKENS.savanna.primary,
  parent: COLOR_TOKENS.heritage.primary,
  admin: COLOR_TOKENS.granite.ink,
} as const;

export type PortalKey = keyof typeof PORTAL_ACCENT;
