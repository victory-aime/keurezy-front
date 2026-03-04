import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * ChatService provides methods for handling Chat-related operations
 * such as fetching all rental and creating a new rental through API endpoints.
 *
 */
export class ChatService extends BaseApi {
  createConversation(rentalAgreementId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CHAT.CREATE_CONV,
      {},
      { params: { rentalAgreementId } },
    );
  }

  getConversation(userId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CHAT.GET_CONV,
      {},
      { params: { userId } },
    );
  }

  getMessages(data: { userId: string; conversationId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CHAT.GET_MESSAGE,
      {},
      { params: data },
    );
  }

  sendMessage(
    message: string,
    data: { conversationId: string; userId: string },
  ) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CHAT.SEND_MESSAGE,
      { message },
      { params: data },
    );
  }

  readMessage(data: { messageId: string; userId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CHAT.READ_MESSAGE,
      {},
      { params: data },
    );
  }
}
