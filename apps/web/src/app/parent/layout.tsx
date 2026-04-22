import type { ReactNode } from 'react';
import { BookOpen, CalendarDays, CreditCard, GraduationCap, Home, MessageSquare, Users } from 'lucide-react';

import { PortalShell } from '@hha/ui';

import { PortalHeader } from '@/components/portal-header';
import { PortalSidebar } from '@/components/portal-sidebar';
import { requirePortal } from '@/lib/auth/session';

export default async function ParentLayout({ children }: { children: ReactNode }) {
  const account = await requirePortal('parent');
  const items = [
    { href: '/parent', label: 'Overview', icon: Home },
    { href: '/parent/children', label: 'Children', icon: Users },
    { href: '/parent/progress', label: 'Progress', icon: GraduationCap },
    { href: '/parent/attendance', label: 'Attendance', icon: CalendarDays },
    { href: '/parent/fees', label: 'Fees', icon: CreditCard, badge: '!' },
    { href: '/parent/messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { href: '/parent/calendar', label: 'Calendar', icon: BookOpen },
  ] as const;

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
