import { ColorPalette, Tag } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";
import { BaseTagProps, TagType } from "./interface/tag";
import { useTranslation } from "react-i18next";
import { Icons } from "../icons";
import { ENUM } from "_types/*";

const getBadgeContent = (
  status: ENUM.COMMON.Status | undefined,
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
    default:
      return { colorPalette: "green", label: t("inconnu") };
  }
};

export const BaseTag: FC<BaseTagProps> = ({
  children,
  variant = "subtle",
  label: customLabel,
  color,
  status,
  ...props
}) => {
  const { t } = useTranslation();

  const {
    colorPalette,
    label: resolvedLabel,
    icon,
  } = getBadgeContent(status, t);

  return (
    <Tag.Root
      {...props}
      variant={variant}
      colorPalette={colorPalette}
      p={2}
      _disabled={{ background: "gray.300", cursor: "not-allowed" }}
    >
      {icon && <Tag.StartElement>{icon}</Tag.StartElement>}

      <Tag.Label textTransform={"capitalize"}>
        {customLabel ?? resolvedLabel}
      </Tag.Label>
    </Tag.Root>
  );
};
