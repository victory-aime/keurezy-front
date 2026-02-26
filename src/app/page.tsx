"use client";

import { HeroSection } from "_component/HeroSection";
import { FeaturesSection } from "_component/FeatureSection";
import { HowItWorksSection } from "_component/HowItWork";
import { PricingSection } from "_component/PrincingSection";
import { CTASection } from "_component/CTASection";
import { UserLayout } from "./layout/Layout";
import { TenantSection } from "_component/TenantSection";
import { OwnerSection } from "_component/OwnerSection";
import { ValueProposition } from "_component/ValueProposition";

export default function PublicPage() {
  return (
    <UserLayout>
      <HeroSection />
      <FeaturesSection />
      <TenantSection />
      <OwnerSection />
      <ValueProposition />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
    </UserLayout>
  );
}
