import React from "react";
import { VStack } from "@chakra-ui/react";
import { IMobileSidebar } from "../types";
import { RenderLinks } from "./RenderLinks";
import { BaseDrawer } from "_components/custom/drawer/BaseDrawer";

export const MobileSidebar = ({ isOpen, onClose, links }: IMobileSidebar) => {
  return (
    <BaseDrawer
      title={"Menu"}
      isOpen={isOpen}
      onChange={onClose}
      size={"xs"}
      placement={"start"}
      ignoreFooter
      drawerContentColor={"primary.800"}
    >
      <VStack
        alignItems={"flex-start"}
        width={"full"}
        align="stretch"
        height="80%"
        overflow="auto"
      >
        <RenderLinks
          links={links}
          sideToggled={isOpen}
          onShowSidebar={onClose}
        />
      </VStack>
    </BaseDrawer>
  );
};
