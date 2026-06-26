import { MODELS } from '_types/';

interface ChatHeaderProps {
  conversationId: string;
  onBack?: () => void;
  conversations: MODELS.Conversation[];
}
interface ChatInputProps {
  onSend: (content: string) => void;
  onTyping: () => void;
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
  conversationId: string;
  retryMessage: (conversationId: string, message: MODELS.MessagePayload) => void;
}

interface TypingIndicatorProps {
  conversationId: string;
  isOtherTyping: boolean;
  otherUser?: { id: string; name: string };
}

export type {
  ChatHeaderProps,
  ChatInputProps,
  ChatWindowProps,
  ConversationListProps,
  MessageBubbleProps,
  TypingIndicatorProps,
};
