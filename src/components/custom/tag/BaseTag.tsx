import { ColorPalette, Tag } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";
import { BaseTagProps } from "./interface/tag";
import { useTranslation } from "react-i18next";
import { Icons } from "../icons";
import { ENUM } from "_types/*";

const getTagContent = (
  status: ENUM.COMMON.Status | undefined,
  color: ColorPalette = "red",
  t?: (key: string) => string,
): { colorPalette: ColorPalette; label: string; icon?: ReactNode } => {
  if (!t) return { colorPalette: "blue", label: "Inconnu" };

  switch (status) {
    case "ACTIVE":
      return {
        colorPalette: "green",
        label: t("COMMON.STATUS.ACTIVE"),
      };
    case "INACTIVE":
      return { colorPalette: "red", label: t("COMMON.STATUS.INACTIVE") };
    case "AVAILABLE":
      return { colorPalette: "green", label: t("COMMON.STATUS.AVAILABLE") };
    case "CLOSE":
      return { colorPalette: "red", label: t("COMMON.STATUS.CLOSE") };
    case "RENTED":
      return { colorPalette: "blue", label: t("COMMON.STATUS.RENTED") };
    case "PENDING":
      return {
        icon: <Icons.Timer />,
        colorPalette: "orange",
        label: t("COMMON.STATUS.PENDING"),
      };
    case "ACCEPTED":
      return {
        icon: <Icons.Check />,
        colorPalette: "green",
        label: t("COMMON.STATUS.ACCEPTED"),
      };
    case "REJECTED":
      return {
        icon: <Icons.Close />,
        colorPalette: "red",
        label: t("COMMON.STATUS.REJECTED"),
      };
    default:
      return { colorPalette: color, label: t("COMMON.STATUS.UNKNOWN") };
  }
};

export const BaseTag: FC<BaseTagProps> = ({
  children,
  variant = "subtle",
  label: customLabel,
  color = "red",
  status,
  ...props
}) => {
  const { t } = useTranslation();

  const {
    colorPalette,
    label: resolvedLabel,
    icon,
  } = getTagContent(status, color as ColorPalette, t);

  return (
    <Tag.Root
      variant={variant}
      colorPalette={colorPalette}
      _disabled={{ background: "gray.300", cursor: "not-allowed" }}
      px={2}
      py={1}
      {...props}
    >
      {icon && <Tag.StartElement>{icon}</Tag.StartElement>}

      <Tag.Label textTransform="capitalize">
        {customLabel ?? resolvedLabel}
      </Tag.Label>
    </Tag.Root>
  );
};
