import type { ReactNode } from 'react';

import { PortalShell } from '@hha/ui';

import { PortalHeader } from '@/components/portal-header';
import { PortalSidebar, type SidebarItem } from '@/components/portal-sidebar';
import { requirePortal } from '@/lib/auth/session';

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  const account = await requirePortal('teacher');
  const items: readonly SidebarItem[] = [
    { href: '/teacher', label: 'Console', iconKey: 'home' },
    { href: '/teacher/classes', label: 'My Classes', iconKey: 'users' },
    { href: '/teacher/marking', label: 'Marking', iconKey: 'clipboard-check', badge: 18 },
    { href: '/teacher/gradebook', label: 'Gradebook', iconKey: 'bar-chart' },
    { href: '/teacher/attendance', label: 'Attendance', iconKey: 'calendar-clock' },
    { href: '/teacher/resources', label: 'Resources', iconKey: 'library' },
    { href: '/teacher/assignments', label: 'Assignments', iconKey: 'book-open-check' },
    { href: '/teacher/messages', label: 'Messages', iconKey: 'message-square', badge: 4 },
  ];

  return (
    <PortalShell
      portal="teacher"
      title="Teacher Console"
      subtitle="Mrs Dziva · Maths · Form 3"
      sidebar={<PortalSidebar items={items} />}
      header={<PortalHeader account={account} title="Good morning, Miriam." subtitle="Your day at a glance — and what needs your attention." />}
    >
      {children}
    </PortalShell>
  );
}
