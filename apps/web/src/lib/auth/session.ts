/**
 * Demo-mode authentication.
 *
 * We store the signed-in user in a cookie as plain JSON. This is a demo —
 * in production the session would be a signed JWT issued by the API.
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ACCOUNTS, type DemoAccount, type PortalRole } from '../mock/fixtures';

const COOKIE = 'hha_demo_session';

export async function signIn(email: string, password: string): Promise<DemoAccount | null> {
  const account = ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
  );
  if (!account) return null;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, JSON.stringify({ id: account.id }), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12, // 12 hours is plenty for a demo session.
  });
  return account;
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}

export async function currentAccount(): Promise<DemoAccount | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { id: string };
    return ACCOUNTS.find((a) => a.id === parsed.id) ?? null;
  } catch {
    return null;
  }
}

/**
 * Guard for portal pages. Redirects to sign-in if unauthenticated and to the
 * correct portal if the user is in the wrong one.
 */
export async function requirePortal(portal: PortalRole): Promise<DemoAccount> {
  const account = await currentAccount();
  if (!account) redirect(`/sign-in?next=/${portal}`);
  if (account.portal !== portal) redirect(`/${account.portal}`);
  return account;
}

export function portalHomePath(role: PortalRole): string {
  return `/${role}`;
}
