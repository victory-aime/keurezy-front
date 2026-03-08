"use client";

import { Flex } from "@chakra-ui/react";
import { Suspense } from "react";
import { BaseContainer, FloatSwitchColorMode } from "_components/custom";
import { GlobalLoader } from "_components/custom/loader/Loader";

export const Container = ({
  children,
  sidebarToggle,
}: {
  children: React.ReactNode;
  sidebarToggle: boolean;
}) => {
  return (
    <Flex flex={1} h="100%" width="100%">
      <Suspense fallback={<GlobalLoader loader />}>
        <BaseContainer
          mt={{ base: "0", sm: "20px" }}
          p={{ base: 2, sm: 4 }}
          border={"none"}
          position={"relative"}
        >
          {children}
        </BaseContainer>
        <FloatSwitchColorMode />
      </Suspense>
    </Flex>
  );
};
