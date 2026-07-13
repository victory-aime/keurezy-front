importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCZ1sIPqGMvSukLvSgFHoFHnn0FUOybWbI',
  authDomain: 'keurezy-fcm-instance.firebaseapp.com',
  projectId: 'keurezy-fcm-instance',
  storageBucket: 'keurezy-fcm-instance.firebasestorage.app',
  messagingSenderId: '139397785558',
  appId: '1:139397785558:web:760fe46bb8d91cac2de677',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background payload', payload);

  self.registration.showNotification(payload.data?.title ?? payload.data?.title ?? 'Notification', {
    body: payload.notification?.body ?? payload.data?.body,
    icon: '/assets/apple-touch-icon.png',
    data: {
      notificationId: payload.data?.notificationId,
      type: payload.data?.type,
    },
  });
});

self.addEventListener('notificationclick', (event) => {
  const { type, notificationId } = event?.notification?.data || {};
  let url = '/dashboard';

  switch (type) {
    case 'LEAD':
      url = `/dashboard/chat?=${notificationId}`;
      break;

    case 'SYSTEM':
      url = '/dashboard/notifications';
      break;

    case 'VISIT':
      url = '/dashboard/visits';
      break;

    default:
      url = '/dashboard';
  }

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(async (clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.focus();
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              notificationType: type,
              conversationId,
            });
            return;
          }
        }
        return clients.openWindow(url);
      }),
  );
});
