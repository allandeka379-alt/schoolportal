import { ArrowDown } from 'lucide-react';

import { HeroSignIn } from './hero-signin';

/**
 * Hero — §06 of the spec.
 *
 * Two columns on desktop (60/40 split); stacked on mobile with text first.
 * Cream base with a faint stone-pattern SVG anchored bottom-right, and a
 * subtle warm radial vignette.
 *
 * The orchestrated page-load reveal is driven by CSS animations with
 * staggered `animation-delay` values, so it works without client JS.
 */
export function Hero() {
  return (
    <section
      id="main"
      aria-label="Hero"
      className="relative overflow-hidden"
    >
      {/* Ambient background layers — don't interfere with text contrast. */}
      <div
        aria-hidden
        className="stone-pattern pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 90% 10%, rgba(92,58,30,0.05), transparent 45%), radial-gradient(circle at 10% 90%, rgba(198,93,61,0.04), transparent 40%)',
        }}
      />

      <div className="hha-wrap relative grid grid-cols-1 gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-12 lg:gap-16 lg:pb-28 lg:pt-28">
        {/* Left — declaration (7 columns on desktop) */}
        <div className="lg:col-span-7">
          <p
            className="hha-eyebrow motion-safe:animate-reveal"
            style={{ animationDelay: '120ms' }}
          >
            Harare Heritage Academy · Est. 1987
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.04] tracking-tight text-ink">
            <span
              className="block motion-safe:animate-reveal"
              style={{ animationDelay: '200ms' }}
            >
              Where knowledge
            </span>
            <span
              className="block italic font-light text-terracotta motion-safe:animate-reveal"
              style={{ animationDelay: '280ms' }}
            >
              meets heritage.
            </span>
          </h1>

          <p
            className="mt-8 max-w-measure font-serif text-body-lg text-stone motion-safe:animate-reveal"
            style={{ animationDelay: '400ms' }}
          >
            The portal where our learners submit their work, our teachers mark and
            plan, and our parents see every mark, every fee, every announcement —
            exactly as the school releases them. Sign in to continue.
          </p>

          <a
            href="#pathways"
            className="mt-12 inline-flex items-center gap-2 font-sans text-[13px] text-earth transition-colors hover:text-ink motion-safe:animate-reveal"
            style={{ animationDelay: '520ms' }}
          >
            <ArrowDown
              className="h-4 w-4 motion-safe:animate-nudge"
              strokeWidth={1.5}
              aria-hidden
            />
            Scroll to explore
          </a>
        </div>

        {/* Right — sign-in panel (5 columns on desktop) */}
        <div
          className="flex justify-center motion-safe:animate-reveal lg:col-span-5 lg:justify-end"
          style={{ animationDelay: '480ms' }}
        >
          <HeroSignIn />
        </div>
      </div>
    </section>
  );
}
