import * as Constants from "./constants";
import { chatServiceInstance } from "./chat.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getConversationQueries = (
  args: QUERIES.QueryPayload<{ userId: string }>,
) => {
  return QUERIES.useCustomQuery<MODELS.IConversationResponse[]>({
    queryKey: [Constants.CHAT_KEYS.GET_CONV],
    queryFn: () => chatServiceInstance().getConversation(args?.params?.userId!),
    options: args.queryOptions,
  });
};

const createConversationtMutation = (
  args: QUERIES.MutationPayload<{ rentalAgreementId: string }>,
) => {
  return QUERIES.useCustomMutation<{ rentalAgreementId: string }, any>({
    mutationKey: [Constants.CHAT_KEYS.CREATE_CONV],
    mutationFn: ({ params }) =>
      chatServiceInstance().createConversation(params!),
    options: args.mutationOptions,
  });
};

const getMessagesQueries = (
  args: QUERIES.QueryPayload<{ userId: string; conversationId: string }>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<MODELS.IMessageResponse[]>({
    queryKey: [Constants.CHAT_KEYS.GET_MESSAGE],
    queryFn: () =>
      chatServiceInstance().getMessages({
        conversationId: params?.conversationId,
        userId: params?.userId,
      }),
    options: args.queryOptions,
  });
};
const sendMessageMutation = (
  args: QUERIES.MutationPayload<MODELS.ISendMessage>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.CHAT_KEYS.SEND_MESSAGE],
    mutationFn: ({ payload, params }) =>
      chatServiceInstance().sendMessage(payload?.message!, params),
    options: args.mutationOptions,
  });
};

const readMessageMutation = (
  args: QUERIES.MutationPayload<{
    messageId: string;
    userId: string;
  }>,
) => {
  return QUERIES.useCustomMutation<{ messageId: string; userId: string }, any>({
    mutationKey: [Constants.CHAT_KEYS.SEND_MESSAGE],
    mutationFn: ({ params }) => chatServiceInstance().readMessage(params),
    options: args.mutationOptions,
  });
};

export {
  createConversationtMutation,
  getConversationQueries,
  getMessagesQueries,
  sendMessageMutation,
  readMessageMutation,
};
