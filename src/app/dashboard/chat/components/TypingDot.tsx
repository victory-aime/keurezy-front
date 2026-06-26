'use client';

import { Flex, Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
`;

export function TypingDots() {
  return (
    <Flex
      align="center"
      gap="3px"
      mb="10px"
      mt="10px"
      bg="bg.subtle"
      w="fit-content"
      px={4}
      py={3}
      borderRadius="18px"
      borderBottomLeftRadius="4px"
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          w="6px"
          h="6px"
          rounded="full"
          bg="fg.subtle"
          animation={`${bounce} 1.2s ease-in-out infinite`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </Flex>
  );
}
