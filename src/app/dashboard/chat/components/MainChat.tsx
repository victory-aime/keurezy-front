'use client';

import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChatWindow } from './ChatWindow';
import { ConversationList } from './ConversationList';
import { EmptyState } from './EmptyState';

/** Messages de l'agence. La conversation ouverte est dans l'URL (`?c=`), pour y accéder par lien. */
export const MainChat = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeConversationId = searchParams.get('c');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const select = (conversationId: string | null) =>
    router.replace(conversationId ? `${pathname}?c=${conversationId}` : pathname, {
      scroll: false,
    });

  if (isMobile) {
    return activeConversationId ? (
      <ChatWindow conversationId={activeConversationId} onBack={() => select(null)} />
    ) : (
      <ConversationList activeConversationId={null} onSelect={select} />
    );
  }

  return (
    <Flex overflow="hidden" width={'full'} gap={3}>
      <Box w={{ md: '2/5', xl: '1/3' }} maxW="420px" flexShrink={0}>
        <ConversationList activeConversationId={activeConversationId} onSelect={select} />
      </Box>
      <Box width={'full'} minW={0}>
        {activeConversationId ? (
          <ChatWindow key={activeConversationId} conversationId={activeConversationId} />
        ) : (
          <EmptyState />
        )}
      </Box>
    </Flex>
  );
};
