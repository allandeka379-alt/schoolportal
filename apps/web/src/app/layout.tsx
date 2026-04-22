import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'HHA Portal — Harare Heritage Academy',
  description:
    'One unified digital platform for students, teachers, administration, and parents of Harare Heritage Academy.',
};

export const viewport: Viewport = {
  themeColor: '#0f1d3a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="h-full bg-granite-50 text-granite-900 antialiased">{children}</body>
    </html>
  );
}
