'use server';

import { redirect } from 'next/navigation';

import { portalHomePath, signIn as signInSession, signOut as signOutSession } from './session';

export async function signInAction(formData: FormData): Promise<{ error?: string }> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '');

  if (!email || !password) {
    return { error: 'Please enter both your email and password.' };
  }

  const account = await signInSession(email, password);
  if (!account) {
    return { error: 'That email and password combination was not recognised.' };
  }

  redirect(next && next.startsWith('/') ? next : portalHomePath(account.portal));
}

export async function signOutAction(): Promise<void> {
  await signOutSession();
  redirect('/sign-in');
}
