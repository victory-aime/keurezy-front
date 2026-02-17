"use client";

import { HeroSection } from "_component/HeroSection";
import { FeaturesSection } from "_component/FeatureSection";
import { HowItWorksSection } from "_component/HowItWork";
import { PricingSection } from "_component/PrincingSection";
import { CTASection } from "_component/CTASection";
import { UserLayout } from "./layout/Layout";

export default function PublicPage() {
  return (
    <UserLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
    </UserLayout>
  );
}
