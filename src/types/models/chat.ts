import { AttachmentKind, BookingStatus, MessageType, RentalType } from '../enum/type';

/** Statut vu par l'expéditeur ; `sending` et `failed` n'existent que côté client. */
type MessageStatus = 'sending' | 'failed' | 'SENT' | 'DELIVERED' | 'READ';

interface IChatAttachment {
  id: string;
  kind: AttachmentKind;
  mimeType: string;
  fileName: string;
  fileSize: number;
  durationMs: number | null;
  /** URL signée temporaire (1 h), ou aperçu local pendant l'envoi */
  url: string;
}

interface MessagePayload {
  id: string;
  conversationId: string;
  senderId: string;
  sender: { id: string; name: string } | null;
  content: string;
  type: MessageType;
  attachments: IChatAttachment[];
  status?: MessageStatus;
  createdAt: string;
  tempId?: string;
  /** Fichiers d'un envoi en cours (nouvel essai) */
  pendingFiles?: File[];
}

interface Conversation {
  id: string;
  createdAt: string;
  lastMessageAt: string | null;
  unreadCount: number;
  agency: { id: string; name: string; phone: string | null; logo: string | null };
  client: { id: string; userId: string; name: string; phone: string | null };
  property: { id: string; title: string; annonceId: string | null; coverImage: string | null };
  booking: {
    id: string;
    status: BookingStatus;
    rentalType: RentalType;
    startDate: string;
    endDate: string;
  } | null;
  lastMessage: {
    id: string;
    senderId: string;
    content: string;
    type: MessageType;
    attachmentsCount: number;
    createdAt: string;
    status: MessageStatus | null;
  } | null;
}

interface IConversationsPage {
  items: Conversation[];
  nextCursor: string | null;
  unreadTotal: number;
}

interface IConversationsQuery {
  agencyId: string;
  unreadOnly?: boolean;
  search?: string;
  limit?: number;
}

interface IGetMessageResponse {
  items: MessagePayload[];
  nextCursor: string | null;
}

interface ISendMessageRequest {
  conversationId: string;
  content?: string;
  tempId?: string;
  durationMs?: number;
}

interface TypingPayload {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

type SendMessageAck =
  | { ok: true; message: MessagePayload }
  | { ok: false; error: string; errorCode?: string };

export type {
  MessageStatus,
  IChatAttachment,
  MessagePayload,
  Conversation,
  IConversationsPage,
  IConversationsQuery,
  IGetMessageResponse,
  ISendMessageRequest,
  TypingPayload,
  SendMessageAck,
};
