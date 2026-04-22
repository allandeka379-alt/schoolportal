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
 * v2.0 direction: the landing earns the electric-cyan accent (the public
 * face of the system). The `portal-landing` scope class sets --accent to
 * cyan for all downstream components.
 */
export default async function LandingPage() {
  const account = await currentAccount();
  if (account) redirect(portalHomePath(account.portal));

  return (
    <div className="portal-landing min-h-screen bg-snow text-obsidian">
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
