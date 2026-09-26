import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/**
 * ChatService provides methods for handling Chat-related operations
 * such as fetching all rental and creating a new rental through API endpoints.
 *
 */
export class ChatService extends BaseApi {
  createConversation(data: MODELS.ICreateConversation) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().CHAT.CREATE_CONV, data);
  }

  getConversation() {
    return this.apiService.invoke(this.applicationContext.getApiConfig().CHAT.GET_CONV);
  }

  getMessages(data: MODELS.IGetMessagesParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CHAT.GET_MESSAGE,
      {},
      { params: data },
    );
  }
}
