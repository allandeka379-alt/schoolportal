'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Bell,
  FileText,
  Flag,
  Menu,
  MessageSquarePlus,
  Plus,
  Search,
  Upload,
} from 'lucide-react';

import { STUDENT_SIDEBAR } from './sidebar';

/**
 * Top utility bar — §03 Shell.
 *
 *   - Breadcrumb trail (hidden on dashboard)
 *   - Universal search icon (expands on click)
 *   - Notifications bell with unread badge
 *   - Quick-action "+" menu (submit / ask / report)
 *   - Mobile: hamburger button that opens the sidebar
 *
 * Height 64px, sticky, 1px Sand bottom border.
 */

const NOTIFICATIONS = [
  {
    id: 'n1',
    icon: '📬',
    title: 'New message from Mrs Dziva',
    preview: 'I\'ll have Worksheet 5 marked by Friday.',
    when: '10 min ago',
    unread: true,
  },
  {
    id: 'n2',
    icon: '✅',
    title: 'English comprehension returned',
    preview: '22/25 — "Very strong reading, Farai."',
    when: '2 h ago',
    unread: true,
  },
  {
    id: 'n3',
    icon: '📣',
    title: 'Urgent: Sports Day rescheduled',
    preview: 'Moved from 25 April to 2 May.',
    when: '3 h ago',
    unread: false,
  },
  {
    id: 'n4',
    icon: '💳',
    title: 'Term 2 fees reminder',
    preview: '$230.00 outstanding · due 9 May',
    when: 'yesterday',
    unread: false,
  },
];

function buildCrumbs(pathname: string): { label: string; href: string }[] {
  const parts = pathname.split('/').filter(Boolean); // e.g. ['student', 'assignments', 'a-math-5']
  if (parts.length <= 1) return []; // dashboard — no crumbs
  const crumbs: { label: string; href: string }[] = [{ label: 'Dashboard', href: '/student' }];
  let cursor = '';
  for (let i = 0; i < parts.length; i += 1) {
    cursor += '/' + parts[i];
    if (i === 0) continue; // skip "student"
    const seg = parts[i] ?? '';
    const match = STUDENT_SIDEBAR.find((s) => s.href === cursor);
    crumbs.push({
      label: match?.label ?? humanise(seg),
      href: cursor,
    });
  }
  return crumbs;
}

function humanise(slug: string): string {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StudentTopBar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

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

      {/* Search */}
      <div className="flex items-center gap-1">
        {searchOpen ? (
          <div className="flex items-center gap-2 rounded border border-sand bg-white pl-3 pr-1">
            <Search className="h-4 w-4 text-stone" strokeWidth={1.5} aria-hidden />
            <input
              type="search"
              autoFocus
              placeholder="Search assignments, library, announcements…"
              className="h-9 w-64 border-0 bg-transparent text-[13px] text-ink focus:outline-none"
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label="Search"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setQuickOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label={`Notifications — ${unreadCount} unread`}
            aria-expanded={notifOpen}
          >
            <Bell className="h-5 w-5" strokeWidth={1.5} />
            {unreadCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta" aria-hidden />
            ) : null}
          </button>
          {notifOpen ? (
            <NotificationsPopover onClose={() => setNotifOpen(false)} />
          ) : null}
        </div>

        {/* Quick actions */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setQuickOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label="Quick actions"
            aria-expanded={quickOpen}
          >
            <Plus className="h-5 w-5" strokeWidth={1.5} />
          </button>
          {quickOpen ? (
            <div
              className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded border border-sand bg-white shadow-e2"
              role="menu"
            >
              <QuickAction icon={Upload} label="Submit work" />
              <QuickAction icon={MessageSquarePlus} label="Ask a teacher" />
              <QuickAction icon={Flag} label="Report an issue" />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function QuickAction({ icon: Icon, label }: { icon: typeof FileText; label: string }) {
  return (
    <button
      type="button"
      role="menuitem"
      className="flex w-full items-center gap-3 border-b border-sand-light px-4 py-3 text-left font-sans text-[14px] text-ink transition-colors last:border-0 hover:bg-sand-light/60"
    >
      <Icon className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />
      {label}
    </button>
  );
}

function NotificationsPopover({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div aria-hidden onClick={onClose} className="fixed inset-0 z-10" />
      <div className="absolute right-0 top-full z-20 mt-2 w-[360px] overflow-hidden rounded border border-sand bg-white shadow-e2">
        <div className="flex items-center justify-between border-b border-sand px-4 py-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
            Notifications
          </p>
          <button
            type="button"
            className="font-sans text-[12px] text-stone hover:text-ink hover:underline underline-offset-4"
          >
            Mark all as read
          </button>
        </div>
        <ul className="max-h-[420px] divide-y divide-sand-light overflow-y-auto">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-sand-light/40">
              <span className="mt-0.5 text-lg" aria-hidden>
                {n.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-sans text-[14px] text-ink">
                  <span className="truncate">{n.title}</span>
                  {n.unread ? (
                    <span aria-label="unread" className="h-1.5 w-1.5 flex-none rounded-full bg-terracotta" />
                  ) : null}
                </p>
                <p className="mt-0.5 truncate font-serif text-[13px] text-stone">{n.preview}</p>
                <p className="mt-1 font-sans text-[11px] text-stone">{n.when}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-sand px-4 py-3 text-center">
          <button
            type="button"
            className="font-sans text-[13px] font-medium text-terracotta hover:underline underline-offset-4"
          >
            View all →
          </button>
        </div>
      </div>
    </>
  );
}
