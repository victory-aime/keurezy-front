"use client";

import React, { useState, useEffect } from "react";
import { Loader } from "_components/custom";
import { Center } from "@chakra-ui/react";

export const InitializeApp: React.FC<{
  children: React.ReactNode;
  session: any;
}> = ({ children, session }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (session?.session?.token) {
      setIsInitialized(true);
    } else {
      setIsInitialized(false);
    }
  }, [session?.session?.token]);

  if (!isInitialized) {
    return (
      <Center h={"100vh"}>
        <Loader loader showText />
      </Center>
    );
  }

  return <>{children}</>;
};
