import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * PropertyService provides methods for handling Property-related operations
 * such as fetching all agency and creating a new agency through API endpoints.
 */
export class PropertyService extends BaseApi {
  allPublicProperties() {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.ALL_PROPERTIES_PUBLIC,
    );
  }
  getAllPropertyByAgency(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.ALL_PROPERTIES_BY_AGENCY,
      {},
      { params: { agencyId } },
    );
  }
  create_property(data: MODELS.IProperty | FormData) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.CREATE_PROPERTY,
      data,
    );
  }
}
