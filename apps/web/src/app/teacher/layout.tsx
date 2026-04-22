import type { ReactNode } from 'react';
import { BarChart3, BookOpenCheck, CalendarClock, ClipboardCheck, Home, Library, MessageSquare, Users } from 'lucide-react';

import { PortalShell } from '@hha/ui';

import { PortalHeader } from '@/components/portal-header';
import { PortalSidebar } from '@/components/portal-sidebar';
import { requirePortal } from '@/lib/auth/session';

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  const account = await requirePortal('teacher');
  const items = [
    { href: '/teacher', label: 'Console', icon: Home },
    { href: '/teacher/classes', label: 'My Classes', icon: Users },
    { href: '/teacher/marking', label: 'Marking', icon: ClipboardCheck, badge: 18 },
    { href: '/teacher/gradebook', label: 'Gradebook', icon: BarChart3 },
    { href: '/teacher/attendance', label: 'Attendance', icon: CalendarClock },
    { href: '/teacher/resources', label: 'Resources', icon: Library },
    { href: '/teacher/assignments', label: 'Assignments', icon: BookOpenCheck },
    { href: '/teacher/messages', label: 'Messages', icon: MessageSquare, badge: 4 },
  ] as const;

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
