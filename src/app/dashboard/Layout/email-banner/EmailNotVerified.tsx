"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { BaseButton } from "_components/custom";
import { useColorMode } from "_components/ui/color-mode";
import { EmailContainer } from "./email-container";

export const EmailNotVerifiedBanner = ({
  onResend,
  isLoading,
}: {
  onResend?: () => void;
  isLoading: boolean;
}) => {
  const { colorMode } = useColorMode();
  return (
    <EmailContainer>
      <Box
        bg={colorMode === "light" ? "red.50" : "red.900"}
        border="1px solid"
        borderColor={colorMode === "light" ? "red.200" : "red.400"}
        rounded="xl"
        shadow="sm"
        px={5}
        py={3}
      >
        <Flex
          align="center"
          justify="space-between"
          gap={4}
          flexDir={{ base: "column", sm: "row" }}
        >
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            color={colorMode === "light" ? "red.700" : "white"}
          >
            Votre email n'est pas encore vérifié. Vérifiez votre boîte mail pour
            activer votre compte.
          </Text>

          {onResend && (
            <BaseButton
              variant={"outline"}
              colorType="danger"
              onClick={onResend}
              width={{ base: "full", sm: "fit-content" }}
              isLoading={isLoading}
            >
              Renvoyer l'email
            </BaseButton>
          )}
        </Flex>
      </Box>
    </EmailContainer>
  );
};
