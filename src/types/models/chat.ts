interface ICreateConversation {
  recipientId?: string;
  leadId?: string;
  userId?: string;
}
type MessageStatus = 'sending' | 'failed' | 'SENT' | 'DELIVERED' | 'READ';

interface MessagePayload {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  reactions: Record<string, string[]> | null;
  createdAt: string;
  status?: MessageStatus;
  metadata?: Record<string, string[]> | null;
  editedAt?: string | null;
  deletedAt?: string | null;
  receipts?: { status: MessageStatus; userId: string }[];
}

interface IGetMessageResponse {
  items: MessagePayload[];
  nextCursor: string | null;
}

interface IGetMessagesParams {
  userId: string;
  conversationId: string;
  cursor?: string;
  limit?: number;
}

interface TypingPayload {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

interface IConversationParticipants {
  user: { id: string; name: string };
  unreadCount: number;
}

interface Conversation {
  id: string;
  participants: IConversationParticipants[];
  messages: MessagePayload[];
  updatedAt: string;
}

export type {
  ICreateConversation,
  MessagePayload,
  Conversation,
  TypingPayload,
  IConversationParticipants,
  IGetMessageResponse,
  IGetMessagesParams,
  MessageStatus,
};
