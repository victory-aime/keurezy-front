import { useCallback, useEffect, useRef, useState } from 'react';
import { getSocket } from '../../lib/socket';
import { MODELS } from '_types/';

const TYPING_DEBOUNCE_MS = 1000;

/**
 * Gère l'émission ET la réception du typing indicator pour une conversation.
 */
export function useTypingIndicator(conversationId: string | null) {
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false); // évite d'emit 'start' à chaque keystroke

  // ─── Écoute le typing de l'interlocuteur ─────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;

    const onTypingUpdate = (payload: MODELS.TypingPayload) => {
      if (payload.conversationId !== conversationId) return;
      setIsOtherTyping(payload.isTyping);
    };

    socket.on('typing:update', onTypingUpdate);
    return () => {
      socket.off('typing:update', onTypingUpdate);
    };
  }, [conversationId]);

  // ─── Émission avec debounce ───────────────────────────────────────────────
  const notifyTyping = useCallback(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing:start', { conversationId });
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit('typing:stop', { conversationId });
    }, TYPING_DEBOUNCE_MS);
  }, [conversationId]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { isOtherTyping, notifyTyping };
}
