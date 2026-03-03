"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { Container } from "./container/Container";
import { useAuthContext } from "_context/auth-context";
import { SidebarV2 } from "./sidebar/SidebarV2";
import { FooterV2 } from "./footer/FooterV2";
import { SidebarInset } from "./sidebar/components/SidebarInset";
import { HeaderV2 } from "./header/HeaderV2";
import { InitializeApp } from "_context/provider/initialize-app";
import { GuidedTour } from "./guide-tour/GuidedTour";
import { useBreakpointValue } from "@chakra-ui/react";
import { tourSteps } from "_constants/tourStep";
import { StorageKey } from "_constants/StorageKeys";

export const Layout: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { session, user, isLoading } = useAuthContext();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (isMobile) return; // 🚫 Stop complètement en mobile
    const shouldShow = localStorage.getItem(StorageKey.ENABLED_GUIDED_TOUR);

    if (shouldShow === "true") {
      const timer = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  return (
    <InitializeApp isLoading={isLoading}>
      {showTour && (
        <GuidedTour
          onComplete={() => setShowTour(false)}
          tourStep={tourSteps}
        />
      )}
      <SidebarV2
        data={{ user }}
        onShowSidebar={() => setSidebarOpen(!isSidebarOpen)}
        sideToggled={isSidebarOpen}
      />
      <SidebarInset variant="inset" collapsed={!isSidebarOpen}>
        <HeaderV2
          sideToggled={isSidebarOpen}
          onShowSidebar={() => setSidebarOpen(!isSidebarOpen)}
          data={{ session }}
        />
        <Container sidebarToggle={isSidebarOpen}>{children}</Container>
        <FooterV2 />
      </SidebarInset>
    </InitializeApp>
  );
};
