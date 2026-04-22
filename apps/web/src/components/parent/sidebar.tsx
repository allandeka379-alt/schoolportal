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

import { LandingCrest } from '@/components/landing/crest';
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
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-sand bg-cream',
          'transition-transform duration-300 ease-out-soft lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-sand px-5 py-5">
          <Link href="/parent" className="flex items-center gap-3" aria-label="HHA parent portal">
            <LandingCrest size={32} />
            <span className="leading-tight">
              <span className="block font-display text-[16px] text-ink">HHA Portal</span>
              <span className="block font-display text-[13px] italic font-light text-earth">
                Parent
              </span>
            </span>
          </Link>
          {mobileOpen ? (
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded p-1.5 text-stone transition-colors hover:bg-sand-light hover:text-ink lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          ) : null}
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
              <p className="mb-1 px-3 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone">
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
                          'relative flex items-center gap-3 rounded px-3 py-2 font-sans text-[14px] transition-colors',
                          active
                            ? 'bg-sand-light font-medium text-ink'
                            : 'text-stone hover:bg-sand-light/50 hover:text-ink',
                        ].join(' ')}
                      >
                        {active ? (
                          <span
                            aria-hidden
                            className="absolute inset-y-1 left-0 w-[2px] rounded-r-sm bg-terracotta"
                          />
                        ) : null}
                        <Icon
                          className={active ? 'h-4 w-4 text-terracotta' : 'h-4 w-4 text-stone'}
                          strokeWidth={1.5}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 ? (
                          <span
                            className={[
                              'rounded px-1.5 py-0.5 font-sans text-[11px] font-semibold tabular-nums',
                              active ? 'bg-terracotta text-cream' : 'bg-sand text-earth',
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

        {/* Profile compact + sign out */}
        <div className="border-t border-sand p-4">
          <div className="flex items-center gap-3 rounded-sm px-2 py-2">
            <EditorialAvatar name={accountName} size="sm" tone="terracotta" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-sans text-[14px] font-medium text-ink">
                {accountName}
              </span>
              <span className="block truncate font-sans text-[12px] text-stone">{accountMeta}</span>
            </span>
          </div>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded px-3 py-2 font-sans text-[13px] text-stone transition-colors hover:bg-sand-light/60 hover:text-ink"
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
