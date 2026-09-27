'use client';

import { Box, Flex, Float, IconButton } from '@chakra-ui/react';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ChatModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import { useConversationRoom, useSendMessage } from '_hooks/chat/useChatMessages';
import { useTypingIndicator } from '_hooks/chat/useTypings';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { useColorMode } from '_components/ui/color-mode';
import { MessageBubble } from './MessageBubble';
import { TypingDots } from './TypingDot';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { DateSeparator } from './DateSeparator';
import { useDateSeparators } from '_hooks/chat/useDateSeparator';
import { Icons, Loader } from '_components/custom';
import { ChatWindowProps } from '../interface/chat';

export function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const { user } = useUserContext();
  const { colorMode } = useColorMode();
  const { hasPermission } = usePermissions();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadBelowCount, setUnreadBelowCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const { data: conversation } = ChatModule.getConversationQueries(conversationId);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    ChatModule.getMessagesQueries(conversationId);

  useConversationRoom(conversationId);
  const { sendMessage, retryMessage, discardMessage } = useSendMessage(conversationId);
  const { isOtherTyping, notifyTyping } = useTypingIndicator(conversationId);

  // Du plus ancien au plus récent pour l'affichage
  const messages = useMemo(
    () => (data?.pages.flatMap((page) => page.items) ?? []).slice().reverse(),
    [data],
  );
  const chatItems = useDateSeparators(messages);
  const clientUserId = conversation?.client.userId;

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
    setShowScrollButton(false);
    setUnreadBelowCount(0);
  }, []);

  const onScroll = useCallback(async () => {
    const el = scrollRef.current;
    if (!el) return;

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 180;
    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
    if (atBottom) setUnreadBelowCount(0);

    // Historique : on conserve la position de lecture après chargement
    if (el.scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
      const prevScrollHeight = el.scrollHeight;
      await fetchNextPage();
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight;
        }
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isLoading) scrollToBottom('instant' as ScrollBehavior);
  }, [isLoading, scrollToBottom]);

  // Nouveau message : on suit la conversation si l'utilisateur est en bas (ou si c'est le sien)
  const lastMessage = messages.at(-1);
  useEffect(() => {
    if (!lastMessage) return;
    if (isAtBottomRef.current || lastMessage.senderId === user?.id) {
      requestAnimationFrame(() => scrollToBottom());
    } else {
      setUnreadBelowCount((count) => count + 1);
      setShowScrollButton(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage?.id]);

  useEffect(() => {
    if (isOtherTyping && isAtBottomRef.current) scrollToBottom();
  }, [isOtherTyping, scrollToBottom]);

  return (
    <Flex direction="column" height={'3xl'} width={'full'}>
      <ChatHeader conversation={conversation} onBack={onBack} />
      <Box
        ref={scrollRef}
        flex={1}
        overflowY="auto"
        px={3}
        py={4}
        bgColor={colorMode !== 'light' ? 'bg.muted' : 'gray.200'}
        onScroll={onScroll}
        position="relative"
      >
        {isLoading ? (
          <Flex align="center" justifyContent="center" height="full" mt={'10'}>
            <Loader
              color="purple.focusRing"
              size="lg"
              showText
              loader
              text="chargement des messages"
            />
          </Flex>
        ) : (
          <>
            {isFetchingNextPage && (
              <Flex justify="center" py={2}>
                <Loader size="sm" loader />
              </Flex>
            )}

            {chatItems.map((item, index) => {
              if (item.type === 'date-separator') {
                return <DateSeparator key={`sep-${index}`} label={item.label} />;
              }
              const { message } = item;
              // Côté agence : les messages de l'équipe à droite, ceux du client à gauche
              const isOwn = !!clientUserId && message.senderId !== clientUserId;
              const previous = chatItems[index - 1];
              const startsSeries =
                previous?.type !== 'message' || previous.message.senderId !== message.senderId;
              const senderLabel =
                startsSeries && message.senderId !== user?.id ? message.sender?.name : undefined;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  senderLabel={senderLabel}
                  onRetry={retryMessage}
                  onDiscard={discardMessage}
                />
              );
            })}
            {isOtherTyping && <TypingDots />}
          </>
        )}
      </Box>

      {showScrollButton && (
        <Flex position="relative">
          <Float placement="top-center" offsetY={-50}>
            <Flex direction="column" align="center" gap={1}>
              {unreadBelowCount > 0 && (
                <Box
                  bg="primary.500"
                  color="white"
                  fontSize="2xs"
                  fontWeight="700"
                  rounded="full"
                  px={2}
                  py={2}
                  minW="20px"
                  textAlign="center"
                >
                  {unreadBelowCount > 99 ? '99+' : unreadBelowCount}
                </Box>
              )}
              <IconButton
                borderRadius="full"
                boxShadow="lg"
                size="sm"
                colorPalette={'purple'}
                color={'white'}
                onClick={() => scrollToBottom()}
                aria-label="Aller au dernier message"
              >
                <Icons.ChevronDown size={24} />
              </IconButton>
            </Flex>
          </Float>
        </Flex>
      )}
      <ChatInput
        onSend={sendMessage}
        onTyping={notifyTyping}
        canReply={hasPermission(AppPermissions.CONVERSATIONS.REPLY)}
      />
    </Flex>
  );
}
