"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseText, BaseTooltip, TextVariant } from "_components/custom";
import { Button, HStack } from "@chakra-ui/react";
import { HoverActionButtonProps } from "./interface/data-types";

export const ButtonHoverAction = ({
  label,
  icon,
  bg,
  onClick,
  isLoading,
  isDisabled,
}: HoverActionButtonProps) => {
  const [hover, setHover] = useState(false);
  const { t } = useTranslation();

  return (
    <BaseTooltip message={label} show arrow>
      <Button
        size="sm"
        onClick={onClick}
        bg={bg}
        color="white"
        loading={isLoading}
        disabled={isDisabled}
        overflow="hidden"
        px={2}
        w={"36px"}
        transition="all 0.25s ease"
        _hover={{
          w: "120px",
        }}
        onMouseEnter={() => {
          setHover(!hover);
        }}
        onMouseLeave={() => setHover(false)}
      >
        <HStack gap={2}>
          {icon}
          {hover && (
            <BaseText
              whiteSpace="nowrap"
              transition="opacity 0.2s ease"
              _groupHover={{ opacity: 1 }}
              variant={TextVariant.S}
            >
              {hover ? t(label) : null}
            </BaseText>
          )}
        </HStack>
      </Button>
    </BaseTooltip>
  );
};
