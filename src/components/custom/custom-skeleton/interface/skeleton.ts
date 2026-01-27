import { variantColorType } from "_components/custom/button";

type LoaderType =
  | "BAR_CHART"
  | "DATA_TABLE"
  | "DONUT_CHART"
  | "LINE_CHART"
  | "PRODUCT_LIST_CARD"
  | "DEFAULT"
  | "TEXT"
  | "IMAGE"
  | "TEXT_IMAGE"
  | "BUTTON"
  | "FORM";

interface CustomSkeletonLoaderProps {
  type?: LoaderType;
  tableColumns?: number;
  tableRows?: number;
  width?: string | number | any;
  height?: string | number;
  statisticBars?: number;
  count?: number;
  variant?: "pulse" | "shine";
  direction?: any;
  numberOfLines?: number;
  colorButton?: variantColorType;
}

export type { LoaderType, CustomSkeletonLoaderProps };
