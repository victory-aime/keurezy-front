import { BadgeProps } from "@chakra-ui/react/badge";
import React from "react";
import { variantColorType } from "_components/custom/button";
import { ENUM } from "_types/";
import { TextVariant } from "_components/custom/base-text";

type BadgeType = "common" | "payment";
type StatusType = ENUM.COMMON.Status;

interface Props extends BadgeProps {
  label?: string;
  color?: variantColorType;
  status?: StatusType;
  textSize?: TextVariant;
  type?: BadgeType;
  variant?: "outline" | "solid" | "subtle" | "surface" | "plain" | undefined;
  children?: React.ReactNode;
}

export type { Props };
