import { VStack } from "@chakra-ui/react";
import { IMobileSidebar } from "../types";
import { RenderLinks } from "./RenderLinks";
import { BaseDrawer, BaseButton, Icons } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { t } from "i18next";

export const MobileSidebar = ({
  isOpen,
  onClose,
  links,
  handleLogout,
}: IMobileSidebar) => {
  return (
    <BaseDrawer
      title={"Menu"}
      isOpen={isOpen}
      onChange={onClose}
      size={"xs"}
      placement={"start"}
      ignoreFooter
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
        <BaseButton
          withGradient
          colorType={"danger"}
          overflow={"hidden"}
          justifyContent={"center"}
          onClick={() => {
            onClose();
            handleLogout?.();
          }}
          leftIcon={
            <Icons.Logout
              width="18px"
              height="18px"
              color={VariablesColors.white}
            />
          }
        >
          {t("COMMON.LOGOUT")}
        </BaseButton>
      </VStack>
    </BaseDrawer>
  );
};
