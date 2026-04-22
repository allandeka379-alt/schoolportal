import type { Config } from 'tailwindcss';

import preset from '@hha/config/tailwind/preset';

/**
 * Extend the shared preset with the landing-page tokens from the design spec:
 *   Ink, Earth, Terracotta, Ochre — primary
 *   Cream, Sand Light, Sand, Stone — supporting
 *   Soft Ink for the footer surface.
 *
 * The portal chrome continues to use the preset's heritage/savanna/msasa/granite
 * tokens unchanged; the landing uses these earth tokens exclusively.
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
        // Landing-page editorial palette (per design spec §03)
        ink: {
          DEFAULT: '#1A1410',
          soft: '#2D2520', // footer surface, slightly warmer than pure Ink
        },
        earth: '#5C3A1E',
        terracotta: {
          DEFAULT: '#C65D3D',
          hover: '#A94A2E', // darkens to Earth on CTA hover
        },
        ochre: '#D4943A',
        cream: '#FAF5EB',
        'sand-light': '#F5EEDC',
        sand: '#E8DCC4',
        stone: '#6B6458',
        // Reserved state colours (outside core palette, per spec)
        ok: '#2F7D4E',
        warn: '#B8860B',
        danger: '#B0362A',
      },
      fontFamily: {
        // Variables injected by next/font in layout.tsx
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Type scale tokens from §03 of the spec
        'display-xl': ['5.5rem', { lineHeight: '1.045', letterSpacing: '-0.018em' }], // 88/92
        'display-lg': ['4rem', { lineHeight: '1.0625', letterSpacing: '-0.015em' }], // 64/68
        'display-md': ['2.75rem', { lineHeight: '1.182', letterSpacing: '-0.01em' }], // 44/52
        'heading-lg': ['2rem', { lineHeight: '1.25' }], // 32/40
        'heading-md': ['1.5rem', { lineHeight: '1.333' }], // 24/32
        'body-lg': ['1.1875rem', { lineHeight: '1.58' }], // 19/30
        'body-base': ['1rem', { lineHeight: '1.625' }], // 16/26
        'body-sm': ['0.875rem', { lineHeight: '1.571' }], // 14/22
        'label-caps': ['0.75rem', { lineHeight: '1.333', letterSpacing: '0.16em' }], // 12/16 caps
        'mono-sm': ['0.8125rem', { lineHeight: '1.538' }], // 13/20
      },
      spacing: {
        // Spec §03 — 4px base unit. Tailwind already has 1..4 as 0.25rem..1rem, add the larger tokens.
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
        '30': '7.5rem',  // 120px
      },
      borderRadius: {
        // Spec: radius is 4px throughout. Override Tailwind default softening.
        DEFAULT: '0.25rem',
        md: '0.25rem',
        lg: '0.25rem',
      },
      boxShadow: {
        // Elevation ladder from §03
        'e1': 'none', // Level 1 is hairline-border only
        'e2': '0 2px 12px rgba(92, 58, 30, 0.06)',
        'e3': '0 12px 40px rgba(26, 20, 16, 0.12)',
        'screenshot': '0 24px 48px -12px rgba(26, 20, 16, 0.14)',
        'nav-scroll': '0 1px 0 rgba(26, 20, 16, 0.04)',
        'focus': '0 0 0 2px rgba(198, 93, 61, 0.35)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      maxWidth: {
        'measure': '64ch', // Spec §03 — body measure cap
        'prose-sm': '44ch',
      },
      animation: {
        'reveal': 'reveal 480ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'nudge': 'nudge 2.4s ease-in-out infinite',
        'pulse-once': 'pulseOnce 1.2s ease-out 640ms 1',
        'underline-in': 'underlineIn 240ms ease-out forwards',
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
          '0%': { boxShadow: '0 0 0 0 rgba(198, 93, 61, 0.3)' },
          '70%': { boxShadow: '0 0 0 8px rgba(198, 93, 61, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(198, 93, 61, 0)' },
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
