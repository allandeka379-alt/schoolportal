'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { cn } from '@hha/ui';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

/**
 * Scroll-reactive landing navigation.
 *
 *   • Transparent while sitting over the hero
 *   • Translucent white + line hairline + blur once you scroll past ~10px
 *   • Hamburger menu under lg; Escape closes it
 *   • Sign in link + Get started CTA on the right
 */

const NAV_ITEMS = [
  { href: '#services',      label: 'What it does' },
  { href: '#how-it-works',  label: 'How it works' },
  { href: '#announcements', label: 'Announcements' },
  { href: '#support',       label: 'Support' },
] as const;

const SCROLL_THRESHOLD = 10;

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[45] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled || mobileOpen
          ? 'border-b border-line bg-card/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Logo size={32} showText asLink variant="on-light" />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-2 text-small font-medium text-ink/80 transition-colors hover:text-brand-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/sign-in"
            className="rounded-sm px-3 py-2 text-small font-medium text-ink/80 transition-colors hover:text-brand-primary"
          >
            Sign in
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
          >
            Open my portal
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-brand-primary/10 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen ? (
        <div className="absolute inset-x-0 top-[64px] border-b border-line bg-card animate-slide-down lg:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-5 py-4 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-3 text-body font-medium text-ink hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-3 text-body font-medium text-ink hover:bg-surface"
            >
              Sign in
            </Link>
            <Button
              fullWidth
              className="mt-2 rounded-full"
              onClick={() => setMobileOpen(false)}
            >
              <Link href="/sign-in">Open my portal</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
