"use client";

import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { BaseButton, BaseText, Icons } from "_components/custom";
import { MobileSidebar } from "./components/MobileSidebar";
import { ASSETS } from "_assets/images";
import Image from "next/image";
import { SideBarProps } from "./types";
import { UserModule } from "_store/state-management";
import { ALL_CSA_ROUTES, MENU_BY_ROLE } from "./routes/routes";
import { RenderGroupedLinks } from "./components/RenderGroupedLinks";
import { useAuth } from "_hooks/useAuth";
import { APP_ROUTES } from "_config/routes";
import { SideToolTip } from "./components/SideToolTip";
import { useSessionRefreshContext } from "_context/SessionRefresh-context";

export const SidebarV2 = ({
  data,
  onShowSidebar,
  sideToggled,
}: SideBarProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { logout, isLoading } = useAuth();
  const { dismissToast } = useSessionRefreshContext();
  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });
  const sidebarLinks =
    (data?.user?.role ?? user?.role)
      ? MENU_BY_ROLE[data?.user?.role! ?? user?.role] || []
      : ALL_CSA_ROUTES;

  return (
    <Box>
      {isMobile ? (
        <MobileSidebar
          isOpen={sideToggled}
          onClose={onShowSidebar}
          links={sidebarLinks}
          handleLogout={() => {
            dismissToast?.();
            logout(APP_ROUTES.AUTH.SIGN_IN);
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
                  logout(APP_ROUTES.AUTH.SIGN_IN);
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
