"use client";

import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { BaseButton, BaseText, Icons } from "_components/custom";
import { MobileSidebar } from "./components/MobileSidebar";
import { ASSETS } from "_assets/images";
import Image from "next/image";
import { SideBarProps } from "./types";
import {
  UserModule,
  ContactModule,
  PropertyModule,
  RentalModule,
  RentalAgreementModule,
  NotificationsModule,
} from "_store/state-management";
import { ALL_CSA_ROUTES, MENU_BY_ROLE } from "./routes/routes";
import { RenderGroupedLinks } from "./components/RenderGroupedLinks";
import { useAuth } from "_hooks/useAuth";
import { SideToolTip } from "./components/SideToolTip";
import { useSessionRefreshContext } from "_context/SessionRefresh-context";
import { useMemo } from "react";
import { DASHBOARD_ROUTES } from "../../routes";

export const Sidebar = ({ data, onShowSidebar, sideToggled }: SideBarProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { logout } = useAuth();
  const { dismissToast } = useSessionRefreshContext();
  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });
  const agencyId = user?.propertyOwner?.propertyAgency?.id;
  const { data: requestList } = ContactModule.agencyRequestListQueries({
    params: { agencyId: agencyId },
    queryOptions: { enabled: !!agencyId },
  });

  const { data: propertyList } = PropertyModule.getAllPropertiesByAgency({
    params: { agencyId: agencyId },
    queryOptions: { enabled: !!agencyId },
  });

  const { data: rentalRequestList } =
    RentalModule.rentalAgencyRequestListQueries({
      params: { agencyId: agencyId },
      queryOptions: { enabled: !!agencyId },
    });

  const { data: rentalAgreementList } =
    RentalAgreementModule.getRentalAgreementListByAgencyQueries({
      params: {
        agencyId: agencyId,
      },
      queryOptions: {
        enabled: !!agencyId,
      },
    });

  const { data: notificationsList } =
    NotificationsModule.getAllNotificationsQueries({
      params: { recipientId: user?.id },
      queryOptions: { enabled: !!user?.id },
    });

  const badgesByPath = useMemo(() => {
    return {
      [DASHBOARD_ROUTES.REQUEST]: requestList?.length,
      [DASHBOARD_ROUTES.APPART.LIST]: propertyList?.length,
      [DASHBOARD_ROUTES.RENTAL_REQUEST]: rentalRequestList?.length,
      [DASHBOARD_ROUTES.TENANTS.LIST]: rentalAgreementList?.length,
      [DASHBOARD_ROUTES.NOTIFICATION]: notificationsList?.length,
    };
  }, [
    requestList?.length,
    propertyList?.length,
    rentalRequestList?.length,
    rentalAgreementList?.length,
    notificationsList?.length,
  ]);

  const sidebarLinks = useMemo(() => {
    const baseLinks =
      (data?.user?.role ?? user?.role)
        ? MENU_BY_ROLE[data?.user?.role! ?? user?.role] || []
        : ALL_CSA_ROUTES;

    return baseLinks.map((group) => ({
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
  }, [data?.user?.role, user?.role, badgesByPath]);

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
          borderColor="gray.200"
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
            borderColor="gray.200"
          >
            <Image src={ASSETS.LOGO} alt="logo" width={45} height={45} />
            {sideToggled && (
              <BaseText fontSize="sm" fontWeight="medium">
                MyImmo
              </BaseText>
            )}
          </Flex>

          {/* LINKS */}

          <RenderGroupedLinks isCollapsed={sideToggled} links={sidebarLinks} />
          <SideToolTip disabled={sideToggled} label={"Déconnexion"}>
            <Box p={3} borderTop="1px solid" borderColor="gray.200">
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
