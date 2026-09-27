import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/** Chat agence ↔ client (l'identité et les droits sont vérifiés côté serveur). */
export class ChatService extends BaseApi {
  private get routes() {
    return this.applicationContext.getApiConfig().CHAT;
  }

  openBookingConversation(bookingId: string) {
    return this.apiService.invoke(this.routes.OPEN_BOOKING, { bookingId });
  }

  getConversations(query: MODELS.IConversationsQuery & { cursor?: string }) {
    return this.apiService.invoke(this.routes.CONVERSATIONS, {}, { params: query });
  }

  getConversation(conversationId: string) {
    return this.apiService.invoke(this.routes.DETAIL, {}, { params: { conversationId } });
  }

  getMessages(conversationId: string, cursor?: string) {
    return this.apiService.invoke(
      this.routes.MESSAGES,
      {},
      { params: { conversationId, ...(cursor && { cursor }) } },
    );
  }

  /** Multipart : `data` (JSON) + `files` (3 pièces jointes maximum). */
  sendMessage(data: MODELS.ISendMessageRequest, files: File[] = []) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    files.forEach((file) => formData.append('files', file));
    return this.apiService.invoke(this.routes.SEND_MESSAGE, formData);
  }

  markRead(conversationId: string) {
    return this.apiService.invoke(this.routes.READ, { conversationId });
  }
}
