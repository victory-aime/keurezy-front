'use client';

import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Container } from './container/Container';
import { useAuthContext } from '_context/auth-context';
import { Sidebar } from './sidebar/Sidebar';
import { Footer } from './footer/Footer';
import { SidebarInset } from './sidebar/components/SidebarInset';
import { Header } from './header/Header';
import { GuidedTour } from './guide-tour/GuidedTour';
import { useBreakpointValue } from '@chakra-ui/react';
import { tourSteps } from '_constants/tourStep';
import { StorageKey } from '_constants/StorageKeys';
import { EmailNotVerifiedBanner } from './email-banner/EmailNotVerified';
import { BaseModal, BaseText, Icons } from '_components/custom';
import { EmailVerifiedSuccessBanner } from './email-banner/EmailVerifiedSuccessBanner';
import { AuthModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import { useAuth } from '_hooks/useAuth';
import { ENUM } from '_types/*';

export const Layout: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { logout } = useAuth();
  const { isLoading, user } = useAuthContext();
  const { user: currentUser, isLoading: currentUserLoad } = useUserContext();
  const [showTour, setShowTour] = useState(false);
  const [showVerifiedBanner, setShowVerifiedBanner] = useState(false);
  const isInactiveUser = !currentUserLoad && currentUser?.status === ENUM.COMMON.Status.INACTIVE;
  const isShowEmailNotVerifiedBanner = !currentUserLoad && !currentUser?.emailVerified;
  const emailVerifiedStorageKey = user?.id
    ? `${StorageKey.DASHBOARD_OWNER_EMAIL_VERIFIED}_${user.id.slice(0, 8)}`
    : null;

  const prevVerified = useRef<boolean | undefined>(user?.emailVerified);

  const { mutateAsync: sendVerificationEmail, isPending } =
    AuthModule.sendEmailVerificationMutation({});

  // 🔹 Detect email verification change
  useEffect(() => {
    if (!user?.id || !emailVerifiedStorageKey) return;
    const alreadyShown = localStorage.getItem(emailVerifiedStorageKey);

    if (prevVerified.current === false && user.emailVerified && !alreadyShown) {
      setShowVerifiedBanner(true);
      localStorage.setItem(emailVerifiedStorageKey, 'true');
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

    if (enabled === 'true') {
      const timer = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const resendEmailLink = async () => {
    if (!user?.email) return;

    await sendVerificationEmail({
      payload: {
        email: user.email,
      },
    });
  };

  if (currentUserLoad) return null;

  return (
    <>
      {isInactiveUser ? (
        <BaseModal
          isOpen={isInactiveUser}
          icon={<Icons.Warn />}
          modalType={'alertdialog'}
          title={'Compte desactiver'}
          onClick={() => logout()}
          isLoading={isLoading}
          size={'sm'}
          showCloseButton={false}
          buttonCancelTitle=""
          buttonSaveTitle={'COMMON.LOGOUT'}
        >
          <BaseText color="gray.600">
            Votre compte est désactivé. Veuillez contacter votre administrateur pour réactiver votre
            accès.
          </BaseText>
        </BaseModal>
      ) : (
        <main>
          {showTour && <GuidedTour onComplete={() => setShowTour(false)} tourStep={tourSteps} />}
          <Sidebar
            onShowSidebar={() => setSidebarOpen((prev) => !prev)}
            isLoading={isLoading}
            sideToggled={isSidebarOpen}
          />

          <SidebarInset variant="inset" collapsed={!isSidebarOpen} data-tour="finish">
            {isShowEmailNotVerifiedBanner && (
              <EmailNotVerifiedBanner onResend={resendEmailLink} isLoading={isPending} />
            )}

            {showVerifiedBanner && <EmailVerifiedSuccessBanner />}

            <Header
              sideToggled={isSidebarOpen}
              onShowSidebar={() => setSidebarOpen((prev) => !prev)}
            />
            <Container isLoading={isLoading}>{children}</Container>
            <Footer />
          </SidebarInset>
        </main>
      )}
    </>
  );
};
