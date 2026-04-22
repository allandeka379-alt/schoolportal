/**
 * Shared Tailwind preset — HHA design tokens.
 *
 * The proposal calls for "considered typography, restrained colour, and
 * meaningful hierarchy — because our learners and parents deserve the same
 * design care a bank customer receives." This preset encodes that intent.
 *
 * Palette anchors:
 *  - Heritage (navy)    — institutional, trustworthy.
 *  - Savanna (gold)     — heritage accent, used sparingly.
 *  - Msasa (warm red)   — after the msasa tree; used only for urgency/errors.
 *  - Granite (slate)    — neutral scaffolding.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        heritage: {
          50: '#f2f5fa',
          100: '#e1e8f2',
          200: '#c3d1e6',
          300: '#9cb2d3',
          400: '#6f8cbb',
          500: '#4c6ba1',
          600: '#3b5484',
          700: '#32466b',
          800: '#2b3a55',
          900: '#0f1d3a', // Primary — deep institutional navy
          950: '#0a1428',
        },
        savanna: {
          50: '#fdf9ed',
          100: '#faf0cb',
          200: '#f5df91',
          300: '#efc757',
          400: '#eab133',
          500: '#d9951f',
          600: '#bc7118',
          700: '#9a5118',
          800: '#7f411b',
          900: '#6b371b',
        },
        msasa: {
          50: '#fbf3f2',
          100: '#f8e4e2',
          200: '#f2ccc8',
          300: '#e8a8a1',
          400: '#da7b71',
          500: '#c85549',
          600: '#b44035',
          700: '#96332b',
          800: '#7d2d28',
          900: '#6a2a26',
        },
        granite: {
          50: '#f7f8f9',
          100: '#eceef2',
          200: '#d5dae1',
          300: '#b0b9c5',
          400: '#8491a3',
          500: '#667487',
          600: '#525e6f',
          700: '#434c5a',
          800: '#39414c',
          900: '#323841',
          950: '#20242b',
        },
      },
      fontFamily: {
        // Humanist serif for institutional headlines.
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        // Neutral, highly readable sans for body.
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // For amounts, reference numbers, receipts.
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-sm': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        // Restrained, bank-like rather than playful.
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 29 58 / 0.04), 0 1px 3px 0 rgb(15 29 58 / 0.06)',
        elevated:
          '0 4px 6px -2px rgb(15 29 58 / 0.05), 0 10px 15px -3px rgb(15 29 58 / 0.08)',
        focus: '0 0 0 3px rgb(76 107 161 / 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 240ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
