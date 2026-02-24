import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * ContactService provides methods for handling Contact-related operations
 * such as fetching all Contact and creating a new Contact through API endpoints.
 */
export class ContactService extends BaseApi {
  publicRequest(data: MODELS.IContact) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CONTACT.PUBLIC_REQUEST,
      data,
    );
  }
}
