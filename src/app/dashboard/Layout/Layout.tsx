"use client";

import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Container } from "./container/Container";
import { useAuthContext } from "_context/auth-context";
import { Sidebar } from "./sidebar/Sidebar";
import { Footer } from "./footer/Footer";
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
import { EmailVerifiedSuccessBanner } from "./email-banner/EmailVerifiedSuccessBanner";

export const Layout: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const searchParams = useSearchParams()?.get("error");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { session, user, isLoading, refetchSession } = useAuthContext();
  const [showTour, setShowTour] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const prevVerified = useRef<boolean | undefined>(user?.emailVerified);
  const [showVerifiedBanner, setShowVerifiedBanner] = useState(false);

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
    if (user?.id) return;
    const storageKey = `${StorageKey.DASHBOARD_OWNER_EMAIL_VERIFIED}_${user?.id?.slice(0.8)}`;

    const mapped = resolveState(searchParams!);
    const alreadyShown = localStorage.getItem(storageKey);

    /**
     * SUCCESS
     * emailVerified vient de passer de false -> true
     */
    if (prevVerified.current && user?.emailVerified && !alreadyShown) {
      setShowVerifiedBanner(true);
      localStorage.setItem(storageKey, "true");
      refetchSession?.();
    }

    console.log(
      "verif",
      prevVerified.current && user?.emailVerified && !alreadyShown,
    );

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

  useEffect(() => {
    if (!showVerifiedBanner) return;

    const timer = setTimeout(() => {
      setShowVerifiedBanner(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showVerifiedBanner]);

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
      <SidebarInset
        variant="inset"
        collapsed={!isSidebarOpen}
        data-tour="finish"
      >
        {!user?.emailVerified && (
          <EmailNotVerifiedBanner
            onResend={resendEmailLink}
            isLoading={isResending}
          />
        )}
        {showVerifiedBanner && <EmailVerifiedSuccessBanner />}

        <Header
          sideToggled={isSidebarOpen}
          onShowSidebar={() => setSidebarOpen(!isSidebarOpen)}
          data={{ session }}
        />
        <Container sidebarToggle={isSidebarOpen}>{children}</Container>
        <Footer />
      </SidebarInset>
    </InitializeApp>
  );
};
