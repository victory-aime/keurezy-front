"use client";

import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { BaseButton, BaseText, Icons } from "_components/custom";
import { MobileSidebar } from "./components/MobileSidebar";
import { ASSETS } from "_assets/images";
import Image from "next/image";
import { SideBarProps } from "./types";
import {
  PropertyModule,
  BuildingModule,
  LandModule,
} from "_store/state-management";
import { ALL_CSA_ROUTES } from "./routes/routes";
import { RenderGroupedLinks } from "./components/RenderGroupedLinks";
import { useAuth } from "_hooks/useAuth";
import { SideToolTip } from "./components/SideToolTip";
import { useSessionRefreshContext } from "_context/SessionRefresh-context";
import { useMemo } from "react";
import { DASHBOARD_ROUTES } from "../../routes";
import { useColorMode } from "_components/ui/color-mode";
import { useUserContext } from "_context/user-context";

export const Sidebar = ({
  onShowSidebar,
  sideToggled,
  isLoading,
}: SideBarProps & { isLoading?: boolean }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { logout } = useAuth();
  const { dismissToast } = useSessionRefreshContext();
  const { colorMode } = useColorMode();
  const { user } = useUserContext();
  const agencyId = user?.owner?.agency?.id;
  const ownerId = user?.owner?.id;

  const { data: propertyList } = PropertyModule.getAllPropertiesByAgency({
    params: { agencyId, ownerId },
    queryOptions: { enabled: !!agencyId && !!ownerId },
  });

  const { data: buildingList } = BuildingModule.getAllBuildingByAgencyQueries({
    params: {
      agencyId,
      ownerId,
    },
    queryOptions: {
      enabled: !!agencyId && !!ownerId,
    },
  });

  const { data: allLandsList } = LandModule.getAllLandsByAgencyQueries({
    params: {
      agencyId,
      ownerId,
    },
    queryOptions: {
      enabled: !!agencyId && !!ownerId,
    },
  });

  const badgesByPath = useMemo(() => {
    return {
      [DASHBOARD_ROUTES.LAND.LIST]: allLandsList?.totalItems,
      [DASHBOARD_ROUTES.BUILDING.LIST]: buildingList?.totalItems,
      [DASHBOARD_ROUTES.PROPERTIES.LIST]: propertyList?.totalItems,
    };
  }, [
    propertyList?.totalItems,
    buildingList?.totalItems,
    allLandsList?.totalItems,
  ]);

  const sidebarLinks = useMemo(() => {
    return ALL_CSA_ROUTES.map((group) => ({
      ...group,
      links: group.links.map((link) => {
        const badgeValue = badgesByPath[link.path as string];
        return {
          ...link,
          badge:
            typeof badgeValue === "number" && badgeValue > 0
              ? badgeValue
              : undefined,
        };
      }),
    }));
  }, [badgesByPath]);

  return (
    <Box>
      {isMobile ? (
        <MobileSidebar
          isOpen={!sideToggled}
          onClose={onShowSidebar}
          links={sidebarLinks}
          handleLogout={() => {
            dismissToast?.();
            logout();
          }}
        />
      ) : (
        <Box
          w={!sideToggled ? "80px" : "230px"}
          h="100vh"
          position="fixed"
          transition="width 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)"
          overflow="hidden"
          boxShadow="lg"
          borderRight="1px solid"
          borderColor={colorMode === "light" ? "gray.200" : "gray.900"}
          display="flex"
          flexDirection="column"
          zIndex="10"
          data-tour="sidebar"
        >
          <Flex
            align="center"
            justifyContent={!sideToggled ? "center" : "flex-start"}
            gap={3}
            px={3}
            py={2}
            borderBottom="1px solid"
            borderColor={colorMode === "light" ? "gray.200" : "gray.900"}
          >
            <Image
              src={colorMode === "light" ? ASSETS.LOGO : ASSETS.LOGO_DARK}
              alt="logo"
              width={45}
              height={45}
            />
            {sideToggled && (
              <BaseText fontSize="sm" fontWeight="medium">
                MyImmo
              </BaseText>
            )}
          </Flex>

          {/* LINKS */}

          <RenderGroupedLinks
            isCollapsed={sideToggled}
            links={sidebarLinks}
            isLoading={isLoading}
          />

          <SideToolTip disabled={sideToggled} label={"Déconnexion"}>
            <Box
              p={3}
              borderTop="1px solid"
              borderColor={colorMode === "light" ? "gray.200" : "gray.900"}
            >
              <BaseButton
                width={"full"}
                colorType={"danger"}
                leftIcon={<Icons.Logout />}
                onClick={() => {
                  dismissToast?.();
                  logout();
                }}
              >
                {sideToggled ? "Déconnexion" : null}
              </BaseButton>
            </Box>
          </SideToolTip>
        </Box>
      )}
    </Box>
  );
};
