'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Count-up animation for the Numbers Band (§09 of the spec).
 *
 *   - Begins when the element intersects 20% of the viewport
 *   - Counts from 0 to `value` over 1,200ms with ease-out
 *   - Staggered externally via `delayMs`
 *   - Respects prefers-reduced-motion (shows final value with a 200ms fade)
 *
 * Formatting is controlled by a string enum rather than a function prop,
 * because functions cannot cross the server → client component boundary
 * in the Next.js App Router.
 */
export type CountUpFormat = 'integer' | 'percent' | 'thousands';

interface CountUpProps {
  value: number;
  format?: CountUpFormat;
  durationMs?: number;
  delayMs?: number;
  className?: string;
  locale?: string;
}

export function CountUp({
  value,
  format = 'integer',
  durationMs = 1200,
  delayMs = 0,
  className,
  locale = 'en-ZW',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState<string>('0');
  const [done, setDone] = useState(false);

  function formatFinal(n: number): string {
    if (format === 'percent') return `${n}%`;
    if (format === 'thousands') return n.toLocaleString(locale);
    return n.toString();
  }

  function formatInProgress(n: number): string {
    return Math.floor(n).toString();
  }

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setDisplay(formatFinal(value));
      setDone(true);
      return;
    }

    let started = false;
    let rafId = 0;
    let start = 0;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const t = Math.min(1, (timestamp - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const current = eased * value;
      if (t >= 1) {
        setDisplay(formatFinal(value));
        setDone(true);
        return;
      }
      setDisplay(formatInProgress(current));
      rafId = requestAnimationFrame(step);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!started && e.isIntersecting) {
            started = true;
            io.disconnect();
            setTimeout(() => {
              rafId = requestAnimationFrame(step);
            }, delayMs);
          }
        }
      },
      { threshold: 0.2 },
    );

    io.observe(node);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs, delayMs, format, locale]);

  return (
    <span ref={ref} className={className} aria-label={formatFinal(value)}>
      {done ? formatFinal(value) : display}
    </span>
  );
}
