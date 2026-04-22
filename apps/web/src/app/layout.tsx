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
    'A unified digital home for students, teachers, administration, and parents of Harare Heritage Academy.',
  metadataBase: new URL('https://hha-portal.vercel.app'),
  openGraph: {
    title: 'Harare Heritage Academy · Portal',
    description:
      'Where knowledge meets heritage. The unified portal for HHA students, teachers, and parents.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF5EB', // Cream — matches the landing background
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`h-full ${fontVariables}`}>
      <body className="h-full bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
