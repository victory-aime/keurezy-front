import { ColorPalette, TagRootProps } from "@chakra-ui/react";
import { ENUM } from "_types/";
import { TextVariant } from "../../base-text";

type TagType = "icon" | "default";
type StatusType = ENUM.COMMON.Status;

interface BaseTagProps extends TagRootProps {
  label?: string;
  color?: ColorPalette;
  status?: StatusType;
  textSize?: TextVariant;
  type?: TagType;
  variant?: "outline" | "solid" | "subtle" | "surface" | undefined;
}

export type { BaseTagProps, TagType, StatusType };
