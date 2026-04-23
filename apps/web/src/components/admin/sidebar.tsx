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

import { Logo } from '@/components/ui/logo';
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
          <Link href="/admin" className="flex items-center" aria-label="JHS admin">
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
            Bursar portal
          </p>
        </div>

        <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3 py-4">
          {ADMIN_NAV.map((group) => (
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
              href="/admin/slips"
              className="flex items-center gap-2 rounded-md border border-line bg-card px-3 py-2 text-small font-medium text-ink transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
            >
              <FileSearch className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Review slips
            </Link>
            <Link
              href="/admin/announcements"
              className="flex items-center gap-2 rounded-md border border-line bg-card px-3 py-2 text-small font-medium text-ink transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
            >
              <Megaphone className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Post notice
            </Link>
            <Link
              href="/admin/receipts"
              className="flex items-center gap-2 rounded-md border border-line bg-card px-3 py-2 text-small font-medium text-ink transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
            >
              <Banknote className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              New receipt
            </Link>
          </div>
        </div>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <EditorialAvatar name={accountName} size="sm" tone="terracotta" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-small font-semibold text-ink">
                {accountName}
              </span>
              <span className="block truncate text-micro text-muted">
                {accountMeta}
              </span>
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
