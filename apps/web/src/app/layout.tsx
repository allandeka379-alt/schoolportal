import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { fontVariables, legacyAliasStyle } from '@/lib/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Harare Heritage Academy · Portal',
    template: '%s · HHA Portal',
  },
  description:
    'Software for the academic life of Harare Heritage Academy — students, teachers, parents, and the administrator.',
  metadataBase: new URL('https://hha-portal.vercel.app'),
  openGraph: {
    title: 'HHA Portal',
    description:
      'Software for the academic life of Harare Heritage Academy.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#1F3A68',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`h-full ${fontVariables}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: legacyAliasStyle }} />
      </head>
      <body className="min-h-full bg-surface text-ink antialiased">{children}</body>
    </html>
  );
}
