import { Button, ButtonProps, HStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { ButtonBaseProps, VariantColorStyle } from "_components/custom";
import { LoadingDots } from "../animation/loadingDots";
import { useTranslation } from "react-i18next";
import { Colors, getColor, getGradient, getHoverGradient } from "_theme/colors";

const getVariantStyles = (
  colorType: keyof Colors,
  variant: ButtonProps["variant"] = "solid",
  withGradient: boolean = false,
): VariantColorStyle => {
  const color = getColor(colorType, 500);
  const textColor = "white";
  const gradient = getGradient(colorType);
  const hover = getHoverGradient(colorType);

  switch (variant) {
    case "subtle":
      return {
        bg: `${color}`,
        textColor: color,
        gradient: "none",
        hover: `${color}30`,
      };
    case "outline":
      return {
        bg: undefined,
        textColor: color,
        gradient: "none",
        hover: `${color}30`,
      };
    default:
      return {
        bg: withGradient ? gradient : color,
        textColor,
        gradient: withGradient ? gradient : "none",
        hover: withGradient ? hover : `${color}CC`,
      };
  }
};

const BaseButton: FC<ButtonBaseProps> = ({
  children,
  withGradient = false,
  rightIcon,
  colorType = "primary",
  isLoading = false,
  isDisabled = false,
  leftIcon,
  variant = "solid",
  ...rest
}) => {
  const { t } = useTranslation();
  const { bg, gradient, hover, textColor } = getVariantStyles(
    colorType,
    variant,
    withGradient,
  );
  const isOutline = variant === "outline";

  return (
    <>
      {rightIcon ? (
        <HStack width={rest.width}>
          <Button
            position="relative"
            borderColor={isOutline ? textColor : undefined}
            variant={variant}
            bg={
              variant === "solid" ? (withGradient ? gradient : bg) : undefined
            }
            color={textColor}
            border={isOutline ? "1px solid" : undefined}
            _hover={{
              background: isOutline ? hover : withGradient ? hover : `${bg}CC`,
            }}
            _active={{
              background: isOutline ? hover : withGradient ? hover : `${bg}AA`,
            }}
            _disabled={{
              background: "gray.300",
              color: "white",
              cursor: "not-allowed",
              borderColor: "gray.300",
            }}
            borderRadius={"12px"}
            padding="20px"
            loading={isLoading}
            disabled={isLoading || isDisabled}
            loadingText={t("COMMON.LOADING_TEXT")}
            spinner={<LoadingDots />}
            spinnerPlacement="end"
            {...rest}
          >
            {children}
            {rightIcon}
          </Button>
        </HStack>
      ) : leftIcon ? (
        <HStack width={rest.width}>
          <Button
            position="relative"
            borderColor={isOutline ? textColor : undefined}
            variant={variant}
            bg={
              variant === "solid" ? (withGradient ? gradient : bg) : undefined
            }
            color={textColor}
            border={isOutline ? "1px solid" : undefined}
            _hover={{
              background: isOutline ? hover : withGradient ? hover : `${bg}CC`,
            }}
            _active={{
              background: isOutline ? hover : withGradient ? hover : `${bg}AA`,
            }}
            _disabled={{
              background: "gray.300",
              color: "white",
              cursor: "not-allowed",
              borderColor: "gray.300",
            }}
            borderRadius={"12px"}
            padding="20px"
            loading={isLoading}
            disabled={isLoading || isDisabled}
            loadingText={t("COMMON.LOADING_TEXT")}
            spinner={<LoadingDots />}
            spinnerPlacement="end"
            {...rest}
          >
            {leftIcon}
            {children}
          </Button>
        </HStack>
      ) : (
        <Button
          position="relative"
          borderColor={isOutline ? textColor : undefined}
          variant={variant}
          bg={variant === "solid" ? (withGradient ? gradient : bg) : undefined}
          color={textColor}
          border={isOutline ? "1px solid" : undefined}
          _hover={{
            background: isOutline ? hover : withGradient ? hover : `${bg}CC`,
          }}
          _active={{
            background: isOutline ? hover : withGradient ? hover : `${bg}AA`,
          }}
          _disabled={{
            background: "gray.300",
            color: "white",
            cursor: "not-allowed",
            borderColor: "gray.300",
          }}
          borderRadius={"12px"}
          padding="20px"
          loading={isLoading}
          disabled={isLoading || isDisabled}
          loadingText={t("COMMON.LOADING_TEXT")}
          spinner={<LoadingDots />}
          spinnerPlacement="end"
          {...rest}
        >
          {children}
        </Button>
      )}
    </>
  );
};

export { getVariantStyles, BaseButton };
