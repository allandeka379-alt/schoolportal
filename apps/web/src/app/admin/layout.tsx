import type { ReactNode } from 'react';

import { PortalShell } from '@hha/ui';

import { PortalHeader } from '@/components/portal-header';
import { PortalSidebar, type SidebarItem } from '@/components/portal-sidebar';
import { requirePortal } from '@/lib/auth/session';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const account = await requirePortal('admin');
  const items: readonly SidebarItem[] = [
    { href: '/admin', label: 'Overview', iconKey: 'home' },
    { href: '/admin/students', label: 'Students', iconKey: 'users' },
    { href: '/admin/fees', label: 'Fees Ledger', iconKey: 'credit-card' },
    { href: '/admin/slips', label: 'Slip Queue', iconKey: 'file-search', badge: 3 },
    { href: '/admin/receipts', label: 'Receipts', iconKey: 'receipt' },
    { href: '/admin/announcements', label: 'Announcements', iconKey: 'megaphone' },
    { href: '/admin/calendar', label: 'Calendar', iconKey: 'calendar-clock' },
    { href: '/admin/reports', label: 'Reports', iconKey: 'bar-chart' },
    { href: '/admin/audit', label: 'Audit Log', iconKey: 'shield' },
  ];

  return (
    <PortalShell
      portal="admin"
      title="Admin Back-office"
      subtitle={account.position ?? 'Administration'}
      sidebar={<PortalSidebar items={items} />}
      header={<PortalHeader account={account} title="Administration" subtitle="Operations, fees, compliance." />}
    >
      {children}
    </PortalShell>
  );
}
