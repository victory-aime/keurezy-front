import { ReactNode } from "react";
import { ActionButtonTypes } from "../../button";
import { BoxProps } from "@chakra-ui/react";
import { TextVariant } from "_components/custom";
import { Colors } from "_theme/colors";

export interface IBoxProps extends BoxProps {
  title?: string;
  description?: string;
  buttonTitle?: string;
  onClick?: () => void;
  withActionButtons?: boolean;
  isFilterActive?: boolean;
  onToggleFilter?: () => void;
  loader?: boolean;
  actionsButtonProps?: ActionButtonTypes;
  filterComponent?: ReactNode;
  isForm?: boolean;
  formComponent?: ReactNode;
  numberOfLines?: number;
  tooltip?: string;
  textVariant?: TextVariant;
  iconColor?: keyof Colors;
  icon?: ReactNode;
}
