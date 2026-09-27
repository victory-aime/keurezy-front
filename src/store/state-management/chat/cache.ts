import { QUERIES } from 'rise-core-frontend';
import * as Constants from './constants';
import { MODELS } from '_types/index';

type MessagesData = QUERIES.InfiniteQueryResult<MODELS.IGetMessageResponse>;
type ConversationsData = QUERIES.InfiniteQueryResult<MODELS.IConversationsPage>;

const client = () => QUERIES.QueryCache.queryClient;

const messagesKey = (conversationId: string) => [Constants.CHAT_KEYS.MESSAGES, conversationId];

/** Modifie les messages récents (première page, du plus récent au plus ancien). */
const updateMessages = (
  conversationId: string,
  update: (items: MODELS.MessagePayload[]) => MODELS.MessagePayload[],
) => {
  client()?.setQueryData<MessagesData>(messagesKey(conversationId), (data?: MessagesData) => {
    if (!data?.pages.length) return data;
    const [first, ...rest] = data.pages;
    return { ...data, pages: [{ ...first, items: update(first.items) }, ...rest] };
  });
};

/** Modifie chaque liste de conversations en cache (tous filtres confondus). */
const updateConversationLists = (
  update: (page: MODELS.IConversationsPage, pageIndex: number) => MODELS.IConversationsPage,
) => {
  client()?.setQueriesData<ConversationsData>(
    { queryKey: [Constants.CHAT_KEYS.CONVERSATIONS] },
    (data?: ConversationsData) => (data ? { ...data, pages: data.pages.map(update) } : data),
  );
};

export const ChatCache = {
  messagesKey,

  invalidateConversations: () => QUERIES.QueryCache.invalidate([Constants.CHAT_KEYS.CONVERSATIONS]),

  invalidateMessages: (conversationId: string) =>
    QUERIES.QueryCache.invalidate(messagesKey(conversationId)),

  /** Ajoute un message en tête, ou remplace l'envoi optimiste correspondant (`tempId`). */
  upsertMessage: (message: MODELS.MessagePayload) =>
    updateMessages(message.conversationId, (items) => {
      const index = items.findIndex(
        (item) => item.id === message.id || (!!message.tempId && item.id === message.tempId),
      );
      if (index === -1) return [message, ...items];
      const next = [...items];
      next[index] = { ...message, tempId: undefined, pendingFiles: undefined };
      return next;
    }),

  setMessageStatus: (conversationId: string, messageId: string, status: MODELS.MessageStatus) =>
    updateMessages(conversationId, (items) =>
      items.map((item) => (item.id === messageId ? { ...item, status } : item)),
    ),

  removeMessage: (conversationId: string, messageId: string) =>
    updateMessages(conversationId, (items) => items.filter((item) => item.id !== messageId)),

  /** Accusé de lecture : les messages concernés passent à READ. */
  markMessagesRead: (conversationId: string, messageIds: string[]) => {
    const ids = new Set(messageIds);
    client()?.setQueryData<MessagesData>(messagesKey(conversationId), (data?: MessagesData) =>
      data
        ? {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                ids.has(item.id) ? { ...item, status: 'READ' as const } : item,
              ),
            })),
          }
        : data,
    );
    updateConversationLists((page) => ({
      ...page,
      items: page.items.map((conversation) =>
        conversation.id === conversationId &&
        conversation.lastMessage &&
        ids.has(conversation.lastMessage.id)
          ? { ...conversation, lastMessage: { ...conversation.lastMessage, status: 'READ' } }
          : conversation,
      ),
    }));
  },

  /** Nouveau message : dernier message, remontée en tête et compteur de non-lus. */
  applyNewMessage: (message: MODELS.MessagePayload, viewerId: string, incrementUnread: boolean) => {
    let found = false;
    updateConversationLists((page, pageIndex) => {
      const unreadTotal =
        pageIndex === 0 && incrementUnread ? page.unreadTotal + 1 : page.unreadTotal;
      const index = page.items.findIndex((item) => item.id === message.conversationId);
      if (index === -1) return { ...page, unreadTotal };
      found = true;

      const current = page.items[index];
      const updated: MODELS.Conversation = {
        ...current,
        lastMessageAt: message.createdAt,
        unreadCount: current.unreadCount + (incrementUnread ? 1 : 0),
        lastMessage: {
          id: message.id,
          senderId: message.senderId,
          content: message.content,
          type: message.type,
          attachmentsCount: message.attachments.length,
          createdAt: message.createdAt,
          status: message.senderId === viewerId ? (message.status ?? 'SENT') : null,
        },
      };
      const items =
        pageIndex === 0
          ? [updated, ...page.items.filter((_, i) => i !== index)]
          : page.items.map((item, i) => (i === index ? updated : item));
      return { ...page, unreadTotal, items };
    });
    if (!found) ChatCache.invalidateConversations();
  },

  resetUnread: (conversationId: string) =>
    updateConversationLists((page, pageIndex) => {
      const conversation = page.items.find((item) => item.id === conversationId);
      if (!conversation?.unreadCount) return page;
      return {
        ...page,
        unreadTotal:
          pageIndex === 0
            ? Math.max(0, page.unreadTotal - conversation.unreadCount)
            : page.unreadTotal,
        items: page.items.map((item) =>
          item.id === conversationId ? { ...item, unreadCount: 0 } : item,
        ),
      };
    }),

  setPresence: (userId: string, online: boolean) =>
    QUERIES.QueryCache.set(['presence', userId], online),
};
