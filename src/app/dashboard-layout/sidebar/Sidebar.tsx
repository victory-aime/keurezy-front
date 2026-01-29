"use client";
import {
  Box,
  Circle,
  Float,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { MobileSidebar } from "./components/MobileSidebar";
import { RenderLinks } from "./components/RenderLinks";
import useSideBarStyle from "./hooks/useSidebarStyle";
import { MENU_BY_ROLE } from "./routes/routes";
import { SideBarProps } from "./types";
import Image from "next/image";
import { HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
import { BaseButton, BaseModal, BaseText } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { useAuth } from "_hooks/useAuth";
import { CiLogout, CiWarning } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import { RxHamburgerMenu } from "react-icons/rx";

export const Sidebar = ({
  sideToggled,
  onShowSidebar,
  session,
}: SideBarProps) => {
  const { t } = useTranslation();
  const { toggledSideBarStyle } = useSideBarStyle({
    sideToggled,
  });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sidebarLinks = MENU_BY_ROLE["USER"];
  const { logout, isLoading } = useAuth();

  // const permissionsLink = useCallback(() => {
  //   return (
  //     sidebarLinks?.filter((menu: ILink) => {
  //       if (session?.roles !== UserRole.ADMIN) {
  //         menu.subItems = menu.subItems?.filter((subItem) => {
  //           return (
  //             !subItem?.permissionSubLink ||
  //             hasFeatureAccess(menu.menuKey!, subItem?.permissionSubLink)
  //           );
  //         });
  //         return hasModulesAccess(menu.menuKey!) || !menu.menuKey;
  //       }
  //       return true;
  //     }) || []
  //   );
  // }, [sidebarLinks, session, hasFeatureAccess, hasModulesAccess]);

  useEffect(() => {
    if (sidebarLinks?.length === 0) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [sidebarLinks]);

  return (
    <>
      <BaseModal
        isOpen={isModalOpen}
        icon={<CiWarning />}
        modalType={"alertdialog"}
        title={"Aucun espace de travail associé"}
        onClick={() => logout()}
        isLoading={isLoading}
        showCloseButton={false}
        buttonSaveTitle={"COMMON.LOGOUT"}
      >
        <BaseText color="gray.600">
          Il semble que votre compte n’a pas encore été associé à un workspace.
          Veuillez contacter votre administrateur pour obtenir l’accès
          nécessaire.
        </BaseText>
      </BaseModal>

      {isMobile ? (
        <MobileSidebar
          isOpen={sideToggled}
          onClose={onShowSidebar}
          links={sidebarLinks}
        />
      ) : (
        <Box {...toggledSideBarStyle}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={onShowSidebar}
            cursor={"pointer"}
          >
            {!sideToggled ? (
              <Box mt={"5"}>
                <RxHamburgerMenu size={18} />
              </Box>
            ) : (
              <Box position="relative" mt={"4"}>
                <Image
                  src={"/assets/images/placeholder-image.png"}
                  alt={"logo"}
                  width={120}
                  height={120}
                />
                <Float offsetX="3" offsetY="3">
                  <Circle size="5" bg="red">
                    <HiX size={14} color={"white"} />
                  </Circle>
                </Float>
              </Box>
            )}
          </Box>
          <VStack
            width={"full"}
            overflowY={sideToggled ? "hidden" : "auto"}
            overflowX={"hidden"}
            mt={6}
          >
            <RenderLinks
              links={sidebarLinks}
              sideToggled={sideToggled}
              onShowSidebar={onShowSidebar}
            />
          </VStack>
          <Box
            pe={"20px"}
            ps={"20px"}
            mt={"10px"}
            mb={"50px"}
            position="sticky"
            bottom="0"
          >
            <BaseButton
              withGradient
              p={!sideToggled ? 0 : "20px"}
              colorType={"danger"}
              overflow={"hidden"}
              justifyContent={"center"}
              onClick={() => logout()}
              isLoading={isLoading}
              leftIcon={
                <CiLogout
                  width="18px"
                  height="18px"
                  color={VariablesColors.white}
                />
              }
            >
              {sideToggled ? t("COMMON.LOGOUT") : null}
            </BaseButton>
          </Box>
        </Box>
      )}
    </>
  );
};
