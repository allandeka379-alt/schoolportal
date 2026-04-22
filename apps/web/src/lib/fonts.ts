import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

/**
 * v2.0 design direction — cool precision. §02 of the Direction doc.
 *
 *   Space Grotesk  — geometric display for headlines, hero numbers,
 *                    page titles. Weights 400/500/700. Tight tracking.
 *   Inter          — neutral body & UI sans. Weights 400/500/600.
 *                    Optical-size variable, optimised for screen.
 *   JetBrains Mono — code-adjacent signature used for eyebrows, IDs,
 *                    metadata, key-value specs, tabular data.
 *
 * The previous Fraunces + Source Serif 4 pairing is retired; no more
 * serifs on any surface. All three faces are self-hosted via next/font
 * with font-display: swap.
 */

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
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
  weight: ['400', '500', '700'],
});

/* ------------------------------------------------------------------ */
/*  Legacy variable aliases                                            */
/* ------------------------------------------------------------------ */
/*
 * Pages still reference --font-fraunces and --font-source-serif in their
 * class names ("font-display", "font-serif"). We alias both of those to
 * Space Grotesk and Inter respectively, so the cascade inherits the new
 * faces without requiring a per-page edit. The legacy Fraunces / Source
 * Serif assets are no longer downloaded.
 */
export const legacyAliasStyle = `
:root {
  --font-fraunces: ${spaceGrotesk.style.fontFamily};
  --font-source-serif: ${inter.style.fontFamily};
}
`;

/** Joined class string to attach to <html>. */
export const fontVariables = [
  spaceGrotesk.variable,
  inter.variable,
  jetbrainsMono.variable,
].join(' ');
