'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Banknote,
  Calendar,
  CreditCard,
  FileSearch,
  Home,
  LogOut,
  Megaphone,
  Receipt,
  Shield,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';

import { LandingCrest } from '@/components/landing/crest';
import { EditorialAvatar } from '@/components/student/primitives';
import { signOutAction } from '@/lib/auth/actions';

/**
 * Admin sidebar — v2.0.
 *
 * Obsidian surface with amber accent. 260px wide. Nine destinations
 * grouped into Operations / Finance / Communication / Compliance.
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

export const ADMIN_NAV: readonly Group[] = [
  {
    label: 'Operations',
    items: [
      { href: '/admin', label: 'Overview', icon: Home },
      { href: '/admin/students', label: 'Students', icon: Users },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/admin/fees', label: 'Fees Ledger', icon: CreditCard },
      { href: '/admin/slips', label: 'Slip Queue', icon: FileSearch, badge: 3 },
      { href: '/admin/receipts', label: 'Receipts', icon: Receipt },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
      { href: '/admin/audit', label: 'Audit Log', icon: Shield },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(href + '/');
}

export function AdminSidebar({
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
          className="fixed inset-0 z-40 bg-ink/60 lg:hidden"
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-obsidian text-fog',
          'transition-transform duration-120 ease-out-soft lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-graphite px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3" aria-label="HHA admin">
            <LandingCrest size={32} variant="cream" />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-medium text-snow">HHA Portal</span>
              <span
                className="block font-mono text-[10px] font-medium uppercase tracking-[0.14em]"
                style={{ color: 'rgb(var(--accent))' }}
              >
                Admin · Bursar
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

        <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3 py-4">
          {ADMIN_NAV.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="mb-1 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-steel">
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
                          'relative flex items-center gap-3 rounded px-3 py-2 font-sans text-[14px] transition-colors duration-120',
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
                          className="h-4 w-4"
                          style={active ? { color: 'rgb(var(--accent))' } : undefined}
                          strokeWidth={1.5}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 ? (
                          <span
                            className={[
                              'rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums',
                              active ? 'bg-snow/10 text-snow' : 'bg-graphite text-steel',
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
        <div className="border-t border-graphite px-3 py-4">
          <p className="mb-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-steel">
            Quick actions
          </p>
          <div className="space-y-1.5">
            <Link
              href="/admin/slips"
              className="flex items-center gap-2 rounded border border-graphite bg-graphite/40 px-3 py-2 font-sans text-[13px] font-medium text-fog transition-colors duration-120 hover:border-slate hover:text-snow"
            >
              <FileSearch className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Review slips
            </Link>
            <Link
              href="/admin/announcements"
              className="flex items-center gap-2 rounded border border-graphite bg-graphite/40 px-3 py-2 font-sans text-[13px] font-medium text-fog transition-colors duration-120 hover:border-slate hover:text-snow"
            >
              <Megaphone className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Post notice
            </Link>
            <Link
              href="/admin/receipts"
              className="flex items-center gap-2 rounded border border-graphite bg-graphite/40 px-3 py-2 font-sans text-[13px] font-medium text-fog transition-colors duration-120 hover:border-slate hover:text-snow"
            >
              <Banknote className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              New receipt
            </Link>
          </div>
        </div>

        {/* Profile compact + sign out */}
        <div className="border-t border-graphite p-4">
          <div className="flex items-center gap-3 rounded-sm px-2 py-2">
            <EditorialAvatar name={accountName} size="sm" tone="terracotta" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-sans text-[14px] font-medium text-snow">
                {accountName}
              </span>
              <span className="block truncate font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
                {accountMeta}
              </span>
            </span>
          </div>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded px-3 py-2 font-sans text-[13px] text-steel transition-colors duration-120 hover:bg-graphite/60 hover:text-snow"
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
