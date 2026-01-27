"use client";

import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { BaseButton } from "../base/baseButton";
import { IoIosClose } from "react-icons/io";
import { ActionButtonTypes } from "_components/custom";
import { useTranslation } from "react-i18next";
import { HiMiniPlusSmall } from "react-icons/hi2";
import { CiFilter, CiSaveDown2 } from "react-icons/ci";
import { CgSync } from "react-icons/cg";
import { IoDocumentTextOutline } from "react-icons/io5";

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
  onReload,
  onCancel,
  onDownload,
  ...rest
}: ActionButtonTypes) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Flex {...rest} gap={3}>
      {isLoading ? (
        <BaseButton isLoading={isLoading} />
      ) : (
        <>
          {onDownload && downloadPermission && (
            <BaseButton
              withGradient
              colorType={"info"}
              variant={"outline"}
              onClick={onDownload}
              isLoading={isLoading}
              disabled={isLoading || isDisabled}
              px={"15px"}
              leftIcon={<IoDocumentTextOutline />}
            >
              {t(downloadTitle)}
            </BaseButton>
          )}
          {onCancel && (
            <BaseButton
              px={"15px"}
              withGradient
              disabled={isLoading}
              colorType={cancelColor}
              variant={cancelVariant}
              leftIcon={cancelIcon ? cancelIcon : <IoIosClose />}
              onClick={() => (onCancel ? onCancel?.() : router?.back())}
            >
              {t(cancelTitle)}
            </BaseButton>
          )}

          {onToggleFilter && reloadPermission && (
            <BaseButton
              px={"15px"}
              colorType={"tertiary"}
              withGradient
              leftIcon={<CiFilter />}
              onClick={onToggleFilter}
            >
              {t("COMMON.FILTER")}
            </BaseButton>
          )}
          {onClick && validatePermission && (
            <BaseButton
              onClick={onClick}
              px={"15px"}
              colorType={validateColor}
              withGradient
              isLoading={isLoading}
              disabled={isLoading || isDisabled}
              leftIcon={
                icon ? icon : requestId ? <CiSaveDown2 /> : <HiMiniPlusSmall />
              }
            >
              {t(validateTitle)}
            </BaseButton>
          )}
          {onReload && reloadPermission && (
            <BaseButton
              onClick={onReload}
              px={"15px"}
              colorType={"secondary"}
              withGradient
              isLoading={isLoading}
              disabled={isLoading || isDisabled}
              leftIcon={<CgSync size={14} />}
            >
              {t(refreshTitle)}
            </BaseButton>
          )}
        </>
      )}
    </Flex>
  );
};
