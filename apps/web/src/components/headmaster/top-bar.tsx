'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Bell, Lock, Menu, Search, ShieldCheck } from 'lucide-react';

import { HEADMASTER_NAV } from './sidebar';

const CRUMB_LABELS: Record<string, string> = {
  '/headmaster': 'The Bridge',
};

HEADMASTER_NAV.flatMap((g) => g.items).forEach((item) => {
  CRUMB_LABELS[item.href] = item.label;
});

function humanise(s: string): string {
  return s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildCrumbs(pathname: string): { label: string; href: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length <= 1) return [];
  const crumbs: { label: string; href: string }[] = [
    { label: 'The Bridge', href: '/headmaster' },
  ];
  let cursor = '';
  for (let i = 0; i < parts.length; i += 1) {
    cursor += '/' + parts[i];
    if (i === 0) continue;
    crumbs.push({ label: CRUMB_LABELS[cursor] ?? humanise(parts[i] ?? ''), href: cursor });
  }
  return crumbs;
}

export function HeadmasterTopBar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname]);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-sand bg-cream/95 px-4 backdrop-blur-[12px] md:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        {crumbs.length > 0 ? (
          <ol className="flex flex-wrap items-center gap-x-2 font-sans text-[13px] text-stone">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 ? <span className="text-sand">/</span> : null}
                  {last ? (
                    <span className="font-semibold text-ink">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="hover:text-ink hover:underline underline-offset-4">
                      {c.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        ) : null}
      </nav>

      {/* Command palette opener */}
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className="hidden items-center gap-2 rounded border border-sand bg-white px-3 py-1.5 font-sans text-[12px] text-stone hover:border-earth hover:text-ink md:inline-flex"
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        <span>Go to…</span>
        <kbd className="rounded bg-sand px-1 py-px font-mono text-[10px] text-earth">⌘K</kbd>
      </button>

      {/* Security indicators */}
      <div className="hidden items-center gap-2 rounded border border-sand bg-white px-2 py-1.5 font-sans text-[11px] md:inline-flex">
        <ShieldCheck className="h-3.5 w-3.5 text-ok" strokeWidth={1.5} aria-hidden />
        <span className="text-stone">Hardware key</span>
        <Lock className="h-3.5 w-3.5 text-ok" strokeWidth={1.5} aria-hidden />
      </div>

      {/* Alerts bell */}
      <Link
        href="/headmaster/alerts"
        className="relative flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
        aria-label="Alerts"
      >
        <Bell className="h-5 w-5" strokeWidth={1.5} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta" aria-hidden />
      </Link>

      {paletteOpen ? (
        <CommandPalette onClose={() => setPaletteOpen(false)} />
      ) : null}
    </header>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const all = HEADMASTER_NAV.flatMap((g) => g.items);
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded border border-sand bg-white shadow-e3"
      >
        <div className="flex items-center gap-2 border-b border-sand px-4 py-3">
          <Search className="h-4 w-4 text-stone" strokeWidth={1.5} aria-hidden />
          <input
            autoFocus
            type="search"
            placeholder="Go to… teachers, subjects, at-risk students, approvals"
            className="h-9 flex-1 border-0 bg-transparent text-[14px] text-ink placeholder-stone focus:outline-none"
          />
          <kbd className="rounded bg-sand px-1 py-px font-mono text-[10px] text-earth">Esc</kbd>
        </div>
        <div className="max-h-[420px] overflow-y-auto py-2">
          <p className="px-4 pb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone">
            Jump to
          </p>
          <ul>
            {all.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-2 font-sans text-[13px] text-ink hover:bg-sand-light/60"
                >
                  {item.label}
                  <kbd className="font-mono text-[11px] text-stone">↵</kbd>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
