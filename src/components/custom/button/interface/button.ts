import { ButtonProps, FlexProps } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export type variantColorType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "purple"
  | "neutral";

export interface VariantColorStyle {
  bg?: string;
  gradient: string;
  hover: string;
  textColor: string;
}

export interface ButtonBaseProps extends ButtonProps {
  children?: React.ReactNode;
  withGradient?: boolean;
  colorType?: variantColorType;
  isLoading?: boolean;
  isDisabled?: boolean;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
}

export interface ActionButtonTypes extends FlexProps {
  cancelTitle?: string;
  validateTitle?: string;
  downloadTitle?: string;
  refreshTitle?: string;
  cancelColor?: variantColorType;
  validateColor?: variantColorType;
  cancelVariant?: ButtonProps["variant"];
  icon?: ReactNode;
  downloadPermission?: boolean;
  validatePermission?: boolean;
  reloadPermission?: boolean;
  cancelIcon?: ReactNode;
  requestId?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  onCancel?: () => void;
  onReload?: () => void;
  onToggleFilter?: () => void;
  onDownload?: () => void;
}
