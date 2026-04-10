"use client";

import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Container } from "./container/Container";
import { useAuthContext } from "_context/auth-context";
import { Sidebar } from "./sidebar/Sidebar";
import { Footer } from "./footer/Footer";
import { SidebarInset } from "./sidebar/components/SidebarInset";
import { Header } from "./header/Header";
import { GuidedTour } from "./guide-tour/GuidedTour";
import { useBreakpointValue } from "@chakra-ui/react";
import { tourSteps } from "_constants/tourStep";
import { StorageKey } from "_constants/StorageKeys";
import { EmailNotVerifiedBanner } from "./email-banner/EmailNotVerified";
import { authClient } from "../../lib/auth-client";
import { BaseToast, ToastStatus } from "_components/custom";
import { resolveState } from "../../auth/resolve-state";
import { useSearchParams } from "next/navigation";
import { EmailVerifiedSuccessBanner } from "./email-banner/EmailVerifiedSuccessBanner";
import { handleApiError } from "_utils/handleApiError";
import { AuthModule } from "_store/state-management";

export const Layout: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const token = useSearchParams().get("token");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isLoading, user } = useAuthContext();

  const [showTour, setShowTour] = useState(false);
  const [showVerifiedBanner, setShowVerifiedBanner] = useState(false);

  const prevVerified = useRef<boolean | undefined>(user?.emailVerified);

  const { mutateAsync: sendVerificationEmail, isPending } =
    AuthModule.sendEmailVerificationMutation({});

  // 🔹 Verify email via token
  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      const { data, error } = await authClient.verifyEmail({
        query: { token },
      });

      if (error) {
        handleApiError({ status: error.status, message: error.message! });
        return;
      }

      if (data?.status) {
        setShowVerifiedBanner(true);
      }
    };

    verify();
  }, [token]);

  // 🔹 Handle token state (expired / invalid)
  useEffect(() => {
    if (!token) return;

    const state = resolveState(token);

    if (state === "token_expired") {
      BaseToast({
        title: "Lien expiré",
        description: "Ce lien a expiré. Demandez-en un nouveau.",
        type: ToastStatus.WARNING,
      });
    }

    if (state === "invalid_token") {
      BaseToast({
        title: "Lien invalide",
        description: "Ce lien est invalide.",
        type: ToastStatus.INFO,
      });
    }
  }, [token]);

  // 🔹 Detect email verification change
  useEffect(() => {
    if (!user?.id) return;

    const storageKey = `${StorageKey.DASHBOARD_OWNER_EMAIL_VERIFIED}_${user.id.slice(0, 8)}`;
    const alreadyShown = localStorage.getItem(storageKey);

    if (prevVerified.current === false && user.emailVerified && !alreadyShown) {
      setShowVerifiedBanner(true);
      localStorage.setItem(storageKey, "true");
    }

    prevVerified.current = user.emailVerified;
  }, [user?.emailVerified]);

  // 🔹 Auto hide banner
  useEffect(() => {
    if (!showVerifiedBanner) return;

    const timer = setTimeout(() => {
      setShowVerifiedBanner(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showVerifiedBanner]);

  useEffect(() => {
    if (isMobile) return;

    const enabled = localStorage.getItem(StorageKey.ENABLED_GUIDED_TOUR);

    if (enabled === "true") {
      const timer = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const resendEmailLink = async () => {
    if (!user?.email) return;

    await sendVerificationEmail({
      payload: {
        email: user.email,
        callbackURL: process.env.NEXT_PUBLIC_DASHBOARD_URL!,
      },
    });
  };

  return (
    <>
      {showTour && (
        <GuidedTour
          onComplete={() => setShowTour(false)}
          tourStep={tourSteps}
        />
      )}

      <Sidebar
        onShowSidebar={() => setSidebarOpen((prev) => !prev)}
        isLoading={isLoading}
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
            isLoading={isPending}
          />
        )}

        {showVerifiedBanner && <EmailVerifiedSuccessBanner />}

        <Header
          sideToggled={isSidebarOpen}
          onShowSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <Container isLoading={isLoading}>{children}</Container>
        <Footer />
      </SidebarInset>
    </>
  );
};
