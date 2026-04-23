'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';

import { signInAction } from '@/lib/auth/actions';

type Role = 'student' | 'teacher' | 'parent';

const ROLE_HINTS: Record<Role, { email: string }> = {
  student: { email: 'student@jhs.ac.zw' },
  teacher: { email: 'teacher@jhs.ac.zw' },
  parent: { email: 'parent@jhs.ac.zw' },
};

/**
 * Hero sign-in panel — v2.0.
 *
 * Snow surface, Mist ring, cyan/accent CTA. Role pills are obsidian-filled
 * when active; otherwise Fog background with Slate text.
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
    (form.elements.namedItem('password') as HTMLInputElement).value = 'JHS!Portal2026';
  }

  return (
    <div className="w-full max-w-[420px] rounded-md bg-snow p-10 shadow-e3 ring-1 ring-mist lg:p-12">
      <p
        className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
        style={{ color: 'rgb(var(--accent))' }}
      >
        Sign in to the portal
      </p>

      {/* Role pill toggle */}
      <div
        role="radiogroup"
        aria-label="Role"
        className="mt-4 inline-flex items-center gap-1 rounded-full bg-fog p-1 font-mono text-[11px] font-medium uppercase tracking-[0.1em]"
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
                ? 'bg-obsidian text-snow shadow-sm'
                : 'text-slate hover:text-obsidian',
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
            className="rounded border border-signal-error/30 bg-signal-error/5 px-4 py-3 font-sans text-sm text-signal-error"
          >
            {error}
          </div>
        ) : null}

        <input type="hidden" name="next" value={`/${role === 'parent' ? 'parent' : role}`} />

        <div>
          <label
            htmlFor="hero-email"
            className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
          >
            Username
          </label>
          <input
            id="hero-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@jhs.ac.zw"
            className="input-underlined"
            required
          />
        </div>

        <div>
          <label
            htmlFor="hero-password"
            className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
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
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded p-1.5 text-steel transition-colors hover:text-obsidian"
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

        <button type="submit" className="btn-primary w-full" disabled={isPending}>
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
          <Link href="#" className="text-slate underline-offset-4 hover:text-obsidian hover:underline">
            Forgot password?
          </Link>
          <button
            type="button"
            onClick={quickFill}
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel hover:text-obsidian"
          >
            Fill demo credentials
          </button>
        </div>

        <p className="font-sans text-[13px] text-steel">
          First-time user?{' '}
          <Link href="#" className="text-obsidian underline-offset-4 hover:underline">
            Get your credentials
          </Link>
        </p>
      </form>

      {/* Reassurance strip */}
      <div className="mt-8 flex items-center justify-between border-t border-mist pt-5">
        <div className="flex items-center gap-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
            TLS
          </span>
          <span>Paynow</span>
          <span>EcoCash</span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel">ZDPA-compliant</span>
      </div>
    </div>
  );
}
