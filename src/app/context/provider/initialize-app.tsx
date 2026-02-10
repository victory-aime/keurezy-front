"use client";

import React from "react";
import { Loader } from "_components/custom";
import { Center } from "@chakra-ui/react";

export const InitializeApp: React.FC<{
  children: React.ReactNode;
  isLoading?: boolean;
}> = ({ children, isLoading }) => {
  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader loader showText />
      </Center>
    );
  }
  // ⚠️ Pas de loader si pas de session
  // on laisse le middleware / layout gérer la redirection
  return <>{children}</>;
};
