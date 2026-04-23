'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  CalendarClock,
  CreditCard,
  FileText,
  GraduationCap,
  HandCoins,
  Home,
  LogOut,
  Megaphone,
  MessageSquare,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Logo } from '@/components/ui/logo';
import { EditorialAvatar } from '@/components/student/primitives';
import { signOutAction } from '@/lib/auth/actions';

import { ChildSwitcher } from './child-switcher';
import { useSelectedChild } from './selected-child-context';

/**
 * Parent sidebar — §02 & §03.
 *
 * 240px wide. Nine destinations grouped into three visual blocks:
 *   Daily      — Dashboard, Progress, Attendance
 *   Periodic   — Fees, Reports, Calendar
 *   Communication — Messages, Announcements, Meetings
 *
 * The child switcher sits at the top of the sidebar — the single most-used
 * component in the parent portal.
 */

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface Group {
  label: string;
  items: readonly NavItem[];
}

const PARENT_NAV: readonly Group[] = [
  {
    label: 'Daily',
    items: [
      { href: '/parent', label: 'Dashboard', icon: Home },
      { href: '/parent/progress', label: 'Progress', icon: GraduationCap },
      { href: '/parent/attendance', label: 'Attendance', icon: CalendarClock },
    ],
  },
  {
    label: 'Periodic',
    items: [
      { href: '/parent/fees', label: 'Fees', icon: CreditCard, badge: 2 },
      { href: '/parent/reports', label: 'Reports', icon: FileText },
      { href: '/parent/calendar', label: 'Calendar', icon: Calendar },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href: '/parent/messages', label: 'Messages', icon: MessageSquare, badge: 2 },
      { href: '/parent/announcements', label: 'Announcements', icon: Megaphone, badge: 1 },
      { href: '/parent/meetings', label: 'Meetings', icon: HandCoins },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/parent') return pathname === '/parent';
  return pathname === href || pathname.startsWith(href + '/');
}

export function ParentSidebar({
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
  const { selectedId, setSelectedId, allSelected, setAllSelected } = useSelectedChild();

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
          <Link href="/parent" className="flex items-center" aria-label="JHS parent portal">
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
            Parent portal
          </p>
        </div>

        {/* Child switcher */}
        <div className="px-3 py-3">
          <ChildSwitcher
            selectedId={selectedId}
            allSelected={allSelected}
            showAllOption={pathname === '/parent'}
            onSelect={(id) => {
              setAllSelected(false);
              setSelectedId(id);
              onMobileClose?.();
            }}
            onSelectAll={() => {
              setAllSelected(true);
              onMobileClose?.();
            }}
          />
        </div>

        <nav aria-label="Parent navigation" className="flex-1 overflow-y-auto px-3 pb-3">
          {PARENT_NAV.map((group) => (
            <div key={group.label} className="mb-4 last:mb-0">
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

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <EditorialAvatar name={accountName} size="sm" tone="terracotta" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-small font-semibold text-ink">
                {accountName}
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
