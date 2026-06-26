'use client';
import React, { ReactNode, useEffect } from 'react';
import { QueryClientProvider } from 'rise-core-frontend';
import { applicationContext } from '_context/global-state';
import { AppContext } from '_context/app.context';
import { queryClient } from '../lib/query-client';
import { registerServiceWorker } from '../lib/register-sw';

export default function GlobalApplicationProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={applicationContext}>{children}</AppContext.Provider>
    </QueryClientProvider>
  );
}
