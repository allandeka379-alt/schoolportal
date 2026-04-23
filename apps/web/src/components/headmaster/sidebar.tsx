'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
  UserSquare2,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Logo } from '@/components/ui/logo';
import { EditorialAvatar } from '@/components/student/primitives';
import { signOutAction } from '@/lib/auth/actions';

/**
 * Headmaster sidebar — executive register.
 *
 * Seven destinations. One job per page. No branded concept name,
 * no "Cohort", no overlapping features.
 */

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
}

export const HEADMASTER_NAV: readonly NavItem[] = [
  { href: '/headmaster',          label: 'Overview',  icon: LayoutDashboard },
  { href: '/headmaster/students', label: 'Students',  icon: GraduationCap, badge: 18 },
  { href: '/headmaster/teachers', label: 'Teachers',  icon: UserSquare2 },
  { href: '/headmaster/fees',     label: 'Fees',      icon: CreditCard },
  { href: '/headmaster/academic', label: 'Academic',  icon: Users },
  { href: '/headmaster/alerts',   label: 'Alerts',    icon: Bell,          badge: 5 },
  { href: '/headmaster/reports',  label: 'Reports',   icon: FileText,      badge: '14/32' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/headmaster') return pathname === '/headmaster';
  return pathname === href || pathname.startsWith(href + '/');
}

export function HeadmasterSidebar({
  accountName,
  mobileOpen,
  onMobileClose,
}: {
  accountName: string;
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
          <Link
            href="/headmaster"
            className="flex items-center"
            aria-label="JHS Administrator"
          >
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
            Administrator portal
          </p>
        </div>

        <nav aria-label="Administrator navigation" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {HEADMASTER_NAV.map((item) => {
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
                    {item.badge !== undefined ? (
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
        </nav>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <EditorialAvatar name={accountName} size="sm" tone="terracotta" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-small font-semibold text-ink">
                {accountName}
              </span>
              <span className="block truncate text-micro text-muted">
                Administrator
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
