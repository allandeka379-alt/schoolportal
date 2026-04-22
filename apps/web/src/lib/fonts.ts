import { Fraunces, Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';

/**
 * Self-hosted fonts per the design spec §03.
 *
 *   Fraunces       — display serif with variable weight + italic
 *   Source Serif 4 — body serif for long-form reading
 *   Inter          — UI sans for navigation, labels, forms
 *   JetBrains Mono — reference numbers, transaction IDs
 *
 * next/font downloads at build time and serves from our origin with
 * `font-display: swap`, hitting the performance budget in §18.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500'],
});

/** Joined class string to attach to <html>. */
export const fontVariables = [
  fraunces.variable,
  sourceSerif.variable,
  inter.variable,
  jetbrainsMono.variable,
].join(' ');
