import { Text, TextProps } from "@chakra-ui/react";
import React from "react";
import { TextVariant, TextWeight } from "./";

interface BaseTextProps extends TextProps {
  variant?: TextVariant;
  weight?: TextWeight;
}

export const BaseText: React.FC<BaseTextProps> = ({
  variant = TextVariant.M,
  weight = TextWeight.Regular,
  children,
  ...props
}) => {
  const sizeMap: Record<TextVariant, string> = {
    [TextVariant.H1]: "32px",
    [TextVariant.H2]: "28px",
    [TextVariant.H3]: "24px",
    [TextVariant.L]: "20px",
    [TextVariant.XL]: "18px",
    [TextVariant.M]: "16px",
    [TextVariant.S]: "14px",
    [TextVariant.XS]: "12px",
  };

  const weightMap: Record<TextWeight, string> = {
    [TextWeight.THIN]: "thin",
    [TextWeight.ExtraLight]: "extralight",
    [TextWeight.Light]: "light",
    [TextWeight.Regular]: "normal",
    [TextWeight.Medium]: "medium",
    [TextWeight.SemiBold]: "semibold",
    [TextWeight.Bold]: "bold",
    [TextWeight.ExtraBold]: "extrabold",
    [TextWeight.Black]: "black",
  };

  return (
    <Text
      fontSize={sizeMap[variant]}
      fontWeight={weightMap[weight]}
      lineHeight={props.lineHeight ?? "1.8"}
      {...props}
    >
      {children}
    </Text>
  );
};
