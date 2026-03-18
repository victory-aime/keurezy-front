import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * ContactService provides methods for handling Contact-related operations
 * such as fetching all Contact and creating a new Contact through API endpoints.
 */
export class ContactService extends BaseApi {
  publicContact(data: MODELS.IContact) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CONTACT.PUBLIC_CONTACT,
      data,
    );
  }
  agencyContactList(params: MODELS.IAgencyCommonParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CONTACT.AGENCY_CONTACT_LIST,
      {},
      { params },
    );
  }

  agencyChangeContactStatus(params: MODELS.IAgencyCommonParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CONTACT
        .AGENCY_CONTACT_UPDATE_STATUS,
      {},
      { params },
    );
  }

  readAllAgencyContact(params: MODELS.IAgencyCommonParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().CONTACT.AGENCY_CONTACT_READ_ALL,
      {},
      { params },
    );
  }
}
