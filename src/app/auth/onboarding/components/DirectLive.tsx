import { HStack, Box, Text } from "@chakra-ui/react";
import { MotionBox } from "_constants/motion";

export const DirectLive = () => {
  return (
    <HStack gap={2} mb={3}>
      <MotionBox
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        display={"flex"}
        alignItems={"center"}
        gap={2}
      >
        <Box h="8px" w="8px" borderRadius="full" bg="tertiary.400" />
        <Text fontSize="xs" color="tertiary.500">
          Aperçu en direct
        </Text>
      </MotionBox>
    </HStack>
  );
};
