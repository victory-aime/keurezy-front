"use client";

import { Flex } from "@chakra-ui/react";
import { Suspense } from "react";
import {
  BaseContainer,
  FloatSwitchColorMode,
  SwitchColorMode,
} from "_components/custom";
import { GlobalLoader } from "_components/custom/loader/Loader";

export const Container = ({
  children,
  sidebarToggle,
}: {
  children: React.ReactNode;
  sidebarToggle: boolean;
}) => {
  return (
    <Flex flex={1} p={{ base: 4, sm: 6 }} h="100%" width="100%">
      <Suspense fallback={<GlobalLoader loader />}>
        <BaseContainer mt={"60px"} p={0} border={"none"} position={"relative"}>
          {children}
        </BaseContainer>
        <FloatSwitchColorMode />
      </Suspense>
    </Flex>
  );
};
