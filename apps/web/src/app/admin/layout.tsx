import type { ReactNode } from 'react';

import { AdminShell } from '@/components/admin/shell';
import { requirePortal } from '@/lib/auth/session';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const account = await requirePortal('admin');
  const fullName = `${account.firstName} ${account.lastName}`;
  const meta = account.position ?? 'Administration';

  return (
    <AdminShell accountName={fullName} accountMeta={meta}>
      {children}
    </AdminShell>
  );
}
