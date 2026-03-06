"use client";

import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { BaseButton } from "../base/baseButton";
import { ActionButtonTypes, BaseTooltip, Icons } from "_components/custom";
import { useTranslation } from "react-i18next";

export const ActionsButton = ({
  cancelTitle = "COMMON.CANCEL",
  validateTitle = "COMMON.VALIDATE",
  downloadTitle = "COMMON.DOWNLOAD",
  requestId,
  isLoading = false,
  isDisabled = false,
  cancelColor = "danger",
  cancelVariant,
  refreshTitle = "COMMON.REFRESH",
  validateColor = "primary",
  icon,
  cancelIcon,
  onClick,
  onToggleFilter,
  downloadPermission = true,
  validatePermission = true,
  reloadPermission = true,
  withGradient = true,
  onReload,
  onCancel,
  onDownload,
  emailVerificationMessage = "Veuillez vérifier votre email pour utiliser cette fonctionnalité.",
  isEmailVerified,
  ...rest
}: ActionButtonTypes) => {
  const { t } = useTranslation();
  const router = useRouter();

  const disabledBecauseEmail = !isEmailVerified;

  const wrapTooltip = (children: React.ReactNode) => {
    if (!disabledBecauseEmail) return children;

    return (
      <BaseTooltip
        show
        message={emailVerificationMessage}
        placement="top"
        arrow
      >
        <span>{children}</span>
      </BaseTooltip>
    );
  };

  return (
    <Flex {...rest} gap={3}>
      {isLoading ? (
        <BaseButton isLoading={isLoading} />
      ) : (
        <>
          {onDownload &&
            downloadPermission &&
            wrapTooltip(
              <BaseButton
                withGradient={withGradient}
                colorType={"info"}
                variant={"outline"}
                onClick={onDownload}
                isLoading={isLoading}
                disabled={isLoading || isDisabled || disabledBecauseEmail}
                px={"15px"}
                leftIcon={<Icons.Paper />}
              >
                {t(downloadTitle)}
              </BaseButton>,
            )}

          {onCancel &&
            wrapTooltip(
              <BaseButton
                px={"15px"}
                withGradient={withGradient}
                disabled={isLoading || disabledBecauseEmail}
                colorType={cancelColor}
                variant={cancelVariant}
                leftIcon={cancelIcon ? cancelIcon : <Icons.Close />}
                onClick={() => (onCancel ? onCancel?.() : router?.back())}
              >
                {t(cancelTitle)}
              </BaseButton>,
            )}

          {onToggleFilter &&
            reloadPermission &&
            wrapTooltip(
              <BaseButton
                px={"15px"}
                colorType={"tertiary"}
                withGradient={withGradient}
                leftIcon={<Icons.Filter />}
                onClick={onToggleFilter}
                disabled={disabledBecauseEmail}
              >
                {t("COMMON.FILTER")}
              </BaseButton>,
            )}

          {onClick &&
            validatePermission &&
            wrapTooltip(
              <BaseButton
                onClick={onClick}
                px={"15px"}
                colorType={validateColor}
                withGradient={withGradient}
                isLoading={isLoading}
                disabled={isLoading || isDisabled || disabledBecauseEmail}
                leftIcon={
                  icon ? icon : requestId ? <Icons.Save /> : <Icons.Minus />
                }
              >
                {t(validateTitle)}
              </BaseButton>,
            )}

          {onReload &&
            reloadPermission &&
            wrapTooltip(
              <BaseButton
                onClick={onReload}
                px={"15px"}
                colorType={"secondary"}
                withGradient={withGradient}
                isLoading={isLoading}
                disabled={isLoading || isDisabled || disabledBecauseEmail}
                leftIcon={<Icons.Refresh size={14} />}
              >
                {t(refreshTitle)}
              </BaseButton>,
            )}
        </>
      )}
    </Flex>
  );
};
