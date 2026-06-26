import * as Constants from './constants';
import { chatServiceInstance } from './chat.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getConversationQueries = (
  args: QUERIES.QueryPayload<MODELS.Conversation[], undefined, { userId: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { userId: string }, MODELS.Conversation[]>({
    queryKey: [Constants.CHAT_KEYS.GET_ALL_CONVERSATIONS],
    queryFn: () => chatServiceInstance().getConversation(params?.userId!),
    options: queryOptions,
  });
};

const getMessagesQueries = (
  args: QUERIES.InfiniteQueryPayload<MODELS.IGetMessagesParams, MODELS.IGetMessageResponse>,
) => {
  const { queryOptions, params } = args;

  return QUERIES.useCustomInfiniteQuery<MODELS.IGetMessageResponse>({
    queryKey: [Constants.CHAT_KEYS.GET_MESSAGES, params?.conversationId],
    queryFn: ({ pageParam }) =>
      chatServiceInstance().getMessages({ ...params!, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    options: {
      ...queryOptions,
      enabled: !!params?.userId && !!params.conversationId && (queryOptions?.enabled ?? true),
    },
  });
};

const createConversationMutation = (
  args: QUERIES.MutationPayload<MODELS.ICreateConversation, any, MODELS.ICreateConversation>,
) => {
  return QUERIES.useCustomMutation<MODELS.ICreateConversation, any, MODELS.ICreateConversation>({
    mutationKey: [Constants.CHAT_KEYS.CONVERSATION],
    mutationFn: ({ payload, params }) =>
      chatServiceInstance().createConversation(params?.userId!, payload!),
    options: args.mutationOptions,
  });
};

export { createConversationMutation, getConversationQueries, getMessagesQueries };
