'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  BookOpenCheck,
  CalendarClock,
  ClipboardCheck,
  FileEdit,
  FilePenLine,
  FileText,
  Home,
  Library,
  LogOut,
  MessageSquare,
  Notebook,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Logo } from '@/components/ui/logo';
import { EditorialAvatar } from '@/components/student/primitives';
import { signOutAction } from '@/lib/auth/actions';

import { TeacherTag } from './primitives';

/**
 * Teacher sidebar — §02 & §03.
 *
 * Ten primary destinations, visually grouped:
 *   Teaching — Console, Classes, Assignments, Gradebook, Reports
 *   Admin    — Attendance, Resources, Messages
 *   Tools    — Analytics, Lesson Plans
 *
 * 260px wide (wider than the student's 240px — more data-dense pages).
 * Active row: 2px Terracotta left border + Sand Light fill.
 * Quick-action pill buttons ("Take register", "Mark queue", "New assignment")
 * are pinned below nav, above the profile block.
 */

export interface TeacherSidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface Group {
  label: string;
  items: readonly TeacherSidebarItem[];
}

export const TEACHER_NAV: readonly Group[] = [
  {
    label: 'Teaching',
    items: [
      { href: '/teacher', label: 'Console', icon: Home },
      { href: '/teacher/classes', label: 'Classes', icon: Users },
      { href: '/teacher/assignments', label: 'Assignments', icon: BookOpenCheck, badge: 3 },
      { href: '/teacher/gradebook', label: 'Gradebook', icon: BarChart3 },
      { href: '/teacher/reports', label: 'Reports', icon: FilePenLine, badge: 2 },
    ],
  },
  {
    label: 'Admin',
    items: [
      { href: '/teacher/attendance', label: 'Attendance', icon: CalendarClock },
      { href: '/teacher/resources', label: 'Resources', icon: Library },
      { href: '/teacher/messages', label: 'Messages', icon: MessageSquare, badge: 4 },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/teacher/analytics', label: 'Analytics', icon: ClipboardCheck },
      { href: '/teacher/lesson-plans', label: 'Lesson Plans', icon: Notebook },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/teacher') return pathname === '/teacher';
  return pathname === href || pathname.startsWith(href + '/');
}

export function TeacherSidebar({
  accountName,
  accountMeta,
  isHod,
  isFormTeacher,
  mobileOpen,
  onMobileClose,
}: {
  accountName: string;
  accountMeta: string;
  isHod?: boolean;
  isFormTeacher?: boolean;
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
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-line bg-card text-ink',
          'transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Link href="/teacher" className="flex items-center" aria-label="HHA teacher portal">
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
            Teacher portal
          </p>
        </div>

        <nav aria-label="Teacher navigation" className="flex-1 overflow-y-auto px-3 py-4">
          {TEACHER_NAV.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="mb-1.5 px-3 text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
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
                        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        <span className="flex-1">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 ? (
                          <span
                            className={[
                              'rounded-full px-1.5 py-0.5 text-micro font-semibold tabular-nums',
                              active ? 'bg-brand-primary text-white' : 'bg-surface text-muted',
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
            </div>
          ))}
        </nav>

        {/* Quick actions */}
        <div className="border-t border-line px-3 py-4">
          <p className="mb-2 px-3 text-micro font-semibold uppercase tracking-[0.12em] text-muted">
            Quick actions
          </p>
          <div className="space-y-1.5">
            <Link
              href="/teacher/attendance"
              className="flex items-center gap-2 rounded-md border border-line bg-card px-3 py-2 text-small font-medium text-ink transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
            >
              <ClipboardCheck className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Take register
            </Link>
            <Link
              href="/teacher/marking/a-math-5"
              className="flex items-center gap-2 rounded-md border border-line bg-card px-3 py-2 text-small font-medium text-ink transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
            >
              <FileEdit className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Mark queue
            </Link>
            <Link
              href="/teacher/assignments/new"
              className="flex items-center gap-2 rounded-md border border-line bg-card px-3 py-2 text-small font-medium text-ink transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
            >
              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              New assignment
            </Link>
          </div>
        </div>

        {/* Profile + sign out */}
        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <EditorialAvatar name={accountName} size="sm" tone="terracotta" />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 truncate text-small font-semibold text-ink">
                {accountName}
                {isHod ? <TeacherTag label="HOD" /> : null}
                {isFormTeacher && !isHod ? <TeacherTag label="FT" /> : null}
              </span>
              <span className="block truncate text-micro text-muted">{accountMeta}</span>
            </span>
          </div>
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
