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

import { LandingCrest } from '@/components/landing/crest';
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
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
        />
      ) : null}

      <aside
        data-mobile-open={mobileOpen ? 'true' : 'false'}
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-obsidian text-fog',
          'transition-transform duration-120 ease-out-soft lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-graphite px-6 py-5">
          <Link
            href="/student"
            className="flex items-center gap-3"
            aria-label="HHA student portal — dashboard"
          >
            <LandingCrest size={32} variant="cream" />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-medium text-snow">HHA Portal</span>
              <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-steel">
                Student
              </span>
            </span>
          </Link>
          {mobileOpen ? (
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded p-1.5 text-steel transition-colors hover:bg-graphite hover:text-snow lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          ) : null}
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
                      'relative flex items-center gap-3 rounded px-3 py-2.5 font-sans text-[14px] transition-colors duration-120',
                      active
                        ? 'bg-graphite font-medium text-snow'
                        : 'text-steel hover:bg-graphite/60 hover:text-fog',
                    ].join(' ')}
                  >
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-y-1 left-0 w-[2px] rounded-r-sm sidebar-active-accent"
                      />
                    ) : null}
                    <Icon
                      className={active ? 'h-4 w-4' : 'h-4 w-4'}
                      style={active ? { color: 'rgb(var(--accent))' } : undefined}
                      strokeWidth={1.5}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge !== 0 ? (
                      <span
                        className={[
                          'rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums',
                          active
                            ? 'bg-snow/10 text-snow'
                            : 'bg-graphite text-steel',
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

        {/* Profile compact + sign out */}
        <div className="border-t border-graphite p-4">
          <Link
            href="/student/profile"
            className="flex items-center gap-3 rounded-sm px-2 py-2 transition-colors hover:bg-graphite/60"
          >
            <EditorialAvatar name={accountName} size="sm" tone="terracotta" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-sans text-[14px] font-medium text-snow">
                {accountName}
              </span>
              <span className="block truncate font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
                {accountMeta}
              </span>
            </span>
          </Link>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded px-3 py-2 font-sans text-[13px] text-steel transition-colors hover:bg-graphite/60 hover:text-snow"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
