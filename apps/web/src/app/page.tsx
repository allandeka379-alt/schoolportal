import { redirect } from 'next/navigation';

import { AnnouncementsWindow } from '@/components/landing/announcements-window';
import { CtaBand } from '@/components/landing/cta-band';
import { LandingFooter } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { LiveStatsStrip } from '@/components/landing/live-stats';
import { LandingNav } from '@/components/landing/nav';
import { ServicesGrid } from '@/components/landing/services-grid';
import { TrustSecurity } from '@/components/landing/trust-security';
import { currentAccount, portalHomePath } from '@/lib/auth/session';

/**
 * Landing page — civic-light redesign.
 *
 *   Nav (scroll-reactive)
 *   Hero (carousel + background photo)
 *   Live stats strip
 *   Services grid (what the portal does)
 *   How it works (four steps)
 *   Announcements (public notices)
 *   Trust & security
 *   CTA band
 *   Footer
 */
export default async function LandingPage() {
  const account = await currentAccount();
  if (account) redirect(portalHomePath(account.portal));

  return (
    <div className="min-h-screen bg-surface text-ink">
      <LandingNav />
      <main id="main-content">
        <Hero />
        <LiveStatsStrip />
        <ServicesGrid />
        <HowItWorks />
        <AnnouncementsWindow />
        <TrustSecurity />
        <CtaBand />
      </main>
      <LandingFooter />
    </div>
  );
}
