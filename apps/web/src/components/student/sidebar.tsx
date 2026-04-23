'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BookOpen,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Home,
  Library,
  LogOut,
  Megaphone,
  MessageSquare,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Logo } from '@/components/ui/logo';
import { signOutAction } from '@/lib/auth/actions';

import { EditorialAvatar } from './primitives';

/**
 * Student portal sidebar — §02 Information Architecture + §03 Shell.
 *
 * Eight primary destinations:
 *   Dashboard · Assignments · Library · Grades · Timetable · Fees
 *   Announcements · Messages
 *
 * 240px wide. Active row gets a 2px Terracotta left-border and Sand Light fill.
 * Mobile: closed by default, slides in from the left over an overlay.
 */

export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
}

export const STUDENT_SIDEBAR: readonly SidebarItem[] = [
  { href: '/student', label: 'Dashboard', icon: Home },
  { href: '/student/assignments', label: 'Assignments', icon: ClipboardList, badge: 3 },
  { href: '/student/library', label: 'Library', icon: Library },
  { href: '/student/grades', label: 'Grades', icon: GraduationCap },
  { href: '/student/timetable', label: 'Timetable', icon: BookOpen },
  { href: '/student/fees', label: 'Fees', icon: CreditCard },
  { href: '/student/announcements', label: 'Announcements', icon: Megaphone, badge: 2 },
  { href: '/student/messages', label: 'Messages', icon: MessageSquare, badge: 1 },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/student') return pathname === '/student';
  return pathname === href || pathname.startsWith(href + '/');
}

export function StudentSidebar({
  accountName,
  accountMeta,
  mobileOpen,
  onMobileClose,
}: {
  accountName: string;
  accountMeta: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <div
          aria-hidden
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        data-mobile-open={mobileOpen ? 'true' : 'false'}
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-line bg-card text-ink',
          'transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Link href="/student" className="flex items-center" aria-label="HHA student portal">
            <Logo size={32} showText variant="on-light" />
          </Link>
          {mobileOpen ? (
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
        <div className="border-b border-line px-5 py-2.5">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
            Student portal
          </p>
        </div>

        <nav aria-label="Student navigation" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {STUDENT_SIDEBAR.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-small transition-colors duration-200',
                      active
                        ? 'bg-brand-primary/10 font-semibold text-brand-primary'
                        : 'text-ink/80 hover:bg-surface hover:text-brand-primary',
                    ].join(' ')}
                  >
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 left-0 w-[3px] rounded-r-sm bg-brand-primary"
                      />
                    ) : null}
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge !== 0 ? (
                      <span
                        className={[
                          'rounded-full px-1.5 py-0.5 text-micro font-semibold tabular-nums',
                          active
                            ? 'bg-brand-primary text-white'
                            : 'bg-surface text-muted',
                        ].join(' ')}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-line p-4">
          <Link
            href="/student/profile"
            className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-surface"
          >
            <EditorialAvatar name={accountName} size="sm" tone="terracotta" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-small font-semibold text-ink">
                {accountName}
              </span>
              <span className="block truncate text-micro text-muted">{accountMeta}</span>
            </span>
          </Link>
          <form action={signOutAction} className="mt-2">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-small text-muted transition-colors hover:bg-surface hover:text-brand-primary"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
