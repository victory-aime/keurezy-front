"use client";
import React, { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { QUERIES } from "rise-core-frontend";
import { applicationContext } from "_context/global-state";
import { AppContext } from "_context/app.context";
import { SessionProvider } from "next-auth/react";

export default function GlobalApplicationProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  return (
    <QueryClientProvider client={QUERIES.queryClient}>
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition={"bottom-right"}
      />
      <AppContext.Provider value={applicationContext}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
