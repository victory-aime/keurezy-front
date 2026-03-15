import { ENUM, MODELS } from "_types/*";
import * as React from "react";

interface MonthlyRevenueBarChartProps {
  data: { propertyId: string; propertyTitle: string; revenue: number }[];
  isLoading?: boolean;
  refetch?: () => void;
}

interface OccupationRateByTypeBarChartProps {
  data: MODELS.IOccupationRateStats[];
  isLoading?: boolean;
  refetch?: () => void;
}

export type { MonthlyRevenueBarChartProps, OccupationRateByTypeBarChartProps };
