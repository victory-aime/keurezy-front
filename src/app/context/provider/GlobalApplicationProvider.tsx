"use client";
import React, { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { QUERIES } from "rise-core-frontend";
import { applicationContext } from "_context/global-state";
import { AppContext } from "_context/app.context";
import { queryClient } from "../../lib/query-client";

export default function GlobalApplicationProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      <AppContext.Provider value={applicationContext}>
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
