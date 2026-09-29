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
  update_property(data: MODELS.ICreateProperty | FormData, params: { appartId: string }) {
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

  /** Bien de l'agence avec ses annonces et modalités de location. */
  getPropertyDetail(params: { id: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.PROPERTY_DETAIL,
      {},
      { params },
    );
  }

  /** Ce qui est lié au bien, avant une fermeture ou une suppression. */
  getPropertyImpact(params: { id: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.PROPERTY_IMPACT,
      {},
      { params },
    );
  }

  /** Fermer : les annonces en ligne du bien sont retirées, le bien est conservé. */
  close_property(params: { id: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.CLOSE_PROPERTY,
      {},
      { params },
    );
  }

  /** Supprimer un bien sans historique (refus du backend sinon). */
  delete_property(params: { id: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().PROPERTY.DELETE_PROPERTY,
      {},
      { params },
    );
  }
}
