'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import { ChatModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import { Icons, BaseText, BaseButton, BaseIcon } from '_components/custom';
import { Avatar } from '_components/ui/avatar';
import { useState } from 'react';
import { NewConversationModal } from './NewConversationModal';
import { useThemeColors } from '_theme/useThemeColors';
import { ConversationLoad } from './ConversationLoad';
import { ConversationListProps } from '../interface/chat';
import { MessageStatusIcon } from './MessagesStatusIcon';
import { MODELS } from '_types/';
import { formatConversationDate } from 'rise-core-frontend';

export function ConversationList({ activeConversationId, onSelect }: ConversationListProps) {
  const { user } = useUserContext();
  const { hexToRGB } = useThemeColors();
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: conversations, isLoading } = ChatModule.getConversationQueries({
    params: { userId: user?.id! },
    queryOptions: { enabled: !!user?.id },
  });

  return (
    <Flex direction="column" h="100%" width="full">
      <Flex
        px={5}
        py={3}
        mb={4}
        borderBottom="1px solid"
        borderColor="inherit"
        alignItems="center"
        justifyContent="space-between"
      >
        <BaseText fontSize="lg" fontWeight="700">
          Conversations
        </BaseText>
        <BaseIcon boxSize="35px" onClick={() => setModalOpen(true)} cursor="pointer">
          <Icons.PlusMinus />
        </BaseIcon>
      </Flex>

      <Box flex={1} overflowY="auto">
        {isLoading && <ConversationLoad />}

        {!isLoading && !conversations?.length && (
          <Flex direction="column" align="center" justify="center" h="60vh" px={8} gap={4}>
            <Box
              w="56px"
              h="56px"
              rounded="full"
              bg="bg.subtle"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icons.Chat size={24} strokeWidth={1.5} color="var(--chakra-colors-fg-subtle)" />
            </Box>
            <Box textAlign="center">
              <Text fontSize="sm" fontWeight="500" mb={1}>
                Aucune conversation
              </Text>
              <Text fontSize="xs" color="fg.muted">
                Démarrez une discussion avec quelqu'un
              </Text>
            </Box>
            <BaseButton leftIcon={<Icons.Edit size={14} />} onClick={() => setModalOpen(true)}>
              Nouveau message
            </BaseButton>
          </Flex>
        )}

        {conversations?.map((conv: MODELS.Conversation) => {
          const me = conv.participants.find((p) => p.user.id === user?.id);
          const other = conv.participants.find((p) => p.user.id !== user?.id);
          const lastMessage = conv.messages[0];
          const isActive = conv.id === activeConversationId;
          const unreadCount = me?.unreadCount ?? 0;
          const showUnread = unreadCount > 0 && !isActive;
          const isLastMessageMine = lastMessage?.senderId === user?.id;

          return (
            <Flex
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              w="full"
              px={3}
              py={3}
              gap={3}
              align="center"
              cursor="pointer"
              bg={isActive ? hexToRGB(500, 0.2) : 'transparent'}
              rounded={isActive ? 12 : 'none'}
              _hover={{ bg: hexToRGB(500, 0.2), rounded: 12 }}
              transition="background 0.15s"
            >
              <Avatar name={other?.user?.name} />

              <Box flex={1} minW={0}>
                <Flex justify="space-between" align="baseline" gap={2}>
                  <Text fontSize="sm" fontWeight={showUnread ? '700' : '500'} truncate>
                    {other?.user?.name ?? 'Utilisateur'}
                  </Text>
                  {lastMessage && (
                    <Text
                      fontSize="xs"
                      color="fg.subtle"
                      flexShrink={0}
                      textTransform={'capitalize'}
                    >
                      {formatConversationDate(lastMessage.createdAt)}
                    </Text>
                  )}
                </Flex>

                <Flex justify="space-between" align="center" gap={2} mt={0.5}>
                  <Text
                    fontSize="xs"
                    color={showUnread ? 'fg' : 'fg.muted'}
                    fontWeight={showUnread ? '500' : 'normal'}
                    truncate
                    flex={1}
                  >
                    {lastMessage?.content ?? 'Démarrer la conversation'}
                  </Text>

                  {isLastMessageMine && lastMessage?.status ? (
                    <MessageStatusIcon status={lastMessage.status} />
                  ) : showUnread ? (
                    <Box
                      bg="primary.500"
                      color="white"
                      fontSize="2xs"
                      fontWeight="700"
                      borderRadius="full"
                      px={1.5}
                      minW="18px"
                      h="18px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Box>
                  ) : null}
                </Flex>
              </Box>
            </Flex>
          );
        })}
      </Box>

      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConversationCreated={(id) => onSelect?.(id)}
      />
    </Flex>
  );
}
