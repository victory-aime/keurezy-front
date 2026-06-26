'use client';

import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { ConversationList } from './ConversationList';
import { EmptyState } from './EmptyState';

export const MainChat = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return isMobile ? (
    activeConversationId ? (
      <ChatWindow
        conversationId={activeConversationId}
        onBack={() => setActiveConversationId(null)}
      />
    ) : (
      <ConversationList
        activeConversationId={activeConversationId}
        onSelect={setActiveConversationId}
      />
    )
  ) : (
    <Flex overflow="hidden" width={'full'} gap={3}>
      <Box w="1/4" flexShrink={0}>
        <ConversationList
          activeConversationId={activeConversationId}
          onSelect={setActiveConversationId}
        />
      </Box>
      <Box width={'full'}>
        {activeConversationId ? (
          <ChatWindow
            conversationId={activeConversationId}
            onBack={() => setActiveConversationId(null)}
          />
        ) : (
          <EmptyState />
        )}
      </Box>
    </Flex>
  );
};
