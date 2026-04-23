import Link from 'next/link';

import { Crest } from '@hha/ui';

import { SignInForm } from './sign-in-form';

interface PageProps {
  searchParams?: Promise<{ next?: string; error?: string }>;
}

/**
 * Sign-in surface — v2.0.
 *
 * Obsidian brand panel on the left; crisp snow/mist sign-in form on the
 * right. Electric cyan accent (inherited from `.portal-landing`).
 */
export default async function SignInPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  return (
    <main className="portal-landing min-h-screen bg-snow">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-obsidian p-12 text-snow lg:flex">
          <header className="relative flex items-center gap-3">
            <Crest size={40} />
            <div>
              <p
                className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
                style={{ color: 'rgb(var(--accent))' }}
              >
                Harare Heritage Academy
              </p>
              <p className="mt-0.5 font-display text-[18px] font-medium">HHA Portal</p>
            </div>
          </header>

          <div className="relative max-w-md space-y-6">
            <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight tracking-tight text-snow">
              Software for the academic life of the school.
            </h1>
            <p className="font-sans text-[15px] leading-relaxed text-fog/80">
              One portal. Every stakeholder. Precise, fast, and built for how
              teachers, students, parents, and the administrator actually work.
            </p>
            <ul className="space-y-3 font-sans text-[14px] text-fog/80">
              {[
                'Assignments, marking, and end-of-term reports in one place.',
                'EcoCash, OneMoney, InnBucks, and every major local bank — accepted here.',
                'Automatic bank-slip reading. No more slips sitting in a drawer.',
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span
                    className="mt-2 h-1 w-1 flex-none rounded-full"
                    style={{ backgroundColor: 'rgb(var(--accent))' }}
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <footer className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-steel">
            © 2026 Harare Heritage Academy · v2.0
          </footer>
        </section>

        <section className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="lg:hidden flex items-center gap-3">
              <Crest size={32} />
              <p className="font-display text-[18px] font-medium">HHA Portal</p>
            </div>

            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate">
                Sign in
              </p>
              <h2 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-tight text-obsidian">
                Software for HHA.
              </h2>
              <p className="mt-2 font-sans text-[14px] text-slate">
                Use your HHA credentials. Your portal will be chosen for you.
              </p>
            </div>

            <SignInForm next={params.next} initialError={params.error} />

            <div className="rounded-md border border-mist bg-snow p-4">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate">
                Demo accounts
              </p>
              <p className="mt-1 font-mono text-[11px] text-steel">
                All use the password{' '}
                <code className="rounded bg-fog px-1 py-0.5 font-mono text-obsidian">
                  HHA!Portal2026
                </code>
              </p>
              <dl className="mt-3 space-y-1.5 font-mono text-[12px]">
                {[
                  ['student@hha.ac.zw', 'Student · indigo'],
                  ['teacher@hha.ac.zw', 'Teacher · emerald'],
                  ['parent@hha.ac.zw',  'Parent · coral'],
                  ['bursar@hha.ac.zw',  'Admin · bursar'],
                  ['head@hha.ac.zw',    'Administrator · amber'],
                ].map(([email, tag]) => (
                  <div key={email} className="flex justify-between gap-4">
                    <dt className="text-obsidian">{email}</dt>
                    <dd className="uppercase tracking-[0.1em] text-steel">{tag}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="text-center font-sans text-[12px] text-steel">
              By signing in you accept the{' '}
              <Link href="#" className="text-obsidian underline-offset-4 hover:underline">
                acceptable use policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
