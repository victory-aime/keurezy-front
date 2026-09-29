import { ENTITY_QUERY_OPTIONS } from '../query-options';
import * as Constants from './constants';
import { chatServiceInstance } from './chat.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

/** Conversations de l'agence (paginées). `unreadTotal` alimente le badge de la sidebar. */
const getConversationsQueries = (
  query: MODELS.IConversationsQuery,
  args: QUERIES.InfiniteQueryPayload<undefined, MODELS.IConversationsPage> = {},
) => {
  return QUERIES.useCustomInfiniteQuery<MODELS.IConversationsPage>({
    queryKey: [Constants.CHAT_KEYS.CONVERSATIONS, query],
    queryFn: ({ pageParam }) =>
      chatServiceInstance().getConversations({ ...query, ...(pageParam && { cursor: pageParam }) }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    options: {
      ...args.queryOptions,
      enabled: !!query.agencyId && (args.queryOptions?.enabled ?? true),
    },
  });
};

const getConversationQueries = (
  conversationId: string | null,
  args: QUERIES.QueryPayload<MODELS.Conversation> = {},
) => {
  return QUERIES.useCustomQuery<undefined, undefined, MODELS.Conversation>({
    queryKey: [Constants.CHAT_KEYS.CONVERSATION, conversationId],
    queryFn: () => chatServiceInstance().getConversation(conversationId!),
    options: { ...ENTITY_QUERY_OPTIONS, ...args.queryOptions, enabled: !!conversationId },
  });
};

/** Messages du plus récent au plus ancien ; la page suivante remonte l'historique. */
const getMessagesQueries = (
  conversationId: string,
  args: QUERIES.InfiniteQueryPayload<undefined, MODELS.IGetMessageResponse> = {},
) => {
  return QUERIES.useCustomInfiniteQuery<MODELS.IGetMessageResponse>({
    queryKey: [Constants.CHAT_KEYS.MESSAGES, conversationId],
    queryFn: ({ pageParam }) => chatServiceInstance().getMessages(conversationId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    options: { ...args.queryOptions, enabled: !!conversationId },
  });
};

/** Discussion avec le client d'une réservation (conversation du bien, retrouvée ou créée). */
const openBookingConversationMutation = (
  args: QUERIES.MutationPayload<{ bookingId: string }, MODELS.Conversation> = {},
) => {
  return QUERIES.useCustomMutation<{ bookingId: string }, MODELS.Conversation>({
    mutationKey: [Constants.CHAT_KEYS.OPEN_BOOKING],
    mutationFn: ({ payload }) => chatServiceInstance().openBookingConversation(payload!.bookingId),
    options: args.mutationOptions,
  });
};

/** Envoi multipart (texte + pièces jointes). */
const sendMessageMutation = (
  args: QUERIES.MutationPayload<
    MODELS.ISendMessageRequest & { files?: File[] },
    MODELS.MessagePayload
  > = {},
) => {
  return QUERIES.useCustomMutation<
    MODELS.ISendMessageRequest & { files?: File[] },
    MODELS.MessagePayload
  >({
    mutationKey: [Constants.CHAT_KEYS.SEND_MESSAGE],
    mutationFn: ({ payload }) => {
      const { files, ...data } = payload!;
      return chatServiceInstance().sendMessage(data, files);
    },
    options: args.mutationOptions,
  });
};

/** Lecture hors socket : l'API remet le compteur à zéro et notifie le client. */
const markReadMutation = (args: QUERIES.MutationPayload<{ conversationId: string }> = {}) => {
  return QUERIES.useCustomMutation<{ conversationId: string }, { readCount: number }>({
    mutationKey: [Constants.CHAT_KEYS.MARK_READ],
    mutationFn: ({ payload }) => chatServiceInstance().markRead(payload!.conversationId),
    options: args.mutationOptions,
  });
};

export {
  markReadMutation,
  getConversationsQueries,
  getConversationQueries,
  getMessagesQueries,
  openBookingConversationMutation,
  sendMessageMutation,
};
