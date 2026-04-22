'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  Anchor,
  Bell,
  ClipboardList,
  FileText,
  Gauge,
  Grid3x3,
  Layers,
  LogOut,
  PieChart,
  Shield,
  Target,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';

import { LandingCrest } from '@/components/landing/crest';
import { EditorialAvatar } from '@/components/student/primitives';
import { signOutAction } from '@/lib/auth/actions';

/**
 * Headmaster's Bridge sidebar — §03.
 *
 * Dark Earth-filled sidebar. Visually distinct from the role-based portals
 * — a psychological cue that this is a decision-making workspace focused
 * on academic leadership. 260px wide.
 *
 * Eleven destinations — all academic. Grouped visually into three blocks
 * (daily / oversight / governance) to reinforce the cadence of use.
 */

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
}

interface Group {
  label: string;
  items: readonly NavItem[];
}

export const HEADMASTER_NAV: readonly Group[] = [
  {
    label: 'Daily',
    items: [
      { href: '/headmaster',              label: 'The Bridge',         icon: Anchor },
      { href: '/headmaster/approvals',    label: 'Approvals',          icon: ClipboardList, badge: 9 },
      { href: '/headmaster/alerts',       label: 'Alerts',             icon: Bell,          badge: 5 },
    ],
  },
  {
    label: 'Oversight',
    items: [
      { href: '/headmaster/academic',     label: 'Academic Intelligence', icon: Gauge },
      { href: '/headmaster/subjects',     label: 'Subjects & Classes',    icon: Grid3x3 },
      { href: '/headmaster/at-risk',      label: 'At-Risk Register',      icon: AlertTriangle, badge: 18 },
      { href: '/headmaster/teaching',     label: 'Teaching Quality',      icon: Users },
    ],
  },
  {
    label: 'Governance',
    items: [
      { href: '/headmaster/reports',      label: 'Reports',            icon: FileText,   badge: '14/32' },
      { href: '/headmaster/safeguarding', label: 'Safeguarding',       icon: Shield,     badge: 3 },
      { href: '/headmaster/strategic',    label: 'Strategic Goals',    icon: Target },
      { href: '/headmaster/board',        label: 'Board Reporting',    icon: PieChart },
      { href: '/headmaster/profile',      label: 'Delegation',         icon: UserCog },
    ],
  },
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
          <Link
            href="/headmaster"
            className="flex items-center gap-3"
            aria-label="Headmaster's Bridge"
          >
            <LandingCrest size={32} variant="cream" />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-medium text-snow">HHA Portal</span>
              <span
                className="block font-mono text-[10px] font-medium uppercase tracking-[0.14em]"
                style={{ color: 'rgb(var(--accent))' }}
              >
                The Bridge
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

        {/* Command palette hint */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 rounded border border-graphite bg-charcoal px-3 py-2 font-sans text-[12px] text-steel">
            <span>Search · subjects · teachers</span>
            <kbd className="ml-auto rounded border border-graphite bg-graphite px-1 py-px font-mono text-[10px] text-fog">
              ⌘K
            </kbd>
          </div>
        </div>

        <nav aria-label="Headmaster navigation" className="flex-1 overflow-y-auto px-3 pb-3">
          {HEADMASTER_NAV.map((group) => (
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
                        {item.badge !== undefined ? (
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

        {/* Profile + sign out */}
        <div className="border-t border-graphite p-4">
          <div className="flex items-center gap-3 rounded-sm px-2 py-2">
            <EditorialAvatar name={accountName} size="sm" tone="terracotta" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-sans text-[14px] font-medium text-snow">
                {accountName}
              </span>
              <span className="block truncate font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
                Headmaster
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
