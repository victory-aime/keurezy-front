"use client";

import { Box, Flex } from "@chakra-ui/react";
import { Suspense } from "react";
import { BaseContainer, BaseText, TextVariant } from "_components/custom";
import { GlobalLoader } from "_components/custom/loader/Loader";
import { FooterV2 } from "../footer/FooterV2";
import { LinkFooter } from "../footer";

export const Container = ({
  children,
  sidebarToggle,
}: {
  children: React.ReactNode;
  sidebarToggle: boolean;
}) => {
  return (
    <Flex
      flex={1}
      p={{ base: 4, sm: 6 }}
      h="100%"
      width="100%"
      //ps={{ base: 5, smTo2xl: "10px" }}
      //pe={{ base: 5, smTo2xl: "10px" }}
      //pb={{ base: "1rem", smTo2xl: "4rem" }}
    >
      <Suspense fallback={<GlobalLoader loader />}>
        <BaseContainer mt={"30px"} p={0} border={"none"} position={"relative"}>
          {children}
        </BaseContainer>
      </Suspense>
    </Flex>
  );
};
