'use client';
import React, { ReactNode } from 'react';
import { QueryClientProvider } from 'rise-core-frontend';
import { applicationContext } from '_context/global-state';
import { AppContext } from '_context/app.context';
import { queryClient } from '../lib/query-client';

export default function GlobalApplicationProvider({ children }: { children: ReactNode }) {
  // Service worker PWA désactivé : @serwist/next ne génère pas /sw.js avec Turbopack (Next 16).
  // À réactiver (registerServiceWorker de ../lib/register-sw) lors de la migration PWA.
  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={applicationContext}>{children}</AppContext.Provider>
    </QueryClientProvider>
  );
}
