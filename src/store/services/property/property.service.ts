import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/**
 * PropertyService provides methods for handling Property-related operations
 * such as fetching all agency and creating a new agency through API endpoints.
 */
export class PropertyService extends BaseApi {
  getAllPropertyByAgency(params: MODELS.IAgencyFilters) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.ALL_PROPERTIES_BY_AGENCY,
      {},
      { params },
    );
  }
  create_property(data: MODELS.ICreateProperty | FormData) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.CREATE_PROPERTY,
      data,
    );
  }
  update_property(
    data: MODELS.ICreateProperty | FormData,
    params: { ownerId: string; appartId: string },
  ) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.UPDATE_PROPERTY,
      data,
      { params },
    );
  }
  getOccupationRateByType(data: MODELS.IAgencyCommonParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.OCCUPATION_RATE_BY_PROPERTY_TYPE,
      {},
      { params: data },
    );
  }
  getMonthlyRevenue(data: MODELS.IAgencyCommonParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.MONTHLY_REVENUE,
      {},
      { params: data },
    );
  }
}
