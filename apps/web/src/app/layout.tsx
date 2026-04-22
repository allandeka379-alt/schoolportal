import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { fontVariables } from '@/lib/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Harare Heritage Academy · Portal',
    template: '%s · HHA Portal',
  },
  description:
    'Software for the academic life of Harare Heritage Academy — students, teachers, parents, and the Headmaster.',
  metadataBase: new URL('https://hha-portal.vercel.app'),
  openGraph: {
    title: 'HHA Portal · v2.0',
    description:
      'Cool precision software for students, teachers, parents, and the Headmaster of Harare Heritage Academy.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`h-full ${fontVariables}`}>
      <body className="h-full bg-snow text-obsidian antialiased">{children}</body>
    </html>
  );
}
