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
import { EmailNotVerifiedBanner } from './banner/EmailNotVerified';
import { BaseModal, BaseText, BaseToast, Icons, ToastStatus } from '_components/custom';
import { EmailVerifiedSuccessBanner } from './banner/EmailVerifiedSuccessBanner';
import { AuthModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import { useAuth } from '_hooks/useAuth';
import { ENUM } from '_types/*';
import { usePushNotificationsContext } from '../../provider/push-notifications';
import { RequestUserPushNotifPermission } from './banner/request-notif-perm';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../routes';
import {
  getAppNotifPreference,
  isPushEnabled,
  shouldShowPushBanner,
} from '../../helpers/push-notif';

export const Layout: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { logout } = useAuth();
  const { isLoading, user } = useAuthContext();
  const { user: currentUser, isLoading: currentUserLoad } = useUserContext();
  const [showTour, setShowTour] = useState(false);
  const [showVerifiedBanner, setShowVerifiedBanner] = useState(false);
  const [showPermissionLoad, setPermissionLoad] = useState(false);
  const [showEnabledPushNotification, setShowEnabledPushNotification] = useState(() => {
    return shouldShowPushBanner();
  });
  const isInactiveUser = !currentUserLoad && currentUser?.status === ENUM.COMMON.Status.INACTIVE;
  const { enableNotifications } = usePushNotificationsContext();
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

  useEffect(() => {
    if (!user?.id) return;

    if (Notification.permission === 'denied') {
      setShowEnabledPushNotification(false);
      BaseToast({
        title: 'Notifications bloquées',
        description:
          'Autorisez les notifications dans les paramètres de votre navigateur pour les réactiver.',
        type: ToastStatus.WARNING,
      });
      return;
    }

    if (isPushEnabled()) {
      setShowEnabledPushNotification(false);
      return;
    }

    if (getAppNotifPreference() === 'disabled') {
      localStorage.removeItem(StorageKey.PUSH_NOTIFICATION_BANNER_DISMISS_DATE);
      setShowEnabledPushNotification(true);
      return;
    }

    setShowEnabledPushNotification(shouldShowPushBanner());
  }, [user?.id]);

  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Received message', event);
    if (event.data?.type === 'NOTIFICATION_CLICK') {
      switch (event.data.notificationType as ENUM.NotificationType) {
        case 'LEAD':
          router.push(`${DASHBOARD_ROUTES.CHAT}?=${event.data.conversationId}`);
          break;
        case 'SYSTEM':
          router.push(DASHBOARD_ROUTES.NOTIFICATION);
          break;
        case 'VISIT':
          router.push(DASHBOARD_ROUTES.VISITS);
          break;
      }
    }
  });

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

            {showEnabledPushNotification && (
              <RequestUserPushNotifPermission
                enablePermission={() => {
                  setPermissionLoad(true);
                  enableNotifications().then(() => {
                    setShowEnabledPushNotification(false);
                    localStorage.removeItem(StorageKey.PUSH_NOTIFICATION_BANNER_DISMISS_DATE);
                  });
                }}
                dismiss={() => {
                  localStorage.setItem(
                    StorageKey.PUSH_NOTIFICATION_BANNER_DISMISS_DATE,
                    String(Date.now()),
                  );
                  setShowEnabledPushNotification(false);
                }}
                isLoading={showPermissionLoad}
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
        </main>
      )}
    </>
  );
};
