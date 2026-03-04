interface ISendMessage {
  message?: string;
  conversationId?: string;
  userId?: string;
}

interface IMessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt: string;
  createdAt: string;
}

interface IConversationResponse {
  id: string;
  propertyId: string;
  rentalAgreementId: string;
  createdAt: string;
  messages: IMessageResponse[];
}

export type { ISendMessage, IMessageResponse, IConversationResponse };
