import { Flex, HStack, Circle, Text, Box } from "@chakra-ui/react";
import { Icons } from "_components/custom";

export const TopBarMockup = ({
  border,
  muted,
  notifications = false,
  link = "app.myimmo.com/dashboard",
}: any) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      px={4}
      py={3}
      borderBottom="1px solid"
      borderColor={border}
      bg={muted}
    >
      <HStack gap={2}>
        <Circle size="10px" bg="red.400" />
        <Circle size="10px" bg="yellow.400" />
        <Circle size="10px" bg="green.400" />
      </HStack>
      <Flex flex={1} alignItems={"center"} justifyContent={"center"} mx={4}>
        <Text px={3} py={1} fontSize={"xs"} color={"gray.400"}>
          {link}
        </Text>
      </Flex>

      {notifications && (
        <Box position="relative">
          <Icons.Bell size={16} color="gray" />
          <Circle
            size="8px"
            bg="red.500"
            position="absolute"
            top="0"
            right="0"
          />
        </Box>
      )}
    </Flex>
  );
};
