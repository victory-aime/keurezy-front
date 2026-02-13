"use client";
import React, { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { QUERIES } from "rise-core-frontend";
import { applicationContext } from "_context/global-state";
import { AppContext } from "_context/app.context";

export default function GlobalApplicationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = QUERIES.createQueryClient({
    defaultOptions: {
      queries: {
        retryDelay: 2000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition={"bottom-right"}
      />
      <AppContext.Provider value={applicationContext}>
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
