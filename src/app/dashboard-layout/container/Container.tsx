"use client";

import { Flex } from "@chakra-ui/react";
import { Suspense } from "react";
import { BaseContainer } from "_components/custom";
import { GlobalLoader } from "_components/custom/loader/Loader";
import { Session } from "next-auth";

export const Container = ({
  children,
  session,
}: {
  children: React.ReactNode;
  sidebarToggle: boolean;
  session: Session | null;
}) => {
  return (
    <Flex
      h="100%"
      width="100%"
      ps={{ base: 5, md: "20px" }}
      pe={{ base: 5, md: "33px" }}
      pb={{ base: "1rem", xl: "4rem" }}
    >
      <Suspense fallback={<GlobalLoader loader />}>
        <BaseContainer mt={"30px"} p={0} border={"none"} position={"relative"}>
          {children}
        </BaseContainer>
      </Suspense>
    </Flex>
  );
};
