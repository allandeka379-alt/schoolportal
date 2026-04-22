'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@hha/ui';

export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

export function PortalSidebar({ items }: { items: readonly SidebarItem[] }) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = item.icon;
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
