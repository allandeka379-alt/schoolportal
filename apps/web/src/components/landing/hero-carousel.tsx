'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@hha/ui';

export interface HeroSlide {
  key: string;
  render: () => React.ReactNode;
}

interface Props {
  slides: HeroSlide[];
  intervalMs?: number;
  className?: string;
}

/**
 * Minimal hero slide rotator.
 *
 * Advances automatically every `intervalMs` and fades each slide in/out.
 * Honours prefers-reduced-motion by sitting on slide 0 forever. Dots
 * below the hero body let the visitor pick a slide directly.
 */
export function HeroCarousel({ slides, intervalMs = 6000, className }: Props) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    reducedMotion.current =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reducedMotion.current) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        {slides.map((s, i) => (
          <div
            key={s.key}
            aria-hidden={i !== index}
            className={cn(
              'transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
              i === index ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0',
            )}
          >
            {s.render()}
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="mt-8 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                i === index
                  ? 'w-10 bg-brand-primary'
                  : 'w-4 bg-ink/20 hover:bg-ink/30',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
