import { Avatar, Badge } from '@hha/ui';
import { Bell, LogOut } from 'lucide-react';

import { signOutAction } from '@/lib/auth/actions';
import type { DemoAccount } from '@/lib/mock/fixtures';

export function PortalHeader({
  account,
  title,
  subtitle,
  right,
}: {
  account: DemoAccount;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <h2 className="font-display text-xl text-heritage-950">{title}</h2>
        {subtitle ? <p className="text-sm text-granite-600 mt-0.5">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-4">
        {right}
        <button
          className="relative rounded p-2 text-granite-500 hover:bg-granite-100 hover:text-heritage-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-msasa-500" aria-hidden />
        </button>
        <div className="flex items-center gap-3 rounded border border-granite-200 bg-white px-3 py-1.5">
          <Avatar name={`${account.firstName} ${account.lastName}`} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-granite-900 leading-tight">
              {account.firstName} {account.lastName}
            </p>
            <p className="text-[11px] text-granite-500 leading-tight">
              {account.position ?? account.roles.join(', ')}
            </p>
          </div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded p-2 text-granite-500 hover:bg-granite-100 hover:text-heritage-900"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export function BadgeStatusDot({ label, tone }: { label: string; tone: 'success' | 'warning' | 'info' | 'danger' | 'neutral' }) {
  const toneMap = {
    success: 'success',
    warning: 'warning',
    info: 'info',
    danger: 'danger',
    neutral: 'neutral',
  } as const;
  return <Badge tone={toneMap[tone]}>{label}</Badge>;
}
