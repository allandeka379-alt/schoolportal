'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Bell, Menu } from 'lucide-react';

import { ADMIN_NAV } from './sidebar';

const CRUMB_LABELS: Record<string, string> = {
  '/admin': 'Overview',
};

ADMIN_NAV.flatMap((g) => g.items).forEach((item) => {
  CRUMB_LABELS[item.href] = item.label;
});

function humanise(s: string): string {
  return s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildCrumbs(pathname: string): { label: string; href: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length <= 1) return [];
  const crumbs: { label: string; href: string }[] = [
    { label: 'Admin', href: '/admin' },
  ];
  let cursor = '';
  for (let i = 0; i < parts.length; i += 1) {
    cursor += '/' + parts[i];
    if (i === 0) continue;
    crumbs.push({ label: CRUMB_LABELS[cursor] ?? humanise(parts[i] ?? ''), href: cursor });
  }
  return crumbs;
}

export function AdminTopBar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-mist bg-snow/95 px-4 backdrop-blur-[12px] md:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="flex h-10 w-10 items-center justify-center rounded text-slate transition-colors hover:bg-fog hover:text-obsidian lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        {crumbs.length > 0 ? (
          <ol className="flex flex-wrap items-center gap-x-2 font-sans text-[13px] text-slate">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 ? <span className="text-mist">/</span> : null}
                  {last ? (
                    <span className="font-medium text-obsidian">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="hover:text-obsidian hover:underline underline-offset-4">
                      {c.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        ) : (
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-steel">
            Back-office
          </span>
        )}
      </nav>

      {/* Status chip */}
      <span
        className="hidden items-center gap-2 rounded-sm border border-mist bg-fog px-2.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-slate md:inline-flex"
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: 'rgb(var(--accent))' }}
          aria-hidden
        />
        Term 2, 2026
      </span>

      {/* Alerts bell */}
      <button
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded text-slate transition-colors hover:bg-fog hover:text-obsidian"
        aria-label="Alerts"
      >
        <Bell className="h-5 w-5" strokeWidth={1.5} />
        <span
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
          style={{ backgroundColor: 'rgb(var(--accent))' }}
          aria-hidden
        />
      </button>
    </header>
  );
}
