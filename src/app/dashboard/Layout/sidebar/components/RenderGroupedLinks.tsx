import { VStack } from "@chakra-ui/react";
import { SidebarNavGroupProps } from "../types";
import { SidebarGroup } from "./SidebarGroup";

export const RenderGroupedLinks = ({
  links,
  isCollapsed = false,
  mobileCloseDrawer,
}: {
  links: SidebarNavGroupProps[];
  isCollapsed?: boolean;
  mobileCloseDrawer?: () => void;
}) => {
  return (
    <VStack
      align="stretch"
      flex="1"
      overflowY="auto"
      p={4}
      mt={2}
      gap={4}
      width={"full"}
    >
      {links?.map((link, i) => (
        <SidebarGroup
          key={i}
          title={link.title}
          icon={link.icon}
          links={link.links}
          isCollapsed={isCollapsed}
          mobileCloseDrawer={mobileCloseDrawer}
        />
      ))}
    </VStack>
  );
};
