"use client";

import {
  Spinner,
  Image,
  Box,
  SpinnerProps,
  VStack,
  Flex,
  For,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { BaseText } from "_components/custom";
import { VariablesColors } from "_theme/variables";

interface Spinner extends SpinnerProps {
  loader: boolean;
  showText?: boolean;
}

export const Loader = ({ loader, showText = false, ...rest }: Spinner) => {
  const { t } = useTranslation();
  return (
    loader && (
      <VStack gap={1}>
        <Spinner
          {...rest}
          size={rest.size ?? "lg"}
          animationDuration="0.6s"
          css={{
            border: "4px solid transparent",
            borderTopColor: "transparent",
            borderImage: `linear-gradient(45deg, ${VariablesColors.primary}, ${VariablesColors.secondary}, ${VariablesColors.tertiary}) 0.5`,
            animation: "spin 0.6s linear infinite",
          }}
        />
        {showText && (
          <BaseText color={"primary.500"}>{t("COMMON.LOADING_TEXT")}</BaseText>
        )}
      </VStack>
    )
  );
};

export const GlobalLoader = ({ loader }: Spinner) => {
  return (
    loader && (
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bg="rgba(10,16,16,0.85)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex={1000}
      >
        <Flex gap={3}>
          <For each={[0, 1, 2]}>
            {(i, index) => (
              <Box
                key={i}
                w="12px"
                h="12px"
                borderRadius="full"
                bg={["cyan.solid", "orange.solid", "purple.solid"][index % 3]}
                animation={`${"dotBounce"} 1s ${i * 0.2}s infinite ease-in-out`}
              />
            )}
          </For>
        </Flex>
        {/*<Image*/}
        {/*  src={'/assets/images/manaratha.png'}*/}
        {/*  animation={'logo_animation'}*/}
        {/*  alt="loader-animation"*/}
        {/*/>*/}
      </Box>
    )
  );
};
