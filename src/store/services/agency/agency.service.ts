import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * AgencyService provides methods for handling agency-related operations
 * such as fetching all agency and creating a new agency through API endpoints.
 */
export class AgencyService extends BaseApi {
  // agency_info(agencyId: MODELS.Iagency) {
  //   return this.apiService.invoke(
  //     this.applicationContext.getApiConfig().agency.INFO,
  //     { agencyId },
  //   );
  // }

  create_agency(data: MODELS.ICreateAgency | FormData) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CREATE_AGENCY,
      data,
    );
  }
  check_name(name: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CHECK_NAME,
      { name },
    );
  }
}
