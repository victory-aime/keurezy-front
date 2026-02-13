"use client";
import { Box, Flex, useBreakpointValue, VStack } from "@chakra-ui/react";
import { MobileSidebar } from "./components/MobileSidebar";
import { RenderLinks } from "./components/RenderLinks";
import useSideBarStyle from "./hooks/useSidebarStyle";
import { MENU_BY_ROLE } from "./routes/routes";
import { SideBarProps } from "./types";
import Image from "next/image";
import { HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
import { BaseButton, BaseIcon, BaseText, Icons } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { useAuth } from "_hooks/useAuth";
import { useTranslation } from "react-i18next";
import { RxHamburgerMenu } from "react-icons/rx";
import { APP_ROUTES } from "_config/routes";
import { ASSETS } from "_assets/images";
import { UserModule } from "_store/state-management";

export const Sidebar = ({ sideToggled, onShowSidebar, data }: SideBarProps) => {
  const { t } = useTranslation();
  const { toggledSideBarStyle } = useSideBarStyle({
    sideToggled,
  });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sidebarLinks = user?.role ? MENU_BY_ROLE[user?.role] || [] : [];
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
      {/* <BaseModal
        isOpen={isModalOpen}
        icon={<CiWarning />}
        modalType={"alertdialog"}
        title={"Aucun espace de travail associé"}
        onClick={() => logout(APP_ROUTES.AUTH.SIGN_IN)}
        isLoading={isLoading}
        showCloseButton={false}
        buttonSaveTitle={"COMMON.LOGOUT"}
      >
        <BaseText color="gray.600">
          Il semble que votre compte n’a pas encore été associé à un workspace.
          Veuillez contacter votre administrateur pour obtenir l’accès
          nécessaire.
        </BaseText>
      </BaseModal> */}
      {isMobile ? (
        <MobileSidebar
          isOpen={sideToggled}
          onClose={onShowSidebar}
          links={sidebarLinks}
          handleLogout={() => logout(APP_ROUTES.AUTH.SIGN_IN)}
        />
      ) : (
        <Box {...toggledSideBarStyle}>
          <Box
            display="flex"
            width={"full"}
            alignItems="center"
            justifyContent="center"
            onClick={onShowSidebar}
            p={2}
            cursor={"pointer"}
          >
            {!sideToggled ? (
              <Box mt={"5"}>
                <RxHamburgerMenu size={18} />
              </Box>
            ) : (
              <Flex
                mt={"4"}
                width={"full"}
                alignItems="center"
                justifyContent="space-around"
              >
                <Flex gap={2}>
                  <Image src={ASSETS.LOGO} width={24} height={24} alt="logo" />
                  <BaseText>{t("MyIMMO")}</BaseText>
                </Flex>
                <BaseIcon rounded={"full"} bgColor={"red.500"} boxSize={"25px"}>
                  <HiX size={14} color={"white"} />
                </BaseIcon>
              </Flex>
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
              onClick={() => logout(APP_ROUTES.AUTH.SIGN_IN)}
              isLoading={isLoading}
              leftIcon={
                <Icons.Logout
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
