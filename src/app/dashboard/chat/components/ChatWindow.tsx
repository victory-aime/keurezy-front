'use client';

import { Box, Flex, Float, IconButton } from '@chakra-ui/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ChatModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import {
  useAutoMarkAsSeen,
  useConversationRoom,
  useSendMessage,
} from '_hooks/chat/useChatMessages';
import { useTypingIndicator } from '_hooks/chat/useTypings';
import { useColorMode, useColorModeValue } from '_components/ui/color-mode';
import { MessageBubble } from './MessageBubble';
import { TypingDots } from './TypingDot';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { DateSeparator } from './DateSeparator';
import { useDateSeparators } from '_hooks/chat/useDateSeparator';
import { Icons, Loader } from '_components/custom';
import { ChatWindowProps } from '../interface/chat';
import { MODELS } from '_types/*';

export function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const { user } = useUserContext();
  const { colorMode } = useColorMode();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadBelowCount, setUnreadBelowCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const shouldAutoScrollRef = useRef(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    ChatModule.getMessagesQueries({
      params: { conversationId, userId: user?.id! },
    });
  const { data: conversations } = ChatModule.getConversationQueries({
    params: { userId: user?.id! },
    queryOptions: { enabled: false },
  });

  const { join, leave } = useConversationRoom(conversationId);
  const { sendMessage, retryMessage } = useSendMessage();
  const { isOtherTyping, notifyTyping } = useTypingIndicator(conversationId);

  const messages =
    data?.pages
      .reduce<MODELS.MessagePayload[]>((acc, page) => [...acc, ...page.items], [])
      .reverse() ?? [];

  const chatItems = useDateSeparators(messages);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior,
    });
    setShowScrollButton(false);
    setUnreadBelowCount(0);
  }, []);

  const onScroll = useCallback(async () => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom < 180;

    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);

    if (atBottom) setUnreadBelowCount(0);

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

  useAutoMarkAsSeen(conversationId, messages, user?.id);

  useEffect(() => {
    join();
    return () => leave();
  }, [conversationId]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom('instant' as ScrollBehavior);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    if (isAtBottomRef.current) {
      scrollToBottom();
    } else {
      const lastMessage = messages.at(-1);
      if (lastMessage?.senderId !== user?.id) {
        setUnreadBelowCount((c) => c + 1);
        setShowScrollButton(true);
      } else {
        scrollToBottom();
      }
    }

    shouldAutoScrollRef.current = false;
  }, [messages.length, notifyTyping, isOtherTyping]);

  const handleSend = (content: string) => {
    shouldAutoScrollRef.current = true;
    sendMessage(conversationId, content);
  };

  return (
    <Flex direction="column" height={'3xl'} width={'full'}>
      <ChatHeader conversationId={conversationId} onBack={onBack} conversations={conversations} />
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
              <Flex justify="center" py={2} mt={'10'}>
                <Loader size="sm" loader />
              </Flex>
            )}

            {chatItems.map((item, index) =>
              item.type === 'date-separator' ? (
                <DateSeparator key={`sep-${index}`} label={item.label} />
              ) : (
                <MessageBubble
                  key={item.message.id}
                  message={item.message}
                  isOwn={item.message.senderId === user?.id}
                  conversationId={conversationId}
                  retryMessage={() => retryMessage(conversationId, item.message)}
                />
              ),
            )}
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
      <ChatInput onSend={handleSend} onTyping={notifyTyping} />
    </Flex>
  );
}
