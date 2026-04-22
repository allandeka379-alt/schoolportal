import type { ReactNode } from 'react';

import { cn } from '../cn';
import type { PortalKey } from '../tokens';

/**
 * Consistent chrome across the four portals — one sidebar rail, a top bar
 * with user info, content area. The portal key controls the accent stripe
 * so a user glancing between two tabs always knows which role they are in.
 */
export interface PortalShellProps {
  portal: PortalKey;
  title: string;
  subtitle?: string;
  sidebar: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}

const PORTAL_STRIPE: Record<PortalKey, string> = {
  student: 'bg-heritage-900',
  teacher: 'bg-savanna-600',
  parent: 'bg-heritage-700',
  admin: 'bg-granite-900',
};

export function PortalShell({ portal, title, subtitle, sidebar, header, children }: PortalShellProps) {
  return (
    <div className="min-h-screen bg-granite-50">
      <div className={cn('h-1 w-full', PORTAL_STRIPE[portal])} aria-hidden />
      <div className="flex">
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-granite-200 bg-white min-h-[calc(100vh-4px)]">
          <div className="px-5 py-5 border-b border-granite-200">
            <p className="text-xs uppercase tracking-wider text-granite-500">HHA Portal</p>
            <h1 className="mt-1 font-display text-lg text-heritage-950">{title}</h1>
            {subtitle ? <p className="text-xs text-granite-600 mt-0.5">{subtitle}</p> : null}
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">{sidebar}</nav>
        </aside>
        <main className="flex-1 min-w-0">
          {header ? (
            <header className="border-b border-granite-200 bg-white px-6 py-4">{header}</header>
          ) : null}
          <div className="px-6 py-6 max-w-screen-xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
