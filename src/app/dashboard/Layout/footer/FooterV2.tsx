import { Flex, Box } from "@chakra-ui/react";
import { LinkFooter } from "./LinkFooter";
import { BaseText, TextVariant } from "_components/custom";

export const FooterV2 = () => {
  return (
    <Flex
      as="footer"
      zIndex="1000"
      ml={"0"}
      align="center"
      transition="left 0.2s ease"
      justify="space-between"
      flexDirection={{ base: "column", sm: "row" }}
      borderTop="1px solid"
      borderColor="gray.200"
      px={{ base: 4, md: 6 }}
      py={3}
    >
      <BaseText variant={TextVariant.XS} color="gray.600">
        © 2026 RentFlow. Tous droits réservés.
      </BaseText>
      <Flex align="center" gap={2}>
        <Box bg="tertiary.400" h="8px" w="8px" borderRadius="full" />
        <BaseText fontSize="xs" color="gray.600">
          Système opérationnel
        </BaseText>
        <BaseText variant={TextVariant.XS} color="gray.400">
          v1.2.0
        </BaseText>
      </Flex>
      <LinkFooter align="center" fontSize="xs" />
    </Flex>
  );
};
