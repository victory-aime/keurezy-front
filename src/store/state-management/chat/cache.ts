import { QUERIES } from 'rise-core-frontend';
import * as Constants from './constants';
import { MODELS } from '_types/index';

type MessagesCache = QUERIES.InfiniteQueryResult<MODELS.IGetMessageResponse>;

const pendingReadIds = new Map<string, Set<string>>();

/**
 * Helper: update all messages across pages
 */
const mapMessages = (
  cache: MessagesCache,
  updater: (message: MODELS.MessagePayload) => MODELS.MessagePayload,
): MessagesCache => ({
  ...cache,
  pages: cache.pages.map((page) => ({
    ...page,
    items: page.items.map(updater),
  })),
});

export const ChatCache = {
  invalidateConversations: () =>
    QUERIES.QueryCache.invalidate([Constants.CHAT_KEYS.GET_ALL_CONVERSATIONS]),

  getMessages: (conversationId: string) => {
    const key = [Constants.CHAT_KEYS.GET_MESSAGES, conversationId];
    return QUERIES.QueryCache.get<MessagesCache>(key);
  },

  setMessages: (conversationId: string, data: MessagesCache) => {
    const key = [Constants.CHAT_KEYS.GET_MESSAGES, conversationId];

    QUERIES.QueryCache.set<MessagesCache>(key, data);
    QUERIES.QueryCache.invalidate([Constants.CHAT_KEYS.GET_ALL_CONVERSATIONS]);
  },

  /**
   * Ajout message en haut (page 0 uniquement)
   */
  prependMessage: (message: MODELS.MessagePayload) => {
    const key = [Constants.CHAT_KEYS.GET_MESSAGES, message.conversationId];
    const current = QUERIES.QueryCache.get<MessagesCache>(key);

    if (!current) {
      QUERIES.QueryCache.set<MessagesCache>(key, {
        pages: [
          {
            items: [message],
            nextCursor: null,
          },
        ],
        pageParams: [undefined],
      });
      return;
    }

    const alreadyExists = current.pages.some((p) => p.items.some((m) => m.id === message.id));

    if (alreadyExists) return;

    const updated: MessagesCache = {
      ...current,
      pages: current.pages.map((page, index) =>
        index === 0
          ? {
              ...page,
              items: [message, ...page.items],
            }
          : page,
      ),
    };

    QUERIES.QueryCache.set<MessagesCache>(key, updated);
  },

  /**
   * READ update multi messages
   */
  updateMessagesReadStatus: (conversationId: string, messageIds: string[]) => {
    const key = [Constants.CHAT_KEYS.GET_MESSAGES, conversationId];
    const current = QUERIES.QueryCache.get<MessagesCache>(key);
    if (!current) return;

    const idSet = new Set(messageIds);
    const found = new Set<string>();

    const updated = mapMessages(current, (m) => {
      if (idSet.has(m.id)) {
        found.add(m.id);
        return { ...m, status: 'READ' as const };
      }
      return m;
    });

    QUERIES.QueryCache.set<MessagesCache>(key, updated);

    const notFound = messageIds.filter((id) => !found.has(id));

    if (notFound.length) {
      const existing = pendingReadIds.get(conversationId) ?? new Set();
      notFound.forEach((id) => existing.add(id));
      pendingReadIds.set(conversationId, existing);
    }
  },

  /**
   * replace optimistic → server message
   */
  replaceOptimisticMessage: (
    conversationId: string,
    tempId: string,
    confirmedMessage: MODELS.MessagePayload,
  ) => {
    const key = [Constants.CHAT_KEYS.GET_MESSAGES, conversationId];
    const current = QUERIES.QueryCache.get<MessagesCache>(key);
    if (!current) return;

    const pending = pendingReadIds.get(conversationId);
    const wasRead = pending?.has(confirmedMessage.id);

    const finalMessage = wasRead
      ? { ...confirmedMessage, status: 'READ' as const }
      : confirmedMessage;

    if (wasRead) pending!.delete(confirmedMessage.id);

    const updated: MessagesCache = {
      ...current,
      pages: current.pages.map((page) => ({
        ...page,
        items: page.items.map((m) => (m.id === tempId ? finalMessage : m)),
      })),
    };

    QUERIES.QueryCache.set<MessagesCache>(key, updated);
  },

  /**
   * mark failed message
   */
  markMessageFailed: (conversationId: string, tempId: string) => {
    const key = [Constants.CHAT_KEYS.GET_MESSAGES, conversationId];
    const current = QUERIES.QueryCache.get<MessagesCache>(key);
    if (!current) return;

    const updated: MessagesCache = {
      ...current,
      pages: current.pages.map((page) => ({
        ...page,
        items: page.items.map((m) => (m.id === tempId ? { ...m, status: 'failed' as const } : m)),
      })),
    };

    QUERIES.QueryCache.set<MessagesCache>(key, updated);
  },

  /**
   * remove message
   */
  removeMessage: (conversationId: string, messageId: string) => {
    const key = [Constants.CHAT_KEYS.GET_MESSAGES, conversationId];
    const current = QUERIES.QueryCache.get<MessagesCache>(key);
    if (!current) return;

    const updated: MessagesCache = {
      ...current,
      pages: current.pages.map((page) => ({
        ...page,
        items: page.items.filter((m) => m.id !== messageId),
      })),
    };

    QUERIES.QueryCache.set<MessagesCache>(key, updated);
  },

  setPresence: (userId: string, online: boolean) =>
    QUERIES.QueryCache.set(['presence', userId], online),

  getPresence: (userId: string) => QUERIES.QueryCache.get<boolean>(['presence', userId]),
};
