import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Logo } from '@/components/ui/logo';
import { Card } from '@/components/ui/card';

import { SignInForm } from './sign-in-form';

interface PageProps {
  searchParams?: Promise<{ next?: string; error?: string; role?: string }>;
}

const DEMO_USERS = [
  { role: 'Student',       email: 'student@hha.ac.zw',  sub: 'Farai · Form 3 Blue' },
  { role: 'Teacher',       email: 'teacher@hha.ac.zw',  sub: 'Mrs Dziva · Mathematics' },
  { role: 'Parent',        email: 'parent@hha.ac.zw',   sub: 'Mrs Moyo · 2 children' },
  { role: 'Bursar',        email: 'bursar@hha.ac.zw',   sub: 'Fees · slip reconciliation' },
  { role: 'Administrator', email: 'head@hha.ac.zw',     sub: 'Whole-school oversight' },
] as const;

const DEMO_PASSWORD = 'HHA!Portal2026';

/**
 * Sign-in surface — civic-light redesign.
 *
 *   • Minimal header with logo only
 *   • Split layout: form card on the left, demo-users card on the right
 *   • Background gradient tinted with brand primary + accent
 */
export default async function SignInPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-brand-accent/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-primary/15 blur-3xl"
      />

      {/* Minimal header */}
      <header className="relative z-10 mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Logo size={32} showText asLink variant="on-light" />
        <Link
          href="/"
          className="rounded-sm text-small font-medium text-muted transition-colors hover:text-brand-primary"
        >
          ← Back to landing
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[960px] items-start gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Form card */}
        <div>
          <Card className="p-6 sm:p-8">
            <div className="mb-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-brand-primary/5 px-2.5 py-0.5 text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-primary" />
                Sign in to your portal
              </p>
              <h1 className="mt-3 text-h1 text-ink">Welcome back</h1>
              <p className="mt-1 text-small text-muted">
                Use your HHA credentials. The portal routes you to your role automatically.
              </p>
            </div>

            <SignInForm next={params.next} initialError={params.error} />

            <p className="mt-6 text-center text-small text-muted">
              By signing in you accept the{' '}
              <Link href="#" className="font-medium text-brand-primary hover:underline">
                acceptable use policy
              </Link>
              .
            </p>
          </Card>
        </div>

        {/* Demo users */}
        <div>
          <Card className="border-dashed border-brand-primary/20 bg-brand-primary/[0.04] p-5 sm:p-6">
            <div className="mb-4 text-small font-semibold text-brand-primary">
              Demo accounts
            </div>
            <p className="text-micro text-muted">
              Every account uses the password{' '}
              <code className="rounded bg-card px-1.5 py-0.5 font-mono text-micro text-ink">
                {DEMO_PASSWORD}
              </code>
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {DEMO_USERS.map((u) => (
                <li key={u.email}>
                  <details className="group rounded-md border border-line bg-card transition-all duration-200 hover:border-brand-primary/25 hover:shadow-card-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5">
                      <div className="min-w-0">
                        <div className="text-small font-semibold text-ink">{u.role}</div>
                        <div className="truncate-line text-micro text-muted">
                          {u.email} · {u.sub}
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="border-t border-line px-3 py-2.5">
                      <p className="text-micro text-muted">
                        Click the form fields to the left and type the email + password above to
                        sign in as this user.
                      </p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-micro text-muted">
              This portal is a cosmetic demo. No real student data is displayed.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
