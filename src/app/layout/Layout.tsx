"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { InitializeApp } from "_context/provider/initialize-app";
import { useAuthContext } from "_context/auth-context";
import { Navbar } from "_component/NavBar";
import { HeroSection } from "_component/HeroSection";
import { FeaturesSection } from "_component/FeatureSection";
import { HowItWorksSection } from "_component/HowItWork";

export const UserLayout = () => {
  const { isLoading } = useAuthContext();

  return (
    <InitializeApp isLoading={isLoading}>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      {/* <Header />
      <Footer /> */}
    </InitializeApp>
  );
};
