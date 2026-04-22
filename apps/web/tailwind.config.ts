import type { Config } from 'tailwindcss';

import preset from '@hha/config/tailwind/preset';

/**
 * v2.0 Design Direction · "Cool precision."
 *
 * Seven-step neutral system from pure Snow (#FFFFFF) to deep Obsidian
 * (#0A0A0B), plus five per-portal vivid accents used sparingly — never
 * mixed within a single portal.
 *
 * The previous warm-editorial tokens (cream / sand / earth / terracotta /
 * ochre / stone / ink) are retained for backward compatibility with pages
 * that still reference them; the new shells and chrome use the new tokens.
 *
 * Shells and components that want to be "portal-aware" should use
 * `bg-accent`, `text-accent`, `border-accent` — these resolve to the CSS
 * variable `--accent` scoped per portal in globals.css.
 */
const config: Config = {
  presets: [preset as Config],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* v2.0 neutrals */
        snow: '#FFFFFF',
        fog: '#EDEFF2',
        mist: '#D4D7DD',
        steel: '#9095A0',
        slate: '#4D5159',
        graphite: '#2B2D31',
        charcoal: '#17181B',
        obsidian: '#0A0A0B',

        /* Per-portal accents — explicit hex */
        indigo: {
          DEFAULT: '#5B5CFF',
          hover: '#4648D9',
        },
        emerald: {
          DEFAULT: '#00B37E',
          hover: '#009060',
        },
        coral: {
          DEFAULT: '#FF5B7A',
          hover: '#E64564',
        },
        amber: {
          DEFAULT: '#F5A524',
          hover: '#D99020',
        },
        cyan: {
          DEFAULT: '#0AEFFF',
          hover: '#00C5D4',
        },

        /* Portal-aware accent — each shell sets --accent */
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
        },

        /* Universal signal colours */
        signal: {
          success: '#00B37E',
          warning: '#F5A524',
          error: '#FF4D4D',
        },

        /* Retained for backward compat on pages that haven't been refactored */
        ink: {
          DEFAULT: '#0A0A0B', // re-aliased to Obsidian
          soft: '#17181B',
        },
        earth: '#4D5159', // re-aliased to Slate so earth-labelled eyebrows still read
        terracotta: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
        },
        ochre: '#F5A524',
        cream: '#FFFFFF', // re-aliased to Snow
        'sand-light': '#EDEFF2', // re-aliased to Fog
        sand: '#D4D7DD', // re-aliased to Mist
        stone: '#4D5159', // re-aliased to Slate
        ok: '#00B37E',
        warn: '#F5A524',
        danger: '#FF4D4D',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
        /* "serif" is now also Inter — the warm body serif is retired */
        serif: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* v2.0 type scale from §02 */
        'display-xl': ['7.5rem', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-l':  ['5rem',   { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-m':  ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-s':  ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        /* Legacy display aliases for pages that use text-display-md/sm/lg */
        'display-lg': ['5rem',   { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        /* Headings */
        'heading-1': ['1.75rem',  { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-2': ['1.375rem', { lineHeight: '1.25' }],
        'heading-3': ['1.125rem', { lineHeight: '1.3' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.2' }],
        'heading-md': ['1.375rem', { lineHeight: '1.25' }],
        /* Body */
        'body-l': ['1rem',     { lineHeight: '1.5' }],
        'body-m': ['0.875rem', { lineHeight: '1.5' }],
        'body-s': ['0.75rem',  { lineHeight: '1.4' }],
        'micro':  ['0.6875rem', { lineHeight: '1.35', letterSpacing: '0.08em' }],
        'body-lg': ['1rem',    { lineHeight: '1.5' }],
        'body-base': ['0.875rem', { lineHeight: '1.5' }],
        'body-sm': ['0.75rem', { lineHeight: '1.4' }],
        /* Eyebrow/caps */
        'label-caps': ['0.6875rem', { lineHeight: '1.35', letterSpacing: '0.12em' }],
        'mono-sm':    ['0.75rem',   { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        /* v2.0 — slightly squared-off; default 6-8 */
        DEFAULT: '0.375rem', // 6px
        sm: '0.25rem',       // 4px
        md: '0.5rem',        // 8px
        lg: '0.75rem',       // 12px
      },
      boxShadow: {
        /* v2.0 — elevation is implied through border contrast alone. */
        e1: 'none',
        e2: '0 0 0 1px #D4D7DD', // mist border
        e3: '0 8px 24px -8px rgba(10, 10, 11, 0.15)',
        screenshot: '0 8px 24px -8px rgba(10, 10, 11, 0.15)',
        'nav-scroll': '0 1px 0 rgba(10, 10, 11, 0.04)',
        focus: '0 0 0 2px rgb(var(--accent) / 1)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '60': '60ms',
        '120': '120ms',
      },
      maxWidth: {
        measure: '72ch',
        'prose-sm': '52ch',
      },
      animation: {
        reveal: 'reveal 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
        nudge: 'nudge 2.4s ease-in-out infinite',
        'pulse-once': 'pulseOnce 1.2s ease-out 400ms 1',
        'underline-in': 'underlineIn 120ms ease-out forwards',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        nudge: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(4px)' },
        },
        pulseOnce: {
          '0%': { boxShadow: '0 0 0 0 rgb(var(--accent) / 0.35)' },
          '70%': { boxShadow: '0 0 0 8px rgb(var(--accent) / 0)' },
          '100%': { boxShadow: '0 0 0 0 rgb(var(--accent) / 0)' },
        },
        underlineIn: {
          from: { transform: 'scaleX(0)', transformOrigin: 'left' },
          to: { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
    },
  },
};

export default config;
