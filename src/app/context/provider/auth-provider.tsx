"use client";

import { useSession } from "next-auth/react";
import { useSessionRefresh } from "_hooks/useSessionRefresh";
import { useSyncTokensWithContext } from "_hooks/useSyncSession";
import React, { useState, useEffect } from "react";
import { Loader } from "_components/custom";
import { Center } from "@chakra-ui/react";
import { SessionErrorModal } from "../../auth/components/ErrorModal";

export const AppAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  useSessionRefresh();
  useSyncTokensWithContext();

  useEffect(() => {
    if (session?.access_token && session?.refresh_token && !session?.error) {
      setIsInitialized(true);
      setOpenErrorModal(false);
    } else if (session?.error === "RefreshAccessTokenError") {
      setIsInitialized(false);
      setOpenErrorModal(true);
    } else {
      setIsInitialized(false);
    }
  }, [session]);

  if (openErrorModal) {
    return <SessionErrorModal />;
  }

  if (!isInitialized) {
    return (
      <Center h={"100vh"}>
        <Loader loader showText />
      </Center>
    );
  }

  return <>{children}</>;
};
