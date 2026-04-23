import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Final call-to-action band. Deep brand-primary background with a subtle
 * gradient; stark white text; pair of CTAs.
 */
export function CtaBand() {
  return (
    <section
      aria-label="Open your portal"
      className="relative isolate overflow-hidden bg-brand-primary py-16 text-white sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-brand-accent/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-info/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 text-center sm:px-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-micro font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
          Your portal is ready
        </p>
        <h2 className="mx-auto mt-5 max-w-2xl text-h1 text-white sm:text-display sm:leading-[1.08]">
          Software for the academic life of Harare Heritage Academy.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-body text-white/80 sm:text-[17px] sm:leading-7">
          Students, teachers, parents and administrators all sign in at the same door. The portal
          chooses the right experience for each role.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-in"
            className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-body font-semibold text-brand-primary shadow-card-md transition hover:shadow-card-lg"
          >
            Open my portal
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#services"
            className="inline-flex h-14 items-center gap-2 rounded-full border border-white/40 bg-transparent px-7 text-body font-semibold text-white transition hover:bg-white/10"
          >
            See what it does
          </Link>
        </div>
      </div>
    </section>
  );
}
