import type { ReactNode } from 'react';
import { BarChart3, CalendarClock, CreditCard, FileSearch, Home, Megaphone, Receipt, Shield, Users } from 'lucide-react';

import { PortalShell } from '@hha/ui';

import { PortalHeader } from '@/components/portal-header';
import { PortalSidebar } from '@/components/portal-sidebar';
import { requirePortal } from '@/lib/auth/session';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const account = await requirePortal('admin');
  const items = [
    { href: '/admin', label: 'Overview', icon: Home },
    { href: '/admin/students', label: 'Students', icon: Users },
    { href: '/admin/fees', label: 'Fees Ledger', icon: CreditCard },
    { href: '/admin/slips', label: 'Slip Queue', icon: FileSearch, badge: 3 },
    { href: '/admin/receipts', label: 'Receipts', icon: Receipt },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/calendar', label: 'Calendar', icon: CalendarClock },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { href: '/admin/audit', label: 'Audit Log', icon: Shield },
  ] as const;

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
