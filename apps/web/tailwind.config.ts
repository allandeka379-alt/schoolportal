import type { Config } from 'tailwindcss';

import preset from '@hha/config/tailwind/preset';

/**
 * Civic redesign — light-theme palette.
 *
 *   • Brand primary · Council Blue  #1F3A68
 *   • Brand accent  · Gold          #C9A227
 *   • Ink / muted / border / surface / card for neutrals
 *   • Semantic success / warning / danger / info
 *
 * All tokens live as CSS variables in globals.css so charts and inline
 * styles can consume them. Every older HHA colour name (cream, sand, ink,
 * stone, earth, terracotta, ochre, snow, fog, mist, steel, slate,
 * graphite, charcoal, obsidian) is aliased to this palette so the hundred-
 * odd pages written against those names keep rendering.
 */
const config: Config = {
  presets: [preset as Config],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '2.5rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        /* Brand */
        brand: {
          DEFAULT: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          primary: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          accent: 'rgb(var(--color-brand-accent) / <alpha-value>)',
          ink: 'rgb(var(--color-brand-ink) / <alpha-value>)',
        },

        /* Semantic */
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',

        /* Core neutrals */
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-border) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',

        /* Legacy HHA palette (kept for backward-compat) */
        cream: 'rgb(var(--color-card) / <alpha-value>)',
        snow: 'rgb(var(--color-card) / <alpha-value>)',
        fog: 'rgb(var(--color-surface) / <alpha-value>)',
        'sand-light': 'rgb(var(--color-surface) / <alpha-value>)',
        sand: 'rgb(var(--color-border) / <alpha-value>)',
        mist: 'rgb(var(--color-border) / <alpha-value>)',
        stone: 'rgb(var(--color-muted) / <alpha-value>)',
        steel: 'rgb(var(--color-muted) / <alpha-value>)',
        slate: 'rgb(var(--color-muted) / <alpha-value>)',
        graphite: 'rgb(var(--color-ink) / <alpha-value>)',
        charcoal: 'rgb(var(--color-ink) / <alpha-value>)',
        obsidian: 'rgb(var(--color-brand-ink) / <alpha-value>)',
        earth: 'rgb(var(--color-brand-primary) / <alpha-value>)',
        'earth-light': 'rgb(var(--color-brand-primary) / <alpha-value>)',
        terracotta: 'rgb(var(--color-brand-primary) / <alpha-value>)',
        'terracotta-hover': 'rgb(var(--color-brand-primary) / <alpha-value>)',
        ochre: 'rgb(var(--color-brand-accent) / <alpha-value>)',
        ok: 'rgb(var(--color-success) / <alpha-value>)',
        warn: 'rgb(var(--color-warning) / <alpha-value>)',
        'signal-success': 'rgb(var(--color-success) / <alpha-value>)',
        'signal-warning': 'rgb(var(--color-warning) / <alpha-value>)',
        'signal-error': 'rgb(var(--color-danger) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        'card-sm': '0 1px 2px 0 rgba(17, 24, 39, 0.04), 0 1px 3px 0 rgba(17, 24, 39, 0.06)',
        'card-md': '0 4px 8px -2px rgba(17, 24, 39, 0.06), 0 2px 4px -2px rgba(17, 24, 39, 0.04)',
        'card-lg': '0 16px 32px -12px rgba(17, 24, 39, 0.12), 0 4px 8px -4px rgba(17, 24, 39, 0.06)',
        'ring-brand': '0 0 0 4px rgba(31, 58, 104, 0.15)',
        /* Legacy HHA names */
        e1: '0 1px 2px 0 rgba(17, 24, 39, 0.04), 0 1px 3px 0 rgba(17, 24, 39, 0.06)',
        e2: '0 4px 8px -2px rgba(17, 24, 39, 0.06), 0 2px 4px -2px rgba(17, 24, 39, 0.04)',
        e3: '0 16px 32px -12px rgba(17, 24, 39, 0.12), 0 4px 8px -4px rgba(17, 24, 39, 0.06)',
        screenshot: '0 16px 40px -12px rgba(17, 24, 39, 0.14), 0 4px 12px -4px rgba(17, 24, 39, 0.06)',
        'nav-scroll': '0 1px 2px 0 rgba(17, 24, 39, 0.06)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        120: '120ms',
      },
      keyframes: {
        'fade-in':    { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-out':   { from: { opacity: '1' }, to: { opacity: '0' } },
        'slide-up':   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-down': { from: { opacity: '0', transform: 'translateY(-12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in':   { from: { opacity: '0', transform: 'scale(0.97)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'pulse-ring': { '0%': { transform: 'scale(1)', opacity: '0.6' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
        'rotating-in':{ from: { opacity: '0', transform: 'translateY(0.3em)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        reveal:       { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        nudge:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(3px)' } },
      },
      animation: {
        'fade-in':    'fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-out':   'fade-out 150ms ease-in',
        'slide-up':   'slide-up 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':   'scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'rotating-in':'rotating-in 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        reveal:       'reveal 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        nudge:        'nudge 1.6s ease-in-out infinite',
      },
      fontSize: {
        display: ['clamp(2.5rem, 5vw + 1rem, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.5rem' }],
        small: ['0.875rem', { lineHeight: '1.25rem' }],
        micro: ['0.75rem', { lineHeight: '1rem' }],

        /* Legacy HHA type scale names */
        'display-xl': ['clamp(3.5rem, 7vw + 1rem, 5.5rem)', { lineHeight: '1.04', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['clamp(2rem, 4vw + 1rem, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['clamp(1.5rem, 3vw + 0.5rem, 2.25rem)', { lineHeight: '1.12', fontWeight: '600' }],
        'heading-1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'heading-2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'heading-3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'heading-md': ['1.125rem', { lineHeight: '1.6rem', fontWeight: '600' }],
        'heading-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.6rem' }],
        'body-base': ['1rem', { lineHeight: '1.5rem' }],
      },
      maxWidth: {
        measure: '65ch',
        'prose-sm': '56ch',
      },
    },
  },
  plugins: [],
};

export default config;
