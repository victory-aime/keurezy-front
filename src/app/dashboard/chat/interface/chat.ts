import { MODELS } from '_types/';

interface ChatHeaderProps {
  conversation?: MODELS.Conversation;
  onBack?: () => void;
}

interface ChatInputProps {
  onSend: (content: string, files: File[]) => void;
  onTyping: () => void;
  /** Staff sans la permission de répondre : lecture seule */
  canReply: boolean;
}

interface ChatWindowProps {
  conversationId: string;
  onBack?: () => void;
}

interface ConversationListProps {
  activeConversationId: string | null;
  onSelect: (id: string) => void;
}

interface MessageBubbleProps {
  message: MODELS.MessagePayload;
  isOwn: boolean;
  /** Nom affiché au-dessus de la bulle (client, ou collègue de l'agence) */
  senderLabel?: string;
  onRetry: (message: MODELS.MessagePayload) => void;
  onDiscard: (message: MODELS.MessagePayload) => void;
}

export type {
  ChatHeaderProps,
  ChatInputProps,
  ChatWindowProps,
  ConversationListProps,
  MessageBubbleProps,
};
