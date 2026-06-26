'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createSocket } from '../lib/socket';
import { ChatModule } from '_store/state-management';
import { playNotificationSound } from '_utils/play-sound';
import { useUserContext } from '_context/user-context';
import { MODELS } from '_types/';

interface ChatContextType {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  isSocketConnected: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUserContext();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSocketConnected, setSocketConnected] = useState(false);
  const activeConversationIdRef = useRef(activeConversationId);
  activeConversationIdRef.current = activeConversationId;

  useEffect(() => {
    if (!user?.id) return;

    const socket = createSocket();
    socket.connect();

    const onConnect = () => {
      setSocketConnected(true);
    };

    const onDisconnect = () => {
      setSocketConnected(false);
    };

    const onConnectError = () => {
      setSocketConnected(false);
    };

    const onMessageReceive = (message: MODELS.MessagePayload) => {
      ChatModule.ChatCache.prependMessage(message);
      ChatModule.ChatCache.invalidateConversations();

      if (activeConversationIdRef.current !== message.conversationId) {
        playNotificationSound();
      }
    };

    const onMessageSent = (message: MODELS.MessagePayload & { tempId?: string }) => {
      if (message.tempId) {
        ChatModule.ChatCache.replaceOptimisticMessage(
          message.conversationId,
          message.tempId,
          message,
        );
      } else {
        ChatModule.ChatCache.prependMessage(message);
      }
      ChatModule.ChatCache.invalidateConversations();
    };

    const onConversationRead = (data: { conversationId: string; messageIds: string[] }) => {
      ChatModule.ChatCache.updateMessagesReadStatus(data.conversationId, data.messageIds);
    };

    const onPresenceUpdate = (data: { userId: string; online: boolean }) => {
      ChatModule.ChatCache.setPresence(data.userId, data.online);
    };

    const onUnreadReset = (data: { conversationId: string }) => {
      ChatModule.ChatCache.invalidateConversations();
    };

    socket.onAny((eventName, ...args) => {
      console.log('📡 [socket.onAny]', eventName, args);
    });

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('message:receive', onMessageReceive);
    socket.on('message:sent', onMessageSent);
    socket.on('presence:update', onPresenceUpdate);
    socket.on('conversation:read', onConversationRead);
    socket.on('unread:reset', onUnreadReset);

    return () => {
      console.log('[ChatProvider] useEffect cleanup for user:', user.id);
      socket.offAny();
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('message:receive', onMessageReceive);
      socket.off('message:sent', onMessageSent);
      socket.off('conversation:read', onConversationRead);
      socket.off('presence:update', onPresenceUpdate);
      socket.off('unread:reset', onUnreadReset);
    };
  }, [user?.id]);

  return (
    <ChatContext.Provider
      value={{ activeConversationId, setActiveConversationId, isSocketConnected }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}
