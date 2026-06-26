'use client';

import React, { createContext, useCallback, useContext } from 'react';
import { clearPushStorage, setAppNotifPreference } from '../helpers/push-notif';
import { usePushNotifications } from '_hooks/usePushNotifications';
import { useUserContext } from '_context/user-context';
import { NotificationsModule } from '_store/state-management';
import { StorageKey } from '_constants/StorageKeys';

type PushNotificationsContextType = {
  enableNotifications: () => Promise<void>;
  disableNotifications: () => Promise<void>;
  isPending?: boolean;
};

const PushNotificationsContext = createContext<PushNotificationsContextType | null>(null);

export function PushNotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUserContext();

  const { mutateAsync: registerPushToken, isPending: enabledPending } =
    NotificationsModule.registerFcmTokenMutation({
      mutationOptions: {
        onSuccess: async () => {
          localStorage.removeItem(StorageKey.PUSH_NOTIFICATION_BANNER_DISMISS_DATE);
        },
      },
    });
  const { mutateAsync: removeFcmToken, isPending: disablePending } =
    NotificationsModule.removeFcmTokenMutation({
      mutationOptions: {
        onSuccess: async () => {
          setAppNotifPreference('disabled');
          clearPushStorage();
        },
      },
    });

  const handleTokenReady = useCallback(
    async (fcmToken: string, deviceKey: string) => {
      if (!user?.id) return;

      await registerPushToken({
        payload: { token: fcmToken, deviceKey },
        params: { userId: user.id },
      });
    },
    [user?.id, registerPushToken],
  );

  const { enableNotifications } = usePushNotifications({
    userId: user?.id,
    onTokenReady: handleTokenReady,
  });

  const disableNotifications = useCallback(async () => {
    const storedToken = localStorage.getItem(StorageKey.FCM_TOKEN_STORAGE_KEY);
    if (storedToken) {
      await removeFcmToken({ params: { token: storedToken } });
    }
  }, [removeFcmToken]);

  return (
    <PushNotificationsContext.Provider
      value={{
        enableNotifications,
        disableNotifications,
        isPending: enabledPending || disablePending,
      }}
    >
      {children}
    </PushNotificationsContext.Provider>
  );
}

export function usePushNotificationsContext() {
  const context = useContext(PushNotificationsContext);

  if (!context) {
    throw new Error('usePushNotificationsContext must be used within PushNotificationsProvider');
  }

  return context;
}
