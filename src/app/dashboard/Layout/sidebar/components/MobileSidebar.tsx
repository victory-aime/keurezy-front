import { IMobileSidebar } from "../types";
import { BaseDrawer, BaseButton, Icons } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { t } from "i18next";
import { RenderGroupedLinks } from "./RenderGroupedLinks";

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
      <RenderGroupedLinks
        isCollapsed={isOpen}
        links={links}
        mobileCloseDrawer={onClose}
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
    </BaseDrawer>
  );
};
