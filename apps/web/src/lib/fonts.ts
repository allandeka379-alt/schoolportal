import { Inter } from 'next/font/google';

/**
 * Civic redesign — single sans, Inter across the whole system.
 *
 * Earlier generations of this portal shipped Space Grotesk, JetBrains Mono,
 * Fraunces and Source Serif 4. All of those are retired; we now lean on
 * one well-hinted face, sized with a small type scale (display / h1..h3 /
 * body / small / micro) and tabular-nums for financial figures.
 */

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

/**
 * Legacy callers still reference `--font-display`, `--font-inter`,
 * `--font-jetbrains-mono`, `--font-fraunces`, `--font-source-serif`.
 * Alias every one of them to Inter so existing `font-display` /
 * `font-serif` / `font-mono` class names continue to resolve to a
 * sensible face without per-page edits.
 */
export const legacyAliasStyle = `
:root {
  --font-display: ${inter.style.fontFamily};
  --font-inter: ${inter.style.fontFamily};
  --font-jetbrains-mono: ${inter.style.fontFamily};
  --font-fraunces: ${inter.style.fontFamily};
  --font-source-serif: ${inter.style.fontFamily};
}
`;

/** Joined class string to attach to <html>. */
export const fontVariables = inter.variable;
