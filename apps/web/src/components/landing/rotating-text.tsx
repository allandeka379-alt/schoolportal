'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@hha/ui';

interface Props {
  phrases: string[];
  intervalMs?: number;
  className?: string;
}

/**
 * Cycles through a set of phrases in place. Used inside the hero headline
 * to rotate through subjects ("Mathematics, Shona, Biology…" etc).
 */
export function RotatingText({ phrases, intervalMs = 1800, className }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const ref = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (phrases.length < 2) return;
    function tick() {
      setVisible(false);
      ref.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setVisible(true);
      }, 220);
    }
    const id = window.setInterval(tick, intervalMs);
    return () => {
      window.clearInterval(id);
      if (ref.current) window.clearTimeout(ref.current);
    };
  }, [phrases, intervalMs]);

  return (
    <span
      aria-live="polite"
      className={cn(
        'inline-block transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-[0.3em] opacity-0',
        className,
      )}
    >
      {phrases[index]}
    </span>
  );
}
