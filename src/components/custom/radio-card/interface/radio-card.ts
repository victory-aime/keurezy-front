import { RadioCardRootProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IRadioCardProps extends RadioCardRootProps {
  items: {
    label: string;
    icon?: ReactNode;
    value: string;
    content?: ReactNode;
    desc?: string;
  }[];
  colorPalette?:
    | string
    | "transparent"
    | "current"
    | "black"
    | "white"
    | "whiteAlpha"
    | "blackAlpha"
    | "gray"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "blue"
    | "cyan"
    | "purple"
    | "pink"
    | "bg"
    | "fg"
    | "border";
  labelTitle?: string;
  stepButton?: ReactNode;
  orientation?: "vertical" | "horizontal";
}

export type { IRadioCardProps };
