'use client';

import { MotionConfig } from 'framer-motion';
import { UserLayout } from '../../layout/Layout';
import { AvailabilityShowcase } from './AvailabilityShowcase';
import { Faq, FinalCta, Pricing, Steps } from './Conversion';
import { Features } from './Features';
import { Hero } from './Hero';
import { MobileApp } from './MobileApp';
import { Audiences, BeforeAfter, TrustStrip } from './Positioning';
import { VerifiedAgency } from './VerifiedAgency';

/** Page d'accueil (structure : docs/landing-redesign/proposition.md). */
export const LandingPage = () => (
  // « reduceMotion: user » : déplacements coupés si l'utilisateur a choisi de réduire les animations
  <MotionConfig reducedMotion="user">
    <UserLayout flush>
      <Hero />
      <TrustStrip />
      <Audiences />
      <BeforeAfter />
      <Features />
      <AvailabilityShowcase />
      <VerifiedAgency />
      <MobileApp />
      <Steps />
      <Pricing />
      <Faq />
      <FinalCta />
    </UserLayout>
  </MotionConfig>
);
