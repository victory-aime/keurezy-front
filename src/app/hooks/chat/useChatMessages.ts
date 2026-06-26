import { useCallback, useEffect, useRef } from 'react';
import { getSocket } from '../../lib/socket';
import { useUserContext } from '_context/user-context';
import { MODELS } from '_types/';
import { ChatCache } from '_store/state-management/chat';

function createTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useSendMessage() {
  const { user } = useUserContext();

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !user?.id) return;

      const socket = getSocket();
      const tempId = createTempId();

      const optimisticMessage: MODELS.MessagePayload = {
        id: tempId,
        conversationId,
        senderId: user.id,
        content: trimmed,
        type: 'TEXT',
        reactions: null,
        createdAt: new Date().toISOString(),
        status: 'sending',
      };
      ChatCache.prependMessage(optimisticMessage);
      if (!socket || !socket.connected) {
        ChatCache.markMessageFailed(conversationId, tempId);
        return;
      }
      socket.emit('message:send', {
        conversationId,
        content: trimmed,
        tempId,
      });
    },
    [user?.id],
  );

  const retryMessage = useCallback(
    (conversationId: string, failedMessage: MODELS.MessagePayload) => {
      ChatCache.removeMessage(conversationId, failedMessage.id);
      sendMessage(conversationId, failedMessage.content);
    },
    [sendMessage],
  );

  return { sendMessage, retryMessage };
}

export function useConversationRoom(conversationId: string | null) {
  const join = useCallback(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;
    socket.emit('conversation:join', { conversationId });
  }, [conversationId]);

  const leave = useCallback(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;
    socket.emit('conversation:leave', { conversationId });
  }, [conversationId]);

  return { join, leave };
}

export function useAutoMarkAsSeen(
  conversationId: string,
  messages: { id: string; senderId: string; status?: string }[],
  currentUserId: string | undefined,
) {
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket();
    if (!socket || !socket.connected) return;

    const unseenIncoming = messages.filter(
      (m) =>
        m.senderId !== currentUserId &&
        m.status !== 'READ' &&
        !m.id.startsWith('temp-') &&
        !seenIdsRef.current.has(m.id),
    );

    if (!unseenIncoming.length) return;

    for (const message of unseenIncoming) {
      socket.emit('message:seen', { conversationId, messageId: message.id });
      seenIdsRef.current.add(message.id);
    }
  }, [conversationId, messages, currentUserId]);
}
