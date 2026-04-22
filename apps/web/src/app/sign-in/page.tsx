import Link from 'next/link';

import { Crest } from '@hha/ui';

import { SignInForm } from './sign-in-form';

interface PageProps {
  searchParams?: Promise<{ next?: string; error?: string }>;
}

export default async function SignInPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  return (
    <main className="min-h-screen bg-gradient-to-b from-granite-50 to-granite-100">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        <section className="hidden flex-col justify-between bg-heritage-950 text-white p-12 lg:flex">
          <header className="flex items-center gap-3">
            <Crest size={44} />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-heritage-200">
                Harare Heritage Academy
              </p>
              <p className="font-display text-lg">HHA Portal</p>
            </div>
          </header>

          <div className="max-w-md space-y-6">
            <h1 className="font-display text-display-md tracking-tight text-white">
              A digital home that reflects the standards of the school itself.
            </h1>
            <p className="text-heritage-100 leading-relaxed">
              One portal. Every stakeholder. Zero paper circulars. For students, teachers,
              administration, and parents.
            </p>
            <ul className="space-y-2 text-sm text-heritage-100">
              <li className="flex gap-3">
                <span className="h-1 w-1 mt-2 flex-none rounded-full bg-savanna-400" />
                Assignments, marking, and end-of-term reports in one place.
              </li>
              <li className="flex gap-3">
                <span className="h-1 w-1 mt-2 flex-none rounded-full bg-savanna-400" />
                EcoCash, OneMoney, InnBucks, and every major local bank — accepted here.
              </li>
              <li className="flex gap-3">
                <span className="h-1 w-1 mt-2 flex-none rounded-full bg-savanna-400" />
                Automatic bank-slip reading. No more slips sitting in a drawer.
              </li>
            </ul>
          </div>

          <footer className="text-xs text-heritage-300">
            © 2026 Harare Heritage Academy. Version 1.0
          </footer>
        </section>

        <section className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="lg:hidden flex items-center gap-3">
              <Crest size={36} />
              <p className="font-display text-lg">HHA Portal</p>
            </div>

            <div>
              <h2 className="font-display text-display-sm tracking-tight text-heritage-950">
                Sign in
              </h2>
              <p className="mt-1 text-sm text-granite-600">
                Use your HHA credentials. Your portal will be chosen for you.
              </p>
            </div>

            <SignInForm next={params.next} initialError={params.error} />

            <div className="rounded-lg border border-granite-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-granite-600">
                Demo accounts
              </p>
              <p className="mt-1 text-xs text-granite-500">
                All use the password{' '}
                <code className="rounded bg-granite-100 px-1 py-0.5 font-mono">HHA!Portal2026</code>
              </p>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-granite-700">student@hha.ac.zw</dt>
                  <dd className="text-granite-500">Student (Farai Moyo)</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-granite-700">teacher@hha.ac.zw</dt>
                  <dd className="text-granite-500">Teacher (Mrs Dziva)</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-granite-700">parent@hha.ac.zw</dt>
                  <dd className="text-granite-500">Parent (two children)</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-granite-700">bursar@hha.ac.zw</dt>
                  <dd className="text-granite-500">Bursar</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-granite-700">head@hha.ac.zw</dt>
                  <dd className="text-granite-500">Headmaster — The Bridge</dd>
                </div>
              </dl>
            </div>

            <p className="text-center text-xs text-granite-500">
              By signing in you accept the{' '}
              <Link href="#" className="text-heritage-700 underline-offset-4 hover:underline">
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
