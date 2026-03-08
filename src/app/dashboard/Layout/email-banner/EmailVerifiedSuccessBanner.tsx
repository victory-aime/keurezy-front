"use client";

import { Box, Flex } from "@chakra-ui/react";
import { BaseText, Icons } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { EmailContainer } from "./email-container";
import { useColorMode } from "_components/ui/color-mode";

export const EmailVerifiedSuccessBanner = () => {
  const { colorMode } = useColorMode();
  return (
    <EmailContainer>
      <Box
        w="full"
        bg={colorMode === "light" ? "tertiary.50" : "tertiary.900"}
        border="1px solid"
        borderColor={colorMode === "light" ? "tertiary.200" : "tertiary.400"}
        rounded="xl"
        shadow="sm"
        px={5}
        py={3}
      >
        <BaseText
          fontSize={{ base: "sm", sm: "md" }}
          textAlign={"center"}
          color={colorMode === "light" ? "tertiary.700" : "white"}
        >
          <b>Email vérifié.</b> Votre adresse email a été confirmée. Toutes les
          fonctionnalités sont maintenant disponibles.
        </BaseText>
      </Box>
    </EmailContainer>
  );
};
