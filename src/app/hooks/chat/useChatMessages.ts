import { useCallback, useEffect } from 'react';
import { getSocket } from '../../lib/socket';
import { useUserContext } from '_context/user-context';
import { useChatContext } from '../../provider/chat-provider';
import { ENUM, MODELS } from '_types/';
import { ChatModule } from '_store/state-management';

const { ChatCache } = ChatModule;

const ACK_TIMEOUT_MS = 10_000;

const createTempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const kindOf = (file: File) =>
  file.type.startsWith('image/') ? ENUM.AttachmentKind.IMAGE : ENUM.AttachmentKind.DOCUMENT;

/**
 * Envoi optimiste : le message s'affiche aussitôt, puis est remplacé par la version du serveur.
 * Texte par socket (avec accusé), pièces jointes par l'API multipart.
 */
export function useSendMessage(conversationId: string) {
  const { user } = useUserContext();
  const { mutateAsync: sendMultipart } = ChatModule.sendMessageMutation();

  const confirm = useCallback(
    (message: MODELS.MessagePayload, tempId: string) => {
      ChatCache.upsertMessage({ ...message, tempId });
      if (user?.id) ChatCache.applyNewMessage(message, user.id, false);
    },
    [user?.id],
  );

  const deliver = useCallback(
    async (tempId: string, content: string, files: File[]) => {
      const socket = getSocket();
      if (!files.length && socket?.connected) {
        socket
          .timeout(ACK_TIMEOUT_MS)
          .emit(
            'message:send',
            { conversationId, content, tempId },
            (error: Error | null, ack?: MODELS.SendMessageAck) => {
              if (error || !ack?.ok) {
                ChatCache.setMessageStatus(conversationId, tempId, 'failed');
                return;
              }
              confirm(ack.message, tempId);
            },
          );
        return;
      }

      try {
        const message = await sendMultipart({
          payload: { conversationId, content: content || undefined, tempId, files },
        });
        confirm(message, tempId);
      } catch {
        // Le motif du refus est affiché par le gestionnaire d'erreurs global
        ChatCache.setMessageStatus(conversationId, tempId, 'failed');
      }
    },
    [conversationId, sendMultipart, confirm],
  );

  const sendMessage = useCallback(
    (content: string, files: File[] = []) => {
      const trimmed = content.trim();
      if ((!trimmed && !files.length) || !user?.id) return;

      const tempId = createTempId();
      ChatCache.upsertMessage({
        id: tempId,
        tempId,
        conversationId,
        senderId: user.id,
        sender: { id: user.id, name: user.name ?? '' },
        content: trimmed,
        type: !files.length
          ? ENUM.MessageType.TEXT
          : files.every((file) => file.type.startsWith('image/'))
            ? ENUM.MessageType.IMAGE
            : ENUM.MessageType.FILE,
        attachments: files.map((file, index) => ({
          id: `${tempId}-${index}`,
          kind: kindOf(file),
          mimeType: file.type,
          fileName: file.name,
          fileSize: file.size,
          durationMs: null,
          url: URL.createObjectURL(file),
        })),
        status: 'sending',
        createdAt: new Date().toISOString(),
        pendingFiles: files,
      });
      void deliver(tempId, trimmed, files);
    },
    [conversationId, user?.id, user?.name, deliver],
  );

  const retryMessage = useCallback(
    (message: MODELS.MessagePayload) => {
      ChatCache.setMessageStatus(conversationId, message.id, 'sending');
      void deliver(message.id, message.content, message.pendingFiles ?? []);
    },
    [conversationId, deliver],
  );

  const discardMessage = useCallback(
    (message: MODELS.MessagePayload) => ChatCache.removeMessage(conversationId, message.id),
    [conversationId],
  );

  return { sendMessage, retryMessage, discardMessage };
}

/**
 * Conversation affichée : rejoint sa room (lecture des messages, saisie) et la déclare
 * active pour que ses nouveaux messages ne comptent pas comme non lus.
 */
export function useConversationRoom(conversationId: string | null) {
  const { setActiveConversationId, isSocketConnected } = useChatContext();
  const { mutate: markRead } = ChatModule.markReadMutation({
    mutationOptions: {
      onSuccess: (_result, { payload }) => ChatCache.resetUnread(payload!.conversationId),
    },
  });

  useEffect(() => {
    setActiveConversationId(conversationId);
    return () => setActiveConversationId(null);
  }, [conversationId, setActiveConversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket || !isSocketConnected) {
      // Sans temps réel, la lecture est tout de même enregistrée
      markRead({ payload: { conversationId } });
      return;
    }
    socket.emit('conversation:join', { conversationId });
    return () => {
      socket.emit('conversation:leave', { conversationId });
    };
    // markRead est stable (mutation) : volontairement hors dépendances
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, isSocketConnected]);
}
