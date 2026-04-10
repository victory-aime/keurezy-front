import { ENUM } from "_types/*";
import { variantColorType } from "../button";
import { ColorPalette } from "@chakra-ui/react";
import { Icons } from "../icons";

const STATUS_META = {
  ACTIVE: "success",
  AVAILABLE: "success",
  ACCEPTED: "success",
  INACTIVE: "danger",
  CLOSE: "danger",
  RENTED: "danger",
  REJECTED: "danger",
  PENDING: "warning",
  UNAVAILABLE: "warning",
  MAINTENANCE: "info",
  CURRENTLY_ON_SALE: "info",
  SOLD: "warning",
} as const satisfies Partial<Record<ENUM.COMMON.Status, variantColorType>>;

const VARIANT_CONFIG: Partial<
  Record<variantColorType, { colorPalette: ColorPalette }>
> = {
  success: { colorPalette: "green" },
  danger: { colorPalette: "red" },
  warning: { colorPalette: "orange" },
  info: { colorPalette: "blue" },
};

const STATUS_ICONS: Partial<Record<ENUM.COMMON.Status, React.ElementType>> = {
  AVAILABLE: Icons.Check,
  ACCEPTED: Icons.Check,
  REJECTED: Icons.Close,
  UNAVAILABLE: Icons.Close,
  PENDING: Icons.Timer,
  MAINTENANCE: Icons.Wrench,
  CURRENTLY_ON_SALE: Icons.Bell,
  SOLD: Icons.Payment,
};

export { STATUS_ICONS, STATUS_META, VARIANT_CONFIG };
