'use client';

import { Box, Flex, Input, InputGroup } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ChatModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import { Icons, BaseText } from '_components/custom';
import { Avatar } from '_components/ui/avatar';
import { useThemeColors } from '_theme/useThemeColors';
import { formatConversationDate } from 'rise-core-frontend';
import { ConversationLoad } from './ConversationLoad';
import { ConversationListProps } from '../interface/chat';
import { MessageStatusIcon } from './MessagesStatusIcon';
import { getLastMessagePreview } from '../utils/chat';
import { getBookingStatusLabel } from '_utils/bookings';

type Filter = 'ALL' | 'UNREAD';

const SEARCH_DEBOUNCE_MS = 350;

/** Conversations de l'agence : les clients écrivent depuis le mobile, à propos d'un bien. */
export function ConversationList({ activeConversationId, onSelect }: ConversationListProps) {
  const { user } = useUserContext();
  const { hexToRGB } = useThemeColors();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    ChatModule.getConversationsQueries({
      agencyId: user?.agencyId ?? '',
      ...(filter === 'UNREAD' && { unreadOnly: true }),
      ...(debouncedSearch && { search: debouncedSearch }),
    });

  const conversations = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const unreadTotal = data?.pages[0]?.unreadTotal ?? 0;

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    if (
      el.scrollHeight - el.scrollTop - el.clientHeight < 120 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  };

  return (
    <Flex direction="column" h="3xl" width="full">
      <Flex
        direction="column"
        gap={3}
        px={3}
        pt={3}
        pb={3}
        borderBottom="1px solid"
        borderColor="inherit"
      >
        <Flex align="baseline" justify="space-between">
          <BaseText fontSize="lg" fontWeight="700">
            Messages
          </BaseText>
          <BaseText fontSize="xs" color="fg.muted">
            {unreadTotal > 0 ? `${unreadTotal} non lu${unreadTotal > 1 ? 's' : ''}` : 'À jour'}
          </BaseText>
        </Flex>

        <InputGroup startElement={<Icons.Search size={16} />}>
          <Input
            size="sm"
            borderRadius="10px"
            placeholder="Client ou bien…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Rechercher une conversation"
          />
        </InputGroup>

        <Flex gap={2} role="radiogroup">
          {(
            [
              { value: 'ALL', label: 'Toutes' },
              { value: 'UNREAD', label: `Non lues${unreadTotal ? ` (${unreadTotal})` : ''}` },
            ] as const
          ).map((option) => {
            const selected = filter === option.value;
            return (
              <Box
                key={option.value}
                as="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setFilter(option.value)}
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="600"
                borderRadius="full"
                borderWidth="1px"
                borderColor={selected ? 'primary.500' : 'inherit'}
                bg={selected ? hexToRGB(500, 0.15) : 'transparent'}
                color={selected ? 'primary.500' : 'fg.muted'}
              >
                {option.label}
              </Box>
            );
          })}
        </Flex>
      </Flex>

      <Box flex={1} overflowY="auto" onScroll={onScroll} py={2}>
        {isLoading && <ConversationLoad />}

        {!isLoading && !conversations.length && (
          <Flex direction="column" align="center" justify="center" h="50vh" px={8} gap={3}>
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
              <BaseText fontSize="sm" fontWeight="500" mb={1}>
                {debouncedSearch || filter === 'UNREAD' ? 'Aucun résultat' : 'Aucune conversation'}
              </BaseText>
              <BaseText fontSize="xs" color="fg.muted">
                {debouncedSearch || filter === 'UNREAD'
                  ? 'Modifiez la recherche ou le filtre.'
                  : 'Les clients vous écrivent depuis vos annonces. Vous pouvez aussi contacter un client depuis une réservation.'}
              </BaseText>
            </Box>
          </Flex>
        )}

        {conversations.map((conversation) => {
          const { lastMessage, client, property, booking } = conversation;
          const isActive = conversation.id === activeConversationId;
          const unreadCount = conversation.unreadCount;
          const showUnread = unreadCount > 0 && !isActive;
          const isLastMessageMine = !!lastMessage && lastMessage.senderId !== client.userId;

          return (
            <Flex
              key={conversation.id}
              as="button"
              textAlign="left"
              onClick={() => onSelect(conversation.id)}
              aria-current={isActive}
              w="full"
              px={3}
              py={3}
              gap={3}
              align="center"
              cursor="pointer"
              bg={isActive ? hexToRGB(500, 0.2) : 'transparent'}
              rounded={12}
              _hover={{ bg: hexToRGB(500, 0.12) }}
              transition="background 0.15s"
            >
              <Avatar name={client.name} />

              <Box flex={1} minW={0}>
                <Flex justify="space-between" align="baseline" gap={2}>
                  <BaseText fontSize="sm" fontWeight={showUnread ? '700' : '500'} truncate>
                    {client.name}
                  </BaseText>
                  <BaseText
                    fontSize="xs"
                    color={showUnread ? 'primary.500' : 'fg.subtle'}
                    flexShrink={0}
                  >
                    {formatConversationDate(conversation.lastMessageAt ?? conversation.createdAt)}
                  </BaseText>
                </Flex>

                <BaseText fontSize="xs" color="fg.muted" truncate>
                  {property.title}
                  {booking ? ` · ${getBookingStatusLabel(booking.status)}` : ''}
                </BaseText>

                <Flex justify="space-between" align="center" gap={2} mt={0.5}>
                  <BaseText
                    fontSize="xs"
                    color={showUnread ? 'fg' : 'fg.muted'}
                    fontWeight={showUnread ? '600' : 'normal'}
                    truncate
                    flex={1}
                  >
                    {getLastMessagePreview(
                      conversation,
                      isLastMessageMine ? lastMessage?.senderId : undefined,
                    )}
                  </BaseText>

                  {showUnread ? (
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
                  ) : isLastMessageMine && lastMessage?.status ? (
                    <MessageStatusIcon status={lastMessage.status} />
                  ) : null}
                </Flex>
              </Box>
            </Flex>
          );
        })}
      </Box>
    </Flex>
  );
}
