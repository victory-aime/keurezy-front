import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * ApplicationService provides methods for handling application-related operations
 * such as fetching all applications and creating a new application through API endpoints.
 */
export class ApplicationService extends BaseApi {
  createApplicationRequest(data: MODELS.IApplicationRequest) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().APPLICATION.CREATE,
      data,
    );
  }
  agencyApplicationList(params: MODELS.IAgencyFilters) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().APPLICATION
        .AGENCY_APPLICATION_LIST,
      {},
      { params },
    );
  }

  userApplicationList(userId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().APPLICATION.USER_APPLICATION_LIST,
      {},
      { params: { userId } },
    );
  }
}
