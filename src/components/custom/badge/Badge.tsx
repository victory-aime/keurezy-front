import { Badge } from "@chakra-ui/react";
import React, { FC } from "react";
import { Props } from "./interface/badge";
import { BaseText, TextVariant } from "../base-text";
import { variantColorType, getVariantStyles } from "../button";
import { useTranslation } from "react-i18next";
import { hexToRGB } from "_theme/colors";

const getBadgeContent = (
  status?: string,
  type?: string,
  t?: (key: string) => string,
): { variant: variantColorType; label: string } => {
  if (!t) return { variant: "info", label: "Inconnu" };

  if (type === "common") {
    switch (status) {
      case "ACTIVE":
        return { variant: "success", label: t("COMMON.STATUS.ACTIVE") };
      case "INACTIVE":
        return { variant: "danger", label: t("COMMON.STATUS.INACTIVE") };
      case "PENDING":
        return { variant: "warning", label: t("COMMON.STATUS.PENDING") };
      case "AVAILABLE":
        return { variant: "tertiary", label: t("COMMON.STATUS.AVAILABLE") };
      case "CLOSE":
        return { variant: "danger", label: t("COMMON.STATUS.CLOSE") };
      case "RESERVED":
        return { variant: "info", label: t("COMMON.STATUS.RESERVED") };
      case "RENTED":
        return { variant: "warning", label: t("COMMON.STATUS.RENTED") };
      default:
        return { variant: "success", label: t("inconnu") };
    }
  } else if (type === "payment") {
    switch (status) {
      case "PAYE":
        return { variant: "success", label: "Paye" };
      case "PARTIEL":
        return { variant: "warning", label: "Partiel" };
      case "IMPAYE":
        return { variant: "danger", label: "Non paye" };
      default:
        return { variant: "success", label: t("inconnu") };
    }
  } else {
    return { variant: "info", label: t("test") };
  }
};

export const BaseBadge: FC<Props> = ({
  children,
  variant = "solid",
  label: customLabel,
  color,
  type = "common",
  status,
  textSize = TextVariant.XS,
  ...props
}) => {
  const { t } = useTranslation();

  const { variant: resolvedVariant, label: resolvedLabel } = getBadgeContent(
    status,
    type,
    t,
  );

  const { bg, gradient, hover, textColor } = getVariantStyles(
    color ?? resolvedVariant,
    variant,
    true,
  );

  const isSubtle = variant === "subtle";
  const backgroundColor = isSubtle
    ? hexToRGB(color ?? "info", 0.2)
    : (gradient ?? bg ?? "none");

  return (
    <Badge
      {...props}
      variant={variant}
      size={props.size ?? "lg"}
      borderColor={isSubtle ? textColor : undefined}
      bg={backgroundColor}
      borderRadius={props.borderRadius ?? "full"}
      p={props.p ?? 2}
      color={textColor}
      _hover={{ background: hover ?? `${bg}CC` }}
      _active={{
        background: hover ?? `${bg}AA`,
      }}
      _disabled={{ background: "gray.300", cursor: "not-allowed" }}
    >
      <BaseText variant={textSize} textTransform="capitalize">
        {customLabel ?? resolvedLabel}
      </BaseText>
    </Badge>
  );
};
