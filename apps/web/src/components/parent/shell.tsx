'use client';

import { useState, type ReactNode } from 'react';

import { SelectedChildProvider } from './selected-child-context';
import { ParentSidebar } from './sidebar';
import { ParentTopBar } from './top-bar';

/**
 * Parent portal shell — §03.
 *
 * Composes the 240px sidebar (with child switcher at the top), 64px top
 * utility bar, and child-scoped workspace. The SelectedChildProvider wraps
 * everything so nested pages can read the currently-selected child.
 */
export function ParentShell({
  accountName,
  accountMeta,
  children,
}: {
  accountName: string;
  accountMeta: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SelectedChildProvider>
      <div className="min-h-screen bg-cream">
        <div className="flex min-h-screen">
          <ParentSidebar
            accountName={accountName}
            accountMeta={accountMeta}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <ParentTopBar onOpenMobileNav={() => setMobileOpen(true)} />
            <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
              <div className="mx-auto w-full max-w-[1200px]">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </SelectedChildProvider>
  );
}
