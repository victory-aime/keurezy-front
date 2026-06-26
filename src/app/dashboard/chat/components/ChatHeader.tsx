'use client';

import { Flex, Text, Box } from '@chakra-ui/react';
import { BaseIcon, Icons } from '_components/custom';
import { MODELS } from '_types/*';
import { useUserContext } from '_context/user-context';
import { Avatar } from '_components/ui/avatar';
import { useChatPresence } from '_hooks/chat/useChatPresence';
import { ChatHeaderProps } from '../interface/chat';

export function ChatHeader({ conversationId, onBack, conversations }: ChatHeaderProps) {
  const { user } = useUserContext();
  const participants =
    conversations?.find((conv: MODELS.Conversation) => conv.id === conversationId)?.participants ||
    [];
  const getUser = participants.find((p) => p.user?.id !== user?.id);
  const { data: isOnline } = useChatPresence(getUser?.user?.id);

  return (
    <Flex
      align="center"
      gap={3}
      px={2}
      py={2.5}
      borderBottom="1px solid"
      borderColor="inherit"
      flexShrink={0}
    >
      {onBack && (
        <BaseIcon
          boxSize={'30px'}
          rounded={'full'}
          cursor={'pointer'}
          aria-label="Retour"
          onClick={onBack}
        >
          <Icons.IoIosArrowRoundBack />
        </BaseIcon>
      )}

      <Avatar size="sm" name={getUser?.user?.name} />

      <Box>
        <Text fontSize="sm" fontWeight="600">
          {getUser?.user?.name}
        </Text>
        <Flex align="center" gap={1.5}>
          <Box w="6px" h="6px" rounded="full" bg={isOnline ? 'green.500' : 'gray.400'} />
          <Text fontSize="xs" color="fg.muted">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
