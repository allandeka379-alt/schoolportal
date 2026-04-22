'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Banknote,
  BookOpen,
  BookOpenCheck,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileSearch,
  GraduationCap,
  Home,
  Library,
  Megaphone,
  MessageSquare,
  Receipt,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@hha/ui';

/**
 * Items cross the server → client boundary via string keys (not function
 * references), because React Server Components cannot serialise functions
 * in props. The sidebar looks up the actual Lucide icon internally.
 */
export type SidebarIconKey =
  | 'home'
  | 'clipboard-list'
  | 'clipboard-check'
  | 'library'
  | 'book-open'
  | 'book-open-check'
  | 'calendar-clock'
  | 'calendar-days'
  | 'graduation-cap'
  | 'credit-card'
  | 'message-square'
  | 'megaphone'
  | 'users'
  | 'bar-chart'
  | 'banknote'
  | 'file-search'
  | 'receipt'
  | 'shield';

const ICONS: Record<SidebarIconKey, LucideIcon> = {
  home: Home,
  'clipboard-list': ClipboardList,
  'clipboard-check': ClipboardCheck,
  library: Library,
  'book-open': BookOpen,
  'book-open-check': BookOpenCheck,
  'calendar-clock': CalendarClock,
  'calendar-days': CalendarDays,
  'graduation-cap': GraduationCap,
  'credit-card': CreditCard,
  'message-square': MessageSquare,
  megaphone: Megaphone,
  users: Users,
  'bar-chart': BarChart3,
  banknote: Banknote,
  'file-search': FileSearch,
  receipt: Receipt,
  shield: Shield,
};

export interface SidebarItem {
  href: string;
  label: string;
  iconKey: SidebarIconKey;
  badge?: string | number;
}

export function PortalSidebar({ items }: { items: readonly SidebarItem[] }) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = ICONS[item.iconKey];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn('hha-nav-link', active && 'hha-nav-link-active')}
          >
            <Icon className="h-4 w-4 text-granite-500" aria-hidden />
            <span className="flex-1">{item.label}</span>
            {item.badge !== undefined ? (
              <span className="rounded bg-heritage-100 px-1.5 py-0.5 text-[10px] font-semibold text-heritage-800">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </>
  );
}
