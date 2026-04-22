import { redirect } from 'next/navigation';

import { currentAccount, portalHomePath } from '@/lib/auth/session';

export default async function RootIndex() {
  const account = await currentAccount();
  if (account) redirect(portalHomePath(account.portal));
  redirect('/sign-in');
}
