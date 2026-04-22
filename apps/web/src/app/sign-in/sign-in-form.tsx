'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

import { signInAction } from '@/lib/auth/actions';

interface Props {
  next?: string;
  initialError?: string;
}

export function SignInForm({ next, initialError }: Props) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [showPassword, setShowPassword] = useState(false);
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

  function fill(email: string) {
    const form = document.getElementById('sign-in-form') as HTMLFormElement | null;
    if (!form) return;
    (form.elements.namedItem('email') as HTMLInputElement).value = email;
    (form.elements.namedItem('password') as HTMLInputElement).value = 'HHA!Portal2026';
  }

  return (
    <form id="sign-in-form" className="space-y-6" onSubmit={onSubmit} noValidate>
      {error ? (
        <div
          role="alert"
          className="rounded-md border border-signal-error/30 bg-signal-error/5 px-4 py-3 font-sans text-sm text-signal-error"
        >
          <p className="font-medium">We could not sign you in</p>
          <p className="mt-1 text-signal-error/80">{error}</p>
        </div>
      ) : null}

      <input type="hidden" name="next" value={next ?? ''} />

      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@hha.ac.zw"
          className="input-underlined"
          required
        />
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label
            htmlFor="password"
            className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
          >
            Password
          </label>
          <a
            href="#"
            className="font-sans text-[12px] text-slate underline-offset-4 hover:text-obsidian hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
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

      <div className="grid grid-cols-2 gap-2 border-t border-mist pt-4">
        {[
          { email: 'student@hha.ac.zw', label: 'Quick-fill student' },
          { email: 'teacher@hha.ac.zw', label: 'Quick-fill teacher' },
          { email: 'parent@hha.ac.zw', label: 'Quick-fill parent' },
          { email: 'bursar@hha.ac.zw', label: 'Quick-fill bursar' },
        ].map((opt) => (
          <button
            key={opt.email}
            type="button"
            onClick={() => fill(opt.email)}
            className="text-left font-mono text-[11px] uppercase tracking-[0.1em] text-steel hover:text-obsidian"
          >
            ↪ {opt.label}
          </button>
        ))}
      </div>
    </form>
  );
}
