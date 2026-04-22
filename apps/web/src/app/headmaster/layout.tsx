import type { ReactNode } from 'react';

import { HeadmasterShell } from '@/components/headmaster/shell';
import { requirePortal } from '@/lib/auth/session';
import { ME_HEADMASTER } from '@/lib/mock/headmaster-extras';

export default async function HeadmasterLayout({ children }: { children: ReactNode }) {
  await requirePortal('headmaster');
  return (
    <HeadmasterShell accountName={`${ME_HEADMASTER.title} ${ME_HEADMASTER.firstName} ${ME_HEADMASTER.lastName}`}>
      {children}
    </HeadmasterShell>
  );
}
