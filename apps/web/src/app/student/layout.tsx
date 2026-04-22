import type { ReactNode } from 'react';

import { StudentShell } from '@/components/student/shell';
import { requirePortal } from '@/lib/auth/session';
import { ME_STUDENT } from '@/lib/mock/student-extras';

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const account = await requirePortal('student');
  const accountName = `${account.firstName} ${account.lastName}`;
  const accountMeta = `Form ${ME_STUDENT.form.replace('Form ', '')} ${ME_STUDENT.stream} · ${ME_STUDENT.house} House`;

  return (
    <StudentShell accountName={accountName} accountMeta={accountMeta}>
      {children}
    </StudentShell>
  );
}
