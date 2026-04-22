import { ArrowDown } from 'lucide-react';

import { HeroSignIn } from './hero-signin';

/**
 * Hero — v2.0 "cool precision software".
 *
 * Two columns on desktop (7/5 split); stacked on mobile with text first.
 * Snow base with a faint cool radial vignette keyed to the landing accent
 * (electric cyan).
 */
export function Hero() {
  return (
    <section
      id="main"
      aria-label="Hero"
      className="relative overflow-hidden"
    >
      {/* Ambient background — subtle cyan vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 92% 8%, rgba(10,239,255,0.06), transparent 42%), radial-gradient(circle at 8% 94%, rgba(15,17,21,0.05), transparent 45%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--accent)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--accent)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />

      <div className="hha-wrap relative grid grid-cols-1 gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-12 lg:gap-16 lg:pb-28 lg:pt-28">
        {/* Left — declaration (7 columns on desktop) */}
        <div className="lg:col-span-7">
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] motion-safe:animate-reveal"
            style={{ animationDelay: '120ms', color: 'rgb(var(--accent))' }}
          >
            Harare Heritage Academy · Est. 1987
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-tight text-obsidian">
            <span
              className="block motion-safe:animate-reveal"
              style={{ animationDelay: '200ms' }}
            >
              Software for the
            </span>
            <span
              className="block motion-safe:animate-reveal"
              style={{ animationDelay: '280ms', color: 'rgb(var(--accent))' }}
            >
              academic life of the school.
            </span>
          </h1>

          <p
            className="mt-8 max-w-measure font-sans text-[clamp(1rem,1.25vw,1.125rem)] leading-relaxed text-slate motion-safe:animate-reveal"
            style={{ animationDelay: '400ms' }}
          >
            One portal. Every stakeholder. Learners submit their work, teachers mark
            and plan, parents see every mark, every fee, every announcement —
            exactly as the school releases them.
          </p>

          <a
            href="#pathways"
            className="mt-12 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-slate transition-colors hover:text-obsidian motion-safe:animate-reveal"
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
