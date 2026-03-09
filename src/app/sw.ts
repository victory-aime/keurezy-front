/// <reference lib="webworker" />

import { Serwist, NetworkFirst, CacheFirst, ExpirationPlugin } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: any;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,

  runtimeCaching: [
    // Cache pour toutes les requêtes API proxyées
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/api/") || url.pathname.startsWith("/api/v1/"),
      handler: new NetworkFirst({
        cacheName: "api-cache",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 5, // 5 minutes
          }),
        ],
      }),
    },

    // Cache pour les images / avatars
    {
      matcher: ({ request }) => request.destination === "image",
      handler: new CacheFirst({
        cacheName: "image-cache",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 1 semaine
          }),
        ],
      }),
    },
  ],
});

serwist.addEventListeners();
