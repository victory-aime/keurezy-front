import { StatRootProps } from "@chakra-ui/react";
import { ENUM } from "_types/index";
import React from "react";
import { variantColorType } from "_components/custom";

export interface BaseStatsProps extends StatRootProps {
  icon: React.ReactNode;
  color: variantColorType;
  iconBgColor?: string;
  title: string;
  value: number;
  isNumber?: boolean;
  message?: string;
  percent?: number;
  currency?: ENUM.COMMON.Currency;
}
