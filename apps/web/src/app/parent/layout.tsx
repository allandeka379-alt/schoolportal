import type { ReactNode } from 'react';

import { ParentShell } from '@/components/parent/shell';
import { requirePortal } from '@/lib/auth/session';
import { ME_PARENT } from '@/lib/mock/parent-extras';

export default async function ParentLayout({ children }: { children: ReactNode }) {
  await requirePortal('parent');
  const accountName = `${ME_PARENT.title} ${ME_PARENT.firstName} ${ME_PARENT.lastName}`;

  return (
    <ParentShell accountName={accountName} accountMeta="Moyo family · 3 children">
      {children}
    </ParentShell>
  );
}
