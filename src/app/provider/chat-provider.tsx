'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createSocket, destroySocket } from '../lib/socket';
import { ChatModule } from '_store/state-management';
import { playNotificationSound } from '_utils/play-sound';
import { useUserContext } from '_context/user-context';
import { useAuthContext } from '_context/auth-context';
import { MODELS } from '_types/';

interface ChatContextType {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  isSocketConnected: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

/**
 * Temps réel du chat pour tout le dashboard : les messages reçus mettent à jour
 * le cache (liste, conversation ouverte, badge) même hors de la page Messages.
 */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUserContext();
  const { session } = useAuthContext();
  const sessionToken = session?.token;
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSocketConnected, setSocketConnected] = useState(false);
  const activeConversationIdRef = useRef(activeConversationId);
  activeConversationIdRef.current = activeConversationId;

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    const socket = createSocket(sessionToken);

    // Compteurs locaux immédiats, serveur comme référence : relancer la liste annule aussi
    // une réponse en cours devenue périmée (lue avant une remise à zéro)
    let resyncTimer: ReturnType<typeof setTimeout> | null = null;
    const resyncConversations = (delayMs = 0) => {
      if (resyncTimer) clearTimeout(resyncTimer);
      resyncTimer = setTimeout(() => ChatModule.ChatCache.invalidateConversations(), delayMs);
    };

    const onConnect = () => {
      setSocketConnected(true);
      // Messages manqués pendant la coupure
      ChatModule.ChatCache.invalidateConversations();
      const active = activeConversationIdRef.current;
      if (active) {
        ChatModule.ChatCache.invalidateMessages(active);
        socket.emit('conversation:join', { conversationId: active });
      }
    };
    const onDisconnect = () => setSocketConnected(false);
    const onConnectError = (error: Error) => {
      setSocketConnected(false);
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[chat] connexion du socket impossible :', error.message);
      }
    };

    const onMessageReceive = (message: MODELS.MessagePayload) => {
      const isOpen = activeConversationIdRef.current === message.conversationId;
      ChatModule.ChatCache.upsertMessage(message);
      ChatModule.ChatCache.applyNewMessage(message, userId, !isOpen);
      if (!isOpen) {
        playNotificationSound();
        resyncConversations(800);
      }
    };

    const onMessageSent = (message: MODELS.MessagePayload) => {
      ChatModule.ChatCache.upsertMessage(message);
      ChatModule.ChatCache.applyNewMessage(message, userId, false);
    };

    const onConversationRead = (data: { conversationId: string; messageIds: string[] }) =>
      ChatModule.ChatCache.markMessagesRead(data.conversationId, data.messageIds);

    const onPresenceUpdate = (data: { userId: string; online: boolean }) =>
      ChatModule.ChatCache.setPresence(data.userId, data.online);

    const onUnreadReset = (data: { conversationId: string }) => {
      ChatModule.ChatCache.resetUnread(data.conversationId);
      resyncConversations();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('message:receive', onMessageReceive);
    socket.on('message:sent', onMessageSent);
    socket.on('presence:update', onPresenceUpdate);
    socket.on('conversation:read', onConversationRead);
    socket.on('unread:reset', onUnreadReset);
    socket.connect();

    return () => {
      if (resyncTimer) clearTimeout(resyncTimer);
      destroySocket();
      setSocketConnected(false);
    };
  }, [user?.id, sessionToken]);

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
