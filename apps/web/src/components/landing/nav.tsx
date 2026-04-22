'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

import { LandingCrest } from './crest';

const NAV_LINKS: readonly { href: string; label: string; hot?: boolean }[] = [
  { href: '#academics', label: 'Academics' },
  { href: '#admissions', label: 'Admissions' },
  { href: '#announcements', label: 'Announcements', hot: true },
  { href: '#support', label: 'Support' },
  { href: '#about', label: 'About' },
];

const LOCALES: readonly { code: 'EN' | 'SN' | 'ND'; label: string }[] = [
  { code: 'EN', label: 'English' },
  { code: 'SN', label: 'Shona' },
  { code: 'ND', label: 'Ndebele' },
];

/**
 * Sticky nav — §05 of the design spec.
 *
 * At top of page, transparent over the hero at 80px tall. After 40px of
 * scroll the Cream-92 backdrop-blur fills in, the Sand hairline appears,
 * and between 80–200px of scroll the height compresses to 64px.
 *
 * A compact "Sign in" floating action appears in the bottom-right after
 * 400px of scroll, so returning users can enter without scrolling back up.
 */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [locale, setLocale] = useState<'EN' | 'SN' | 'ND'>('EN');

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 40);
      setCompact(y > 200);
      setShowFab(y > 400);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="absolute left-2 top-2 z-[60] -translate-y-20 rounded bg-ink px-3 py-2 text-xs font-semibold text-cream focus:translate-y-0"
      >
        Skip to main content
      </a>

      <header
        data-scrolled={scrolled ? 'true' : 'false'}
        data-compact={compact ? 'true' : 'false'}
        className={[
          'sticky top-0 z-50 w-full transition-all duration-300 ease-out-soft',
          scrolled
            ? 'border-b border-sand bg-cream/92 shadow-nav-scroll backdrop-blur-[12px]'
            : 'border-b border-transparent bg-cream/0 backdrop-blur-0',
          compact ? 'h-16' : 'h-20',
        ].join(' ')}
      >
        <div className="hha-wrap flex h-full items-center gap-6">
          <Link
            href="/"
            className="flex flex-none items-center gap-3"
            aria-label="Harare Heritage Academy — home"
          >
            <LandingCrest size={32} />
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-[18px] font-medium text-ink">
                Harare Heritage
              </span>
              <span className="block font-display text-[15px] italic font-light text-earth">
                Academy
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="ml-auto hidden items-center gap-8 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="landing-link relative font-sans text-sm font-medium text-stone transition-colors hover:text-ink"
              >
                {link.label}
                {link.hot ? (
                  <span
                    aria-label="unread urgent announcement"
                    className="absolute -right-3 -top-0.5 h-1.5 w-1.5 rounded-full bg-terracotta"
                  />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <div
              role="radiogroup"
              aria-label="Language"
              className="flex items-center gap-1 font-sans text-xs font-medium"
            >
              {LOCALES.map((l, i) => (
                <span key={l.code} className="flex items-center gap-1">
                  {i > 0 ? <span className="text-sand">·</span> : null}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={locale === l.code}
                    aria-label={l.label}
                    onClick={() => setLocale(l.code)}
                    className={[
                      'rounded px-1.5 py-1 transition-colors',
                      locale === l.code
                        ? 'text-ink'
                        : 'text-stone hover:text-ink',
                    ].join(' ')}
                  >
                    {l.code}
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/sign-in"
            className="btn-terracotta hidden lg:inline-flex"
            data-animate="nav-cta"
          >
            Sign in
            <ArrowRight className="h-4 w-4" aria-hidden strokeWidth={1.5} />
          </Link>

          <button
            type="button"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded text-earth transition-colors hover:bg-sand-light lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="h-6 w-6" strokeWidth={1.5} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {menuOpen ? (
          <div className="absolute inset-x-0 top-full border-t border-sand bg-cream shadow-e2 lg:hidden">
            <nav aria-label="Primary (mobile)" className="hha-wrap flex flex-col py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 font-sans text-base text-ink hover:text-terracotta"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/sign-in"
                className="btn-terracotta mt-4 w-full"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
                <ArrowRight className="h-4 w-4" aria-hidden strokeWidth={1.5} />
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      {showFab ? (
        <Link
          href="/sign-in"
          className="btn-terracotta fixed bottom-6 right-6 z-40 shadow-e3"
          aria-label="Sign in to the portal"
        >
          Sign in
          <ArrowRight className="h-4 w-4" aria-hidden strokeWidth={1.5} />
        </Link>
      ) : null}
    </>
  );
}
