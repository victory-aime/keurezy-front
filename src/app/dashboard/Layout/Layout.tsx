"use client";

import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Container } from "./container/Container";
import { useAuthContext } from "_context/auth-context";
import { Sidebar } from "./sidebar/Sidebar";
import { FooterV2 } from "./footer/FooterV2";
import { SidebarInset } from "./sidebar/components/SidebarInset";
import { Header } from "./header/Header";
import { InitializeApp } from "_context/provider/initialize-app";
import { GuidedTour } from "./guide-tour/GuidedTour";
import { useBreakpointValue } from "@chakra-ui/react";
import { tourSteps } from "_constants/tourStep";
import { StorageKey } from "_constants/StorageKeys";
import { EmailNotVerifiedBanner } from "./email-banner/EmailNotVerified";
import { authClient } from "../../lib/auth-client";
import { DASHBOARD_ROUTES } from "../routes";
import { BaseToast, ToastStatus } from "_components/custom";
import { resolveState } from "../../auth/resolve-state";
import { useSearchParams } from "next/navigation";

export const Layout: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const searchParams = useSearchParams();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { session, user, isLoading, refetchSession } = useAuthContext();
  const [showTour, setShowTour] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const prevVerified = useRef<boolean | undefined>(user?.emailVerified);

  const resendEmailLink = async () => {
    if (!user?.email) return;

    try {
      setIsResending(true);

      const { data, error } = await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: DASHBOARD_ROUTES.HOME,
      });

      if (data?.status) {
        BaseToast({
          title: "Email envoyé",
          description:
            "Un nouveau lien de vérification vient d’être envoyé à votre adresse email.",
        });
      }

      if (error) {
        BaseToast({
          title: "Erreur",
          description:
            "Impossible d’envoyer le lien de vérification. Veuillez réessayer.",
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (isMobile) return;
    const shouldShow = localStorage.getItem(StorageKey.ENABLED_GUIDED_TOUR);

    if (shouldShow === "true") {
      const timer = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  useEffect(() => {
    const mapped = resolveState(searchParams);
    const alreadyShown = sessionStorage.getItem(
      StorageKey.DASHBOARD_OWNER_EMAIL_VERIFIED,
    );

    /**
     * SUCCESS
     * emailVerified vient de passer de false -> true
     */
    if (!prevVerified.current && user?.emailVerified && !alreadyShown) {
      BaseToast({
        title: "Email vérifié",
        description:
          "Votre adresse email a été confirmée. Toutes les fonctionnalités sont maintenant disponibles.",
      });
      refetchSession?.();
      sessionStorage.setItem(StorageKey.DASHBOARD_OWNER_EMAIL_VERIFIED, "true");
    }

    /**
     * TOKEN EXPIRED
     */
    if (mapped === "token_expired") {
      BaseToast({
        title: "Lien expiré",
        description:
          "Ce lien de vérification a expiré. Vous pouvez en demander un nouveau.",
        type: ToastStatus.WARNING,
      });
    }
    if (mapped === "invalid_token") {
      BaseToast({
        title: "Lien invalide",
        description:
          "Ce lien de vérification est invalide. Vous pouvez en demander un nouveau.",
        type: ToastStatus.INFO,
      });
    }
    prevVerified.current = user?.emailVerified;
  }, [user?.emailVerified, searchParams]);

  return (
    <InitializeApp isLoading={isLoading}>
      {showTour && (
        <GuidedTour
          onComplete={() => setShowTour(false)}
          tourStep={tourSteps}
        />
      )}
      <Sidebar
        data={{ user }}
        onShowSidebar={() => setSidebarOpen(!isSidebarOpen)}
        sideToggled={isSidebarOpen}
      />
      <SidebarInset variant="inset" collapsed={!isSidebarOpen}>
        {!user?.emailVerified && (
          <EmailNotVerifiedBanner
            onResend={resendEmailLink}
            isLoading={isResending}
          />
        )}
        <Header
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
