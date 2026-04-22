import { redirect } from 'next/navigation';

import { AnnouncementsWindow } from '@/components/landing/announcements-window';
import { FeatureShowcase } from '@/components/landing/feature-showcase';
import { LandingFooter } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { LandingNav } from '@/components/landing/nav';
import { NumbersBand } from '@/components/landing/numbers-band';
import { RolePathways } from '@/components/landing/role-pathways';
import { TrustSecurity } from '@/components/landing/trust-security';
import { Voices } from '@/components/landing/voices';
import { currentAccount, portalHomePath } from '@/lib/auth/session';

/**
 * Root route — the landing page.
 *
 * Authenticated users are redirected to their portal home; unauthenticated
 * users see the editorial landing in the Cream / Earth / Terracotta palette
 * described in the Landing Page Design Specification.
 */
export default async function LandingPage() {
  const account = await currentAccount();
  if (account) redirect(portalHomePath(account.portal));

  return (
    <div className="min-h-screen bg-cream text-ink">
      <LandingNav />
      <main>
        <Hero />
        <RolePathways />
        <FeatureShowcase />
        <NumbersBand />
        <HowItWorks />
        <Voices />
        <AnnouncementsWindow />
        <TrustSecurity />
      </main>
      <LandingFooter />
    </div>
  );
}
