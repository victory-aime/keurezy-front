import { StatRootProps } from "@chakra-ui/react";
import { ENUM } from "_types/index";
import React from "react";

export interface BaseStatsProps extends StatRootProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  title: string;
  value: number;
  isNumber?: boolean;
  isPercent?: boolean;
  message?: string;
  percent?: number;
  currency?: ENUM.COMMON.Currency;
  isLoading?: boolean;
}
