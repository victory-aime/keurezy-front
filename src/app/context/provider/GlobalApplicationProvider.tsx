'use client';
import React, { ReactNode, useEffect } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { applicationContext } from '_context/global-state';
import { AppContext } from '_context/app.context';
import { queryClient } from '../../lib/query-client';
import { registerServiceWorker } from '../../lib/register-sw';

export default function GlobalApplicationProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
    console.log('service registry');
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
      <AppContext.Provider value={applicationContext}>{children}</AppContext.Provider>
    </QueryClientProvider>
  );
}
