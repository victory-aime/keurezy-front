import { Serwist, CacheFirst, ExpirationPlugin } from 'serwist';

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: any;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,

  // Les réponses /api/ (données authentifiées) ne sont jamais mises en cache :
  // elles pourraient être servies à un autre utilisateur du même navigateur.
  runtimeCaching: [
    {
      matcher: ({ request }) => request.destination === 'image',
      handler: new CacheFirst({
        cacheName: 'image-cache',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 7,
          }),
        ],
      }),
    },
  ],
});

serwist.addEventListeners();
