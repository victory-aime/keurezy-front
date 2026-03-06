"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { BaseButton } from "_components/custom";
import { MotionBox } from "_constants/motion";

export const EmailNotVerifiedBanner = ({
  onResend,
  isLoading,
}: {
  onResend?: () => void;
  isLoading: boolean;
}) => {
  return (
    <MotionBox
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      position="absolute"
      top="64px"
      left="0"
      right="0"
      zIndex="50"
      px={8}
    >
      <Box
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
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
          <Text fontSize={{ base: "md", sm: "lg" }} color="red.700">
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
    </MotionBox>
  );
};
