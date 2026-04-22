import type { ReactNode } from 'react';
import { BookOpen, ClipboardList, CreditCard, GraduationCap, Home, Library, MessageSquare } from 'lucide-react';

import { PortalShell } from '@hha/ui';

import { PortalHeader } from '@/components/portal-header';
import { PortalSidebar } from '@/components/portal-sidebar';
import { requirePortal } from '@/lib/auth/session';

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const account = await requirePortal('student');
  const items = [
    { href: '/student', label: 'Dashboard', icon: Home },
    { href: '/student/assignments', label: 'Assignments', icon: ClipboardList, badge: 3 },
    { href: '/student/library', label: 'Library', icon: Library },
    { href: '/student/progress', label: 'Progress', icon: GraduationCap },
    { href: '/student/timetable', label: 'Timetable', icon: BookOpen },
    { href: '/student/fees', label: 'Fees', icon: CreditCard },
    { href: '/student/messages', label: 'Messages', icon: MessageSquare, badge: 2 },
  ] as const;

  return (
    <PortalShell
      portal="student"
      title="Student Portal"
      subtitle="Form 3 Blue · Savanna House"
      sidebar={<PortalSidebar items={items} />}
      header={<PortalHeader account={account} title={`Sawubona, ${account.firstName}.`} subtitle="Here is your day." />}
    >
      {children}
    </PortalShell>
  );
}
