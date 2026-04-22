'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Scroll-triggered reveal — one-shot per session, per §16 of the spec.
 *
 * Uses IntersectionObserver at the 20% threshold. On first intersection,
 * reveals with a combined fade + 24px lift over 480ms. Respects
 * `prefers-reduced-motion` by skipping the translate and using a brief fade.
 */
interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

export function Reveal({
  children,
  delayMs = 0,
  className = '',
  as: Component = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion — reveal immediately.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = {
    transitionDelay: delayMs ? `${delayMs}ms` : undefined,
  };

  return (
    <Component
      // @ts-expect-error polymorphic ref
      ref={ref}
      data-revealed={revealed ? 'true' : 'false'}
      style={style}
      className={`transition-all duration-[480ms] ease-out-soft ${
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </Component>
  );
}
