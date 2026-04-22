import type { ReactNode } from 'react';

import { PortalShell } from '@hha/ui';

import { PortalHeader } from '@/components/portal-header';
import { PortalSidebar, type SidebarItem } from '@/components/portal-sidebar';
import { requirePortal } from '@/lib/auth/session';

export default async function ParentLayout({ children }: { children: ReactNode }) {
  const account = await requirePortal('parent');
  const items: readonly SidebarItem[] = [
    { href: '/parent', label: 'Overview', iconKey: 'home' },
    { href: '/parent/children', label: 'Children', iconKey: 'users' },
    { href: '/parent/progress', label: 'Progress', iconKey: 'graduation-cap' },
    { href: '/parent/attendance', label: 'Attendance', iconKey: 'calendar-days' },
    { href: '/parent/fees', label: 'Fees', iconKey: 'credit-card', badge: '!' },
    { href: '/parent/messages', label: 'Messages', iconKey: 'message-square', badge: 3 },
    { href: '/parent/calendar', label: 'Calendar', iconKey: 'book-open' },
  ];

  return (
    <PortalShell
      portal="parent"
      title="Parent Portal"
      subtitle="Moyo family"
      sidebar={<PortalSidebar items={items} />}
      header={
        <PortalHeader
          account={account}
          title={`Welcome, ${account.firstName}.`}
          subtitle="Everything about Farai and Tanaka — in one place."
        />
      }
    >
      {children}
    </PortalShell>
  );
}
