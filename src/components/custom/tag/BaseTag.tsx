import { ColorPalette, Tag, TagCloseTrigger } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";
import { BaseTagProps } from "./interface/tag";
import { useTranslation } from "react-i18next";
import { ENUM } from "_types/*";
import { STATUS_ICONS, STATUS_META, VARIANT_CONFIG } from "../utils";

const getTagContent = (
  status?: ENUM.COMMON.Status,
  fallbackColor: ColorPalette = "red",
  t?: (key: string) => string,
): { colorPalette: ColorPalette; label: string; icon?: ReactNode } => {
  if (!t) {
    return { colorPalette: "blue", label: "Inconnu" };
  }

  if (!status || !STATUS_META[status as keyof typeof STATUS_META]) {
    return {
      colorPalette: fallbackColor,
      label: t("COMMON.STATUS.UNKNOWN"),
    };
  }

  const variant = STATUS_META[status as keyof typeof STATUS_META];
  const { colorPalette } = VARIANT_CONFIG[variant] ?? {
    colorPalette: fallbackColor,
  };
  const Icon = STATUS_ICONS[status];

  return {
    colorPalette,
    label: t(`COMMON.STATUS.${status}`),
    icon: Icon ? <Icon /> : undefined,
  };
};

export const BaseTag: FC<BaseTagProps> = ({
  children,
  variant = "subtle",
  label: customLabel,
  color = "red",
  iconPosition = "start",
  icon: customIcon,
  onCloseIconTrigger,
  status,
  ...props
}) => {
  const { t } = useTranslation();

  const {
    colorPalette,
    label: resolvedLabel,
    icon,
  } = getTagContent(status, color as ColorPalette, t);

  const renderedIcon = customIcon ?? icon;

  return (
    <Tag.Root
      variant={variant}
      colorPalette={colorPalette}
      _disabled={{ background: "gray.300", cursor: "not-allowed" }}
      px={2}
      py={1}
      {...props}
    >
      {iconPosition === "start" && (
        <>
          {renderedIcon ? (
            <Tag.StartElement>{renderedIcon}</Tag.StartElement>
          ) : onCloseIconTrigger ? (
            <Tag.StartElement>
              <TagCloseTrigger onClick={onCloseIconTrigger} />
            </Tag.StartElement>
          ) : null}
        </>
      )}
      <Tag.Label textTransform="capitalize">
        {customLabel ?? resolvedLabel}
      </Tag.Label>
      {iconPosition === "end" && (
        <>
          {renderedIcon ? (
            <Tag.StartElement>{renderedIcon}</Tag.StartElement>
          ) : onCloseIconTrigger ? (
            <Tag.StartElement>
              <TagCloseTrigger onClick={onCloseIconTrigger} />
            </Tag.StartElement>
          ) : null}
        </>
      )}
    </Tag.Root>
  );
};
