'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Bell, HelpCircle, Menu } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 'pn1', title: "Mrs Dziva replied", preview: "Re: Farai's recent marks", when: '2 h ago', unread: true },
  { id: 'pn2', title: 'Term 2 report released', preview: 'All three children', when: '2 d ago', unread: true },
  { id: 'pn3', title: 'Payment confirmation · Tanaka', preview: 'USD 150 · reconciled', when: '2 d ago', unread: false },
  { id: 'pn4', title: 'Science Fair trip — permission', preview: "Due Friday 25 April", when: '3 d ago', unread: false },
];

const LOCALES: readonly { code: 'EN' | 'SN' | 'ND'; label: string }[] = [
  { code: 'EN', label: 'English' },
  { code: 'SN', label: 'Shona' },
  { code: 'ND', label: 'Ndebele' },
];

const CRUMB_LABELS: Record<string, string> = {
  '/parent': 'Dashboard',
  '/parent/progress': 'Progress',
  '/parent/attendance': 'Attendance',
  '/parent/fees': 'Fees',
  '/parent/reports': 'Reports',
  '/parent/calendar': 'Calendar',
  '/parent/messages': 'Messages',
  '/parent/announcements': 'Announcements',
  '/parent/meetings': 'Meetings',
};

function humanise(s: string): string {
  return s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildCrumbs(pathname: string): { label: string; href: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length <= 1) return [];
  const crumbs: { label: string; href: string }[] = [{ label: 'Dashboard', href: '/parent' }];
  let cursor = '';
  for (let i = 0; i < parts.length; i += 1) {
    cursor += '/' + parts[i];
    if (i === 0) continue;
    crumbs.push({ label: CRUMB_LABELS[cursor] ?? humanise(parts[i] ?? ''), href: cursor });
  }
  return crumbs;
}

export function ParentTopBar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [locale, setLocale] = useState<'EN' | 'SN' | 'ND'>('EN');

  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-sand bg-cream/92 px-4 backdrop-blur-[12px] md:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        {crumbs.length > 0 ? (
          <ol className="flex flex-wrap items-center gap-x-2 font-sans text-[13px] text-stone">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 ? <span className="text-sand">/</span> : null}
                  {last ? (
                    <span className="font-medium text-ink">{c.label}</span>
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

      <div className="flex items-center gap-1">
        {/* Language */}
        <div
          role="radiogroup"
          aria-label="Language"
          className="hidden items-center gap-1 rounded border border-sand bg-white px-1 py-1 font-sans text-[12px] md:inline-flex"
        >
          {LOCALES.map((l) => {
            const active = locale === l.code;
            return (
              <button
                key={l.code}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={l.label}
                onClick={() => setLocale(l.code)}
                className={[
                  'rounded px-2 py-0.5 transition-colors',
                  active ? 'bg-ink text-cream' : 'text-stone hover:text-ink',
                ].join(' ')}
              >
                {l.code}
              </button>
            );
          })}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setHelpOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label={`Notifications — ${unread} unread`}
            aria-expanded={notifOpen}
          >
            <Bell className="h-5 w-5" strokeWidth={1.5} />
            {unread > 0 ? (
              <span
                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta"
                aria-hidden
              />
            ) : null}
          </button>
          {notifOpen ? <NotifPopover onClose={() => setNotifOpen(false)} /> : null}
        </div>

        {/* Help */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setHelpOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label="Help"
            aria-expanded={helpOpen}
          >
            <HelpCircle className="h-5 w-5" strokeWidth={1.5} />
          </button>
          {helpOpen ? (
            <>
              <div aria-hidden onClick={() => setHelpOpen(false)} className="fixed inset-0 z-10" />
              <div className="absolute right-0 top-full z-20 mt-2 w-[300px] rounded border border-sand bg-white p-4 shadow-e2">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
                  Common parent tasks
                </p>
                <ul className="mt-2 space-y-2 font-serif text-[14px] text-ink">
                  <li>
                    <Link href="/parent/fees" className="landing-link text-terracotta">
                      Paying term fees →
                    </Link>
                  </li>
                  <li>
                    <Link href="/parent/attendance" className="landing-link text-terracotta">
                      Explaining an absence →
                    </Link>
                  </li>
                  <li>
                    <Link href="/parent/meetings" className="landing-link text-terracotta">
                      Booking a parent-teacher meeting →
                    </Link>
                  </li>
                  <li>
                    <Link href="/parent/messages" className="landing-link text-terracotta">
                      Messaging a teacher →
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function NotifPopover({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div aria-hidden onClick={onClose} className="fixed inset-0 z-10" />
      <div className="absolute right-0 top-full z-20 mt-2 w-[360px] overflow-hidden rounded border border-sand bg-white shadow-e2">
        <div className="flex items-center justify-between border-b border-sand px-4 py-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
            Notifications
          </p>
          <button type="button" className="font-sans text-[12px] text-stone hover:text-ink">
            Mark all as read
          </button>
        </div>
        <ul className="max-h-[420px] divide-y divide-sand-light overflow-y-auto">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-sand-light/40">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-sans text-[14px] text-ink">
                  <span className="truncate">{n.title}</span>
                  {n.unread ? (
                    <span
                      aria-label="unread"
                      className="h-1.5 w-1.5 flex-none rounded-full bg-terracotta"
                    />
                  ) : null}
                </p>
                <p className="mt-0.5 truncate font-serif text-[13px] text-stone">{n.preview}</p>
                <p className="mt-1 font-sans text-[11px] text-stone">{n.when}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
