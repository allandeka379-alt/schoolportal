'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';

import { signInAction } from '@/lib/auth/actions';

type Role = 'student' | 'teacher' | 'parent';

const ROLE_HINTS: Record<Role, { email: string }> = {
  student: { email: 'student@hha.ac.zw' },
  teacher: { email: 'teacher@hha.ac.zw' },
  parent: { email: 'parent@hha.ac.zw' },
};

/**
 * Hero sign-in panel per §06 of the spec.
 *
 *   - Role pill selector (Student / Teacher / Parent) in a single toggle group
 *   - Two underlined fields (Username, Password) — no box borders
 *   - Terracotta full-width CTA with a right-pointing arrow glyph
 *   - "Forgot password?" and "First-time user?" as sibling links
 *   - Row of reassurance badges along the bottom (Paynow, EcoCash, TLS)
 */
export function HeroSignIn() {
  const [role, setRole] = useState<Role>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(undefined);
    startTransition(async () => {
      const result = await signInAction(form);
      if (result?.error) setError(result.error);
    });
  }

  function quickFill() {
    const form = document.getElementById('hero-signin') as HTMLFormElement | null;
    if (!form) return;
    (form.elements.namedItem('email') as HTMLInputElement).value = ROLE_HINTS[role].email;
    (form.elements.namedItem('password') as HTMLInputElement).value = 'HHA!Portal2026';
  }

  return (
    <div className="w-full max-w-[420px] rounded bg-white p-10 shadow-e3 ring-1 ring-sand lg:p-12">
      <p className="hha-eyebrow-earth">Sign in to the portal</p>

      {/* Role pill toggle */}
      <div
        role="radiogroup"
        aria-label="Role"
        className="mt-4 inline-flex items-center gap-1 rounded-full bg-sand-light p-1 font-sans text-xs font-semibold"
      >
        {(['student', 'teacher', 'parent'] as const).map((r) => (
          <button
            key={r}
            role="radio"
            aria-checked={role === r}
            type="button"
            onClick={() => setRole(r)}
            className={[
              'rounded-full px-4 py-2 transition-all duration-200 ease-out-soft',
              role === r
                ? 'bg-ink text-cream shadow-sm'
                : 'text-stone hover:text-ink',
            ].join(' ')}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <form id="hero-signin" onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
        {error ? (
          <div
            role="alert"
            className="rounded border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
          >
            {error}
          </div>
        ) : null}

        <input type="hidden" name="next" value={`/${role === 'parent' ? 'parent' : role}`} />

        <div>
          <label
            htmlFor="hero-email"
            className="mb-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth"
          >
            Username
          </label>
          <input
            id="hero-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@hha.ac.zw"
            className="input-underlined"
            required
          />
        </div>

        <div>
          <label
            htmlFor="hero-password"
            className="mb-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="hero-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="input-underlined pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded p-1.5 text-stone transition-colors hover:text-ink"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-terracotta w-full" disabled={isPending}>
          {isPending ? (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          ) : null}
          Sign in
          <ArrowRight className="h-4 w-4" aria-hidden strokeWidth={1.5} />
        </button>

        <div className="flex items-center justify-between font-sans text-[13px]">
          <Link href="#" className="landing-link text-earth hover:text-terracotta">
            Forgot password?
          </Link>
          <button
            type="button"
            onClick={quickFill}
            className="font-sans text-[13px] text-stone hover:text-ink"
          >
            Fill demo credentials
          </button>
        </div>

        <p className="font-sans text-[13px] text-stone">
          First-time user?{' '}
          <Link href="#" className="landing-link">
            Get your credentials
          </Link>
        </p>
      </form>

      {/* Reassurance badges along the bottom */}
      <div className="mt-8 flex items-center justify-between border-t border-sand pt-5">
        <div className="flex items-center gap-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
            TLS
          </span>
          <span>Paynow</span>
          <span>EcoCash</span>
        </div>
        <span className="font-sans text-[11px] text-stone">ZDPA-compliant</span>
      </div>
    </div>
  );
}
