"use client";

import { PiWarningBold } from "react-icons/pi";
import { BaseModal, BaseText } from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { useTranslation } from "react-i18next";
import { VariablesColors } from "_theme/variables";
import { useAuth } from "_hooks/useAuth";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "_config/routes";
import { signOut } from "next-auth/react";

export const SessionErrorModal = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoading } = useAuth();

  const handleReconnect = () => {
    router.push(APP_ROUTES.AUTH.SIGN_IN);
  };
  const handleSignOut = async () => {
    await signOut({ callbackUrl: APP_ROUTES.AUTH.SIGN_IN });
  };

  return (
    <BaseModal
      isOpen
      icon={<PiWarningBold size={22} color={VariablesColors.warning} />}
      iconBackgroundColor={hexToRGB("warning", 0.2)}
      title={"SESSION_EXPIRE"}
      buttonSaveTitle={"COMMON.LOGIN"}
      buttonCancelTitle={"COMMON.LOGOUT"}
      colorSaveButton={"primary"}
      ignoreFooter={false}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      lazyMount
      isLoading={isLoading}
      showCloseButton={false}
      onClick={handleReconnect}
      onChange={handleSignOut}
    >
      <BaseText>{t("SESSION_MESSAGE")}</BaseText>
    </BaseModal>
  );
};
