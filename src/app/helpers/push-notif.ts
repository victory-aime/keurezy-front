import { StorageKey } from '_constants/StorageKeys';
import { Messaging, onRegistered, register } from 'firebase/messaging';

type AppNotifPreference = 'granted' | 'disabled';

function getAppNotifPreference(): AppNotifPreference {
  return (
    (localStorage.getItem(StorageKey.PUSH_NOTIFICATION_APP_PREFERENCE) as AppNotifPreference) ??
    'disabled'
  );
}

function setAppNotifPreference(value: AppNotifPreference): void {
  localStorage.setItem(StorageKey.PUSH_NOTIFICATION_APP_PREFERENCE, value);
}

/** Notifs actives = permission navigateur granted ET préférence app granted */
function isPushEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
    Notification.permission === 'granted' &&
    getAppNotifPreference() === 'granted'
  );
}

function isBrowserSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

/** Vide toutes les clés push du localStorage — à appeler au remote */
function clearPushStorage(): void {
  localStorage.removeItem(StorageKey.FCM_TOKEN_STORAGE_KEY);
  localStorage.removeItem(StorageKey.DEVICE_STORAGE_KEY);
}

async function resolveFcmToken(messaging: Messaging): Promise<string | null> {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.warn('[Push] NEXT_PUBLIC_FIREBASE_VAPID_KEY manquant');
    return null;
  }
  return new Promise((resolve, reject) => {
    onRegistered(messaging, (token) => {
      resolve(token ?? null);
    });

    register(messaging, { vapidKey }).catch((error) => {
      console.error('[Push] Erreur register FCM:', error);
      reject(error);
    });
  });
}

const shouldShowPushBanner = () => {
  if (typeof window === 'undefined') return false;
  if (Notification.permission === 'granted') return false;
  if (Notification.permission === 'denied') return false;

  const lastDismiss = localStorage.getItem(StorageKey.PUSH_NOTIFICATION_BANNER_DISMISS_DATE);
  if (!lastDismiss) return true;

  const diff = Date.now() - Number(lastDismiss);
  const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;

  return diff > COOLDOWN_MS;
};

export {
  type AppNotifPreference,
  getAppNotifPreference,
  isPushEnabled,
  register,
  resolveFcmToken,
  clearPushStorage,
  shouldShowPushBanner,
  isBrowserSupported,
  setAppNotifPreference,
};
