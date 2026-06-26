import { useEffect, useRef } from 'react';
import { onMessage } from 'firebase/messaging';
import { firebaseMessaging } from '../lib/firebase';
import { BaseToast } from '_components/custom';
import { StorageKey } from '_constants/StorageKeys';
import { getDeviceKey } from '_utils/get-deviceKey';
import {
  isPushEnabled,
  resolveFcmToken,
  isBrowserSupported,
  setAppNotifPreference,
} from '../helpers/push-notif';

interface UsePushNotificationsOptions {
  userId?: string;
  onTokenReady: (fcmToken: string, deviceKey: string) => Promise<void>;
}

export function usePushNotifications({ userId, onTokenReady }: UsePushNotificationsOptions) {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const enableNotifications = async () => {
    if (!userId) return;
    if (!isBrowserSupported()) return;
    if (!firebaseMessaging) return;

    let permission = Notification.permission;
    if (permission === 'denied') {
      console.info('[Push] Permission bloquée par le navigateur — rediriger vers les paramètres');
      return;
    }
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }
    if (permission !== 'granted') return;

    try {
      const [fcmToken, deviceKey] = await Promise.all([
        resolveFcmToken(firebaseMessaging!),
        getDeviceKey(),
      ]);

      if (!fcmToken || !deviceKey) return;

      await onTokenReady(fcmToken, deviceKey);
      localStorage.setItem(StorageKey.FCM_TOKEN_STORAGE_KEY, fcmToken);
      localStorage.setItem(StorageKey.DEVICE_STORAGE_KEY, deviceKey);
      setAppNotifPreference('granted');
    } catch (error) {
      console.error('[Push] Erreur initialisation:', error);
    }
  };

  useEffect(() => {
    const syncToken = async () => {
      if (!userId || !firebaseMessaging) return;

      if (!isPushEnabled()) return;

      const storedToken = localStorage.getItem(StorageKey.FCM_TOKEN_STORAGE_KEY);
      const storedDeviceKey = localStorage.getItem(StorageKey.DEVICE_STORAGE_KEY);

      if (!storedToken || !storedDeviceKey) return;

      try {
        const fcmToken = await resolveFcmToken(firebaseMessaging);
        if (!fcmToken) return;
        if (storedToken === fcmToken) return;

        await onTokenReady(fcmToken, storedDeviceKey);
        localStorage.setItem(StorageKey.FCM_TOKEN_STORAGE_KEY, fcmToken);
      } catch (e) {
        console.error('[Push] Erreur syncToken:', e);
      }
    };

    syncToken();
  }, [userId, onTokenReady]);

  useEffect(() => {
    if (!firebaseMessaging) return;
    if (!isPushEnabled()) return;

    unsubscribeRef.current?.();
    unsubscribeRef.current = onMessage(firebaseMessaging, (payload) => {
      BaseToast({
        title: payload.data?.title,
        description: payload.data?.body,
      });
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [userId]);

  return {
    enableNotifications,
  };
}
